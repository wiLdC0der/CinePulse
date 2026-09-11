import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Create an account</h1>
      <p className="mt-1 text-sm text-paper-500">Save favorites and build a watchlist as you browse.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {error && (
          <p role="alert" className="rounded border border-signal-brick/40 bg-signal-brick/5 px-3 py-2 text-sm text-signal-brick">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm text-paper-300">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-paper-100 focus:border-marquee"
          />
        </div>

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
            minLength={8}
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-md border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-paper-100 focus:border-marquee"
          />
          <p className="mt-1 text-xs text-paper-500">At least 8 characters.</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded bg-marquee py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-marquee-light disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-paper-500">
        Already have an account?{' '}
        <Link to="/login" className="text-marquee hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
