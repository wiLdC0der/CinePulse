import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';

const Favorites = () => {
  const { user } = useAuth();
  const favorites = user?.favorites || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Favorites</h1>
            <p className="text-xs text-slate-400">
              Movies you have marked as personal favorites.
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          <span className="text-slate-100 font-bold text-base">{favorites.length}</span> Saved
        </div>
      </div>

      {/* Favorites List or Empty State */}
      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your favorites list is empty"
          description="Browse movies and tap the heart icon on any poster to save it here for quick access anytime."
          actionLabel="Discover Movies"
          actionTo="/discover"
        />
      ) : (
        <MovieGrid movies={favorites} />
      )}

    </div>
  );
};

export default Favorites;
