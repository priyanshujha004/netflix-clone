import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMovieContext } from '../context/MovieContext';

function MovieCard({ movie }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  const onFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      if (favorite) {
        removeFromFavorites(movie.id);
      } else {
        addToFavorites(movie);
      }
    } else {
      navigate('/login');
    }
  };

  const openNetflix = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      const netflixId = movie?.external_ids?.netflix_id;
      const url = netflixId
        ? `https://www.netflix.com/title/${netflixId}`
        : `https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`;
      window.open(url, '_blank');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="group relative flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-800 shadow-xl transition-all duration-300 hover:scale-105 hover:border-red-600/50">
      <div className="aspect-[2/3] w-full relative overflow-hidden bg-gray-900">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Favorite Heart Button - Always Visible & Clickable Top Right */}
        <button
          type="button"
          onClick={onFavoriteClick}
          aria-pressed={favorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg active:scale-95 ${
            favorite && user
              ? 'bg-black/80 text-red-600 border border-red-600/80 scale-110 shadow-red-900/30'
              : 'bg-black/60 text-gray-200 hover:text-red-500 hover:bg-black/90 border border-white/20'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={favorite && user ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2.5"
            className="w-5 h-5 transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Hover Overlay with Watch Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            className="w-full bg-[#E50914] hover:bg-[#b9090b] text-white text-sm font-semibold py-2 px-3 rounded shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
            onClick={openNetflix}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Now
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1 bg-[#1e1e1e]">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-red-500 transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-400 font-medium">
          {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;