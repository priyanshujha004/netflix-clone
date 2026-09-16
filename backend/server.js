import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';


// Load env vars
dotenv.config();
console.log('Access Token  :', process.env.ACCESS_TOKEN_TTL)
console.log('Refresh Token :', process.env.REFRESH_TOKEN_TTL);

const app = express();

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);


// Base Route
app.get('/', (req, res) => {
    res.send('Netflix Clone API is Running...');
});

const PORT = process.env.PORT || 5001;

await connectDB();

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
