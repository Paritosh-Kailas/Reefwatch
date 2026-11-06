import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ResetPasswordForm from './ResetPasswordForm';

function getErrorMessage(error) {
  return error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Unable to sign in. Please try again.';
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetInfo, setShowResetInfo] = useState(false);

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn({ email: form.email.trim(), password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  if (showResetInfo) {
    return <ResetPasswordForm onBack={() => setShowResetInfo(false)} />;
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-teal-100">Email address</label>
        <input id="login-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update} placeholder="you@example.com" className="w-full rounded-xl border border-teal-900/60 bg-[#061a22] px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20" />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="login-password" className="text-sm font-medium text-teal-100">Password</label>
          <button type="button" onClick={() => setShowResetInfo(true)} className="text-xs text-teal-300 hover:text-teal-100 hover:underline">Forgot password?</button>
        </div>
        <div className="relative">
          <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={form.password} onChange={update} placeholder="Enter your password" className="w-full rounded-xl border border-teal-900/60 bg-[#061a22] px-4 py-3 pr-20 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 text-xs text-slate-400 hover:text-teal-200" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
        </div>
      </div>
      {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
      <button type="submit" disabled={loading || !form.email.trim() || !form.password} className="w-full rounded-xl bg-teal-500 px-4 py-3 font-semibold text-[#042128] transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Signing in…' : 'Sign in'}</button>
      <p className="text-center text-sm text-slate-400">New to Reefwatch? <Link to="/register" className="font-medium text-teal-300 hover:underline">Create an account</Link></p>
    </form>
  );
}
