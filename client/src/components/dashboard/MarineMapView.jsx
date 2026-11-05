import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getPollutionMap } from '../../api/pollutionApi';

const REFRESH_MS = 60000;

// Clearly labelled fallback so the dashboard remains usable when the API is offline.
// These are illustrative locations, not live sensor measurements.
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

function scoreColor(score) {
  const stops = [[242, 208, 107], [255, 154, 77], [255, 77, 94]];
  const t = Math.min(Math.max(score / 100, 0), 1) * 2;
  const i = Math.min(Math.floor(t), 1);
  const [a, b] = [stops[i], stops[i + 1]];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * (t - i))).join(',')})`;
}

const label = (h) =>
  h.name || `${Math.abs(h.lat).toFixed(0)}°${h.lat >= 0 ? 'N' : 'S'}, ${Math.abs(h.lng).toFixed(0)}°${h.lng >= 0 ? 'E' : 'W'}`;

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 5, { duration: 1.1 });
  }, [target, map]);
  return null;
}

export default function MarineMapView({ className = 'h-[680px]' }) {
  const [hotspots, setHotspots] = useState([]);
  const [total, setTotal] = useState(0);
  const [reefBelt, setReefBelt] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataMode, setDataMode] = useState('loading');
  const [dataSource, setDataSource] = useState('');
  const [dataSourceUrl, setDataSourceUrl] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await getPollutionMap({ reefBelt });
      if (!Array.isArray(data?.hotspots)) throw new Error('Unexpected pollution API response');
      setHotspots(data.hotspots);
      setTotal(Number(data.totalReadings) || 0);
      setDataSource(data?.source || 'Reefwatch API');
      setDataSourceUrl(data?.sourceUrl || '');
      setDataMode(data?.isLive ? 'live' : 'dataset');
    } catch {
      setHotspots(DEMO_HOTSPOTS);
      setTotal(DEMO_HOTSPOTS.reduce((sum, h) => sum + h.count, 0));
      setDataSource('');
      setDataSourceUrl('');
      setDataMode('demo');
    } finally {
      setLoading(false);
    }
  }, [reefBelt]);

  useEffect(() => {
    setLoading(true);
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const shown = useMemo(
    () => hotspots.filter((h) => h.score >= minScore && (!reefBelt || (h.lat >= -32 && h.lat <= 32))),
    [hotspots, minScore, reefBelt]
  );
  const avg = shown.length
    ? Math.round(shown.reduce((sum, h) => sum + h.score, 0) / shown.length)
    : 0;
  const shownReadings = shown.reduce((sum, h) => sum + (Number(h.count) || 0), 0);

  return (
    <div className={`relative isolate overflow-hidden rounded-2xl border border-teal-900/40 bg-[#06222a] ${className}`}>
      <MapContainer
        center={[10, 90]}
        zoom={3}
        minZoom={2}
        maxZoom={18}
        worldCopyJump
        zoomControl
        scrollWheelZoom
        className="h-full w-full bg-[#06222a]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          keepBuffer={4}
        />
        <FlyTo target={selected} />
        {shown.map((h) => {
          const color = scoreColor(h.score);
          const radius = 90000 + h.score * 2500;
          return (
            <Fragment key={h.id}>
              <Circle center={[h.lat, h.lng]} radius={radius} pathOptions={{ stroke: false, fillColor: color, fillOpacity: 0.1 }} interactive={false} />
              <Circle center={[h.lat, h.lng]} radius={radius * 0.5} pathOptions={{ stroke: false, fillColor: color, fillOpacity: 0.2 }} interactive={false} />
              <CircleMarker
                center={[h.lat, h.lng]}
                radius={3 + h.score / 30}
                pathOptions={{ color: '#fff', weight: 1, fillColor: color, fillOpacity: 1 }}
                eventHandlers={{ click: () => setSelected(h) }}
              >
                <Tooltip direction="top">{label(h)}</Tooltip>
                <Popup closeButton={false}>
                  <div className="min-w-[180px]">
                    <h3 className="text-base font-semibold">{label(h)}</h3>
                    {dataMode === 'dataset' || dataMode === 'live' ? (
                      <>
                        <p className="text-xs text-slate-600">Most common concentration class: {h.concentrationClass || 'Unclassified'}</p>
                        {h.marineSetting && <p className="text-xs text-slate-600">Marine setting: {h.marineSetting}</p>}
                        {h.samplingMethod && <p className="text-xs text-slate-600">Sampling method: {h.samplingMethod}</p>}
                        {h.avgConcentration != null && <p className="text-xs text-slate-600">Mean measured concentration: {Number(h.avgConcentration).toLocaleString()} {h.unit}</p>}
                        <p className="text-xs text-slate-600">Class display score: {h.score}/100 (derived from source class)</p>
                        {h.sampleDateStart && <p className="text-xs text-slate-600">Sample dates: {h.sampleDateStart}{h.sampleDateEnd && h.sampleDateEnd !== h.sampleDateStart ? ` to ${h.sampleDateEnd}` : ''}</p>}
                        {h.accessionUrl && <a className="text-xs text-blue-700 underline" href={h.accessionUrl} target="_blank" rel="noreferrer">Open NCEI record</a>}
                      </>
                    ) : <p className="text-xs text-slate-500">Illustrative demo score: {h.score}/100</p>}
                    <div className="my-2 h-1.5 rounded bg-slate-200">
                      <div className="h-full rounded" style={{ width: `${h.score}%`, background: color }} />
                    </div>
                    <p className="text-xs">{h.count} source sample{h.count === 1 ? '' : 's'}</p>
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>

      <aside className="absolute left-3 top-3 z-[1000] flex max-h-[calc(100%-1.5rem)] w-72 flex-col overflow-hidden rounded-2xl border border-teal-200/15 bg-[#071f26]/95 text-slate-100 shadow-xl backdrop-blur">
        <div className="p-4">
          <h2 className="font-serif text-xl font-bold tracking-tight">Reef pollution map</h2>
          <p className="mt-1 text-xs text-teal-100/70">Brighter areas indicate higher microplastic concentration classes. Select a marker for details.</p>
        </div>
        <div className="grid grid-cols-3 border-y border-teal-200/15 text-center">
          <div className="border-r border-teal-200/15 p-3">
            <b className="block font-serif text-xl">{shown.length}</b>
            <span className="text-[11px] text-teal-100/60">hotspots</span>
          </div>
          <div className="border-r border-teal-200/15 p-3">
            <b className="block font-serif text-xl">{avg}</b>
            <span className="text-[11px] text-teal-100/60">avg class score</span>
          </div>
          <div className="p-3">
            <b className="block font-serif text-xl">{shownReadings.toLocaleString()}</b>
            <span className="text-[11px] text-teal-100/60">readings</span>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={reefBelt} onChange={(e) => setReefBelt(e.target.checked)} className="accent-teal-300" />
            Reef belt only (32°N to 32°S)
          </label>
          <div>
            <label htmlFor="minScore" className="flex justify-between text-xs text-teal-100/60">
              <span>Minimum class score</span><span>{minScore}</span>
            </label>
            <input id="minScore" type="range" min="0" max="90" step="5" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="mt-2 w-full accent-teal-300" />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {loading && <p className="p-3 text-sm text-teal-100/60">Loading reef locations…</p>}
          {!loading && shown.length === 0 && (
            <p className="p-3 text-sm text-teal-100/60">No locations match these filters. Lower the minimum score or turn off reef-belt filtering.</p>
          )}
          {shown.slice(0, 60).map((h) => (
            <button key={h.id} onClick={() => setSelected(h)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-teal-300/10 focus-visible:bg-teal-300/10 focus-visible:outline-none">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-[#1a0f08]" style={{ background: scoreColor(h.score) }}>{h.score}</span>
              <span className="text-sm">{label(h)}<small className="block text-xs text-teal-100/50">{h.count} sample readings</small></span>
            </button>
          ))}
        </div>
        <div className="border-t border-teal-200/15 px-4 py-2">
          <p className="mb-2 text-[10px] leading-relaxed text-teal-100/60">
            {dataMode === 'live' && `Live data source: ${dataSource}.`}
            {dataMode === 'dataset' && <>{dataSource}: archived field observations, not live sensor readings. Class thresholds vary by marine setting; the 0–100 score is display-only. {dataSourceUrl && <a className="underline" href={dataSourceUrl} target="_blank" rel="noreferrer">Source metadata</a>}</>}
            {dataMode === 'demo' && 'Demo mode: API unavailable. Locations and scores are illustrative, not measured observations.'}
            {dataMode === 'loading' && 'Connecting to Reefwatch data…'}
          </p>
          <div className="flex justify-end">
            <button onClick={() => { setLoading(true); load(); }} className="rounded-full border border-teal-200/20 px-3 py-1 text-xs hover:border-teal-300">Refresh</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
