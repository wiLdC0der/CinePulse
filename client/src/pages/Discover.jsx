import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { getGenres, getMoviesByGenre, getPopular, searchMovies } from '../services/movieService';

// URL is the source of truth for query/genre/page so results survive a
// refresh and the page is shareable, per the assignment's URL requirement.
export default function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('query') || '';
  const urlGenre = searchParams.get('genre') ? Number(searchParams.get('genre')) : null;
  const urlPage = Number(searchParams.get('page')) || 1;

  const [inputValue, setInputValue] = useState(urlQuery);
  const debouncedQuery = useDebounce(inputValue, 400);

  const [genres, setGenres] = useState([]);
  const [state, setState] = useState({ movies: [], totalPages: 1, loading: true, error: null });

  useEffect(() => {
    getGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  // Typing updates the URL's query (and resets to page 1) once debounced.
  useEffect(() => {
    if (debouncedQuery === urlQuery) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      next.set('query', debouncedQuery);
    } else {
      next.delete('query');
    }
    next.set('page', '1');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const fetchResults = () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    const request = urlQuery
      ? searchMovies(urlQuery, urlPage)
      : urlGenre
      ? getMoviesByGenre(urlGenre, urlPage)
      : getPopular(urlPage);

    request
      .then((data) =>
        setState({ movies: data.results, totalPages: data.totalPages, loading: false, error: null })
      )
      .catch((err) => setState({ movies: [], totalPages: 1, loading: false, error: err.message }));
  };

  useEffect(fetchResults, [urlQuery, urlGenre, urlPage]);

  const handleGenreSelect = (genreId) => {
    const next = new URLSearchParams(searchParams);
    if (genreId) {
      next.set('genre', String(genreId));
    } else {
      next.delete('genre');
    }
    next.delete('query');
    setInputValue('');
    next.set('page', '1');
    setSearchParams(next);
  };

  const handlePageChange = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heading = urlQuery ? `Results for "${urlQuery}"` : urlGenre ? 'Browsing by genre' : 'Discover movies';

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Discover</h1>
      <p className="mt-1 text-sm text-paper-500">Search by title or browse by genre.</p>

      <div className="mt-6 flex flex-col gap-4">
        <SearchBar value={inputValue} onChange={setInputValue} />
        <GenreFilter genres={genres} selectedGenreId={urlGenre} onSelect={handleGenreSelect} />
      </div>

      <h2 className="mb-4 mt-8 text-sm font-medium text-paper-500">{heading}</h2>

      <MovieGrid
        movies={state.movies}
        loading={state.loading}
        error={state.error}
        onRetry={fetchResults}
        emptyTitle="No movies found"
        emptyMessage={urlQuery ? `Nothing matched "${urlQuery}". Try a different title.` : 'Try a different genre.'}
      />

      {!state.loading && !state.error && (
        <Pagination page={urlPage} totalPages={state.totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
