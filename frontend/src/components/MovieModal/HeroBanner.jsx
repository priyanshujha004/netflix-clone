import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMovieContext } from '../../context/MovieContext';
import { useNavigate } from 'react-router-dom';
import { fetchMovieTrailer } from '../../api/tmdbAPI';

const HeroBanner = ({ movie, details }) => {
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const navigate = useNavigate();

  if (!movie) return null;

  const favorited = isFavorite(movie.id);

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : 'https://via.placeholder.com/780x439?text=No+Preview';

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : 'https://via.placeholder.com/342x513?text=No+Poster';

  const handlePlay = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const netflixUrl = movie.external_ids?.imdb_id
      ? `https://www.netflix.com/search?q=${encodeURIComponent(movie.title || movie.name)}`
      : `https://www.netflix.com/search?q=${encodeURIComponent(movie.title || movie.name)}`;
    window.open(netflixUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWatchTrailer = async () => {
    try {
      const year = (movie.release_date || movie.first_air_date || '').substring(0, 4);
      const data = await fetchMovieTrailer({
        id: movie.id,
        title: movie.title || movie.name,
        year
      });
      if (data && data.youtubeUrl) {
        window.open(data.youtubeUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert('Trailer not available for this title.');
      }
    } catch (err) {
      console.warn('Trailer fetch failed:', err);
      alert('Trailer not available for this title.');
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (favorited) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className="relative w-full aspect-video md:h-96 overflow-hidden rounded-t-xl bg-black">
      {/* Backdrop Image */}
      <img
        src={backdropUrl}
        alt={movie.title || movie.name}
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />

      {/* Poster + Action Bar Overlay */}
      <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10 gap-4">
        <div className="flex items-end gap-4">
          {/* Overlapping Poster */}
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-24 h-36 md:w-36 md:h-52 object-cover rounded-md shadow-2xl border-2 border-zinc-700/50 hidden sm:block"
          />
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-md mb-2">
              {movie.title || movie.name}
            </h1>
            {details?.tagline && (
              <p className="text-sm text-gray-300 italic mb-2 drop-shadow">"{details.tagline}"</p>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold px-5 py-2 md:px-7 md:py-2.5 rounded-md transition transform hover:scale-105 shadow-lg text-sm md:text-base"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </button>

              <button
                onClick={handleWatchTrailer}
                className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white font-semibold px-5 py-2 md:px-6 md:py-2.5 rounded-md border border-gray-400 hover:border-white transition transform hover:scale-105 shadow-lg text-sm md:text-base"
              >
                <svg className="w-5 h-5 fill-red-600" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch Trailer
              </button>

              <button
                onClick={handleFavoriteClick}
                className={`p-2.5 rounded-full border-2 transition transform hover:scale-110 flex items-center justify-center ${
                  favorited
                    ? 'border-red-600 bg-red-600/20 text-red-500'
                    : 'border-gray-400 bg-black/40 text-white hover:border-white'
                }`}
                title={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <svg
                  className={`w-5 h-5 ${favorited ? 'fill-current text-red-600' : 'fill-none stroke-current'}`}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
