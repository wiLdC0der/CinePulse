import { Link } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import { releaseYear, formatRating } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { useSavedMovies } from '../context/SavedMoviesContext';

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><rect width="300" height="450" fill="#1E1C27"/><text x="150" y="230" font-family="sans-serif" font-size="16" fill="#9C99A8" text-anchor="middle">No poster</text></svg>`
  );

// Movie id/title/poster etc. can come either from a normalized TMDB
// movie or a saved-movie subdocument from Mongo -- both shapes use
// the same field names, so this component accepts either.
export default function MovieCard({ movie }) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useSavedMovies();

  const id = movie.id ?? movie.movieId;
  const poster = movie.posterUrl;
  const title = movie.title;
  const date = movie.releaseDate;
  const rating = movie.voteAverage;

  const favorited = isFavorite(id);
  const watchlisted = isInWatchlist(id);

  const handleAction = async (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    try {
      await action(id);
    } catch {
      // The toggle failed server-side (e.g. network hiccup); state
      // simply doesn't change, so the button reflects reality.
    }
  };

  return (
    <Link
      to={`/movies/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-md bg-ink-800 ring-1 ring-ink-700 transition-colors hover:ring-marquee/60"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-ink-700">
        <img
          src={poster || FALLBACK_POSTER}
          alt={`${title} poster`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_POSTER;
          }}
        />

        {isAuthenticated && (
          <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={(e) => handleAction(e, toggleFavorite)}
              aria-pressed={favorited}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className={`rounded-full p-1.5 backdrop-blur-sm transition-colors ${
                favorited ? 'bg-signal-brick text-paper-100' : 'bg-ink-950/70 text-paper-100 hover:bg-ink-950'
              }`}
            >
              <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              onClick={(e) => handleAction(e, toggleWatchlist)}
              aria-pressed={watchlisted}
              aria-label={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
              className={`rounded-full p-1.5 backdrop-blur-sm transition-colors ${
                watchlisted ? 'bg-marquee text-ink-950' : 'bg-ink-950/70 text-paper-100 hover:bg-ink-950'
              }`}
            >
              <Bookmark size={16} fill={watchlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}

        {rating > 0 && (
          <div className="absolute bottom-2 left-2 rounded bg-ink-950/80 px-1.5 py-0.5 text-xs font-medium text-marquee">
            {formatRating(rating)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 p-2.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-paper-100">{title}</h3>
        <p className="text-xs text-paper-500">{releaseYear(date)}</p>
      </div>
    </Link>
  );
}
