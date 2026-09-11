import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, X } from 'lucide-react';
import { searchMoviesApi, fetchGenres } from '../services/api';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import { GridSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('query') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const genreParam = searchParams.get('genre') || '';

  const [searchInput, setSearchInput] = useState(queryParam);
  const [selectedGenre, setSelectedGenre] = useState(genreParam);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync internal state when URL params change
  useEffect(() => {
    setSearchInput(queryParam);
    setSelectedGenre(genreParam);
    setPage(pageParam);
  }, [queryParam, genreParam, pageParam]);

  // Load Genres on mount
  useEffect(() => {
    const getGenresList = async () => {
      try {
        const data = await fetchGenres();
        if (data.success) {
          setGenres(data.genres || []);
        }
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    };
    getGenresList();
  }, []);

  // Fetch movies based on current search & filter criteria
  const performSearch = useCallback(async (q, p, g) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchMoviesApi(q, p, g);
      if (data.success) {
        setMovies(data.results || []);
        setTotalPages(data.totalPages || 1);
        setTotalResults(data.totalResults || 0);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to fetch movies. Please verify your connection or backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Execute search whenever parameters change
  useEffect(() => {
    performSearch(queryParam, pageParam, genreParam);
  }, [queryParam, pageParam, genreParam, performSearch]);

  // Debounced input change handler updating URL parameters
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== queryParam) {
        updateUrlParams(searchInput, 1, selectedGenre);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const updateUrlParams = (newQuery, newPage, newGenre) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('query', newQuery);
    if (newPage > 1) params.set('page', newPage.toString());
    if (newGenre) params.set('genre', newGenre);
    setSearchParams(params);
  };

  const handleGenreChange = (e) => {
    const g = e.target.value;
    setSelectedGenre(g);
    updateUrlParams(searchInput, 1, g);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateUrlParams(searchInput, newPage, selectedGenre);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedGenre('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header section */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Discover & Search Movies
        </h1>
        <p className="text-sm text-slate-400">
          Browse through thousands of popular titles, filter by genre, or search by title.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        
        {/* Search Input Box */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search titles..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-950 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-9 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Genre Selector & Reset Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-red-500 shrink-0" />
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none w-full"
            >
              <option value="" className="bg-slate-900 text-slate-200">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id} className="bg-slate-900 text-slate-200">
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {(searchInput || selectedGenre) && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* Results Header Info */}
      {!loading && !error && (
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div>
            Showing <span className="text-slate-200 font-semibold">{movies.length}</span> movies
            {totalResults > 0 && <span> of {totalResults} total</span>}
            {queryParam && <span> for &quot;<span className="text-red-400 font-medium">{queryParam}</span>&quot;</span>}
          </div>
          <div>
            Page <span className="text-slate-200 font-semibold">{page}</span> of {totalPages}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => performSearch(queryParam, pageParam, genreParam)}
        />
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <GridSkeleton count={10} />
      ) : movies.length === 0 ? (
        <EmptyState
          title="No movies found"
          description={
            queryParam
              ? `No movie titles matched "${queryParam}". Try searching with a different keyword or resetting filters.`
              : 'No movies available for the selected criteria.'
          }
          actionLabel="Reset Search & Filters"
          actionTo="/discover"
        />
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

    </div>
  );
};

export default Discover;
