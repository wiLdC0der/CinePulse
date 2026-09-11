import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, Heart, Bookmark, ArrowLeft, User, Film } from 'lucide-react';
import { fetchMovieDetails } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
import { DetailsSkeleton } from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, isWatchlisted, toggleFavorite, toggleWatchlist } = useAuth();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingFav, setIsUpdatingFav] = useState(false);
  const [isUpdatingWatch, setIsUpdatingWatch] = useState(false);

  const loadMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovieDetails(id);
      if (data.success && data.movie) {
        setMovie(data.movie);
      } else {
        setError('Movie details not found');
      }
    } catch (err) {
      console.error('Failed to load movie details:', err);
      setError('Unable to fetch movie details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovie();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DetailsSkeleton />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorMessage message={error || 'Movie not found'} onRetry={loadMovie} />
      </div>
    );
  }

  const favorite = isFavorite(String(movie.id));
  const watchlisted = isWatchlisted(String(movie.id));

  // Format runtime (e.g. 142 -> 2h 22m)
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const handleFavToggle = async () => {
    if (isUpdatingFav) return;
    setIsUpdatingFav(true);
    const res = await toggleFavorite(movie);
    setIsUpdatingFav(false);
    if (res && res.requireAuth) {
      navigate('/login', { state: { message: res.message } });
    }
  };

  const handleWatchlistToggle = async () => {
    if (isUpdatingWatch) return;
    setIsUpdatingWatch(true);
    const res = await toggleWatchlist(movie);
    setIsUpdatingWatch(false);
    if (res && res.requireAuth) {
      navigate('/login', { state: { message: res.message } });
    }
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Hero Backdrop Header */}
      <div className="relative w-full h-[380px] sm:h-[480px] bg-slate-950 overflow-hidden border-b border-slate-800">
        {movie.backdropPath ? (
          <img
            src={movie.backdropPath}
            alt={movie.title}
            className="w-full h-full object-cover object-top brightness-50"
          />
        ) : (
          <div className="w-full h-full bg-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 sm:-mt-52 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Poster Card */}
          <div className="w-48 sm:w-64 shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900">
              {movie.posterPath ? (
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-600">
                  <Film className="w-12 h-12 mb-2" />
                  <span className="text-xs">{movie.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-6">
            
            {/* Title & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-sm italic text-slate-400 mt-1">&quot;{movie.tagline}&quot;</p>
              )}
            </div>

            {/* Badges Info Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
              {movie.voteAverage > 0 && (
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  <span>{movie.voteAverage.toFixed(1)}</span>
                  <span className="text-slate-500 font-normal">({movie.voteCount} votes)</span>
                </div>
              )}

              {movie.releaseDate && (
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{movie.releaseDate}</span>
                </div>
              )}

              {movie.runtime > 0 && (
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            {/* Genres Pills */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <Link
                    key={g.id}
                    to={`/discover?genre=${g.id}`}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 rounded-lg transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleFavToggle}
                disabled={isUpdatingFav}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border shadow-lg ${
                  favorite
                    ? 'bg-red-600 border-red-500 text-white shadow-red-950/40'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
                <span>{favorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
              </button>

              <button
                onClick={handleWatchlistToggle}
                disabled={isUpdatingWatch}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all border shadow-lg ${
                  watchlisted
                    ? 'bg-amber-600 border-amber-500 text-white shadow-amber-950/40'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${watchlisted ? 'fill-current' : ''}`} />
                <span>{watchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            {/* Overview */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <h3 className="text-base font-bold text-slate-100">Overview</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{movie.overview}</p>
            </div>

            {/* Director Credit */}
            {movie.director && movie.director !== 'Unknown' && (
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Director: </span>
                <span>{movie.director}</span>
              </div>
            )}

          </div>

        </div>

        {/* Top Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-xl font-bold text-slate-100">Featured Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {movie.cast.map((actor) => (
                <div
                  key={actor.id}
                  className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3"
                >
                  {actor.profilePath ? (
                    <img
                      src={actor.profilePath}
                      alt={actor.name}
                      className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-700"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-100 truncate">{actor.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{actor.character}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations Section */}
        {movie.recommendations && movie.recommendations.length > 0 && (
          <section className="mt-12 space-y-5">
            <h2 className="text-xl font-bold text-slate-100 border-b border-slate-800/80 pb-3">
              You Might Also Like
            </h2>
            <MovieGrid movies={movie.recommendations} />
          </section>
        )}

      </div>
    </div>
  );
};

export default MovieDetails;
