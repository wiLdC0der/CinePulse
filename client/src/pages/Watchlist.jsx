import React from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';

const Watchlist = () => {
  const { user } = useAuth();
  const watchlist = user?.watchlist || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Bookmark className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Watchlist</h1>
            <p className="text-xs text-slate-400">
              Movies you are planning to watch later.
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          <span className="text-slate-100 font-bold text-base">{watchlist.length}</span> Saved
        </div>
      </div>

      {/* Watchlist Grid or Empty State */}
      {watchlist.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Your watchlist is empty"
          description="Keep track of movies you want to watch later by clicking the bookmark icon on any movie card."
          actionLabel="Discover Movies to Watch"
          actionTo="/discover"
        />
      ) : (
        <MovieGrid movies={watchlist} />
      )}

    </div>
  );
};

export default Watchlist;
