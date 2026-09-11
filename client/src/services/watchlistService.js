import api from './api';

export async function getWatchlist() {
  const { data } = await api.get('/watchlist');
  return data.data.movies;
}

export async function addToWatchlist(movieId) {
  const { data } = await api.post(`/watchlist/${movieId}`);
  return data.data.movies;
}

export async function removeFromWatchlist(movieId) {
  const { data } = await api.delete(`/watchlist/${movieId}`);
  return data.data.movies;
}
