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
    </form>
  );
}
