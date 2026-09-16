import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-[#141414]/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center group" aria-label="Netflix Home">
            <span className="text-3xl font-black tracking-tighter text-[#E50914] uppercase drop-shadow">
              NETFLIX
            </span>
          </Link>
          {user && (
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className="text-gray-200 hover:text-red-500 transition-colors">
                Home
              </Link>
              <Link to="/browse" className="text-gray-200 hover:text-red-500 transition-colors">
                Browse
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
              <Link
                to="/profile"
                className="text-sm font-medium text-gray-300 hover:text-white transition flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:inline">{user.name || 'Profile'}</span>
              </Link>
              <Button
                type="button"
                onClick={handleLogout}
                variant="secondary"
                className="text-xs px-3 py-1.5 font-semibold border-gray-700"
              >
                Logout
              </Button>
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

