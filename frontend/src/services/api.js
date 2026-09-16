import {
  fetchTrendingMovies,
  searchMoviesByTitle,
  fetchGenres,
  discoverMovies,
  searchCast,
  fetchMovieDetails
} from '../api/tmdbAPI';

const API_KEY = "88c6a07392f2e132ce0178b185d681a3";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  return await fetchTrendingMovies();
};

export const searchMovies = async (query) => {
  return await searchMoviesByTitle(query);
};

export {
  fetchTrendingMovies,
  searchMoviesByTitle,
  fetchGenres,
  discoverMovies,
  searchCast,
  fetchMovieDetails
};