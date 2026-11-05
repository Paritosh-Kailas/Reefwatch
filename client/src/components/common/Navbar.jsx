import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Map' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-teal-900/40 bg-[#06222a]/95 px-6 py-3 backdrop-blur">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🪸</span>
        <span className="font-serif text-xl font-bold tracking-tight text-teal-200">Reefwatch</span>
      </Link>

      <div className="flex items-center gap-6">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-teal-300' : 'text-slate-400 hover:text-teal-200'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
        <Link
          to="/login"
          className="rounded-full border border-teal-600/50 px-4 py-1.5 text-sm text-teal-300 transition hover:bg-teal-700/20"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}
