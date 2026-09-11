import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

// Shared grid used by Home, Discover, Favorites, and Watchlist so
// loading/empty/error handling for a list of movies is written once.
export default function MovieGrid({
  movies,
  loading,
  error,
  onRetry,
  emptyTitle = 'No movies found',
  emptyMessage = 'Try a different search or check back later.',
  skeletonCount = 10,
}) {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id ?? movie.movieId} movie={movie} />
      ))}
    </div>
  );
}
