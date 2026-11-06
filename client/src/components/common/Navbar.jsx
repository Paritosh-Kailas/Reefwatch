import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Global pollution map' },
  { to: '/reports/density', label: 'Density report' },
];

export default function Navbar() {
  const { user, signOut, loading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-teal-900/40 bg-[#06222a]/95 px-6 py-3 backdrop-blur">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">🪸</span>
        <span className="font-serif text-xl font-bold tracking-tight text-teal-200">Reefwatch</span>
      </Link>
      <div className="flex flex-wrap items-center gap-5">
        {links.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-teal-300' : 'text-slate-400 hover:text-teal-200'}`}>{link.label}</NavLink>)}
        {!loading && (user ? (
          <div className="flex items-center gap-3">
            <span className="hidden max-w-36 truncate text-sm text-slate-300 sm:inline" title={user.name}>{user.name}</span>
            <button type="button" onClick={signOut} className="rounded-full border border-teal-600/50 px-4 py-1.5 text-sm text-teal-300 transition hover:bg-teal-700/20">Sign out</button>
          </div>
        ) : (
          <Link to="/login" className="rounded-full border border-teal-600/50 px-4 py-1.5 text-sm text-teal-300 transition hover:bg-teal-700/20">Sign in</Link>
        ))}
      </div>
    </nav>
  );
}
