const axios = require('axios');

const getTmdbClient = () => {
  const apiKey = process.env.TMDB_API_KEY;
  const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

  if (!apiKey) {
    throw new Error('TMDB_API_KEY environment variable is missing. Please configure it in your server .env file.');
  }

  return axios.create({
    baseURL: baseUrl,
    params: {
      api_key: apiKey
    }
  });
};

// Image URL helpers
const IMAGE_BASE = 'https://image.tmdb.org/t/p/';
const formatPoster = (path) => path ? `${IMAGE_BASE}w500${path}` : null;
const formatBackdrop = (path) => path ? `${IMAGE_BASE}w1280${path}` : null;

// Normalize movie object for clean frontend consumption
const normalizeMovie = (movie) => {
  if (!movie) return null;
  return {
    id: String(movie.id),
    movieId: String(movie.id),
    title: movie.title || movie.name || 'Untitled',
    originalTitle: movie.original_title || '',
    posterPath: formatPoster(movie.poster_path),
    backdropPath: formatBackdrop(movie.backdrop_path),
    releaseDate: movie.release_date || movie.first_air_date || '',
    releaseYear: (movie.release_date || movie.first_air_date || '').split('-')[0] || '',
    voteAverage: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : 0,
    voteCount: movie.vote_count || 0,
    overview: movie.overview || 'No overview available.',
    genres: movie.genres || (movie.genre_ids ? movie.genre_ids : []),
    genreIds: movie.genre_ids || [],
    runtime: movie.runtime || 0
  };
};

const tmdbService = {
  // Fetch popular movies
  async getPopular(page = 1) {
    const client = getTmdbClient();
    const response = await client.get('/movie/popular', { params: { page } });
    return {
      page: response.data.page,
      totalPages: Math.min(response.data.total_pages, 500), // TMDB caps at 500
      totalResults: response.data.total_results,
      results: response.data.results.map(normalizeMovie)
    };
  },

  // Fetch trending movies
  async getTrending(page = 1) {
    const client = getTmdbClient();
    const response = await client.get('/trending/movie/week', { params: { page } });
    return {
      page: response.data.page,
      totalPages: Math.min(response.data.total_pages, 500),
      totalResults: response.data.total_results,
      results: response.data.results.map(normalizeMovie)
    };
  },

  // Search movies by query
  async searchMovies(query, page = 1, genreId = null) {
    const client = getTmdbClient();
    
    // If query is empty and genreId is provided, use discover endpoint
    if (!query && genreId) {
      return this.getByGenre(genreId, page);
    }

    const params = { query, page };
    const response = await client.get('/search/movie', { params });
    let results = response.data.results.map(normalizeMovie);

    // If genreId filter is passed alongside search query
    if (genreId) {
      const gId = Number(genreId);
      results = results.filter(m => Array.isArray(m.genreIds) && m.genreIds.includes(gId));
    }

    return {
      page: response.data.page,
      totalPages: Math.min(response.data.total_pages, 500),
      totalResults: response.data.total_results,
      results
    };
  },

  // Get movies by Genre ID
  async getByGenre(genreId, page = 1) {
    const client = getTmdbClient();
    const response = await client.get('/discover/movie', {
      params: { with_genres: genreId, page, sort_by: 'popularity.desc' }
    });
    return {
      page: response.data.page,
      totalPages: Math.min(response.data.total_pages, 500),
      totalResults: response.data.total_results,
      results: response.data.results.map(normalizeMovie)
    };
  },

  // Get detailed movie information by ID
  async getMovieDetails(movieId) {
    const client = getTmdbClient();
    const response = await client.get(`/movie/${movieId}`, {
      params: { append_to_response: 'credits,recommendations' }
    });
    
    const data = response.data;
    const normalized = normalizeMovie(data);

    // Extract cast & crew info
    const credits = data.credits || {};
    const cast = (credits.cast || []).slice(0, 10).map(person => ({
      id: person.id,
      name: person.name,
      character: person.character,
      profilePath: person.profile_path ? `${IMAGE_BASE}w185${person.profile_path}` : null
    }));

    const directorObj = (credits.crew || []).find(person => person.job === 'Director');
    const director = directorObj ? directorObj.name : 'Unknown';

    // Format genres as objects { id, name }
    const genres = (data.genres || []).map(g => ({ id: g.id, name: g.name }));

    // Format recommendations
    const recommendations = ((data.recommendations && data.recommendations.results) || [])
      .slice(0, 6)
      .map(normalizeMovie);

    return {
      ...normalized,
      tagline: data.tagline || '',
      status: data.status || '',
      budget: data.budget || 0,
      revenue: data.revenue || 0,
      genres,
      director,
      cast,
      recommendations
    };
  },

  // Get list of movie genres
  async getGenres() {
    const client = getTmdbClient();
    const response = await client.get('/genre/movie/list');
    return response.data.genres || [];
  }
};

module.exports = tmdbService;
