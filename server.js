import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import postRoutes from './routes/postRoute.js';
import userRoutes from './routes/userRoute.js';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors()); // Enable CORS

// Routes
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Server is running and endpoint is accessible' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
