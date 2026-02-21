import { Router } from 'express';

export const matchmakingRoutes = Router();

matchmakingRoutes.get('/health', (req, res) => {
  res.json({ status: 'Matchmaking routes working' });
});