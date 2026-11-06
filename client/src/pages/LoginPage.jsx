import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

/**
 * LoginPage
 * Full-page wrapper for the sign-in experience.
 * Layout: ocean-dark background, centred card with logo + LoginForm.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#061a22] px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo / branding */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-1">
            <span className="text-5xl">🪸</span>
            <span className="font-serif text-2xl font-bold tracking-tight text-teal-200">
              Reefwatch
            </span>
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to monitor coral reefs worldwide
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-teal-900/40 bg-[#071f26] p-8 shadow-2xl shadow-teal-950/50">
          <h1 className="mb-6 font-serif text-xl font-bold text-teal-100">
            Welcome back
          </h1>
          <LoginForm />
        </div>

        {/* Back link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-teal-400">← Back to home</Link>
        </p>

      </div>
    </div>
  );
}
