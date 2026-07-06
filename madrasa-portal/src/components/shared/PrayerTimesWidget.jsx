import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { PATHS } from '../../routes/paths';

const DEFAULT_LAT  = 22.701;
const DEFAULT_LON  = 90.3535;
const DEFAULT_CITY = 'Barishal';

const PRAYERS = [
  { key: 'Fajr',    icon: '🌙', en: 'Fajr',    bn: 'ফজর'    },
  { key: 'Dhuhr',   icon: '☀️', en: 'Dhuhr',   bn: 'যোহর'   },
  { key: 'Asr',     icon: '🌤', en: 'Asr',      bn: 'আসর'    },
  { key: 'Maghrib', icon: '🌇', en: 'Maghrib',  bn: 'মাগরিব' },
  { key: 'Isha',    icon: '🌃', en: 'Isha',     bn: 'ইশা'    },
];

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

function to12h(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function PrayerTimesWidget() {
  const { lang } = useLang();
  const [times,   setTimes]   = useState(null);
  const [hijri,   setHijri]   = useState(null);
  const [city,    setCity]    = useState(DEFAULT_CITY);
  const [now,     setNow]     = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const fetchTimes = useCallback(async (lat, lon) => {
    setLoading(true); setError(false);
    try {
      const d    = new Date();
      const date = `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
      const res  = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=1`);
      const json = await res.json();
      const raw  = json.data.timings;
      const clean = {};
      PRAYERS.forEach(({ key }) => { clean[key] = raw[key]?.split(' ')[0]; });
      setTimes(clean);
      setHijri(json.data.date?.hijri);
      // Use meta from Aladhan first, then try Nominatim as fallback
      const aladhanCity = json.data.meta?.timezone?.split('/')?.pop()?.replace(/_/g, ' ');
      if (aladhanCity) setCity(aladhanCity);
      try {
        const gr = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${lang}`);
        const gj = await gr.json();
        const nominatimCity = gj.address?.city || gj.address?.town || gj.address?.village || gj.address?.county;
        if (nominatimCity) setCity(nominatimCity);
      } catch { /* keep aladhan city */ }
    } catch { setError(true); }
    finally  { setLoading(false); }
  }, [lang]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => fetchTimes(coords.latitude, coords.longitude),
        ()           => fetchTimes(DEFAULT_LAT, DEFAULT_LON),
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else { fetchTimes(DEFAULT_LAT, DEFAULT_LON); }
  }, [fetchTimes]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Derived
  let activePrayer = null, nextPrayer = null, countdown = 0;
  if (times) {
    const list = PRAYERS.map(p => ({ key: p.key, date: parseTime(times[p.key]) })).filter(p => p.date);
    const nowMs = now.getTime();
    for (let i = list.length - 1; i >= 0; i--) {
      if (nowMs >= list[i].date.getTime()) { activePrayer = list[i].key; break; }
    }
    const upcoming = list.find(p => p.date.getTime() > nowMs);
    if (upcoming) { nextPrayer = upcoming.key; countdown = Math.floor((upcoming.date.getTime() - nowMs) / 1000); }
  }

  const isBn     = lang === 'bn';
  const locale   = isBn ? 'bn-BD' : 'en-GB';
  const timeStr  = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr  = now.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
  const hijriStr = hijri ? `${hijri.day} ${hijri.month.en} ${hijri.year} AH` : '';

  // Featured = next prayer if exists, else active
  const featuredKey  = nextPrayer ?? activePrayer;
  const featuredInfo = featuredKey ? PRAYERS.find(p => p.key === featuredKey) : null;
  const otherPrayers = PRAYERS.filter(p => p.key !== featuredKey);

  return (
    <div className="rounded-2xl overflow-hidden text-white" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)' }}>

      {/* ── Header: clock + location ── */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <div className="text-xl font-bold font-manrope tabular-nums">{timeStr}</div>
          <div className="text-[11px] opacity-60 font-inter mt-0.5">{dateStr}{hijriStr ? ` · ${hijriStr}` : ''}</div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-[11px] opacity-60 font-inter">
            <span className="material-symbols-outlined text-xs">location_on</span>
            {city}
          </div>
          <div className="text-[10px] opacity-40 font-inter mt-0.5">{isBn ? 'নামাজের সময়' : 'Prayer Times'}</div>
        </div>
      </div>

      {loading ? (
        <div className="p-4 space-y-3">
          <div className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.07)' }} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-xs opacity-50 font-inter">
          {isBn ? 'নামাজের সময় লোড হয়নি।' : 'Could not load prayer times.'}
        </div>
      ) : (
        <div className="p-3 space-y-2">

          {/* ── Featured card: next / current prayer ── */}
          {featuredInfo && (
            <div
              className="rounded-2xl p-4 flex items-center justify-between"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.15) 100%)',
                border: '1px solid rgba(212,175,55,0.45)',
                boxShadow: '0 4px 20px rgba(212,175,55,0.15)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">{featuredInfo.icon}</span>
                <div>
                  <div className="text-[10px] font-semibold font-inter uppercase tracking-widest opacity-70 mb-0.5">
                    {featuredKey === nextPrayer
                      ? (isBn ? 'পরবর্তী নামাজ' : 'Next Prayer')
                      : (isBn ? 'চলমান নামাজ' : 'Current Prayer')
                    }
                  </div>
                  <div className="text-xl font-bold font-manrope text-secondary">
                    {isBn ? featuredInfo.bn : featuredInfo.en}
                  </div>
                  {featuredKey === nextPrayer && (
                    <div className="text-[11px] font-inter opacity-70 mt-0.5 tabular-nums">
                      {isBn ? 'বাকি: ' : 'In: '}{fmtCountdown(countdown)}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-manrope tabular-nums text-secondary">
                  {to12h(times[featuredKey])}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-inter mt-1 opacity-70">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  {featuredKey === activePrayer ? (isBn ? 'চলছে' : 'Active') : (isBn ? 'আসছে' : 'Upcoming')}
                </span>
              </div>
            </div>
          )}

          {/* ── Other prayers: compact rows ── */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {otherPrayers.map((p, i) => {
              const isPast = activePrayer && PRAYERS.findIndex(x => x.key === p.key) < PRAYERS.findIndex(x => x.key === activePrayer);
              return (
                <div
                  key={p.key}
                  className="flex items-center justify-between px-3 py-2.5"
                  style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                    borderBottom: i < otherPrayers.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-base leading-none ${isPast ? 'opacity-35' : ''}`}>{p.icon}</span>
                    <span className={`text-sm font-inter font-medium ${isPast ? 'opacity-35' : 'opacity-85'}`}>
                      {isBn ? p.bn : p.en}
                    </span>
                  </div>
                  <span className={`text-sm font-manrope tabular-nums font-semibold ${isPast ? 'opacity-35' : 'opacity-85'}`}>
                    {to12h(times[p.key])}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="px-4 pb-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link
          to={PATHS.PRAYER_TIMES}
          className="inline-flex items-center gap-1 text-[11px] font-semibold font-inter opacity-60 hover:opacity-100 text-secondary transition-opacity"
        >
          <span className="material-symbols-outlined text-xs">open_in_new</span>
          {isBn ? 'সম্পূর্ণ সময়সূচি' : 'Full Schedule'}
        </Link>
      </div>
    </div>
  );
}
