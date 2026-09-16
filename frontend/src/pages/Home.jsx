import { useState, useEffect } from 'react';
import { searchMovies, getPopularMovies } from '../services/api';
import { discoverMovies, searchCast } from '../api/tmdbAPI';
import MovieCard from '../components/MovieCard';
import Input from '../components/Input';
import Button from '../components/Button';
import MovieModal from '../components/MovieModal/MovieModal';
import FilterBar from '../components/Filters/FilterBar';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected Movie for Modal
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Active View Mode: 'popular' | 'discover' | 'search' | 'cast'
  const [activeMode, setActiveMode] = useState('popular');
  const [actorInfo, setActorInfo] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    genre: '',
    language: '',
    yearGte: '',
    yearLte: '',
    country: ''
  });

  // Load Popular/Trending on Mount
  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    setLoading(true);
    setError(null);
    setActorInfo(null);
    try {
      const popularMovies = await getPopularMovies();
      setMovies(popularMovies);
      setActiveMode('popular');
    } catch (err) {
      console.error(err);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  // Handle Filter Change
  const handleFilterChange = async (key, value) => {
    let newFilters = { ...filters };

    if (key === 'yearRange') {
      newFilters.yearGte = value.gte;
      newFilters.yearLte = value.lte;
    } else {
      newFilters[key] = value;
    }

    setFilters(newFilters);
    setActorInfo(null);

    // If all filters cleared, reload popular
    if (!newFilters.genre && !newFilters.language && !newFilters.yearGte && !newFilters.country) {
      loadPopularMovies();
      return;
    }

    // Apply discovery filtering
    setLoading(true);
    setError(null);
    try {
      const data = await discoverMovies({
        genre: newFilters.genre,
        language: newFilters.language,
        yearGte: newFilters.yearGte,
        yearLte: newFilters.yearLte,
        country: newFilters.country
      });
      setMovies(data.results || []);
      setActiveMode('discover');
    } catch (err) {
      console.error(err);
      setError('Failed to apply filters');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      genre: '',
      language: '',
      yearGte: '',
      yearLte: '',
      country: ''
    });
    setSearchQuery('');
    setActorInfo(null);
    loadPopularMovies();
  };

  // Unified Search Handler (Searches Titles & Actors simultaneously)
  const handleUnifiedSearch = async (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setActorInfo(null);

    try {
      // Run both Title Search & Actor Search concurrently
      const [titleResults, castResults] = await Promise.all([
        searchMovies(query).catch(() => []),
        searchCast(query).catch(() => ({ person: null, movies: [] }))
      ]);

      let combinedMovies = [];
      const seenIds = new Set();

      // If an actor match was found with movies
      if (castResults?.person && castResults.movies?.length > 0) {
        setActorInfo(castResults.person);
        castResults.movies.forEach((m) => {
          if (m && m.id && !seenIds.has(m.id)) {
            seenIds.add(m.id);
            combinedMovies.push(m);
          }
        });
        setActiveMode('cast');
      } else {
        setActiveMode('search');
      }

      // Merge title search results
      (titleResults || []).forEach((m) => {
        if (m && m.id && !seenIds.has(m.id)) {
          seenIds.add(m.id);
          combinedMovies.push(m);
        }
      });

      setMovies(combinedMovies);
    } catch (err) {
      console.error(err);
      setError('Failed to execute search');
    } finally {
      setLoading(false);
    }
  };

  // Click on Cast/Actor inside Modal
  const handleCastClickInModal = async (actorName) => {
    setSelectedMovie(null);
    setSearchQuery(actorName);
    setLoading(true);
    try {
      const castData = await searchCast(actorName);
      if (castData?.movies) {
        setMovies(castData.movies);
        setActorInfo(castData.person);
        setActiveMode('cast');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="home flex flex-col items-center py-8 px-4 bg-[#141414] text-white min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        {/* Unified Search Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#E50914] rounded-full inline-block"></span>
              {activeMode === 'popular' && 'Trending & Popular'}
              {activeMode === 'discover' && 'Filtered Discover'}
              {activeMode === 'search' && `Search Results for "${searchQuery}"`}
              {activeMode === 'cast' && `Results for ${actorInfo?.name || searchQuery}`}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Search by title, actor, or genre from a single search box.
            </p>
          </div>

          {/* Unified Single Search Input */}
          <form onSubmit={handleUnifiedSearch} className="flex w-full md:w-auto min-w-[320px] sm:min-w-[440px] gap-2">
            <Input
              type="text"
              placeholder="Search by movie title, actor, or cast name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="primary" className="whitespace-nowrap px-6">
              Search
            </Button>
          </form>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Actor Banner (if an actor was found in search) */}
        {activeMode === 'cast' && actorInfo && (
          <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-900/50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {actorInfo.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${actorInfo.profile_path}`}
                  alt={actorInfo.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-red-600"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg">
                  {actorInfo.name ? actorInfo.name.charAt(0) : 'A'}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-white">Actor: {actorInfo.name}</h2>
                <p className="text-xs text-gray-400">Showing movies starring or featuring {actorInfo.name}</p>
              </div>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs text-gray-400 hover:text-white underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message text-red-400 mb-6 text-center font-medium bg-red-950/30 p-3 rounded border border-red-900">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400 text-sm">Loading movies…</span>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold">No movies found matching "{searchQuery}".</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 text-red-500 hover:text-red-400 underline text-sm"
            >
              Reset search & filters
            </button>
          </div>
        ) : (
          <div className="movies-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                movie={movie}
                key={movie.id}
                onSelectMovie={(m) => setSelectedMovie(m)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onCastClick={handleCastClickInModal}
        />
      )}
    </section>
  );
}

export default Home;
