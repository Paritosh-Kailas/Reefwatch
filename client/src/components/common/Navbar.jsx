import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { to: '/',          label: 'Home' },
  { to: '/dashboard', label: 'Map'  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-teal-900/40 bg-[#06222a]/95 px-6 py-3 backdrop-blur">

      {/* Brand */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🪸</span>
        <span className="font-serif text-xl font-bold tracking-tight text-teal-200">
          Reefwatch
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        {navLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-teal-300' : 'text-slate-400 hover:text-teal-200'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}

        {/* Auth area — changes based on login state */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* User avatar initial */}
            <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-700/40 text-sm font-bold text-teal-200">
              {user.name?.[0]?.toUpperCase() ?? '?'}
            </span>
            <span className="hidden text-sm text-slate-300 sm:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-teal-700/40 px-3 py-1 text-xs text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-full border border-teal-600/50 px-4 py-1.5 text-sm text-teal-300 transition hover:bg-teal-700/20"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
