import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Log in</h1>
      <p className="mt-1 text-sm text-paper-500">Welcome back. Access your favorites and watchlist.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <p role="alert" className="rounded border border-signal-brick/40 bg-signal-brick/5 px-3 py-2 text-sm text-signal-brick">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-paper-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-paper-100 focus:border-marquee"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-paper-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-md border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-paper-100 focus:border-marquee"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded bg-marquee py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-marquee-light disabled:opacity-60"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-paper-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-marquee hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
