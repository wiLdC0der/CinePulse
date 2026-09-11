import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Bookmark, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MovieCard = ({ movie, onAuthRequired }) => {
  const { isFavorite, isWatchlisted, toggleFavorite, toggleWatchlist } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isUpdatingFav, setIsUpdatingFav] = useState(false);
  const [isUpdatingWatch, setIsUpdatingWatch] = useState(false);

  const movieId = String(movie.id || movie.movieId);
  const favorite = isFavorite(movieId);
  const watchlisted = isWatchlisted(movieId);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdatingFav) return;

    setIsUpdatingFav(true);
    const res = await toggleFavorite(movie);
    setIsUpdatingFav(false);

    if (res && res.requireAuth) {
      if (onAuthRequired) {
        onAuthRequired(res.message);
      } else {
        navigate('/login', { state: { message: res.message } });
      }
    }
  };

  const handleWatchlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpdatingWatch) return;

    setIsUpdatingWatch(true);
    const res = await toggleWatchlist(movie);
    setIsUpdatingWatch(false);

    if (res && res.requireAuth) {
      if (onAuthRequired) {
        onAuthRequired(res.message);
      } else {
        navigate('/login', { state: { message: res.message } });
      }
    }
  };

  const posterSrc = movie.posterPath || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null);
  const releaseYear = movie.releaseYear || (movie.releaseDate ? movie.releaseDate.split('-')[0] : (movie.release_date ? movie.release_date.split('-')[0] : 'N/A'));
  const rating = movie.voteAverage ?? movie.vote_average ?? 0;

  return (
    <div className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800/80 hover:border-slate-700 transition-all duration-300 flex flex-col h-full shadow-lg hover:shadow-red-950/20 hover:-translate-y-1">
      
      {/* Poster Container */}
      <Link to={`/movie/${movieId}`} className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950 block">
        {posterSrc && !imageError ? (
          <img
            src={posterSrc}
            alt={movie.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-600 text-center">
            <Film className="w-12 h-12 mb-2 stroke-[1.5]" />
            <span className="text-xs font-medium text-slate-400 line-clamp-2">{movie.title}</span>
          </div>
        )}

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-slate-800 text-[11px] font-semibold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
            <span>{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleFavoriteClick}
            disabled={isUpdatingFav}
            title={favorite ? "Remove from Favorites" : "Add to Favorites"}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              favorite
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:text-white hover:bg-red-600 hover:border-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleWatchlistClick}
            disabled={isUpdatingWatch}
            title={watchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              watchlisted
                ? 'bg-amber-600 border-amber-500 text-white'
                : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:text-white hover:bg-amber-600 hover:border-amber-500'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${watchlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </Link>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <Link
            to={`/movie/${movieId}`}
            className="font-semibold text-sm text-slate-100 hover:text-red-400 transition-colors line-clamp-1 block"
            title={movie.title}
          >
            {movie.title}
          </Link>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>{releaseYear}</span>
            <span className="text-[11px] font-medium text-slate-500 uppercase">Movie</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
