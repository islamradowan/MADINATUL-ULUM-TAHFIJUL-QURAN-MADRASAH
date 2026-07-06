import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom green icon for mosques
const mosqueIcon = new L.Icon({
  iconUrl:       'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize:      [25, 41],
  iconAnchor:    [12, 41],
  popupAnchor:   [1, -34],
  shadowSize:    [41, 41],
});

// Red icon for user location
const userIcon = new L.Icon({
  iconUrl:       'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize:      [25, 41],
  iconAnchor:    [12, 41],
  popupAnchor:   [1, -34],
  shadowSize:    [41, 41],
});

const RADIUS_OPTIONS = [500, 1000, 2000, 3000, 5000];

// Haversine distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Recenter map when location changes
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MosqueFinderPage() {
  const [userPos,    setUserPos]    = useState(null);
  const [mosques,    setMosques]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [locError,   setLocError]   = useState('');
  const [fetchError, setFetchError] = useState('');
  const [radius,     setRadius]     = useState(1000);
  const [selected,   setSelected]   = useState(null);
  const [search,     setSearch]     = useState('');
  const markerRefs = useRef({});

  const fetchMosques = useCallback(async (lat, lon, r) => {
    setLoading(true);
    setFetchError('');
    try {
      const query = `[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="muslim"](around:${r},${lat},${lon});way["amenity"="place_of_worship"]["religion"="muslim"](around:${r},${lat},${lon}););out center;`;

      // Multiple Overpass mirrors — try each until one succeeds
      const SERVERS = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
      ];

      let data = null;
      for (const server of SERVERS) {
        try {
          const res = await fetch(server, {
            method:  'POST',
            body:    query,
            signal:  AbortSignal.timeout(15000),
          });
          if (!res.ok) continue;
          data = await res.json();
          break;
        } catch { continue; }
      }
      if (!data) throw new Error('all servers failed');

      const results = data.elements
        .map((el) => ({
          id:   el.id,
          name: el.tags?.name || el.tags?.['name:bn'] || 'মসজিদ',
          lat:  el.lat ?? el.center?.lat,
          lon:  el.lon ?? el.center?.lon,
          dist: getDistance(lat, lon, el.lat ?? el.center?.lat, el.lon ?? el.center?.lon),
        }))
        .filter((m) => m.lat && m.lon)
        .sort((a, b) => a.dist - b.dist);

      setMosques(results);
    } catch {
      setFetchError('সার্ভার ব্যস্ত আছে, কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  }, []);

  function locateMe() {
    setLocError('');
    setMosques([]);
    setSelected(null);
    if (!navigator.geolocation) {
      setLocError('আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        setUserPos(pos);
        fetchMosques(coords.latitude, coords.longitude, radius);
      },
      () => {
        setLoading(false);
        setLocError('লোকেশন অ্যাক্সেস অনুমতি দিন এবং আবার চেষ্টা করুন।');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Re-fetch when radius changes (if location already known)
  useEffect(() => {
    if (userPos) fetchMosques(userPos[0], userPos[1], radius);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius]);

  function handleSelectMosque(mosque) {
    setSelected(mosque);
    const ref = markerRefs.current[mosque.id];
    if (ref) ref.openPopup();
  }

  const filtered = mosques.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const defaultCenter = userPos ?? [22.7010, 90.3535]; // Barishal fallback

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-6 py-10 space-y-8">

      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold font-manrope text-primary-container">
          আশেপাশের মসজিদ
        </h1>
        <p className="text-lg text-on-surface-variant font-inter">
          আপনার বর্তমান অবস্থান থেকে কাছের মসজিদগুলো খুঁজুন
        </p>
      </section>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">

        {/* Locate button */}
        <button
          onClick={locateMe}
          disabled={loading}
          className="flex items-center gap-2 bg-primary-container text-white px-6 py-3 rounded-xl font-semibold font-inter hover:bg-primary transition-colors disabled:opacity-60 shadow-sm"
        >
          {loading
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />খুঁজছি…</>
            : <><span className="material-symbols-outlined">my_location</span>আমার অবস্থান খুঁজুন</>
          }
        </button>

        {/* Radius selector */}
        <div className="flex items-center gap-2 bg-surface-base border border-border-subtle rounded-xl px-4 py-2.5 shadow-sm">
          <span className="material-symbols-outlined text-outline text-sm">radar</span>
          <span className="text-sm text-text-muted font-inter">দূরত্ব:</span>
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="bg-transparent text-sm font-semibold text-primary-container font-inter focus:outline-none"
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r >= 1000 ? `${r / 1000} কিমি` : `${r} মি`}
              </option>
            ))}
          </select>
        </div>

        {/* Mosque count badge */}
        {mosques.length > 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-success-green px-4 py-2.5 rounded-xl text-sm font-semibold font-inter">
            <span className="material-symbols-outlined text-sm icon-fill">mosque</span>
            {mosques.length}টি মসজিদ পাওয়া গেছে
          </div>
        )}
      </div>

      {/* Errors */}
      {locError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-error rounded-xl px-5 py-4 font-inter text-sm max-w-xl mx-auto">
          <span className="material-symbols-outlined flex-shrink-0">location_off</span>
          {locError}
        </div>
      )}
      {fetchError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-error rounded-xl px-5 py-4 font-inter text-sm max-w-xl mx-auto">
          <span className="material-symbols-outlined flex-shrink-0">error</span>
          <span className="flex-1">{fetchError}</span>
          <button
            onClick={() => userPos && fetchMosques(userPos[0], userPos[1], radius)}
            className="flex-shrink-0 text-xs font-semibold underline hover:no-underline"
          >
            আবার চেষ্টা
          </button>
        </div>
      )}

      {/* Map + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Map */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-ambient border border-border-subtle" style={{ height: '520px' }}>
          <MapContainer
            center={defaultCenter}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userPos && <MapController center={userPos} />}

            {/* User location marker */}
            {userPos && (
              <>
                <Circle
                  center={userPos}
                  radius={radius}
                  pathOptions={{ color: '#1a6b4a', fillColor: '#1a6b4a', fillOpacity: 0.08, weight: 1.5 }}
                />
                <Marker position={userPos} icon={userIcon}>
                  <Popup>
                    <div className="font-inter text-sm font-semibold text-primary-container">📍 আপনার অবস্থান</div>
                  </Popup>
                </Marker>
              </>
            )}

            {/* Mosque markers */}
            {filtered.map((mosque) => (
              <Marker
                key={mosque.id}
                position={[mosque.lat, mosque.lon]}
                icon={mosqueIcon}
                ref={(ref) => { if (ref) markerRefs.current[mosque.id] = ref; }}
              >
                <Popup>
                  <div className="font-inter space-y-1 min-w-[160px]">
                    <p className="font-semibold text-sm text-primary-container">{mosque.name}</p>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <span>📍</span>{(mosque.dist * 1000).toFixed(0)} মিটার দূরে
                    </p>
                    <a
                      href={`https://www.openstreetmap.org/directions?from=${userPos?.[0]},${userPos?.[1]}&to=${mosque.lat},${mosque.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-container hover:underline mt-1"
                    >
                      🗺️ দিকনির্দেশনা
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Mosque list */}
        <div className="bg-surface-base rounded-2xl shadow-ambient border border-border-subtle flex flex-col overflow-hidden" style={{ height: '520px' }}>

          {/* List header + search */}
          <div className="px-4 py-4 border-b border-border-subtle bg-surface-alt/50 space-y-3">
            <h3 className="text-base font-semibold font-manrope text-primary-container flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary icon-fill">mosque</span>
              কাছের মসজিদসমূহ
            </h3>
            {mosques.length > 0 && (
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                <input
                  type="text"
                  placeholder="মসজিদ খুঁজুন…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary-container font-inter"
                />
              </div>
            )}
          </div>

          {/* List body */}
          <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
            {!userPos && !loading && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-text-muted p-6 text-center">
                <span className="material-symbols-outlined text-5xl text-outline">mosque</span>
                <p className="text-sm font-inter">আপনার অবস্থান খুঁজুন বাটনে ক্লিক করুন</p>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary-container rounded-full animate-spin" />
              </div>
            )}

            {!loading && userPos && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted p-6 text-center">
                <span className="material-symbols-outlined text-4xl">search_off</span>
                <p className="text-sm font-inter">এই এলাকায় কোনো মসজিদ পাওয়া যায়নি।</p>
                <button
                  onClick={() => setRadius((r) => Math.min(r * 2, 5000))}
                  className="text-xs text-primary-container hover:underline font-inter"
                >
                  দূরত্ব বাড়ান
                </button>
              </div>
            )}

            {!loading && filtered.map((mosque, i) => (
              <button
                key={mosque.id}
                onClick={() => handleSelectMosque(mosque)}
                className={`w-full text-left px-4 py-3.5 hover:bg-surface-alt transition-colors flex items-start gap-3 ${selected?.id === mosque.id ? 'bg-emerald-50' : ''}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-manrope flex-shrink-0 mt-0.5 ${
                  i === 0 ? 'bg-charity-gold-light text-on-secondary-container' : 'bg-primary-fixed text-on-primary-fixed-variant'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary font-inter truncate">{mosque.name}</p>
                  <p className="text-xs text-text-muted font-inter mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">near_me</span>
                    {mosque.dist < 1
                      ? `${(mosque.dist * 1000).toFixed(0)} মিটার`
                      : `${mosque.dist.toFixed(2)} কিমি`} দূরে
                  </p>
                </div>
                <a
                  href={`https://www.openstreetmap.org/directions?from=${userPos?.[0]},${userPos?.[1]}&to=${mosque.lat},${mosque.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 p-1.5 rounded-lg text-outline hover:text-primary-container hover:bg-emerald-50 transition-colors"
                  title="দিকনির্দেশনা"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                </a>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info note */}
      <p className="text-center text-xs text-text-muted font-inter">
        মসজিদের তথ্য <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="text-primary-container hover:underline">OpenStreetMap</a> থেকে নেওয়া হয়েছে। কিছু মসজিদ তালিকায় নাও থাকতে পারে।
      </p>

    </main>
  );
}
