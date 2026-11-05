import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDensityMap, getDensityStats } from '../api/densityApi';

const fmt = (n) => new Intl.NumberFormat().format(Number(n) || 0);
const pct = (n) => `${Number(n || 0).toFixed(1)}%`;
const columns = [['Reef system','name'],['Country / region','location'],['Latitude','lat'],['Longitude','lng'],['Coral coverage (%)','coralCoverage'],['Algae coverage (%)','algaeCoverage'],['Sand or rubble (%)','sandOrRubble'],['Density class','densityClass'],['Evidence status','evidenceStatus']];

function exportCsv(rows) {
  const cell = (value) => {
    const s = String(value ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [columns.map(([label]) => cell(label)).join(','), ...rows.map((r) => columns.map(([, key]) => cell(r[key])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a'); a.href = url; a.download = 'reefwatch-density-report.csv'; a.click(); URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [reefs, setReefs] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('loading');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [mapRes, statsRes] = await Promise.all([getDensityMap(), getDensityStats()]);
      if (!Array.isArray(mapRes.data?.data)) throw new Error('Unexpected density response');
      setReefs(mapRes.data.data.map((r) => ({ ...r, evidenceStatus: 'Illustrative sample' })));
      setStats(statsRes.data?.data || null);
      setStatus('ready');
    } catch (error) {
      console.error('[DensityReport] Load failed:', error);
      setStatus('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  const filtered = useMemo(() => reefs.filter((r) =>
    (filter === 'All' || r.densityClass === filter) &&
    `${r.name} ${r.location}`.toLowerCase().includes(query.toLowerCase())
  ), [reefs, query, filter]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 text-slate-100">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-teal-300">Reefwatch · Analysis</p>
          <h1 className="font-serif text-3xl font-bold">Global reef density report</h1>
          <p className="mt-2 text-sm text-slate-400">Explore reef coverage records, filter reef systems and export a report.</p></div>
        <div className="flex gap-2"><button onClick={load} className="rounded-lg border border-teal-800 px-4 py-2 text-sm text-teal-200">Refresh</button>
          <button disabled={!filtered.length} onClick={() => exportCsv(filtered)} className="rounded-lg bg-teal-300 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-40">Download CSV</button></div>
      </header>
      <aside className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
        <strong>Data quality notice:</strong> The current density API returns hard-coded illustrative reef examples, not verified survey measurements or a live monitoring feed. Treat this as a report interface prototype until a cited reef-survey dataset is connected.
      </aside>
      {status === 'loading' && <p className="py-12 text-center text-slate-400">Loading density report…</p>}
      {status === 'error' && <section className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5"><p className="font-semibold text-rose-200">Density data could not be loaded.</p><p className="mt-1 text-sm text-slate-400">Check that the backend is running and /api/density/map is reachable.</p><button onClick={load} className="mt-4 rounded-lg border border-rose-400/40 px-3 py-2 text-sm">Try again</button></section>}
      {status === 'ready' && <>
        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          { [['Reef systems',fmt(stats?.totalReefs ?? reefs.length)],['Average coral coverage',pct(stats?.avgCoralCoverage)],['Dense examples',fmt(stats?.denseReefs)],['Sparse examples',fmt(stats?.sparseReefs)]].map(([label,value]) =>
            <article key={label} className="rounded-xl border border-teal-900/50 bg-[#0a2b33] p-4"><p className="text-xs uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-teal-100">{value}</p></article>)}
        </section>
        <section className="overflow-hidden rounded-xl border border-teal-900/50 bg-[#08252d]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-900/50 p-4"><div><h2 className="font-semibold text-teal-100">Reef coverage records</h2><p className="mt-1 text-xs text-slate-400">{filtered.length} of {reefs.length} records shown</p></div>
            <div className="flex flex-wrap gap-2"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reef or country" className="w-52 rounded-lg border border-teal-900 bg-[#061c23] px-3 py-2 text-sm outline-none focus:border-teal-400" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-teal-900 bg-[#061c23] px-3 py-2 text-sm"><option>All</option><option>Dense</option><option>Moderate</option><option>Sparse</option></select></div></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-[#0d333c] text-xs uppercase tracking-wide text-slate-400"><tr>{['Reef system','Country / region','Coral','Algae','Sand / rubble','Density','Data status'].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-teal-900/40">{filtered.map((r) => <tr key={r.id} className="hover:bg-teal-900/20"><td className="px-4 py-3 font-medium">{r.name}<span className="block text-xs text-slate-500">{Number(r.lat).toFixed(2)}, {Number(r.lng).toFixed(2)}</span></td><td className="px-4 py-3 text-slate-300">{r.location}</td><td className="px-4 py-3">{pct(r.coralCoverage)}</td><td className="px-4 py-3">{pct(r.algaeCoverage)}</td><td className="px-4 py-3">{pct(r.sandOrRubble)}</td><td className="px-4 py-3">{r.densityClass}</td><td className="px-4 py-3 text-xs text-amber-200">Illustrative sample</td></tr>)}
              {!filtered.length && <tr><td colSpan="7" className="px-4 py-10 text-center text-slate-400">No records match these filters.</td></tr>}</tbody></table></div>
        </section>
        <p className="mt-3 text-xs text-slate-500">Percentages and classes are reproduced from the current API response and are not independently validated. CSV export contains the filtered rows.</p>
      </>}
    </main>
  );
}
