import { Router } from 'express';

export const userRoutes = Router();

userRoutes.get('/health', (req, res) => {
  res.json({ status: 'User routes working' });
});