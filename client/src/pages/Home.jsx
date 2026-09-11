import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Flame, Compass, ChevronRight, X } from 'lucide-react';
import { fetchPopularMovies, fetchTrendingMovies, fetchGenres } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieGrid from '../components/MovieGrid';
import { GridSkeleton } from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const navigate = useNavigate();
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authPrompt, setAuthPrompt] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [popData, trendData, genreData] = await Promise.all([
        fetchPopularMovies(1),
        fetchTrendingMovies(1),
        fetchGenres()
      ]);

      if (popData.success) {
        setPopular(popData.results);
        if (popData.results.length > 0) {
          // Select a high quality featured movie for the hero banner
          const featured = popData.results.find(m => m.backdropPath) || popData.results[0];
          setHeroMovie(featured);
        }
      }

      if (trendData.success) {
        setTrending(trendData.results);
      }

      if (genreData.success) {
        setGenres(genreData.genres || []);
      }
    } catch (err) {
      console.error('Failed to load home page data:', err);
      setError('Unable to fetch movies right now. Please check your backend / TMDB service setup.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAuthRequired = (message) => {
    setAuthPrompt(message || 'Please sign in to save movies to your account.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      
      {/* Auth Requirement Toast Notification */}
      {authPrompt && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-slate-100 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce">
          <p className="text-xs font-medium">{authPrompt}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthPrompt(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={loadData} />}

      {loading ? (
        <div className="space-y-8">
          <div className="h-80 bg-slate-900 rounded-2xl animate-pulse" />
          <GridSkeleton count={5} />
        </div>
      ) : (
        <>
          {/* Featured Hero Banner */}
          {heroMovie && <HeroBanner movie={heroMovie} onAuthRequired={handleAuthRequired} />}

          {/* Quick Genre Category Pills */}
          {genres.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-red-500" />
                  Explore Categories
                </h2>
                <Link
                  to="/discover"
                  className="text-xs font-semibold text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  Browse All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {genres.slice(0, 10).map((g) => (
                  <Link
                    key={g.id}
                    to={`/discover?genre=${g.id}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap transition-all shadow-sm"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Popular Movies Section */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-slate-100">Popular Movies</h2>
              </div>
              <Link
                to="/discover"
                className="text-xs font-semibold text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                View More <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <MovieGrid movies={popular.slice(0, 10)} onAuthRequired={handleAuthRequired} />
          </section>

          {/* Trending Movies Section */}
          {trending.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-bold text-slate-100">Trending This Week</h2>
                </div>
                <Link
                  to="/discover"
                  className="text-xs font-semibold text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  Explore <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <MovieGrid movies={trending.slice(0, 10)} onAuthRequired={handleAuthRequired} />
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
