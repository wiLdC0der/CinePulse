import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Heart, Bookmark, LogIn, UserPlus, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-red-400 transition-colors">
            Cine<span className="text-red-500">Pulse</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2 rounded-full border border-slate-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors hover:text-red-400 ${
              isActive('/') ? 'text-red-500 font-semibold' : 'text-slate-300'
            }`}
          >
            Home
          </Link>
          <Link
            to="/discover"
            className={`transition-colors hover:text-red-400 ${
              isActive('/discover') ? 'text-red-500 font-semibold' : 'text-slate-300'
            }`}
          >
            Discover
          </Link>
          {user && (
            <>
              <Link
                to="/favorites"
                className={`flex items-center gap-1.5 transition-colors hover:text-red-400 ${
                  isActive('/favorites') ? 'text-red-500 font-semibold' : 'text-slate-300'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Favorites</span>
                {user.favorites?.length > 0 && (
                  <span className="bg-red-600/90 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                    {user.favorites.length}
                  </span>
                )}
              </Link>
              <Link
                to="/watchlist"
                className={`flex items-center gap-1.5 transition-colors hover:text-red-400 ${
                  isActive('/watchlist') ? 'text-red-500 font-semibold' : 'text-slate-300'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Watchlist</span>
                {user.watchlist?.length > 0 && (
                  <span className="bg-amber-600/90 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                    {user.watchlist.length}
                  </span>
                )}
              </Link>
            </>
          )}
        </nav>

        {/* Auth Buttons / Profile - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-medium text-slate-200">
                <User className="w-3.5 h-3.5 text-red-500" />
                <span className="max-w-[120px] truncate">{user.name}</span>
              </div>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md shadow-red-950/40"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-5 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-red-500 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <nav className="flex flex-col space-y-2 text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Home
            </Link>
            <Link
              to="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Discover Movies
            </Link>

            {user ? (
              <>
                <Link
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Favorites
                  </span>
                  {user.favorites?.length > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {user.favorites.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/watchlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-900 text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    Watchlist
                  </span>
                  {user.watchlist?.length > 0 && (
                    <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {user.watchlist.length}
                    </span>
                  )}
                </Link>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Logged in as <span className="text-slate-200 font-semibold">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
