import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

function getErrorMessage(error) {
  return error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Unable to create your account. Please try again.';
}

export default function RegisterForm() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', organization: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Your password must contain at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organization.trim(),
        password: form.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-teal-100">Full name</label>
        <input id="register-name" name="name" autoComplete="name" required maxLength={60} value={form.name} onChange={update} placeholder="Your name" className="auth-input" />
      </div>
      <div>
        <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-teal-100">Email address</label>
        <input id="register-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update} placeholder="you@example.com" className="auth-input" />
      </div>
      <div>
        <label htmlFor="register-organization" className="mb-2 block text-sm font-medium text-teal-100">Organization <span className="font-normal text-slate-500">(optional)</span></label>
        <input id="register-organization" name="organization" autoComplete="organization" maxLength={100} value={form.organization} onChange={update} placeholder="University, lab or organization" className="auth-input" />
      </div>
      <div>
        <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-teal-100">Password</label>
        <div className="relative">
          <input id="register-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required value={form.password} onChange={update} placeholder="At least 8 characters" className="auth-input pr-20" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 text-xs text-slate-400 hover:text-teal-200">{showPassword ? 'Hide' : 'Show'}</button>
        </div>
      </div>
      <div>
        <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-medium text-teal-100">Confirm password</label>
        <input id="register-confirm-password" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={form.confirmPassword} onChange={update} placeholder="Enter your password again" className="auth-input" />
      </div>
      {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
      <p className="text-xs leading-relaxed text-slate-500">By creating an account, you agree to use Reefwatch responsibly. New accounts are assigned the standard researcher role.</p>
      <button type="submit" disabled={loading || !form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword} className="w-full rounded-xl bg-teal-500 px-4 py-3 font-semibold text-[#042128] transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Creating account…' : 'Create account'}</button>
      <p className="text-center text-sm text-slate-400">Already registered? <Link to="/login" className="font-medium text-teal-300 hover:underline">Sign in</Link></p>

import { useAuth } from '../../hooks/useAuth';

const ROLES = ['researcher', 'diver', 'guest'];

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [fields,     setFields]     = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'researcher', organization: '' });
  const [errors,     setErrors]     = useState({});
  const [serverErr,  setServerErr]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPass,   setShowPass]   = useState(false);

  function validate() {
    const e = {};
    if (!fields.name.trim())                                      e.name            = 'Full name is required.';
    if (!fields.email.trim())                                     e.email           = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))   e.email           = 'Enter a valid email.';
    if (!fields.password)                                         e.password        = 'Password is required.';
    else if (fields.password.length < 8)                          e.password        = 'Password must be at least 8 characters.';
    if (fields.confirmPassword !== fields.password)               e.confirmPassword = 'Passwords do not match.';
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
      await register({ name: fields.name, email: fields.email, password: fields.password, role: fields.role, organization: fields.organization });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerErr(err.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = (field) =>
    `w-full rounded-xl border bg-[#061a22] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:ring-2 focus:ring-teal-500 ${
      errors[field] ? 'border-red-500/60' : 'border-teal-900/50 hover:border-teal-700/60'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverErr && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverErr}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">Full name</label>
        <input id="name" name="name" type="text" autoComplete="name" value={fields.name} onChange={handleChange} placeholder="Jane Doe" className={inputClass('name')} />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" value={fields.email} onChange={handleChange} placeholder="you@example.com" className={inputClass('email')} />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-slate-300">Role</label>
        <select id="role" name="role" value={fields.role} onChange={handleChange}
          className="w-full rounded-xl border border-teal-900/50 bg-[#061a22] px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:ring-2 focus:ring-teal-500 hover:border-teal-700/60">
          {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>

      {/* Organization (optional) */}
      <div>
        <label htmlFor="organization" className="mb-1.5 block text-sm font-medium text-slate-300">
          Organization <span className="text-slate-500">(optional)</span>
        </label>
        <input id="organization" name="organization" type="text" value={fields.organization} onChange={handleChange} placeholder="Marine Research Institute" className={inputClass('organization')} />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
        <div className="relative">
          <input id="password" name="password" type={showPass ? 'text' : 'password'} autoComplete="new-password" value={fields.password} onChange={handleChange} placeholder="Min. 8 characters" className={`${inputClass('password')} pr-11`} />
          <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" aria-label="Toggle password">
            {showPass ? '🙈' : '👁️'}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-300">Confirm password</label>
        <input id="confirmPassword" name="confirmPassword" type={showPass ? 'text' : 'password'} autoComplete="new-password" value={fields.confirmPassword} onChange={handleChange} placeholder="Repeat password" className={inputClass('confirmPassword')} />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
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
            Creating account…
          </span>
        ) : 'Create account'}
      </button>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-teal-400 hover:underline">Sign in</Link>
      </p>

    </form>
  );
}
