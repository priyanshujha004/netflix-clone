import { useState, useEffect } from 'react';
import { searchMovies, getPopularMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import Input from '../components/Input';
import Button from '../components/Button';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch (err) {
        console.log(err);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };
    loadPopularMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;
    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);
    } catch (err) {
      console.log(err);
      setError('Failed to search movies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="home flex flex-col items-center py-8 px-4 bg-[#141414] text-white min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#E50914] rounded-full inline-block"></span>
              Recommended Movies
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Search and discover popular movies
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex w-full md:w-auto min-w-[320px] sm:min-w-[420px] gap-2">
            <Input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="primary" className="whitespace-nowrap px-6">
              Search
            </Button>
          </form>
        </div>

        {error && <div className="error-message text-red-400 mb-6 text-center font-medium bg-red-950/30 p-3 rounded border border-red-900">{error}</div>}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400 text-sm">Loading movies…</span>
          </div>
        ) : (
          <div className="movies-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies
              .filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;

