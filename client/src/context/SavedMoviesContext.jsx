import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites, addFavorite, removeFavorite } from '../services/favoriteService';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/watchlistService';

// Favorite/watchlist membership is checked from many places at once
// (every movie card, the details page), so it lives in context rather
// than being re-fetched per component.
const SavedMoviesContext = createContext(null);

export function SavedMoviesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      setWatchlist([]);
      setLoaded(false);
      return;
    }
    Promise.all([getFavorites(), getWatchlist()])
      .then(([favs, watch]) => {
        setFavorites(favs);
        setWatchlist(watch);
      })
      .catch(() => {
        // Leave lists empty; individual pages surface their own error states.
      })
      .finally(() => setLoaded(true));
  }, [isAuthenticated]);

  const isFavorite = useCallback((movieId) => favorites.some((m) => m.movieId === movieId), [favorites]);
  const isInWatchlist = useCallback((movieId) => watchlist.some((m) => m.movieId === movieId), [watchlist]);

  const toggleFavorite = useCallback(
    async (movieId) => {
      if (isFavorite(movieId)) {
        const updated = await removeFavorite(movieId);
        setFavorites(updated);
      } else {
        const updated = await addFavorite(movieId);
        setFavorites(updated);
      }
    },
    [isFavorite]
  );

  const toggleWatchlist = useCallback(
    async (movieId) => {
      if (isInWatchlist(movieId)) {
        const updated = await removeFromWatchlist(movieId);
        setWatchlist(updated);
      } else {
        const updated = await addToWatchlist(movieId);
        setWatchlist(updated);
      }
    },
    [isInWatchlist]
  );

  const value = {
    favorites,
    watchlist,
    loaded,
    isFavorite,
    isInWatchlist,
    toggleFavorite,
    toggleWatchlist,
  };

  return <SavedMoviesContext.Provider value={value}>{children}</SavedMoviesContext.Provider>;
}

export function useSavedMovies() {
  const ctx = useContext(SavedMoviesContext);
  if (!ctx) throw new Error('useSavedMovies must be used within a SavedMoviesProvider');
  return ctx;
}
