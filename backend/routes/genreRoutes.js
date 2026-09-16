import express from 'express';

const router = express.Router();

let cachedGenres = null;
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const TMDB_API_KEY = process.env.TMDB_API_KEY || "88c6a07392f2e132ce0178b185d681a3";
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (cachedGenres && now - lastFetchTime < CACHE_DURATION) {
      return res.json({ genres: cachedGenres, cached: true });
    }

    const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
    if (!response.ok) {
      throw new Error(`TMDB responded with status ${response.status}`);
    }

    const data = await response.json();
    cachedGenres = data.genres;
    lastFetchTime = now;

    res.json({ genres: cachedGenres, cached: false });
  } catch (error) {
    console.error('Error fetching genres:', error.message);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

export default router;
