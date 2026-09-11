import api from './api';

export async function getPopular(page = 1) {
  const { data } = await api.get('/movies/popular', { params: { page } });
  return data.data;
}

export async function getTopRated(page = 1) {
  const { data } = await api.get('/movies/top-rated', { params: { page } });
  return data.data;
}

export async function searchMovies(query, page = 1) {
  const { data } = await api.get('/movies/search', { params: { query, page } });
  return data.data;
}

export async function getMoviesByGenre(genreId, page = 1) {
  const { data } = await api.get(`/movies/genre/${genreId}`, { params: { page } });
  return data.data;
}

export async function getMovieById(id) {
  const { data } = await api.get(`/movies/${id}`);
  return data.data.movie;
}

export async function getGenres() {
  const { data } = await api.get('/movies/genres');
  return data.data.genres;
}
