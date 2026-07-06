import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '../context/LanguageContext';

// Kaaba coordinates
const KAABA = { lat: 21.4225, lon: 39.8262 };

function toRad(deg) { return (deg * Math.PI) / 180; }
function toDeg(rad) { return (rad * 180) / Math.PI; }

/** Great-circle bearing from (lat1,lon1) → Kaaba */
function calcQiblaBearing(lat, lon) {
  const φ1 = toRad(lat), φ2 = toRad(KAABA.lat);
  const Δλ = toRad(KAABA.lon - lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Distance in km (Haversine) */
function calcDistance(lat, lon) {
  const R = 6371;
  const dLat = toRad(KAABA.lat - lat);
  const dLon = toRad(KAABA.lon - lon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(KAABA.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const CARDINAL = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
function getCardinal(deg) { return CARDINAL[Math.round(((deg % 360) + 360) % 360 / 45) % 8]; }

// ── Compass needle SVG ────────────────────────────────────────────────────────
function CompassDial({ rotation, children, size = 280 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-primary-container/20 bg-gradient-to-br from-surface-alt to-white shadow-ambient-lg" />
      {/* Cardinal labels — fixed */}
      {[
        { label: 'N', deg: 0 },
        { label: 'E', deg: 90 },
        { label: 'S', deg: 180 },
        { label: 'W', deg: 270 },
      ].map(({ label, deg }) => {
        const r = size / 2 - 18;
        const rad = toRad(deg - 90);
        const x = size / 2 + r * Math.cos(rad);
        const y = size / 2 + r * Math.sin(rad);
        return (
          <span
            key={label}
            className={`absolute text-xs font-bold font-manrope select-none ${label === 'N' ? 'text-error' : 'text-primary-container'}`}
            style={{ left: x, top: y, transform: 'translate(-50%,-50%)' }}
          >
            {label}
          </span>
        );
      })}
      {/* Rotating needle */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Qibla needle ─────────────────────────────────────────────────────────────
function QiblaNeedle() {
  return (
    <svg width="60" height="200" viewBox="0 0 60 200" className="drop-shadow-md">
      {/* North (Qibla) — green with Kaaba icon */}
      <polygon points="30,10 42,100 18,100" fill="#0b3d2e" />
      {/* South — grey */}
      <polygon points="30,190 42,100 18,100" fill="#9ca3af" />
      {/* Center dot */}
      <circle cx="30" cy="100" r="8" fill="#0b3d2e" />
      <circle cx="30" cy="100" r="4" fill="white" />
    </svg>
  );
}

// ── General compass needle ────────────────────────────────────────────────────
function GeneralNeedle() {
  return (
    <svg width="60" height="200" viewBox="0 0 60 200" className="drop-shadow-md">
      <polygon points="30,10 42,100 18,100" fill="#ba1a1a" />
      <polygon points="30,190 42,100 18,100" fill="#9ca3af" />
      <circle cx="30" cy="100" r="8" fill="#1a1c1b" />
      <circle cx="30" cy="100" r="4" fill="white" />
    </svg>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function QiblaCompassPage() {
  const { t } = useLang();
  const [tab, setTab]           = useState('qibla'); // 'qibla' | 'general'
  const [userPos, setUserPos]   = useState(null);
  const [locError, setLocError] = useState('');
  const [locating, setLocating] = useState(false);
  const [heading, setHeading]   = useState(null);   // device heading (°)
  const [permErr, setPermErr]   = useState('');
  const orientRef               = useRef(null);

  // ── Geolocation ─────────────────────────────────────────────────────────────
  const locate = useCallback(() => {
    setLocError('');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserPos({ lat: coords.latitude, lon: coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError(t('compassLocError'));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [t]);

  useEffect(() => { locate(); }, [locate]);

  // ── Device orientation ───────────────────────────────────────────────────────
  useEffect(() => {
    function handleOrientation(e) {
      // iOS: webkitCompassHeading; Android: 360 - alpha
      const h = e.webkitCompassHeading != null
        ? e.webkitCompassHeading
        : e.alpha != null ? (360 - e.alpha) : null;
      if (h != null) setHeading(h);
    }

    async function requestAndListen() {
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        try {
          const res = await DeviceOrientationEvent.requestPermission();
          if (res !== 'granted') { setPermErr(t('compassPermErr')); return; }
        } catch { setPermErr(t('compassPermErr')); return; }
      }
      orientRef.current = handleOrientation;
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    requestAndListen();
    return () => {
      window.removeEventListener('deviceorientationabsolute', orientRef.current, true);
      window.removeEventListener('deviceorientation', orientRef.current, true);
    };
  }, [t]);

  // ── Derived values ───────────────────────────────────────────────────────────
  const qiblaBearing = userPos ? calcQiblaBearing(userPos.lat, userPos.lon) : null;
  const distance     = userPos ? calcDistance(userPos.lat, userPos.lon) : null;

  // Needle rotation:
  // General compass: needle points North → rotate by -heading so North stays up
  // Qibla compass:   needle points to Qibla → rotate by (qiblaBearing - heading)
  const generalRotation = heading != null ? -heading : 0;
  const qiblaRotation   = heading != null && qiblaBearing != null
    ? qiblaBearing - heading
    : qiblaBearing ?? 0;

  const hasOrientation = heading != null;

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-6 py-10 space-y-8">

      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold font-manrope text-primary-container">
          {t('compassPageTitle')}
        </h1>
        <p className="text-lg text-on-surface-variant font-inter">
          {t('compassPageDesc')}
        </p>
      </section>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-surface-container rounded-xl p-1 gap-1">
          {[
            { key: 'qibla',   icon: 'mosque',   label: t('compassTabQibla')   },
            { key: 'general', icon: 'explore',  label: t('compassTabGeneral') },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold font-inter transition-all ${
                tab === key
                  ? 'bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-base">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Location error */}
      {locError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-error rounded-xl px-5 py-4 font-inter text-sm max-w-xl mx-auto">
          <span className="material-symbols-outlined flex-shrink-0">location_off</span>
          <span className="flex-1">{locError}</span>
          <button onClick={locate} className="text-xs font-semibold underline">{t('compassRetry')}</button>
        </div>
      )}

      {/* Permission error */}
      {permErr && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-5 py-4 font-inter text-sm max-w-xl mx-auto">
          <span className="material-symbols-outlined flex-shrink-0">sensors_off</span>
          {permErr}
        </div>
      )}

      {/* Compass card */}
      <div className="flex flex-col items-center gap-8">
        <div className="bg-surface-base rounded-3xl shadow-ambient-lg border border-border-subtle p-8 flex flex-col items-center gap-6 w-full max-w-sm">

          {/* Compass dial */}
          {tab === 'qibla' ? (
            <CompassDial rotation={qiblaRotation}>
              <QiblaNeedle />
            </CompassDial>
          ) : (
            <CompassDial rotation={generalRotation}>
              <GeneralNeedle />
            </CompassDial>
          )}

          {/* Info row */}
          {tab === 'qibla' ? (
            <div className="w-full space-y-3">
              {/* Qibla bearing */}
              <div className="flex items-center justify-between bg-surface-alt rounded-xl px-4 py-3">
                <span className="text-sm text-text-muted font-inter flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary-container">navigation</span>
                  {t('compassQiblaBearing')}
                </span>
                <span className="text-sm font-bold text-primary-container font-manrope">
                  {qiblaBearing != null ? `${qiblaBearing.toFixed(1)}°` : '—'}
                </span>
              </div>
              {/* Distance */}
              <div className="flex items-center justify-between bg-surface-alt rounded-xl px-4 py-3">
                <span className="text-sm text-text-muted font-inter flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary-container">straighten</span>
                  {t('compassDistance')}
                </span>
                <span className="text-sm font-bold text-primary-container font-manrope">
                  {distance != null ? `${distance.toLocaleString()} km` : '—'}
                </span>
              </div>
              {/* Device heading */}
              <div className="flex items-center justify-between bg-surface-alt rounded-xl px-4 py-3">
                <span className="text-sm text-text-muted font-inter flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary-container">explore</span>
                  {t('compassDeviceHeading')}
                </span>
                <span className="text-sm font-bold text-primary-container font-manrope">
                  {hasOrientation ? `${Math.round(heading)}° ${getCardinal(heading)}` : t('compassNoSensor')}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-3">
              {/* Heading */}
              <div className="flex items-center justify-between bg-surface-alt rounded-xl px-4 py-3">
                <span className="text-sm text-text-muted font-inter flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary-container">explore</span>
                  {t('compassHeading')}
                </span>
                <span className="text-sm font-bold text-primary-container font-manrope">
                  {hasOrientation ? `${Math.round(heading)}°` : t('compassNoSensor')}
                </span>
              </div>
              {/* Cardinal */}
              <div className="flex items-center justify-between bg-surface-alt rounded-xl px-4 py-3">
                <span className="text-sm text-text-muted font-inter flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary-container">near_me</span>
                  {t('compassDirection')}
                </span>
                <span className="text-sm font-bold text-primary-container font-manrope">
                  {hasOrientation ? getCardinal(heading) : '—'}
                </span>
              </div>
              {/* Location */}
              <div className="flex items-center justify-between bg-surface-alt rounded-xl px-4 py-3">
                <span className="text-sm text-text-muted font-inter flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary-container">my_location</span>
                  {t('compassLocation')}
                </span>
                <span className="text-xs font-bold text-primary-container font-manrope">
                  {locating
                    ? t('compassLocating')
                    : userPos
                      ? `${userPos.lat.toFixed(4)}°, ${userPos.lon.toFixed(4)}°`
                      : '—'}
                </span>
              </div>
            </div>
          )}

          {/* Sensor status badge */}
          <div className={`flex items-center gap-2 text-xs font-inter px-3 py-1.5 rounded-full ${
            hasOrientation
              ? 'bg-green-50 text-success-green border border-green-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${hasOrientation ? 'bg-success-green animate-pulse' : 'bg-amber-400'}`} />
            {hasOrientation ? t('compassSensorActive') : t('compassSensorInactive')}
          </div>
        </div>

        {/* Qibla note */}
        {tab === 'qibla' && (
          <p className="text-center text-xs text-text-muted font-inter max-w-sm">
            {t('compassQiblaNote')}
          </p>
        )}
        {tab === 'general' && !hasOrientation && (
          <p className="text-center text-xs text-text-muted font-inter max-w-sm">
            {t('compassDesktopNote')}
          </p>
        )}
      </div>
    </main>
  );
}
