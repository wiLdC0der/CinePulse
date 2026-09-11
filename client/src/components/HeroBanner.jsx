import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Info, Star, Heart, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HeroBanner = ({ movie, onAuthRequired }) => {
  const { isFavorite, isWatchlisted, toggleFavorite, toggleWatchlist } = useAuth();
  const navigate = useNavigate();

  if (!movie) return null;

  const movieId = String(movie.id || movie.movieId);
  const favorite = isFavorite(movieId);
  const watchlisted = isWatchlisted(movieId);

  const backdropSrc = movie.backdropPath || (movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null);
  const rating = movie.voteAverage ?? movie.vote_average ?? 0;
  const releaseYear = movie.releaseYear || (movie.releaseDate ? movie.releaseDate.split('-')[0] : (movie.release_date ? movie.release_date.split('-')[0] : ''));

  const handleFav = async () => {
    const res = await toggleFavorite(movie);
    if (res && res.requireAuth) {
      if (onAuthRequired) onAuthRequired(res.message);
      else navigate('/login');
    }
  };

  const handleWatch = async () => {
    const res = await toggleWatchlist(movie);
    if (res && res.requireAuth) {
      if (onAuthRequired) onAuthRequired(res.message);
      else navigate('/login');
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 my-6 shadow-2xl">
      {/* Backdrop Image */}
      {backdropSrc ? (
        <img
          src={backdropSrc}
          alt={movie.title}
          className="w-full h-[340px] sm:h-[420px] object-cover object-center brightness-75"
        />
      ) : (
        <div className="w-full h-[340px] sm:h-[420px] bg-gradient-to-r from-slate-950 to-slate-900" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex flex-col justify-end p-6 sm:p-10">
        <div className="max-w-2xl space-y-3">
          
          {/* Metadata badges */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
            {rating > 0 && (
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {typeof rating === 'number' ? rating.toFixed(1) : rating}
              </span>
            )}
            {releaseYear && <span className="text-slate-400">{releaseYear}</span>}
            <span className="bg-red-600/30 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full uppercase text-[10px] tracking-wider">
              Featured Movie
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
            {movie.title}
          </h1>

          {/* Overview */}
          <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/movie/${movieId}`}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-red-950/50"
            >
              <Info className="w-4 h-4" />
              View Details
            </Link>

            <button
              onClick={handleFav}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-2 border transition-colors ${
                favorite
                  ? 'bg-red-600/20 text-red-400 border-red-500/50'
                  : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
              {favorite ? 'Favorited' : 'Favorite'}
            </button>

            <button
              onClick={handleWatch}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg flex items-center gap-2 border transition-colors ${
                watchlisted
                  ? 'bg-amber-600/20 text-amber-400 border-amber-500/50'
                  : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${watchlisted ? 'fill-amber-500 text-amber-500' : ''}`} />
              {watchlisted ? 'In Watchlist' : 'Watchlist'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
