import { Link } from 'react-router-dom';

const stats = [
  { label: 'Reef systems tracked',  value: '25+' },
  { label: 'Pollution hotspots',    value: '163K' },
  { label: 'Species catalogued',    value: '800+' },
  { label: 'Scans processed',       value: '12K' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#061a22] text-slate-100">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-teal-900/30 via-transparent to-[#061a22]" />
        <span className="mb-4 text-6xl">🪸</span>
        <h1 className="font-serif text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Monitor the Ocean's<br />
          <span className="text-teal-300">Coral Reefs</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          Reefwatch uses AI-powered image analysis to track coral bleaching, marine pollution,
          species density and debris across the world's most critical reef ecosystems — in real time.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/dashboard"
            className="rounded-full bg-teal-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-400"
          >
            View Global Map →
          </Link>
          <Link
            to="/register"
            className="rounded-full border border-teal-600/50 px-8 py-3 font-semibold text-teal-300 transition hover:bg-teal-800/30"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-teal-900/40 bg-[#071f26]/80 py-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-3xl font-bold text-teal-300">{s.value}</p>
              <p className="mt-1 text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold">What Reefwatch Does</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '🗺️', title: 'Global Pollution Map', desc: 'Real-time heatmap of pollution scores across 25+ major reef systems worldwide.' },
            { icon: '🤖', title: 'AI Coral Analysis',    desc: 'Upload a dive photo and get instant bleaching severity, health scores, and coral type identification.' },
            { icon: '🐠', title: 'Species Catalog',      desc: 'Browse 800+ documented reef species with conservation status and sighting records.' },
            { icon: '🧪', title: 'Debris Detection',     desc: 'Identify plastic, fishing nets, microplastics and other debris from underwater images.' },
            { icon: '📊', title: 'Density Reports',      desc: 'Track coral and algae coverage percentages over time with exportable charts.' },
            { icon: '📋', title: 'Research Reports',     desc: 'Generate PDF reports for research submissions, NGOs, and conservation agencies.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-teal-900/40 bg-[#071f26]/60 p-6 transition hover:border-teal-600/40">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 font-serif text-lg font-semibold text-teal-100">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-teal-900/40 bg-teal-900/20 py-16 text-center">
        <h2 className="font-serif text-3xl font-bold">Ready to explore?</h2>
        <p className="mt-3 text-slate-400">Open the global pollution map and start monitoring reefs.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-full bg-teal-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-400"
        >
          Open Map →
        </Link>
      </section>

      <footer className="py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Reefwatch — built for ocean conservation research
      </footer>
    </div>
  );
}
