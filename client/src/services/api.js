import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer Token if logged in
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('movie_app_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth failures globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear token
      localStorage.removeItem('movie_app_token');
    }
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

// --- Movie Endpoints ---
export const fetchPopularMovies = async (page = 1) => {
  const response = await API.get(`/movies/popular?page=${page}`);
  return response.data;
};

export const fetchTrendingMovies = async (page = 1) => {
  const response = await API.get(`/movies/trending?page=${page}`);
  return response.data;
};

export const searchMoviesApi = async (query = '', page = 1, genre = '') => {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (page) params.append('page', page);
  if (genre) params.append('genre', genre);

  const response = await API.get(`/movies/search?${params.toString()}`);
  return response.data;
};

export const fetchGenres = async () => {
  const response = await API.get('/movies/genres');
  return response.data;
};

export const fetchMoviesByGenre = async (genreId, page = 1) => {
  const response = await API.get(`/movies/genre/${genreId}?page=${page}`);
  return response.data;
};

export const fetchMovieDetails = async (id) => {
  const response = await API.get(`/movies/${id}`);
  return response.data;
};

// --- Favorites Endpoints ---
export const fetchFavorites = async () => {
  const response = await API.get('/favorites');
  return response.data;
};

export const addFavoriteApi = async (movieId, movieData = {}) => {
  const response = await API.post(`/favorites/${movieId}`, movieData);
  return response.data;
};

export const removeFavoriteApi = async (movieId) => {
  const response = await API.delete(`/favorites/${movieId}`);
  return response.data;
};

// --- Watchlist Endpoints ---
export const fetchWatchlist = async () => {
  const response = await API.get('/watchlist');
  return response.data;
};

export const addWatchlistApi = async (movieId, movieData = {}) => {
  const response = await API.post(`/watchlist/${movieId}`, movieData);
  return response.data;
};

export const removeWatchlistApi = async (movieId) => {
  const response = await API.delete(`/watchlist/${movieId}`);
  return response.data;
};

export default API;
