import express from 'express';

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY || "88c6a07392f2e132ce0178b185d681a3";
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

// Simple in-memory cache for movie details / discover responses
const cacheMap = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

const getCached = (key) => {
  const item = cacheMap.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cacheMap.delete(key);
    return null;
  }
  return item.data;
};

const setCache = (key, data) => {
  cacheMap.set(key, { data, timestamp: Date.now() });
};

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
  try {
    const cacheKey = 'trending';
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await fetch(`${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error(`TMDB status ${response.status}`);
    const data = await response.json();

    setCache(cacheKey, data.results);
    res.json(data.results);
  } catch (error) {
    console.error('Error fetching trending:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// GET /api/movies/discover
router.get('/discover', async (req, res) => {
  try {
    const { genre, language, year_gte, year_lte, country, page = 1 } = req.query;

    const cacheKey = `discover:${genre || ''}:${language || ''}:${year_gte || ''}:${year_lte || ''}:${country || ''}:${page}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=${page}&include_adult=false`;

    if (genre) url += `&with_genres=${encodeURIComponent(genre)}`;
    if (language) url += `&with_original_language=${encodeURIComponent(language)}`;
    if (year_gte) url += `&primary_release_date.gte=${encodeURIComponent(year_gte)}-01-01`;
    if (year_lte) url += `&primary_release_date.lte=${encodeURIComponent(year_lte)}-12-31`;
    if (country) url += `&with_origin_country=${encodeURIComponent(country)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`TMDB status ${response.status}`);
    const data = await response.json();

    setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error in discover endpoint:', error.message);
    res.status(500).json({ error: 'Failed to discover movies' });
  }
});

// GET /api/movies/search/cast
router.get('/search/cast', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Actor search query is required' });
    }

    const cacheKey = `cast:${query.toLowerCase().trim()}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    // Step 1: Search for person
    const personRes = await fetch(`${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    if (!personRes.ok) throw new Error(`TMDB status ${personRes.status}`);
    const personData = await personRes.json();

    if (!personData.results || personData.results.length === 0) {
      return res.json({ person: null, movies: [] });
    }

    const primaryPerson = personData.results[0];

    // Step 2: Fetch person's movie credits
    const creditsRes = await fetch(`${TMDB_BASE_URL}/person/${primaryPerson.id}/movie_credits?api_key=${TMDB_API_KEY}`);
    if (!creditsRes.ok) throw new Error(`TMDB status ${creditsRes.status}`);
    const creditsData = await creditsRes.json();

    // Sort by popularity or vote_count
    const sortedMovies = (creditsData.cast || []).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    const result = {
      person: {
        id: primaryPerson.id,
        name: primaryPerson.name,
        profile_path: primaryPerson.profile_path,
        known_for_department: primaryPerson.known_for_department
      },
      movies: sortedMovies
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Error searching cast:', error.message);
    res.status(500).json({ error: 'Failed to search movies by cast' });
  }
});

// GET /api/movies/:id/details
router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `details:${id}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,recommendations,similar,release_dates,external_ids`
    );
    if (!response.ok) throw new Error(`TMDB status ${response.status}`);
    const data = await response.json();

    setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// GET /api/movies/:id/credits
router.get('/:id/credits', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `credits:${id}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error(`TMDB status ${response.status}`);
    const data = await response.json();

    setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching credits:', error.message);
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

export default router;
