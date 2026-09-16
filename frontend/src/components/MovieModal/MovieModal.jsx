import React, { useEffect, useState } from 'react';
import HeroBanner from './HeroBanner';
import ContentDetails from './ContentDetails';
import CreditsFooter from './CreditsFooter';
import { fetchMovieDetails } from '../../api/tmdbAPI';

const MovieModal = ({ movie, onClose, onCastClick }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movie?.id) return;

    let isMounted = true;
    setLoading(true);

    fetchMovieDetails(movie.id)
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error loading movie details in modal:', err);
        if (isMounted) setLoading(false);
      });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [movie, onClose]);

  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] rounded-xl shadow-2xl overflow-y-auto border border-zinc-800 my-auto transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/90 text-white rounded-full p-2 transition transform hover:scale-110 border border-zinc-700"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Hero Banner */}
        <HeroBanner movie={movie} details={details} />

        {/* Content Details */}
        {loading ? (
          <div className="p-12 flex justify-center items-center text-red-600">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            <ContentDetails movie={movie} details={details} onCastClick={onCastClick} />
            <CreditsFooter details={details} />
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
