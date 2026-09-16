import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

function Favorites() {
  const { favorites } = useMovieContext();

  if (favorites && favorites.length > 0) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#141414] min-h-screen text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#E50914] rounded-full inline-block"></span>
              My Favorites ({favorites.length})
            </h1>
          </div>
          <div className="movies-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center py-24 px-4 bg-[#141414] min-h-[75vh] text-white text-center">
      <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-800/50 flex items-center justify-center text-[#E50914] mb-4">
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">No Favorite Movies Yet</h2>
      <p className="text-gray-400 max-w-md mb-6">
        Click the heart icon on any movie poster to save it to your personal favorites list!
      </p>
      <Link to="/browse">
        <Button variant="primary" className="px-6 py-2.5">
          Explore Movies
        </Button>
      </Link>
    </section>
  );
}

export default Favorites;