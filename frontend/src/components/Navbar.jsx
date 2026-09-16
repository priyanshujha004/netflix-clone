import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import ProfileDropdown from './ProfileDropdown';

function Navbar() {
  const { user, loading } = useAuth();

  const mainHomePath = user ? '/browse' : '/';

  return (
    <nav className="bg-[#141414]/95 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          {/* Brand Logo - Routes to main home/browse */}
          <Link to={mainHomePath} className="flex items-center group" aria-label="Netflix Home">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-[#E50914] uppercase drop-shadow">
              NETFLIX
            </span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/browse" className="text-gray-200 hover:text-red-500 transition-colors">
                Home
              </Link>
              <Link to="/favorites" className="text-gray-200 hover:text-red-500 transition-colors">
                My Favorites
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/favorites"
                className="md:hidden text-sm text-gray-300 hover:text-white transition"
              >
                Favorites
              </Link>
              {/* Profile Avatar Dropdown */}
              <ProfileDropdown />
            </div>
          ) : (
            !loading && (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="primary" className="text-sm px-4 py-1.5 font-semibold">
                    Sign In
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
