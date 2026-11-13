
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { getPollutionMap } from '../../api/pollutionApi';

// ============================================================
// FALLBACK DATA
// ============================================================

const FALLBACK_HOTSPOTS = [
  { id: 1, name: 'Great Barrier Reef', location: 'Australia', lat: -18.29, lng: 147.70, score: 52, count: 7, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 2, name: 'Coral Triangle – Raja Ampat', location: 'Indonesia', lat: -0.59, lng: 130.11, score: 18, count: 2, scans: 0, pollutionSeverity: 'Low' },
  { id: 3, name: 'Florida Keys Reef', location: 'USA', lat: 24.56, lng: -81.78, score: 72, count: 18, scans: 0, pollutionSeverity: 'Critical' },
  { id: 4, name: 'Mesoamerican Barrier Reef', location: 'Belize', lat: 17.25, lng: -87.55, score: 45, count: 9, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 5, name: 'Red Sea Reef', location: 'Egypt', lat: 27.20, lng: 33.83, score: 28, count: 3, scans: 0, pollutionSeverity: 'Low' },
  { id: 6, name: 'Tubbataha Reef', location: 'Philippines', lat: 8.77, lng: 119.90, score: 21, count: 2, scans: 0, pollutionSeverity: 'Low' },
  { id: 7, name: 'Chagos Archipelago', location: 'British Indian Ocean', lat: -6.36, lng: 71.87, score: 5, count: 0, scans: 0, pollutionSeverity: 'Pristine' },
  { id: 8, name: 'Maldives Reefs', location: 'Maldives', lat: 3.20, lng: 73.22, score: 40, count: 8, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 9, name: 'Palau Barrier Reef', location: 'Palau', lat: 7.34, lng: 134.48, score: 15, count: 1, scans: 0, pollutionSeverity: 'Low' },
  { id: 10, name: 'New Caledonia Reef', location: 'France (Pacific)', lat: -21.30, lng: 165.30, score: 30, count: 4, scans: 0, pollutionSeverity: 'Low' },
  { id: 11, name: 'Hawaii Reef Systems', location: 'USA', lat: 21.31, lng: -157.86, score: 50, count: 10, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 12, name: 'Andaman Sea Reef', location: 'Thailand', lat: 7.95, lng: 98.34, score: 45, count: 11, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 13, name: 'Gulf of Oman Reef', location: 'Oman', lat: 22.50, lng: 59.50, score: 32, count: 3, scans: 0, pollutionSeverity: 'Low' },
  { id: 14, name: 'Mayotte Lagoon', location: 'France (Indian Ocean)', lat: -12.83, lng: 45.17, score: 24, count: 3, scans: 0, pollutionSeverity: 'Low' },
  { id: 15, name: 'Bermuda Platform Reef', location: 'Bermuda', lat: 32.31, lng: -64.75, score: 70, count: 20, scans: 0, pollutionSeverity: 'Critical' },
  { id: 16, name: 'Ningaloo Reef', location: 'Australia', lat: -22.68, lng: 113.74, score: 10, count: 1, scans: 0, pollutionSeverity: 'Pristine' },
  { id: 17, name: 'Cocos Island Reef', location: 'Costa Rica', lat: 5.53, lng: -87.07, score: 20, count: 2, scans: 0, pollutionSeverity: 'Low' },
  { id: 18, name: 'Galapagos Marine Reserve', location: 'Ecuador', lat: -0.67, lng: -90.55, score: 25, count: 3, scans: 0, pollutionSeverity: 'Low' },
  { id: 19, name: 'Gulf of Mexico Reef', location: 'Mexico', lat: 19.43, lng: -89.13, score: 80, count: 25, scans: 0, pollutionSeverity: 'Critical' },
  { id: 20, name: 'Caribbean – Virgin Islands', location: 'US Virgin Islands', lat: 18.34, lng: -64.90, score: 75, count: 22, scans: 0, pollutionSeverity: 'Critical' },
  { id: 21, name: 'Spermonde Archipelago', location: 'Indonesia', lat: -5.01, lng: 119.33, score: 78, count: 30, scans: 0, pollutionSeverity: 'Critical' },
  { id: 22, name: 'Okinawa Reef', location: 'Japan', lat: 26.33, lng: 127.81, score: 42, count: 6, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 23, name: 'Sri Lanka Reef', location: 'Sri Lanka', lat: 7.87, lng: 80.77, score: 50, count: 12, scans: 0, pollutionSeverity: 'Moderate' },
  { id: 24, name: 'Mozambique Channel Reef', location: 'Mozambique', lat: -17.27, lng: 35.54, score: 35, count: 4, scans: 0, pollutionSeverity: 'Low' },
  { id: 25, name: 'Comoros Reef', location: 'Comoros', lat: -11.65, lng: 43.33, score: 30, count: 3, scans: 0, pollutionSeverity: 'Low' },
];

const FALLBACK_TOTAL = FALLBACK_HOTSPOTS.reduce(
  (sum, hotspot) => sum + hotspot.count,
  0
);

// ============================================================
// DEMO DATA
// ============================================================

const DEMO_HOTSPOTS = [
  { id: 'demo-1', name: 'Jakarta Bay, Indonesia', lat: -6.0, lng: 106.8, score: 92, count: 14 },
  { id: 'demo-2', name: 'Visayan Sea, Philippines', lat: 10.3, lng: 123.9, score: 88, count: 11 },
  { id: 'demo-3', name: 'Kingston Harbour, Jamaica', lat: 17.9, lng: -76.8, score: 84, count: 7 },
  { id: 'demo-4', name: 'Persian Gulf, UAE', lat: 25.3, lng: 55.0, score: 82, count: 9 },
  { id: 'demo-5', name: 'Hainan Island, China', lat: 18.2, lng: 109.7, score: 79, count: 6 },
  { id: 'demo-6', name: 'Cancun, Mexico', lat: 21.2, lng: -86.8, score: 77, count: 8 },
  { id: 'demo-7', name: 'Gulf of Thailand', lat: 12.5, lng: 100.5, score: 74, count: 10 },
  { id: 'demo-8', name: 'Gulf of Mannar, India', lat: 9.0, lng: 79.1, score: 71, count: 5 },
  { id: 'demo-9', name: 'Florida Keys, USA', lat: 24.7, lng: -81.0, score: 70, count: 12 },
  { id: 'demo-10', name: 'Great Barrier Reef, Australia', lat: -18.3, lng: 147.0, score: 68, count: 16 },
  { id: 'demo-11', name: 'Malé Atoll, Maldives', lat: 4.2, lng: 73.5, score: 66, count: 6 },
  { id: 'demo-12', name: 'Santos, Brazil', lat: -24.0, lng: -46.3, score: 63, count: 4 },
  { id: 'demo-13', name: 'Hurghada, Red Sea', lat: 27.2, lng: 33.8, score: 60, count: 7 },
  { id: 'demo-14', name: 'Mombasa, Kenya', lat: -4.1, lng: 39.7, score: 57, count: 5 },
  { id: 'demo-15', name: 'Oahu, Hawaii', lat: 21.4, lng: -157.8, score: 50, count: 6 },
  { id: 'demo-16', name: 'Tuamotu, French Polynesia', lat: -17.5, lng: -145.0, score: 28, count: 3 },
];

const REFRESH_MS = 60_000;

// ============================================================
// POLLUTION SCORE COLOR
// ============================================================

function scoreColor(score) {
  const stops = [
    [242, 208, 107],
    [255, 154, 77],
    [255, 77, 94],
  ];

  const t = Math.min(Math.max(Number(score) / 100, 0), 1) * 2;
  const index = Math.min(Math.floor(t), 1);
  const [a, b] = [stops[index], stops[index + 1]];

  return `rgb(${a
    .map((value, i) =>
      Math.round(value + (b[i] - value) * (t - index))
    )
    .join(',')})`;
}

// ============================================================
// COORDINATE LABEL - INCOMING VERSION
// ============================================================

const label = (hotspot) =>
  `${Math.abs(hotspot.lat).toFixed(0)}°${hotspot.lat >= 0 ? 'N' : 'S'}, ` +
  `${Math.abs(hotspot.lng).toFixed(0)}°${hotspot.lng >= 0 ? 'E' : 'W'}`;

// ============================================================
// MAP NAVIGATION
// ============================================================

function FlyTo({ target }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 5, {
        duration: 1.1,
      });
    }
  }, [target, map]);

  return null;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MarineMapView({
  className = 'h-[680px]',
}) {
  // State initialized with fallback data

  const [hotspots, setHotspots] = useState(FALLBACK_HOTSPOTS);
  const [total, setTotal] = useState(FALLBACK_TOTAL);

  const [reefBelt, setReefBelt] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(true);

  // Fetch pollution data

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPollutionMap({ reefBelt });
      const data = response?.data ?? response;

      let apiHotspots;

      if (Array.isArray(data?.hotspots)) {
        apiHotspots = data.hotspots;
      } else if (Array.isArray(data)) {
        apiHotspots = data;
      } else {
        throw new Error('Unexpected pollution API response');
      }

      if (apiHotspots.length > 0) {
        setHotspots(apiHotspots);

        const calculatedTotal = apiHotspots.reduce(
          (sum, hotspot) =>
            sum + (Number(hotspot.count) || 0),
          0
        );

        setTotal(
          Number(data?.totalReadings) || calculatedTotal
        );

        setUsingFallback(false);
      } else {
        setHotspots(FALLBACK_HOTSPOTS);
        setTotal(FALLBACK_TOTAL);
        setUsingFallback(true);
      }
    } catch (error) {
      console.warn(
        'Backend unavailable. Loading demo data.',
        error
      );

      // Use fallback data when API is unavailable.

      setHotspots(DEMO_HOTSPOTS);
      setTotal(
        DEMO_HOTSPOTS.reduce(
          (sum, hotspot) => sum + hotspot.count,
          0
        )
      );

      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, [reefBelt]);

  // Initial load and automatic refresh

  useEffect(() => {
    load();

    const timer = setInterval(load, REFRESH_MS);

    return () => clearInterval(timer);
  }, [load]);

  // Filter hotspots

  const shown = useMemo(
    () =>
      hotspots.filter(
        (hotspot) =>
          Number(hotspot.score) >= minScore &&
          (!reefBelt ||
            (hotspot.lat >= -32 && hotspot.lat <= 32))
      ),
    [hotspots, minScore, reefBelt]
  );

  // Average pollution score

  const avg = shown.length
    ? Math.round(
        shown.reduce(
          (sum, hotspot) =>
            sum + (Number(hotspot.score) || 0),
          0
        ) / shown.length
      )
    : 0;

  const shownReadings = shown.reduce(
    (sum, hotspot) =>
      sum + (Number(hotspot.count) || 0),
    0
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-teal-900/40 bg-[#06222a] ${className}`}
    >
      {/* MAP */}

      <MapContainer
        center={[10, 90]}
        zoom={3}
        minZoom={2}
        worldCopyJump
        zoomControl={false}
        className="h-full w-full bg-[#06222a]"
      >
        {/* ESRI Ocean Base Map */}

        <TileLayer
          attribution='Tiles &copy; <a href="https://www.esri.com">Esri</a>, Garmin, GEBCO, NOAA NGDC'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={18}
          keepBuffer={4}
        />

        <FlyTo target={selected} />

        {/* HOTSPOT MARKERS */}

        <MarkerClusterGroup chunkedLoading>
          {shown.map((hotspot) => {
            const color = scoreColor(hotspot.score);
            const radius =
              90_000 + Number(hotspot.score) * 2_500;

            return (
              <Fragment key={hotspot.id}>
                {/* Outer glow */}

                <Circle
                  center={[hotspot.lat, hotspot.lng]}
                  radius={radius}
                  pathOptions={{
                    stroke: false,
                    fillColor: color,
                    fillOpacity: 0.1,
                  }}
                  interactive={false}
                />

                {/* Inner glow */}

                <Circle
                  center={[hotspot.lat, hotspot.lng]}
                  radius={radius * 0.45}
                  pathOptions={{
                    stroke: false,
                    fillColor: color,
                    fillOpacity: 0.2,
                  }}
                  interactive={false}
                />

                {/* Hotspot marker */}

                <CircleMarker
                  center={[hotspot.lat, hotspot.lng]}
                  radius={4 + Number(hotspot.score) / 25}
                  pathOptions={{
                    color: '#fff',
                    weight: 1.5,
                    fillColor: color,
                    fillOpacity: 1,
                  }}
                  eventHandlers={{
                    click: () => setSelected(hotspot),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -4]}>
                    <span className="font-semibold">
                      {hotspot.name}
                    </span>
                    <br />
                    <span className="text-xs text-slate-500">
                      {label(hotspot)}
                    </span>
                  </Tooltip>

                  <Popup closeButton={false} minWidth={200}>
                    <div>
                      <h3 className="text-sm font-bold">
                        {hotspot.name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {hotspot.location || 'Unknown location'}
                        {' · '}
                        {label(hotspot)}
                      </p>

                      <p
                        className="mt-1 text-xs font-medium"
                        style={{ color }}
                      >
                        {hotspot.pollutionSeverity || 'Unknown'}
                        {' — Score '}
                        {hotspot.score}/100
                      </p>

                      <div className="my-2 h-1.5 rounded bg-slate-200">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${Math.min(
                              Math.max(Number(hotspot.score), 0),
                              100
                            )}%`,
                            background: color,
                          }}
                        />
                      </div>

                      <p className="text-xs text-slate-500">
                        {hotspot.count || 0} debris readings
                        {hotspot.scans > 0 &&
                          ` · ${hotspot.scans} from user scans`}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              </Fragment>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* SIDEBAR */}

      <aside className="absolute left-3 top-3 z-[1000] flex max-h-[calc(100%-1.5rem)] w-72 flex-col overflow-hidden rounded-2xl border border-teal-200/15 bg-[#071f26]/90 text-slate-100 backdrop-blur">

        {/* Header */}

        <div className="p-4">
          <h2 className="font-serif text-xl font-bold tracking-tight">
            Reef pollution map
          </h2>

          <p className="mt-1 text-xs text-teal-100/60">
            Brighter areas have more pollution.
            Select one for details.
          </p>

          {usingFallback && (
            <p className="mt-2 rounded-lg bg-teal-900/40 px-2 py-1 text-[11px] text-teal-300">
              📡 Showing demo data — connect backend for live readings
            </p>
          )}

          {loading && (
            <p className="mt-1 text-[11px] text-teal-100/40">
              Refreshing...
            </p>
          )}
        </div>

        {/* Statistics */}

        <div className="grid grid-cols-3 border-y border-teal-200/15 text-center">
          {[
            { label: 'hotspots', value: shown.length },
            { label: 'avg score', value: avg },
            { label: 'readings', value: total.toLocaleString() },
          ].map((stat, index, array) => (
            <div
              key={stat.label}
              className={`p-3 ${
                index < array.length - 1
                  ? 'border-r border-teal-200/15'
                  : ''
              }`}
            >
              <b className="block font-serif text-xl">
                {stat.value}
              </b>

              <span className="text-[11px] text-teal-100/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Filters */}

        <div className="space-y-3 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={reefBelt}
              onChange={(event) =>
                setReefBelt(event.target.checked)
              }
              className="accent-teal-300"
            />
            Reef belt only (32°N to 32°S)
          </label>

          <div>
            <label
              htmlFor="minScore"
              className="flex justify-between text-xs text-teal-100/60"
            >
              <span>Minimum pollution score</span>
              <span>{minScore}</span>
            </label>

            <input
              id="minScore"
              type="range"
              min="0"
              max="90"
              step="5"
              value={minScore}
              onChange={(event) =>
                setMinScore(Number(event.target.value))
              }
              className="mt-2 w-full accent-teal-300"
            />
          </div>
        </div>

        {/* Hotspot list */}

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {shown.length === 0 && (
            <p className="p-3 text-sm text-teal-100/60">
              Nothing at this score threshold — lower the
              slider to see more.
            </p>
          )}

          {shown.slice(0, 60).map((hotspot) => (
            <button
              key={hotspot.id}
              onClick={() => setSelected({ ...hotspot })}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-teal-300/10 focus-visible:outline-none"
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-[#1a0f08]"
                style={{
                  background: scoreColor(hotspot.score),
                }}
              >
                {hotspot.score}
              </span>

              <span className="text-sm leading-tight">
                {hotspot.name}

                <small className="block text-xs text-teal-100/50">
                  {hotspot.count || 0} readings
                </small>
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}

        <div className="flex justify-between border-t border-teal-200/15 px-4 py-2">
          <span className="self-center text-[10px] text-teal-100/50">
            {shownReadings.toLocaleString()} filtered readings
          </span>

          <button
            onClick={load}
            disabled={loading}
            className="rounded-full border border-teal-200/20 px-3 py-1 text-xs hover:border-teal-300 disabled:opacity-40"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </aside>
    </div>
  );
}
