import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { getPollutionMap } from '../../api/pollutionApi';

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK DATA  (shown when the backend API is unavailable)
// 25 real reef systems worldwide with pollution scores baked in.
// score = 100 - waterClarity  →  low clarity means high pollution.
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_HOTSPOTS = [
  { id: 1,  name: 'Great Barrier Reef',         location: 'Australia',               lat: -18.29, lng:  147.70, score: 52, count:  7, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 2,  name: 'Coral Triangle – Raja Ampat', location: 'Indonesia',              lat:  -0.59, lng:  130.11, score: 18, count:  2, scans: 0, pollutionSeverity: 'Low'      },
  { id: 3,  name: 'Florida Keys Reef',           location: 'USA',                    lat:  24.56, lng:  -81.78, score: 72, count: 18, scans: 0, pollutionSeverity: 'Critical' },
  { id: 4,  name: 'Mesoamerican Barrier Reef',   location: 'Belize',                 lat:  17.25, lng:  -87.55, score: 45, count:  9, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 5,  name: 'Red Sea Reef',                location: 'Egypt',                  lat:  27.20, lng:   33.83, score: 28, count:  3, scans: 0, pollutionSeverity: 'Low'      },
  { id: 6,  name: 'Tubbataha Reef',              location: 'Philippines',            lat:   8.77, lng:  119.90, score: 21, count:  2, scans: 0, pollutionSeverity: 'Low'      },
  { id: 7,  name: 'Chagos Archipelago',          location: 'British Indian Ocean',   lat:  -6.36, lng:   71.87, score:  5, count:  0, scans: 0, pollutionSeverity: 'Pristine' },
  { id: 8,  name: 'Maldives Reefs',              location: 'Maldives',               lat:   3.20, lng:   73.22, score: 40, count:  8, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 9,  name: 'Palau Barrier Reef',          location: 'Palau',                  lat:   7.34, lng:  134.48, score: 15, count:  1, scans: 0, pollutionSeverity: 'Low'      },
  { id: 10, name: 'New Caledonia Reef',          location: 'France (Pacific)',       lat: -21.30, lng:  165.30, score: 30, count:  4, scans: 0, pollutionSeverity: 'Low'      },
  { id: 11, name: 'Hawaii Reef Systems',         location: 'USA',                    lat:  21.31, lng: -157.86, score: 50, count: 10, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 12, name: 'Andaman Sea Reef',            location: 'Thailand',               lat:   7.95, lng:   98.34, score: 45, count: 11, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 13, name: 'Gulf of Oman Reef',           location: 'Oman',                   lat:  22.50, lng:   59.50, score: 32, count:  3, scans: 0, pollutionSeverity: 'Low'      },
  { id: 14, name: 'Mayotte Lagoon',              location: 'France (Indian Ocean)',  lat: -12.83, lng:   45.17, score: 24, count:  3, scans: 0, pollutionSeverity: 'Low'      },
  { id: 15, name: 'Bermuda Platform Reef',       location: 'Bermuda',                lat:  32.31, lng:  -64.75, score: 70, count: 20, scans: 0, pollutionSeverity: 'Critical' },
  { id: 16, name: 'Ningaloo Reef',               location: 'Australia',              lat: -22.68, lng:  113.74, score: 10, count:  1, scans: 0, pollutionSeverity: 'Pristine' },
  { id: 17, name: 'Cocos Island Reef',           location: 'Costa Rica',             lat:   5.53, lng:  -87.07, score: 20, count:  2, scans: 0, pollutionSeverity: 'Low'      },
  { id: 18, name: 'Galapagos Marine Reserve',    location: 'Ecuador',                lat:  -0.67, lng:  -90.55, score: 25, count:  3, scans: 0, pollutionSeverity: 'Low'      },
  { id: 19, name: 'Gulf of Mexico Reef',         location: 'Mexico',                 lat:  19.43, lng:  -89.13, score: 80, count: 25, scans: 0, pollutionSeverity: 'Critical' },
  { id: 20, name: 'Caribbean – Virgin Islands',  location: 'US Virgin Islands',      lat:  18.34, lng:  -64.90, score: 75, count: 22, scans: 0, pollutionSeverity: 'Critical' },
  { id: 21, name: 'Spermonde Archipelago',       location: 'Indonesia',              lat:  -5.01, lng:  119.33, score: 78, count: 30, scans: 0, pollutionSeverity: 'Critical' },
  { id: 22, name: 'Okinawa Reef',                location: 'Japan',                  lat:  26.33, lng:  127.81, score: 42, count:  6, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 23, name: 'Sri Lanka Reef',              location: 'Sri Lanka',              lat:   7.87, lng:   80.77, score: 50, count: 12, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 24, name: 'Mozambique Channel Reef',     location: 'Mozambique',             lat: -17.27, lng:   35.54, score: 35, count:  4, scans: 0, pollutionSeverity: 'Low'      },
  { id: 25, name: 'Comoros Reef',                location: 'Comoros',                lat: -11.65, lng:   43.33, score: 30, count:  3, scans: 0, pollutionSeverity: 'Low'      },
];
const FALLBACK_TOTAL = FALLBACK_HOTSPOTS.reduce((s, h) => s + h.count, 0);

// ─────────────────────────────────────────────────────────────────────────────
// Auto-refresh interval (1 minute)
// ─────────────────────────────────────────────────────────────────────────────
const REFRESH_MS = 60_000;

// ─────────────────────────────────────────────────────────────────────────────
// scoreColor(score)
// Maps a 0-100 pollution score to a colour:
//   0-50 → yellow (#f2d06b)  |  50-100 → orange → red
// Uses linear interpolation between three RGB stops.
// ─────────────────────────────────────────────────────────────────────────────
function scoreColor(score) {
  const stops = [
    [242, 208, 107], // yellow   (clean-ish)
    [255, 154,  77], // orange   (moderate)
    [255,  77,  94], // red      (critical)
  ];
  const t = Math.min(Math.max(score / 100, 0), 1) * 2;
  const i = Math.min(Math.floor(t), 1);
  const [a, b] = [stops[i], stops[i + 1]];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * (t - i))).join(',')})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// label(h)  →  "18°S, 147°E"  — human-readable coordinate label
// ─────────────────────────────────────────────────────────────────────────────
const label = (h) =>
  `${Math.abs(h.lat).toFixed(0)}°${h.lat >= 0 ? 'N' : 'S'}, ` +
  `${Math.abs(h.lng).toFixed(0)}°${h.lng >= 0 ? 'E' : 'W'}`;

// ─────────────────────────────────────────────────────────────────────────────
// <FlyTo target={selectedHotspot} />
// A tiny Leaflet helper component that smoothly pans/zooms the map
// whenever the user clicks a hotspot in the sidebar list.
// useMap() is a react-leaflet hook that gives access to the Leaflet map instance.
// ─────────────────────────────────────────────────────────────────────────────
function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 5, { duration: 1.1 });
  }, [target, map]);
  return null; // renders nothing — purely a side-effect component
}

// ─────────────────────────────────────────────────────────────────────────────
// <MarineMapView />  — the main exported component
// Props:
//   className  — Tailwind height class (default "h-[680px]")
// ─────────────────────────────────────────────────────────────────────────────
export default function MarineMapView({ className = 'h-[680px]' }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [hotspots,  setHotspots]  = useState(FALLBACK_HOTSPOTS); // pre-filled with fallback
  const [total,     setTotal]     = useState(FALLBACK_TOTAL);
  const [reefBelt,  setReefBelt]  = useState(true);              // filter: 32°N–32°S band
  const [minScore,  setMinScore]  = useState(0);                 // slider: hide low scores
  const [selected,  setSelected]  = useState(null);              // clicked hotspot for FlyTo
  const [loading,   setLoading]   = useState(false);
  const [usingFallback, setUsingFallback] = useState(true);      // shows "demo data" badge

  // ── Data fetching ──────────────────────────────────────────────────────────
  // load() tries the backend API; on failure silently keeps the fallback data.
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPollutionMap({ reefBelt });
      if (data.hotspots && data.hotspots.length > 0) {
        setHotspots(data.hotspots);
        setTotal(data.totalReadings ?? 0);
        setUsingFallback(false);
      } else if (data && data.length > 0) {
        // Handle case where API returns a direct array (from our CSV update)
        setHotspots(data);
        setTotal(data.length);
        setUsingFallback(false);
      }
    } catch {
      // Backend unreachable — keep fallback data, show notice instead of red error
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, [reefBelt]);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer); // cleanup on unmount
  }, [load]);

  // ── Derived values (memoised so they only recompute when deps change) ──────
  const shown = useMemo(
    () => hotspots.filter((h) => h.score >= minScore),
    [hotspots, minScore],
  );
  const avg = shown.length
    ? Math.round(shown.reduce((s, h) => s + h.score, 0) / shown.length)
    : 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-teal-900/40 bg-[#06222a] ${className}`}>

      {/* ── Leaflet map ─────────────────────────────────────────────────────── */}
      <MapContainer
        center={[10, 90]}      // initial centre: Indian Ocean (good global view)
        zoom={3}
        minZoom={2}
        worldCopyJump          // seamlessly wraps when user scrolls past 180°
        zoomControl={false}    // we'll keep default zoom controls off for cleaner UI
        className="h-full w-full bg-[#06222a]"
      >
        {/*
          TileLayer — the actual map background image tiles.
          We use ESRI's free World Ocean Base tileset:
            • No API key required — completely free forever
            • Beautiful dark ocean look with sea-floor features
            • Perfect for a reef-monitoring app
          Note: ESRI tiles use {z}/{y}/{x} order (y before x) unlike OSM.
        */}
        <TileLayer
          attribution='Tiles &copy; <a href="https://www.esri.com">Esri</a>, Garmin, GEBCO, NOAA NGDC'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Smooth fly-to animation when a hotspot is selected in the sidebar */}
        <FlyTo target={selected} />

        {/* ── Add MarkerClusterGroup here to group densely packed CSV markers ── */}
        <MarkerClusterGroup chunkedLoading>
          {/* ── Render one entry per visible hotspot ─────────────────────────── */}
          {shown.map((h) => {
            const color  = scoreColor(h.score);
            const radius = 90_000 + h.score * 2_500; // metres; more pollution = bigger glow

            return (
              <Fragment key={h.id}>
                {/*
                  Two overlapping translucent Circles create a soft "glow" halo.
                  The outer one (fillOpacity 0.1) bleeds outward;
                  the inner one (fillOpacity 0.2) is denser at the centre.
                  interactive={false} means clicks pass through to the CircleMarker below.
                */}
                <Circle
                  center={[h.lat, h.lng]}
                  radius={radius}
                  pathOptions={{ stroke: false, fillColor: color, fillOpacity: 0.12 }}
                  interactive={false}
                />
                <Circle
                  center={[h.lat, h.lng]}
                  radius={radius * 0.45}
                  pathOptions={{ stroke: false, fillColor: color, fillOpacity: 0.22 }}
                  interactive={false}
                />

                {/*
                  CircleMarker — the clickable dot on the map.
                  radius in PIXELS (not metres), so it stays a fixed visual size
                  regardless of zoom level. We scale it slightly with pollution score.
                */}
                <CircleMarker
                  center={[h.lat, h.lng]}
                  radius={4 + h.score / 25}
                  pathOptions={{ color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 1 }}
                  eventHandlers={{ click: () => setSelected(h) }}
                >
                  {/* Tooltip: shown on hover — coordinate label */}
                  <Tooltip direction="top" offset={[0, -4]}>
                    <span className="font-semibold">{h.name}</span>
                    <br />
                    <span className="text-xs text-slate-500">{label(h)}</span>
                  </Tooltip>

                  {/* Popup: shown on click — full detail card */}
                  <Popup closeButton={false} minWidth={200}>
                    <div>
                      <h3 className="text-sm font-bold">{h.name}</h3>
                      <p className="text-xs text-slate-500">{h.location} · {label(h)}</p>
                      <p className="mt-1 text-xs font-medium" style={{ color }}>
                        {h.pollutionSeverity} — score {h.score}/100
                      </p>
                      {/* Score bar */}
                      <div className="my-2 h-1.5 rounded bg-slate-200">
                        <div className="h-full rounded" style={{ width: `${h.score}%`, background: color }} />
                      </div>
                      <p className="text-xs text-slate-500">
                        {h.count} debris reading{h.count !== 1 ? 's' : ''}
                        {h.scans > 0 && ` · ${h.scans} from user scans`}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              </Fragment>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* ── Sidebar panel ───────────────────────────────────────────────────── */}
      <aside className="absolute left-3 top-3 z-[1000] flex max-h-[calc(100%-1.5rem)] w-72 flex-col overflow-hidden rounded-2xl border border-teal-200/15 bg-[#071f26]/90 text-slate-100 backdrop-blur">

        {/* Title */}
        <div className="p-4">
          <h2 className="font-serif text-xl font-bold tracking-tight">Reef pollution map</h2>
          <p className="mt-1 text-xs text-teal-100/60">
            Brighter areas have more pollution. Select one for details.
          </p>
          {/* Demo data notice — shown when backend is unreachable */}
          {usingFallback && (
            <p className="mt-2 rounded-lg bg-teal-900/40 px-2 py-1 text-[11px] text-teal-300">
              📡 Showing demo data — connect backend for live readings
            </p>
          )}
          {loading && (
            <p className="mt-1 text-[11px] text-teal-100/40">Refreshing…</p>
          )}
        </div>

        {/* Stats row: hotspots | avg score | total readings */}
        <div className="grid grid-cols-3 border-y border-teal-200/15 text-center">
          {[
            { label: 'hotspots', value: shown.length },
            { label: 'avg score', value: avg },
            { label: 'readings', value: total.toLocaleString() },
          ].map((s, i, arr) => (
            <div key={s.label} className={`p-3 ${i < arr.length - 1 ? 'border-r border-teal-200/15' : ''}`}>
              <b className="block font-serif text-xl">{s.value}</b>
              <span className="text-[11px] text-teal-100/60">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Controls: reef-belt checkbox + score slider */}
        <div className="space-y-3 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={reefBelt}
              onChange={(e) => setReefBelt(e.target.checked)}
              className="accent-teal-300"
            />
            Reef belt only (32°N to 32°S)
          </label>

          <div>
            <label htmlFor="minScore" className="flex justify-between text-xs text-teal-100/60">
              <span>Minimum pollution score</span>
              <span>{minScore}</span>
            </label>
            <input
              id="minScore"
              type="range"
              min="0" max="90" step="5"
              value={minScore}
              onChange={(e) => setMinScore(+e.target.value)}
              className="mt-2 w-full accent-teal-300"
            />
          </div>
        </div>

        {/* Hotspot list (scrollable) */}
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {shown.length === 0 && (
            <p className="p-3 text-sm text-teal-100/60">
              Nothing at this score threshold — lower the slider to see more.
            </p>
          )}
          {shown.slice(0, 60).map((h) => (
            <button
              key={h.id}
              onClick={() => setSelected({ ...h })}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-teal-300/10 focus-visible:outline-none"
            >
              {/* Coloured score badge */}
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-[#1a0f08]"
                style={{ background: scoreColor(h.score) }}
              >
                {h.score}
              </span>
              <span className="text-sm leading-tight">
                {h.name}
                <small className="block text-xs text-teal-100/50">{h.count} readings</small>
              </span>
            </button>
          ))}
        </div>

        {/* Footer: refresh button */}
        <div className="flex justify-end border-t border-teal-200/15 px-4 py-2">
          <button
            onClick={load}
            className="rounded-full border border-teal-200/20 px-3 py-1 text-xs hover:border-teal-300 disabled:opacity-40"
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </aside>
    </div>
  );
}