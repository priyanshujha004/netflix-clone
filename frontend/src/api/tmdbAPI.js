import axiosInstance from './axiosInstance';

const TMDB_API_KEY = "88c6a07392f2e132ce0178b185d681a3";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// In-memory frontend cache for 5 minutes
const frontendCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const getCached = (key) => {
  const item = frontendCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL) {
    frontendCache.delete(key);
    return null;
  }
  return item.data;
};

const setCache = (key, data) => {
  frontendCache.set(key, { data, timestamp: Date.now() });
};

// Utility: Debounce helper for inputs
export const debounce = (func, delay = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// 1. Fetch Trending Movies
export const fetchTrendingMovies = async () => {
  const cacheKey = 'trending';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axiosInstance.get('/movies/trending');
    setCache(cacheKey, response.data);
    return response.data;
  } catch (err) {
    console.warn('Backend trending endpoint failed, falling back to direct TMDB fetch', err.message);
    const res = await fetch(`${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    setCache(cacheKey, data.results || []);
    return data.results || [];
  }
};

// 2. Fetch Genre List
export const fetchGenres = async () => {
  const cacheKey = 'genres';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axiosInstance.get('/genres');
    const genres = response.data.genres || [];
    setCache(cacheKey, genres);
    return genres;
  } catch (err) {
    console.warn('Backend genres failed, falling back to TMDB', err.message);
    const res = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    const genres = data.genres || [];
    setCache(cacheKey, genres);
    return genres;
  }
};

// 3. Discover Movies with Filters
export const discoverMovies = async ({ genre, language, yearGte, yearLte, country, page = 1 }) => {
  const cacheKey = `discover:${genre || ''}:${language || ''}:${yearGte || ''}:${yearLte || ''}:${country || ''}:${page}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const params = { page };
    if (genre) params.genre = genre;
    if (language) params.language = language;
    if (yearGte) params.year_gte = yearGte;
    if (yearLte) params.year_lte = yearLte;
    if (country) params.country = country;

    const response = await axiosInstance.get('/movies/discover', { params });
    setCache(cacheKey, response.data);
    return response.data;
  } catch (err) {
    console.warn('Backend discover failed, falling back to TMDB direct fetch', err.message);
    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=${page}&include_adult=false`;
    if (genre) url += `&with_genres=${encodeURIComponent(genre)}`;
    if (language) url += `&with_original_language=${encodeURIComponent(language)}`;
    if (yearGte) url += `&primary_release_date.gte=${encodeURIComponent(yearGte)}-01-01`;
    if (yearLte) url += `&primary_release_date.lte=${encodeURIComponent(yearLte)}-12-31`;
    if (country) url += `&with_origin_country=${encodeURIComponent(country)}`;

    const res = await fetch(url);
    const data = await res.json();
    setCache(cacheKey, data);
    return data;
  }
};

// 4. Search Movies by Actor/Cast
export const searchCast = async (query) => {
  if (!query || !query.trim()) return { person: null, movies: [] };

  const cacheKey = `cast:${query.trim().toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axiosInstance.get('/movies/search/cast', { params: { query } });
    setCache(cacheKey, response.data);
    return response.data;
  } catch (err) {
    console.warn('Backend cast search failed, falling back to direct TMDB', err.message);
    const pRes = await fetch(`${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    const pData = await pRes.json();
    if (!pData.results || pData.results.length === 0) return { person: null, movies: [] };

    const person = pData.results[0];
    const cRes = await fetch(`${TMDB_BASE_URL}/person/${person.id}/movie_credits?api_key=${TMDB_API_KEY}`);
    const cData = await cRes.json();
    const result = {
      person: { id: person.id, name: person.name, profile_path: person.profile_path },
      movies: (cData.cast || []).sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    };
    setCache(cacheKey, result);
    return result;
  }
};

// 5. Fetch Full Movie Details (includes credits, recommendations, release_dates)
export const fetchMovieDetails = async (movieId) => {
  if (!movieId) return null;

  const cacheKey = `details:${movieId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await axiosInstance.get(`/movies/${movieId}/details`);
    setCache(cacheKey, response.data);
    return response.data;
  } catch (err) {
    console.warn('Backend details endpoint failed, falling back to direct TMDB', err.message);
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,recommendations,similar,release_dates,external_ids`
    );
    const data = await res.json();
    setCache(cacheKey, data);
    return data;
  }
};

// 6. Search Movies by Title
export const searchMoviesByTitle = async (query) => {
  if (!query || !query.trim()) return [];

  const cacheKey = `search:${query.trim().toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    const results = data.results || [];
    setCache(cacheKey, results);
    return results;
  } catch (err) {
    console.error('Failed to search movies:', err);
    return [];
  }
};
