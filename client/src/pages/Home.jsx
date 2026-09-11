import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPopular, getTopRated } from '../services/movieService';
import MovieGrid from '../components/MovieGrid';
import { releaseYear } from '../utils/format';

// Home shows a small hero built from the current #1 popular movie, then
// two curated rails. Each rail loads and errors independently so one
// failing TMDB request doesn't blank the whole page.
export default function Home() {
  const [popular, setPopular] = useState({ movies: [], loading: true, error: null });
  const [topRated, setTopRated] = useState({ movies: [], loading: true, error: null });

  const loadPopular = () => {
    setPopular((s) => ({ ...s, loading: true, error: null }));
    getPopular(1)
      .then((data) => setPopular({ movies: data.results, loading: false, error: null }))
      .catch((err) => setPopular({ movies: [], loading: false, error: err.message }));
  };

  const loadTopRated = () => {
    setTopRated((s) => ({ ...s, loading: true, error: null }));
    getTopRated(1)
      .then((data) => setTopRated({ movies: data.results, loading: false, error: null }))
      .catch((err) => setTopRated({ movies: [], loading: false, error: err.message }));
  };

  useEffect(() => {
    loadPopular();
    loadTopRated();
  }, []);

  const hero = popular.movies[0];

  return (
    <div>
      {hero && (
        <section className="relative border-b border-ink-700">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: hero.backdropUrl ? `url(${hero.backdropUrl})` : undefined }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-ink-950/40" />
          <div className="relative mx-auto flex max-w-content flex-col gap-4 px-4 py-14 sm:px-6 md:flex-row md:items-end md:gap-8 md:py-20">
            <img
              src={hero.posterUrl}
              alt={`${hero.title} poster`}
              className="hidden w-40 flex-shrink-0 rounded-md shadow-lg shadow-black/50 md:block"
            />
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-wide text-paper-500">Popular this week</p>
              <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-paper-100 sm:text-4xl">
                {hero.title}
              </h1>
              <p className="mt-1 text-sm text-paper-500">{releaseYear(hero.releaseDate)}</p>
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-paper-300">{hero.overview}</p>
              <div className="mt-5 flex gap-3">
                <Link
                  to={`/movies/${hero.id}`}
                  className="rounded bg-marquee px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-marquee-light"
                >
                  View details
                </Link>
                <Link
                  to="/discover"
                  className="rounded border border-ink-700 px-4 py-2 text-sm text-paper-100 transition-colors hover:border-marquee hover:text-marquee"
                >
                  Discover more
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-paper-100">Popular movies</h2>
            <Link to="/discover" className="text-sm text-marquee hover:underline">
              See all
            </Link>
          </div>
          <MovieGrid
            movies={popular.movies}
            loading={popular.loading}
            error={popular.error}
            onRetry={loadPopular}
          />
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-paper-100">Top rated</h2>
            <Link to="/discover" className="text-sm text-marquee hover:underline">
              See all
            </Link>
          </div>
          <MovieGrid
            movies={topRated.movies}
            loading={topRated.loading}
            error={topRated.error}
            onRetry={loadTopRated}
          />
        </section>
      </div>
    </div>
  );
}
