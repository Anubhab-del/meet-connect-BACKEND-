import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import userRoutes from './routes/userRoutes.js';
import readinessRoutes from './routes/readinessRoutes.js';
import battleRoutes from './routes/battleRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://meet-connect-umber.vercel.app','http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/readiness', readinessRoutes);
app.use('/api/battle', battleRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => res.json({ message: 'MeetConnect API is running 🚀' }));

app.use((err, req, res, next) => {
  console.error('💥 Global error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ DB Error:', err));