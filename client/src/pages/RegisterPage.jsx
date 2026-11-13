import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#061a22] px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Branding */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-1">
            <span className="text-5xl">🪸</span>
            <span className="font-serif text-2xl font-bold tracking-tight text-teal-200">Reefwatch</span>
          </Link>
          <p className="mt-2 text-sm text-slate-400">Join the reef monitoring community</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-teal-900/40 bg-[#071f26] p-8 shadow-2xl shadow-teal-950/50">
          <h1 className="mb-6 font-serif text-xl font-bold text-teal-100">Create your account</h1>
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-teal-400">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
