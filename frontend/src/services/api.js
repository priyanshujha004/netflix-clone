const API_KEY = "88c6a07392f2e132ce0178b185d681a3";
const BASE_URL = "https://api.themoviedb.org/3"

export const getPopularMovies = async () => {
    // Request TMDB to also return external IDs (incl. Netflix)
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&append_to_response=external_ids`);
    const data = await response.json();
    // Return the full movie objects (they now contain `external_ids`)
    return data.results;
}

export const searchMovies = async (query) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await response.json()
    return data.results
}