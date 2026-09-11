export default function GenreFilter({ genres, selectedGenreId, onSelect }) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by genre">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
          !selectedGenreId
            ? 'border-marquee bg-marquee/10 text-marquee'
            : 'border-ink-700 text-paper-300 hover:border-paper-500'
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          onClick={() => onSelect(genre.id)}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            selectedGenreId === genre.id
              ? 'border-marquee bg-marquee/10 text-marquee'
              : 'border-ink-700 text-paper-300 hover:border-paper-500'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
