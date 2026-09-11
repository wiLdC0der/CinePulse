import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search for a movie…' }) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-500" size={18} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
        className="w-full rounded-md border border-ink-700 bg-ink-800 py-2.5 pl-10 pr-10 text-sm text-paper-100 placeholder:text-paper-500 focus:border-marquee"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-500 hover:text-paper-100"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
