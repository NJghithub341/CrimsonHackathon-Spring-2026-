import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { battleRoutes } from './routes/battles';
import { matchmakingRoutes } from './routes/matchmaking';
import { questionRoutes } from './routes/questions';
import { audioRoutes } from './routes/audio';

import { errorHandler } from './middleware/errorHandler';
import { SocketManager } from './services/SocketManager';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static audio files
app.use('/audio', express.static('public/audio'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/audio', audioRoutes);

// Initialize Socket Manager
const socketManager = new SocketManager(io);

// Error handling
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time battles`);
});