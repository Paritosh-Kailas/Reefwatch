import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const redirectTo = location.state?.from?.pathname ?? '/dashboard';

  const [fields,     setFields]     = useState({ email: '', password: '' });
  const [errors,     setErrors]     = useState({});
  const [serverErr,  setServerErr]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass,   setShowPass]   = useState(false);

  function validate() {
    const e = {};
    if (!fields.email.trim())                                    e.email    = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))  e.email    = 'Enter a valid email.';
    if (!fields.password)                                        e.password = 'Password is required.';
    else if (fields.password.length < 8)                         e.password = 'Password must be at least 8 characters.';
    return e;
  }

  function handleChange(e) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerErr('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const clientErrors = validate();
    if (Object.keys(clientErrors).length) { setErrors(clientErrors); return; }
    setSubmitting(true);
    try {
      await login(fields.email, fields.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerErr(err.response?.data?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = (f) =>
    `w-full rounded-xl border bg-[#061a22] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:ring-2 focus:ring-teal-500 ${
      errors[f] ? 'border-red-500/60' : 'border-teal-900/50 hover:border-teal-700/60'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverErr && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverErr}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email"
          value={fields.email} onChange={handleChange} placeholder="you@example.com" className={inputCls('email')} />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
          <button type="button" className="text-xs text-teal-400 hover:underline">Forgot password?</button>
        </div>
        <div className="relative">
          <input id="password" name="password" type={showPass ? 'text' : 'password'}
            autoComplete="current-password" value={fields.password} onChange={handleChange}
            placeholder="••••••••" className={`${inputCls('password')} pr-11`} />
          <button type="button" onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            aria-label={showPass ? 'Hide password' : 'Show password'}>
            {showPass ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={submitting}
        className="w-full rounded-xl bg-teal-500 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50">
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Signing in…
          </span>
        ) : 'Sign in'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-teal-900/40" /></div>
        <div className="relative flex justify-center text-xs text-slate-500"><span className="bg-[#071f26] px-3">or</span></div>
      </div>

      <p className="text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-teal-400 hover:underline">Create one</Link>
      </p>
    </form>
  );
}
