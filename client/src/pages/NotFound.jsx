import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-display text-5xl text-marquee">404</p>
      <h1 className="mt-3 font-display text-xl font-semibold text-paper-100">Page not found</h1>
      <p className="mt-1 text-sm text-paper-500">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 rounded bg-marquee px-4 py-2 text-sm font-medium text-ink-950 hover:bg-marquee-light"
      >
        Back to home
      </Link>
    </div>
  );
}
