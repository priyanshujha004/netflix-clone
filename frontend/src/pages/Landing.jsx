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

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col selection:bg-red-600 selection:text-white">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/[0.08]">
        {/* Cinematic Backdrop Image & Multi-layer Dark Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-25 scale-105 transform filter blur-[1px]"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/80 via-[#0f0f0f]/60 to-[#0f0f0f] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.12)_0%,transparent_70%)] pointer-events-none z-0" />

        {/* Hero Content Block */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-6 pt-16 pb-12 flex flex-col items-center">
          {/* Eyebrow Pill Tag */}
          {/* <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-red-600/10 border border-red-500/25 text-red-500 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Next-Gen Cinematic Streaming
          </div> */}

          {/* High-Contrast Display Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-xl leading-[1.08] max-w-4xl">
            Unlimited movies, TV shows, and more.
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-2xl font-normal text-gray-300 drop-shadow max-w-2xl leading-relaxed">
            Watch anywhere. Cancel anytime. Dive into award-winning originals, hit franchises, and hidden gems.
          </p>

          <p className="text-sm sm:text-base text-gray-400 font-light">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          {/* Interactive Email Bar */}
          <form
            onSubmit={handleGetStarted}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto mt-4 p-2 sm:p-2.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80"
          >
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder-gray-400 py-3 px-4 text-base w-full sm:flex-1"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold bg-[#E50914] hover:bg-[#b9090b] text-white rounded-xl flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-red-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all group cursor-pointer"
            >
              Get Started
              <svg
                className="w-4 h-4 fill-current transform group-hover:translate-x-1.5 transition-transform duration-200"
                viewBox="0 0 24 24"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </Button>
          </form>

          {/* Quick Metrics / Social Proof Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 pt-8 text-center border-t border-white/[0.08] mt-8 w-full max-w-3xl">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">10K+</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Titles Available</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">4K UHD</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Ultra Quality</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">0 Ads</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Ad-Free Viewing</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">Instant</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Trailer Previews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Glass Cards Grid (Modern Structural Layout) */}
      <section className="py-16 sm:py-20 bg-black/40 border-b border-white/[0.06] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="backdrop-blur-md bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-red-600/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Save to Your Personal Vault</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Save your favorite movies and tv shows to your personal vault and watch them anytime.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="backdrop-blur-md bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-red-600/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Instant HD Trailers</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Discover your next favorite film in seconds with official trailers, teasers, and high-definition previews without signing in.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="backdrop-blur-md bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-red-600/40 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Explore Cast & Genres</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Search deep actor filmographies, custom release years, original languages, and genre filters tailored to your taste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Movie Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex-1">
        {/* Section Header with Typographic Balance */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-5 border-b border-white/[0.08] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span className="text-xs uppercase tracking-widest font-semibold text-red-500">Curated Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trending & Top Recommended Movies
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-1.5 font-light">
              Explore hit movies available to stream right now across all genres
            </p>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-gray-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Live Top 12 Picks
          </div>
        </div>

        {/* Movies Grid */}
        {loadingMovies ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-400 font-light">Loading trending titles...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {topMovies.map((movie) => (
                <MovieCard
                  movie={movie}
                  key={movie.id}
                  onSelectMovie={(m) => setSelectedMovie(m)}
                />
              ))}
            </div>

            {/* Asymmetrical Portal Card with "Look for More" Button */}
            <div className="mt-16 sm:mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/40 via-zinc-900/90 to-zinc-950 border border-red-900/30 p-8 sm:p-12 shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2 max-w-xl">
                  <span className="text-xs font-semibold uppercase tracking-widest text-red-500">Expanded Discovery</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Looking for a specific title or actor?
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
                    Search through thousands of movies, filter by release dates, audio languages, and discover comprehensive cast filmographies on the browse page.
                  </p>
                </div>

                <div className="shrink-0">
                  <Button
                    variant="primary"
                    onClick={() => navigate('/browse')}
                    className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-[#E50914] hover:bg-[#b9090b] text-white rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-red-950/60 hover:scale-105 active:scale-95 transition-all group cursor-pointer"
                  >
                    Look for More
                    <svg
                      className="w-5 h-5 fill-current transform group-hover:translate-x-1.5 transition-transform duration-200"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Decorative Background Glow */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </>
        )}
      </section>

      {/* Movie Modal Triggered by Info Button on Landing */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onCastClick={(actorName) => {
            setSelectedMovie(null);
            navigate(`/browse?cast=${encodeURIComponent(actorName)}`, {
              state: { castQuery: actorName }
            });
          }}
        />
      )}
    </div>
  );
};

export default Landing;
