import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

const MovieContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('film_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { user, authenticatedFetch } = useAuth();

  // Fetch favorites from DB when user logs in
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        try {
          const res = await authenticatedFetch(
            `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}/api/favorites`
          );
          if (res.ok) {
            const data = await res.json();
            // Map backend schema to TMDB schema used by frontend
            const mappedFavorites = data.map((fav) => ({
              id: fav.movieId,
              title: fav.movieTitle,
              poster_path: fav.posterPath,
              release_date: fav.releaseDate,
            }));
            setFavorites(mappedFavorites);
            localStorage.setItem('film_favorites', JSON.stringify(mappedFavorites));
          }
        } catch {
          // Keep existing local favorites if fetch fails
        }
      };
      fetchFavorites();
    }
  }, [user, authenticatedFetch]);

  const addToFavorites = async (movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => String(m.id) === String(movie.id))) return prev;
      const next = [...prev, movie];
      localStorage.setItem('film_favorites', JSON.stringify(next));
      return next;
    });

    if (user) {
      try {
        await authenticatedFetch(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}/api/favorites`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              movieId: movie.id,
              movieTitle: movie.title,
              posterPath: movie.poster_path,
              releaseDate: movie.release_date,
            }),
          }
        );
      } catch (err) {
        console.error('Failed to sync favorite addition:', err);
      }
    }
  };

  const removeFromFavorites = async (movieId) => {
    setFavorites((prev) => {
      const next = prev.filter((movie) => String(movie.id) !== String(movieId));
      localStorage.setItem('film_favorites', JSON.stringify(next));
      return next;
    });

    if (user) {
      try {
        await authenticatedFetch(
          `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}/api/favorites/${movieId}`,
          {
            method: 'DELETE',
          }
        );
      } catch (err) {
        console.error('Failed to sync favorite removal:', err);
      }
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => String(movie.id) === String(movieId));
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};

