import { Link } from 'react-router-dom';
import { useSavedMovies } from '../context/SavedMoviesContext';
import MovieGrid from '../components/MovieGrid';

export default function Watchlist() {
  const { watchlist, loaded } = useSavedMovies();

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Your watchlist</h1>
      <p className="mt-1 text-sm text-paper-500">Movies you're planning to watch.</p>

      <div className="mt-6">
        <MovieGrid
          movies={watchlist}
          loading={!loaded}
          emptyTitle="Your watchlist is empty"
          emptyMessage="Browse movies and tap the bookmark icon to save them here."
          skeletonCount={5}
        />
        {loaded && watchlist.length === 0 && (
          <div className="mt-4 text-center">
            <Link to="/discover" className="text-sm text-marquee hover:underline">
              Discover movies to add
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
