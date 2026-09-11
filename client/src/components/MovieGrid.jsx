import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, onAuthRequired }) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id || movie.movieId}
          movie={movie}
          onAuthRequired={onAuthRequired}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
