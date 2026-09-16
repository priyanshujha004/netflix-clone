import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    movieId: {
        type: Number,
        required: true,
    },
    movieTitle: {
        type: String,
        required: true,
    },
    posterPath: {
        type: String,
    },
    releaseDate: {
        type: String,
    }
}, { timestamps: true });

// Prevent duplicate favorites for the same user and movie
favoriteSchema.index({ user: 1, movieId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
