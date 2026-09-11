import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  addFavoriteApi,
  removeFavoriteApi,
  addWatchlistApi,
  removeWatchlistApi
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('movie_app_token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Hydrate user state on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await fetchCurrentUser();
          if (data.success) {
            setUser(data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to restore auth session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await loginUser({ email, password });
      if (data.success) {
        localStorage.setItem('movie_app_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        setAuthError(data.message || 'Login failed');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials or server error';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const data = await registerUser({ name, email, password });
      if (data.success) {
        localStorage.setItem('movie_app_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        setAuthError(data.message || 'Registration failed');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration error';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('movie_app_token');
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  // Helper checks
  const isFavorite = (movieId) => {
    if (!user || !user.favorites) return false;
    return user.favorites.some(fav => String(fav.movieId) === String(movieId));
  };

  const isWatchlisted = (movieId) => {
    if (!user || !user.watchlist) return false;
    return user.watchlist.some(item => String(item.movieId) === String(movieId));
  };

  // Toggle Favorite
  const toggleFavorite = async (movie) => {
    if (!user) {
      return { success: false, requireAuth: true, message: 'Please log in to save favorites' };
    }

    const movieId = String(movie.id || movie.movieId);
    const currentlyFav = isFavorite(movieId);

    try {
      let data;
      if (currentlyFav) {
        data = await removeFavoriteApi(movieId);
      } else {
        const moviePayload = {
          movieId: String(movie.id || movie.movieId),
          title: movie.title,
          posterPath: movie.posterPath || movie.poster_path || '',
          backdropPath: movie.backdropPath || movie.backdrop_path || '',
          releaseDate: movie.releaseDate || movie.release_date || '',
          voteAverage: movie.voteAverage || movie.vote_average || 0,
          overview: movie.overview || '',
          genres: movie.genres || []
        };
        data = await addFavoriteApi(movieId, moviePayload);
      }

      if (data.success) {
        setUser(prev => ({
          ...prev,
          favorites: data.favorites
        }));
        return { success: true, isFavorite: !currentlyFav };
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return { success: false, message: err.response?.data?.message || 'Operation failed' };
    }
  };

  // Toggle Watchlist
  const toggleWatchlist = async (movie) => {
    if (!user) {
      return { success: false, requireAuth: true, message: 'Please log in to add to watchlist' };
    }

    const movieId = String(movie.id || movie.movieId);
    const currentlyWatchlisted = isWatchlisted(movieId);

    try {
      let data;
      if (currentlyWatchlisted) {
        data = await removeWatchlistApi(movieId);
      } else {
        const moviePayload = {
          movieId: String(movie.id || movie.movieId),
          title: movie.title,
          posterPath: movie.posterPath || movie.poster_path || '',
          backdropPath: movie.backdropPath || movie.backdrop_path || '',
          releaseDate: movie.releaseDate || movie.release_date || '',
          voteAverage: movie.voteAverage || movie.vote_average || 0,
          overview: movie.overview || '',
          genres: movie.genres || []
        };
        data = await addWatchlistApi(movieId, moviePayload);
      }

      if (data.success) {
        setUser(prev => ({
          ...prev,
          watchlist: data.watchlist
        }));
        return { success: true, isWatchlisted: !currentlyWatchlisted };
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
      return { success: false, message: err.response?.data?.message || 'Operation failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        login,
        register,
        logout,
        isFavorite,
        isWatchlisted,
        toggleFavorite,
        toggleWatchlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
