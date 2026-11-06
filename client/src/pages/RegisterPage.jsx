import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#061a22] px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-teal-900/50 bg-[#071f26] p-7 shadow-2xl shadow-black/20 sm:p-9">
        <div className="mb-7 text-center">
          <span className="text-4xl" aria-hidden="true">🪸</span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">Join the community</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-teal-100">Create your account</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">Create a Reefwatch account to access your research workspace.</p>
        </div>
        <RegisterForm />
        <p className="mt-7 text-center text-xs text-slate-600"><Link to="/" className="hover:text-teal-300">← Back to home</Link></p>
      </section>
    </main>
  );
}
