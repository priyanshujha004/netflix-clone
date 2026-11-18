import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPopularMovies } from '../services/api';
import Home from './Home';
import MovieCard from '../components/MovieCard';
import Input from '../components/Input';
import Button from '../components/Button';
import MovieModal from '../components/MovieModal/MovieModal';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [topMovies, setTopMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (!user) {
      const loadTopMovies = async () => {
        try {
          const movies = await getPopularMovies();
          setTopMovies(movies.slice(0, 12));
        } catch (err) {
          console.error('Failed to load top movies for landing page:', err);
        } finally {
          setLoadingMovies(false);
        }
      };
      loadTopMovies();
    }
  }, [user]);

  const handleGetStarted = (e) => {
    e.preventDefault();
    navigate('/signup', { state: { email } });
  };

  // If user is logged in, show the Home page directly
  if (user) {
    return <Home />;
  }

  // Before Sign In: Landing page with Netflix hero backdrop & scrollable top movies
  return (
    <div className="bg-[#141414] text-white min-h-screen flex flex-col">
      {/* Netflix Hero Section */}
      <div className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b-8 border-gray-900">
        {/* Cinematic Backdrop Image & Dark Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40 scale-105 transform filter blur-[1px]"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/60 to-black/80 z-0" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-12 pb-8">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-lg leading-tight">
            Unlimited movies, TV shows, and more.
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-gray-200 drop-shadow">
            Watch anywhere. Cancel anytime.
          </p>
          <p className="text-base sm:text-lg text-gray-300">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <form
            onSubmit={handleGetStarted}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto mt-6"
          >
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/70 border border-gray-500 focus:border-red-600 text-white placeholder-gray-400 py-3.5 px-4 rounded text-base w-full sm:flex-1"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto px-8 py-3.5 text-lg font-bold bg-[#E50914] hover:bg-[#b9090b] text-white rounded flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-red-950/40"
            >
              Get Started
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </Button>
          </form>
        </div>
      </div>

      {/* Scrollable Top Recommended Movies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
              <span className="w-1.5 h-7 bg-[#E50914] rounded-full inline-block"></span>
              Trending & Top Recommended Movies
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Explore hit movies available to stream right now
            </p>
          </div>
        </div>

        {loadingMovies ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topMovies.map((movie) => (
              <MovieCard
                movie={movie}
                key={movie.id}
                onSelectMovie={(m) => setSelectedMovie(m)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Movie Modal Triggered by Info Button on Landing */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Landing;
