import { Link } from 'react-router-dom';

const stats = [
  { label: 'Map coverage', value: 'Global' },
  { label: 'Observation source', value: 'NOAA NCEI' },
  { label: 'Data type', value: 'Archived samples' },
  { label: 'Map access', value: 'Public' },
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
          Explore geolocated marine microplastics observations from the NOAA NCEI dataset on a global map. Inspect source records, sample dates, measurement units and concentration classes.
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
            { icon: '🗺️', title: 'Global Pollution Map', desc: 'Open the interactive global map of archived NOAA NCEI microplastics observations, inspect sample markers and source measurements.', to: '/dashboard', action: 'Explore map →' },
            { icon: '🤖', title: 'AI Coral Analysis', desc: 'Planned module. Image-based coral health analysis is not yet connected to a verified production model.' },
            { icon: '🐠', title: 'Species Catalog', desc: 'Planned module. Species records need a verified catalog source before public release.' },
            { icon: '🧪', title: 'Debris Detection', desc: 'Planned module. Image detection requires a configured and evaluated model.' },
            { icon: '📊', title: 'Density Reports', desc: 'Open the reef-density report to review summary statistics, search reef records, filter density classes and export the visible rows as CSV. Current values are illustrative.', to: '/reports/density', action: 'View density report →' },
            { icon: '📋', title: 'Research Reports', desc: 'Planned module. Report generation is not yet part of the verified map workflow.' },
          ].map((feature) => {
            const cardClass = "group block rounded-2xl border border-teal-900/40 bg-[#071f26]/60 p-6 transition hover:-translate-y-1 hover:border-teal-500/70 hover:bg-[#0a2b33]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400";
            const content = (
              <>
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="mt-3 font-serif text-lg font-semibold text-teal-100">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.desc}</p>
                {feature.to && <span className="mt-4 inline-flex text-sm font-semibold text-teal-300 transition group-hover:gap-2">{feature.action}</span>}
              </>
            );
            return feature.to ? (
              <Link key={feature.title} to={feature.to} className={cardClass} aria-label={`${feature.title}: open feature`}>
                {content}
              </Link>
            ) : (
              <div key={feature.title} className={cardClass}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-teal-900/40 bg-teal-900/20 py-16 text-center">
        <h2 className="font-serif text-3xl font-bold">Ready to explore?</h2>
        <p className="mt-3 text-slate-400">Open the global microplastics map and explore archived observations.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-full bg-teal-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-400"
        >
          Open Map →
        </Link>
      </section>

      <footer className="py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Reefwatch — marine microplastics observations explorer
      </footer>
    </div>
  );
}
