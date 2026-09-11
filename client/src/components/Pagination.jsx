import { ChevronLeft, ChevronRight } from 'lucide-react';

// TMDB caps at 500 pages regardless of totalPages returned; clamp so
// "Next" never requests a page the API will reject.
const TMDB_MAX_PAGE = 500;

export default function Pagination({ page, totalPages, onPageChange }) {
  const cappedTotal = Math.min(totalPages || 1, TMDB_MAX_PAGE);
  if (cappedTotal <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < cappedTotal;

  return (
    <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Pagination">
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-1 rounded border border-ink-700 px-3 py-1.5 text-sm text-paper-300 transition-colors hover:border-marquee hover:text-marquee disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink-700 disabled:hover:text-paper-300"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      <span className="text-sm text-paper-500">
        Page <span className="text-paper-100">{page}</span> of {cappedTotal}
      </span>
      <button
        type="button"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-1 rounded border border-ink-700 px-3 py-1.5 text-sm text-paper-300 transition-colors hover:border-marquee hover:text-marquee disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink-700 disabled:hover:text-paper-300"
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}
