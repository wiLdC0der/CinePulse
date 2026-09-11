import api from './api';

export async function getFavorites() {
  const { data } = await api.get('/favorites');
  return data.data.movies;
}

export async function addFavorite(movieId) {
  const { data } = await api.post(`/favorites/${movieId}`);
  return data.data.movies;
}

export async function removeFavorite(movieId) {
  const { data } = await api.delete(`/favorites/${movieId}`);
  return data.data.movies;
}
