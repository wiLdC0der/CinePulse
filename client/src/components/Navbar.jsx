import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Heart, Bookmark, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `text-sm transition-colors ${isActive ? 'text-marquee' : 'text-paper-300 hover:text-paper-100'}`;

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-paper-100">
          <Film className="text-marquee" size={22} />
          Reel
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/discover" className={navLinkClass}>
            Discover
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/favorites" className={navLinkClass}>
                Favorites
              </NavLink>
              <NavLink to="/watchlist" className={navLinkClass}>
                Watchlist
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-paper-500">Hi, {user?.name?.split(' ')[0]}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded border border-ink-700 px-3 py-1.5 text-sm text-paper-300 transition-colors hover:border-marquee hover:text-marquee"
              >
                <LogOut size={15} /> Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-paper-300 hover:text-paper-100">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded bg-marquee px-3.5 py-1.5 text-sm font-medium text-ink-950 transition-colors hover:bg-marquee-light"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="text-paper-100 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-ink-700 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/discover" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Discover
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/favorites" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  <span className="inline-flex items-center gap-1.5">
                    <Heart size={14} /> Favorites
                  </span>
                </NavLink>
                <NavLink to="/watchlist" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  <span className="inline-flex items-center gap-1.5">
                    <Bookmark size={14} /> Watchlist
                  </span>
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-left text-sm text-paper-300 hover:text-marquee"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-paper-300" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="text-sm text-marquee" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
