import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#061a22] text-center">
      <span className="text-6xl">🌊</span>
      <h1 className="mt-4 font-serif text-4xl font-bold text-teal-200">404 — Page Not Found</h1>
      <p className="mt-2 text-slate-400">This page drifted away.</p>
      <Link to="/" className="mt-6 rounded-full bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-500">
        Go Home
      </Link>
    </div>
  );
}
