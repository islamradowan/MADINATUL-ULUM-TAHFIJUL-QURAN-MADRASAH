import { useState, useEffect, useCallback } from 'react';
import { useLang } from '../context/LanguageContext';

const DEFAULT_LAT  = 22.701;
const DEFAULT_LON  = 90.3535;
const DEFAULT_CITY = 'Barishal';

const PRAYERS = [
  { key: 'Fajr',    icon: '🌙', en: 'Fajr',    bn: 'ফজর'      },
  { key: 'Sunrise', icon: '🌅', en: 'Sunrise',  bn: 'সূর্যোদয়'  },
  { key: 'Dhuhr',   icon: '☀️', en: 'Dhuhr',   bn: 'যোহর'     },
  { key: 'Asr',     icon: '🌤', en: 'Asr',      bn: 'আসর'      },
  { key: 'Maghrib', icon: '🌇', en: 'Maghrib',  bn: 'মাগরিব'   },
  { key: 'Isha',    icon: '🌃', en: 'Isha',     bn: 'ইশা'      },
];

const EXTRA_TIMES = [
  { key: 'Imsak',      icon: '🌚', en: 'Imsak',             bn: 'ইমসাক',                    desc_en: 'Stop eating — Suhoor ends',        desc_bn: 'সেহরি শেষের সময়'         },
  { key: 'Midnight',   icon: '🌑', en: 'Midnight',          bn: 'মধ্যরাত',                  desc_en: 'Islamic midnight',                 desc_bn: 'ইসলামিক মধ্যরাত'          },
  { key: 'Firstthird', icon: '🌘', en: 'Last Third Begins', bn: 'রাতের শেষ তৃতীয়াংশ শুরু', desc_en: 'Tahajjud time starts',             desc_bn: 'তাহাজ্জুদের সময় শুরু'    },
  { key: 'Lastthird',  icon: '🌗', en: 'Last Third Ends',   bn: 'রাতের শেষ তৃতীয়াংশ শেষ',  desc_en: 'Night last third ends',            desc_bn: 'রাতের শেষ তৃতীয়াংশ শেষ' },
];

// All keys we need to extract from API
const ALL_KEYS = [...PRAYERS.map(p => p.key), ...EXTRA_TIMES.map(p => p.key)];

function parseTime(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0); return d;
}

function fmtCountdown(secs) {
  if (secs <= 0) return '00:00:00';
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  const p = (n) => String(n).padStart(2, '0');
  return `${p(h)}:${p(m)}:${p(s)}`;
}

function to12h(raw) {
  const hhmm = raw?.split(' ')[0];
  if (!hhmm) return '—';
  const [h, m] = hhmm.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return '—';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

// Parse Aladhan DD-MM-YYYY date string safely
function parseAladhanDate(str) {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(Number);
  return new Date(yyyy, mm - 1, dd);
}

export default function PrayerTimesPage() {
  const { lang } = useLang();
  const isBn = lang === 'bn';

  const [today,   setToday]   = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [city,    setCity]    = useState(DEFAULT_CITY);
  const [now,     setNow]     = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [calLoad, setCalLoad] = useState(true);
  const [error,   setError]   = useState(false);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fetchToday = useCallback(async (lat, lon) => {
    setLoading(true); setError(false);
    try {
      const d    = new Date();
      const date = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
      const res  = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=1`);
      const json = await res.json();
      if (json.code !== 200) throw new Error('API error');
      const raw   = json.data.timings;
      const times = {};
      ALL_KEYS.forEach(k => { times[k] = raw[k]?.split(' ')[0] ?? null; });
      setToday({ times, hijri: json.data.date?.hijri });
      // City from timezone
      const tz = json.data.meta?.timezone;
      if (tz) setCity(tz.split('/').pop().replace(/_/g, ' '));
    } catch { setError(true); }
    finally  { setLoading(false); }
  }, []);

  const fetchMonthly = useCallback(async (lat, lon) => {
    setCalLoad(true);
    try {
      const d   = new Date();
      // Correct Aladhan v1 calendar endpoint
      const url = `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=1&month=${d.getMonth()+1}&year=${d.getFullYear()}`;
      const res  = await fetch(url);
      const json = await res.json();
      if (json.code !== 200) throw new Error('API error');
      setMonthly(Array.isArray(json.data) ? json.data : []);
    } catch { setMonthly([]); }
    finally  { setCalLoad(false); }
  }, []);

  useEffect(() => {
    function run(lat, lon) {
      fetchToday(lat, lon);
      fetchMonthly(lat, lon);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: c }) => run(c.latitude, c.longitude),
        ()              => run(DEFAULT_LAT, DEFAULT_LON),
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else { run(DEFAULT_LAT, DEFAULT_LON); }
  }, [fetchToday, fetchMonthly]);

  // Derived active/next prayer
  let activePrayer = null, nextPrayer = null, countdown = 0;
  if (today?.times) {
    const list = PRAYERS.map(p => ({ key: p.key, date: parseTime(today.times[p.key]) })).filter(p => p.date);
    const nowMs = now.getTime();
    for (let i = list.length - 1; i >= 0; i--) {
      if (nowMs >= list[i].date.getTime()) { activePrayer = list[i].key; break; }
    }
    const upcoming = list.find(p => p.date.getTime() > nowMs);
    if (upcoming) { nextPrayer = upcoming.key; countdown = Math.floor((upcoming.date.getTime() - nowMs) / 1000); }
  }

  const locale   = isBn ? 'bn-BD' : 'en-GB';
  const timeStr  = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr  = now.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const hijri    = today?.hijri;
  const hijriStr = hijri ? `${hijri.day} ${isBn ? hijri.month.ar : hijri.month.en}, ${hijri.year} AH` : '';
  const todayDay = now.getDate();
  const nextInfo = nextPrayer ? PRAYERS.find(p => p.key === nextPrayer) : null;

  return (
    <main className="flex-grow w-full">

      {/* Hero */}
      <section className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0b3d2e 0%, #00261b 60%, #0b3d2e 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-4 md:px-6 text-center text-white">
          <div className="text-5xl md:text-6xl font-bold font-manrope tabular-nums tracking-wide mb-2">{timeStr}</div>
          <div className="text-base opacity-80 font-inter mb-1">{dateStr}</div>
          {hijriStr && <div className="text-sm opacity-60 font-inter mb-3">{hijriStr}</div>}
          <div className="flex items-center justify-center gap-1.5 text-sm opacity-70 font-inter">
            <span className="material-symbols-outlined text-base">location_on</span>
            {city}
          </div>
          {!loading && !error && nextInfo && (
            <div className="mt-6 inline-flex items-center gap-4 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-3">
              <div className="text-left">
                <div className="text-xs opacity-60 font-inter">{isBn ? 'পরবর্তী নামাজ' : 'Next Prayer'}</div>
                <div className="text-base font-bold text-secondary font-manrope">
                  {nextInfo.icon} {isBn ? nextInfo.bn : nextInfo.en}
                  <span className="text-xs font-normal opacity-70 ml-2">({to12h(today.times[nextInfo.key])})</span>
                </div>
              </div>
              <div className="text-3xl font-bold font-manrope tabular-nums text-secondary">{fmtCountdown(countdown)}</div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-4 md:px-6 py-10 space-y-10">

        {/* Today's prayer cards */}
        <section>
          <h2 className="text-xl font-bold font-manrope text-primary-container mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined icon-fill text-secondary">schedule</span>
            {isBn ? 'আজকের নামাজের সময়' : "Today's Prayer Times"}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 rounded-2xl bg-surface-container animate-pulse" />)}
            </div>
          ) : error ? (
            <div className="text-center py-10 text-text-muted font-inter text-sm">
              {isBn ? 'নামাজের সময় লোড হয়নি।' : 'Could not load prayer times.'}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {PRAYERS.map(({ key, icon, en, bn }) => {
                  const isActive = key === activePrayer;
                  const isNext   = key === nextPrayer;
                  return (
                    <div key={key} className={`relative rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all ${
                      isActive ? 'bg-primary-container text-white shadow-ambient-lg scale-105'
                        : isNext ? 'bg-emerald-50 border-2 border-primary-container/30 text-primary-container'
                        : 'bg-surface-base border border-border-subtle text-on-surface'
                    }`}>
                      {isActive && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary animate-pulse" />}
                      <span className="text-3xl leading-none">{icon}</span>
                      <span className={`text-sm font-bold font-manrope ${isActive ? 'text-white' : 'text-primary-container'}`}>{isBn ? bn : en}</span>
                      <span className={`text-base font-bold font-manrope tabular-nums ${isActive ? 'text-secondary' : 'text-primary-container'}`}>{to12h(today.times[key])}</span>
                      {isActive && <span className="text-[10px] bg-secondary text-primary-container font-bold px-2 py-0.5 rounded-full font-inter">{isBn ? 'চলমান' : 'Current'}</span>}
                      {isNext && !isActive && <span className="text-[10px] bg-primary-container text-white font-bold px-2 py-0.5 rounded-full font-inter">{isBn ? 'পরবর্তী' : 'Next'}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Extra times */}
              <div className="mt-6">
                <h3 className="text-sm font-bold font-manrope text-primary-container mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-secondary">star</span>
                  {isBn ? 'অতিরিক্ত সময় (তাহাজ্জুদ, ইমসাক ও মধ্যরাত)' : 'Additional Times (Tahajjud, Imsak & Midnight)'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {EXTRA_TIMES.map(({ key, icon, en, bn, desc_en, desc_bn }) => (
                    <div key={key} className="bg-surface-alt border border-border-subtle rounded-xl p-3 flex items-center gap-3">
                      <span className="text-2xl flex-shrink-0">{icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold font-manrope text-primary-container">{isBn ? bn : en}</div>
                        <div className="text-base font-bold font-manrope tabular-nums text-primary-container">{to12h(today.times[key])}</div>
                        <div className="text-[10px] text-text-muted font-inter leading-tight mt-0.5">{isBn ? desc_bn : desc_en}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Monthly calendar */}
        <section>
          <h2 className="text-xl font-bold font-manrope text-primary-container mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined icon-fill text-secondary">calendar_month</span>
            {isBn
              ? `${now.toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })} — নামাজের সময়সূচি`
              : `${now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} — Prayer Schedule`
            }
          </h2>

          <div className="bg-surface-base rounded-2xl shadow-ambient border border-border-subtle overflow-hidden">
            {calLoad ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary-container rounded-full animate-spin" />
              </div>
            ) : monthly.length === 0 ? (
              <div className="text-center py-10 text-text-muted font-inter text-sm">
                {isBn ? 'মাসিক সময়সূচি লোড হয়নি।' : 'Could not load monthly schedule.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-inter">
                  <thead>
                    <tr className="bg-primary-container text-white">
                      <th className="px-3 py-3 text-left font-semibold whitespace-nowrap sticky left-0 bg-primary-container">
                        {isBn ? 'তারিখ' : 'Date'}
                      </th>
                      {PRAYERS.map(({ key, icon, en, bn }) => (
                        <th key={key} className="px-3 py-3 text-center font-semibold whitespace-nowrap">
                          {icon} {isBn ? bn : en}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthly.map((row, i) => {
                      const gregDate = parseAladhanDate(row.date?.gregorian?.date);
                      const dayNum   = gregDate ? gregDate.getDate() : parseInt(row.date?.gregorian?.day, 10);
                      const isToday  = dayNum === todayDay;
                      const t        = row.timings ?? {};
                      const weekday  = gregDate
                        ? gregDate.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', { weekday: 'short' })
                        : '';
                      return (
                        <tr key={i} className={`border-b border-border-subtle ${
                          isToday ? 'bg-emerald-50' : i % 2 === 0 ? 'bg-white' : 'bg-surface-alt/40'
                        }`}>
                          <td className={`px-3 py-2.5 whitespace-nowrap sticky left-0 ${isToday ? 'bg-emerald-50' : i % 2 === 0 ? 'bg-white' : 'bg-surface-alt/40'}`}>
                            <div className={`font-bold text-sm ${isToday ? 'text-primary-container' : 'text-on-surface'}`}>
                              {isBn
                                ? `${String(dayNum).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d])}`
                                : `${String(dayNum).padStart(2,'0')} ${row.date?.gregorian?.month?.en?.slice(0,3) ?? ''}`
                              }
                            </div>
                            <div className={`text-[10px] ${isToday ? 'text-primary-container font-bold' : 'text-text-muted'}`}>
                              {isToday ? (isBn ? 'আজ' : 'Today') : weekday}
                            </div>
                          </td>
                          {PRAYERS.map(({ key }) => (
                            <td key={key} className={`px-3 py-2.5 text-center tabular-nums whitespace-nowrap ${
                              isToday ? 'text-primary-container font-semibold' : 'text-text-muted'
                            }`}>
                              {to12h(t[key])}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <p className="text-center text-xs text-text-muted font-inter">
          {isBn
            ? <>নামাজের সময় <a href="https://aladhan.com" target="_blank" rel="noreferrer" className="text-primary-container hover:underline">Aladhan API</a> থেকে নেওয়া হয়েছে। হিসাব পদ্ধতি: University of Islamic Sciences, Karachi (Method 1)।</>
            : <>Prayer times sourced from <a href="https://aladhan.com" target="_blank" rel="noreferrer" className="text-primary-container hover:underline">Aladhan API</a>. Calculation method: University of Islamic Sciences, Karachi (Method 1).</>
          }
        </p>
      </div>
    </main>
  );
}
