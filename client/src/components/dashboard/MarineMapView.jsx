import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getPollutionMap } from '../../api/pollutionApi';

const REFRESH_MS = 60000;

// yellow -> orange -> red
function scoreColor(score) {
  const stops = [[242, 208, 107], [255, 154, 77], [255, 77, 94]];
  const t = Math.min(Math.max(score / 100, 0), 1) * 2;
  const i = Math.min(Math.floor(t), 1);
  const [a, b] = [stops[i], stops[i + 1]];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * (t - i))).join(',')})`;
}

const label = (h) =>
  `${Math.abs(h.lat).toFixed(0)}°${h.lat >= 0 ? 'N' : 'S'}, ${Math.abs(h.lng).toFixed(0)}°${h.lng >= 0 ? 'E' : 'W'}`;

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
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await getPollutionMap({ reefBelt });
      setHotspots(data.hotspots);
      setTotal(data.totalReadings);
      setError('');
    } catch {
      setError('Could not load pollution data. Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [reefBelt]);

  useEffect(() => {
    setLoading(true);
    load();
    const timer = setInterval(load, REFRESH_MS); // keeps the map live
    return () => clearInterval(timer);
  }, [load]);

  const shown = useMemo(() => hotspots.filter((h) => h.score >= minScore), [hotspots, minScore]);
  const avg = shown.length ? Math.round(shown.reduce((s, h) => s + h.score, 0) / shown.length) : 0;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-teal-900/40 bg-[#06222a] ${className}`}>
      <MapContainer center={[10, 90]} zoom={3} minZoom={2} worldCopyJump zoomControl={false} className="h-full w-full bg-[#06222a]">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FlyTo target={selected} />
        {shown.map((h) => {
          const color = scoreColor(h.score);
          const radius = 90000 + h.score * 2500;
          return (
            <Fragment key={h.id}>
              {/* overlapping halos: clusters of polluted cells glow brighter */}
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
                    <p className="text-xs text-slate-500">Pollution score {h.score}/100</p>
                    <div className="my-2 h-1.5 rounded bg-slate-200">
                      <div className="h-full rounded" style={{ width: `${h.score}%`, background: color }} />
                    </div>
                    <p className="text-xs">
                      {h.count} reading{h.count === 1 ? '' : 's'} in this area
                      {h.scans > 0 && ` · ${h.scans} from user scans`}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>

      <aside className="absolute left-3 top-3 z-[1000] flex max-h-[calc(100%-1.5rem)] w-72 flex-col overflow-hidden rounded-2xl border border-teal-200/15 bg-[#071f26]/90 text-slate-100 backdrop-blur">
        <div className="p-4">
          <h2 className="font-serif text-xl font-bold tracking-tight">Reef pollution map</h2>
          <p className="mt-1 text-xs text-teal-100/60">Brighter areas have more pollution. Select one for details.</p>
        </div>
        <div className="grid grid-cols-3 border-y border-teal-200/15 text-center">
          <div className="border-r border-teal-200/15 p-3">
            <b className="block font-serif text-xl">{shown.length}</b>
            <span className="text-[11px] text-teal-100/60">hotspots</span>
          </div>
          <div className="border-r border-teal-200/15 p-3">
            <b className="block font-serif text-xl">{avg}</b>
            <span className="text-[11px] text-teal-100/60">avg score</span>
          </div>
          <div className="p-3">
            <b className="block font-serif text-xl">{total.toLocaleString()}</b>
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
              <span>Minimum pollution score</span><span>{minScore}</span>
            </label>
            <input id="minScore" type="range" min="0" max="90" step="5" value={minScore} onChange={(e) => setMinScore(+e.target.value)} className="mt-2 w-full accent-teal-300" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {loading && <p className="p-3 text-sm text-teal-100/60">Loading hotspots…</p>}
          {error && <p className="p-3 text-sm text-red-300">{error}</p>}
          {!loading && !error && hotspots.length === 0 && (
            <p className="p-3 text-sm text-teal-100/60">No data yet. Import the dataset (see backend/uploads) or save a scan with coordinates.</p>
          )}
          {!loading && hotspots.length > 0 && shown.length === 0 && (
            <p className="p-3 text-sm text-teal-100/60">Nothing at this score. Lower the minimum to see more.</p>
          )}
          {shown.slice(0, 60).map((h) => (
            <button key={h.id} onClick={() => setSelected({ ...h })} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-teal-300/10 focus-visible:bg-teal-300/10 focus-visible:outline-none">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-[#1a0f08]" style={{ background: scoreColor(h.score) }}>{h.score}</span>
              <span className="text-sm">{label(h)}<small className="block text-xs text-teal-100/50">{h.count} readings</small></span>
            </button>
          ))}
        </div>
        <div className="flex justify-end border-t border-teal-200/15 px-4 py-2">
          <button onClick={load} className="rounded-full border border-teal-200/20 px-3 py-1 text-xs hover:border-teal-300">Refresh</button>
        </div>
      </aside>
    </div>
  );
}
