import { Link } from 'react-router-dom';
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#061a22] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-teal-900/40 bg-[#071f26] p-8">
        <h1 className="mb-6 font-serif text-2xl font-bold text-teal-200">Create an account</h1>
        <p className="text-sm text-slate-400">Registration form coming soon.</p>
        <Link to="/" className="mt-6 inline-block text-sm text-teal-400 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
}
