import Favorite from '../models/Favorite.js';

// @desc    Add a movie to favorites
// @route   POST /api/favorites
export const addFavorite = async (req, res) => {
    const { movieId, movieTitle, posterPath, releaseDate } = req.body;

    try {
        const favoriteExists = await Favorite.findOne({ user: req.user._id, movieId });

        if (favoriteExists) {
            return res.status(400).json({ message: 'Movie is Already in Favorites' });
        }

        const favorite = await Favorite.create({
            user: req.user._id,
            movieId,
            movieTitle,
            posterPath,
            releaseDate
        });

        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: 'Error Adding Favorite' });
    }
};

// @desc    Get all user favorites
// @route   GET /api/favorites
export const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching favorites' });
    }
};

// @desc    Remove a movie from favorites
// @route   DELETE /api/favorites/:movieId
export const removeFavorite = async (req, res) => {
    try {
        // We use movieId (the TMDB id) rather than the MongoDB _id for easier frontend integration
        const favorite = await Favorite.findOneAndDelete({ 
            user: req.user._id, 
            movieId: req.params.movieId 
        });

        if (favorite) {
            res.json({ message: 'Favorite Removed Successfully' });
        } else {
            res.status(404).json({ message: 'Favorite Not Found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error Removing Favorite' });
    }
};
