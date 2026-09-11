import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, Bookmark, ArrowLeft } from 'lucide-react';
import { getMovieById } from '../services/movieService';
import { useAuth } from '../context/AuthContext';
import { useSavedMovies } from '../context/SavedMoviesContext';
import ErrorState from '../components/ErrorState';
import { releaseYear, formatRating, formatRuntime } from '../utils/format';

function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-content animate-pulse px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="aspect-[2/3] w-48 flex-shrink-0 rounded-md bg-ink-800" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-2/3 rounded bg-ink-800" />
          <div className="h-4 w-1/3 rounded bg-ink-800" />
          <div className="h-4 w-full rounded bg-ink-800" />
          <div className="h-4 w-5/6 rounded bg-ink-800" />
        </div>
      </div>
    </div>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useSavedMovies();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionPending, setActionPending] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    getMovieById(id)
      .then(setMovie)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) return <DetailsSkeleton />;
  if (error) {
    return (
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }
  if (!movie) return null;

  const favorited = isFavorite(movie.id);
  const watchlisted = isInWatchlist(movie.id);
  const runtime = formatRuntime(movie.runtime);

  const handleToggle = async (action) => {
    setActionPending(true);
    try {
      await action(movie.id);
    } finally {
      setActionPending(false);
    }
  };

  return (
    <div>
      {movie.backdropUrl && (
        <div className="relative h-56 w-full overflow-hidden sm:h-72">
          <img src={movie.backdropUrl} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>
      )}

      <div className={`mx-auto max-w-content px-4 sm:px-6 ${movie.backdropUrl ? '-mt-24 sm:-mt-32' : 'py-8'}`}>
        <Link to="/discover" className="mb-4 inline-flex items-center gap-1 text-sm text-paper-500 hover:text-paper-100">
          <ArrowLeft size={15} /> Back to discover
        </Link>

        <div className="flex flex-col gap-6 pb-10 md:flex-row">
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="w-40 flex-shrink-0 self-start rounded-md shadow-lg shadow-black/50 sm:w-52"
          />

          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold text-paper-100 sm:text-3xl">{movie.title}</h1>
            {movie.tagline && <p className="mt-1 text-sm italic text-paper-500">{movie.tagline}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-paper-300">
              <span>{releaseYear(movie.releaseDate)}</span>
              {runtime && <span>{runtime}</span>}
              <span className="text-marquee">★ {formatRating(movie.voteAverage)}</span>
            </div>

            {movie.genres?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span key={g.id} className="rounded-full border border-ink-700 px-2.5 py-0.5 text-xs text-paper-300">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-paper-300">
              {movie.overview || 'No overview available.'}
            </p>

            {movie.director && (
              <p className="mt-4 text-sm text-paper-500">
                Director: <span className="text-paper-100">{movie.director}</span>
              </p>
            )}

            <div className="mt-6 flex gap-3">
              {isAuthenticated ? (
                <>
                  <button
                    type="button"
                    disabled={actionPending}
                    onClick={() => handleToggle(toggleFavorite)}
                    className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                      favorited ? 'bg-signal-brick text-paper-100' : 'border border-ink-700 text-paper-100 hover:border-signal-brick hover:text-signal-brick'
                    }`}
                  >
                    <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
                    {favorited ? 'In favorites' : 'Add to favorites'}
                  </button>
                  <button
                    type="button"
                    disabled={actionPending}
                    onClick={() => handleToggle(toggleWatchlist)}
                    className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                      watchlisted ? 'bg-marquee text-ink-950' : 'border border-ink-700 text-paper-100 hover:border-marquee hover:text-marquee'
                    }`}
                  >
                    <Bookmark size={16} fill={watchlisted ? 'currentColor' : 'none'} />
                    {watchlisted ? 'On watchlist' : 'Add to watchlist'}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  state={{ from: { pathname: `/movies/${movie.id}` } }}
                  className="rounded border border-ink-700 px-4 py-2 text-sm text-paper-100 transition-colors hover:border-marquee hover:text-marquee"
                >
                  Log in to save this movie
                </Link>
              )}
            </div>
          </div>
        </div>

        {movie.cast?.length > 0 && (
          <section className="border-t border-ink-700 py-10">
            <h2 className="mb-4 font-display text-lg font-semibold text-paper-100">Cast</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {movie.cast.map((actor) => (
                <div key={actor.id}>
                  <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-ink-800">
                    {actor.profileUrl && (
                      <img src={actor.profileUrl} alt={actor.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-paper-100">{actor.name}</p>
                  <p className="text-xs text-paper-500">{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
