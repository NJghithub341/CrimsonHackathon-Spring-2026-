import { Router } from 'express';

export const questionRoutes = Router();

questionRoutes.get('/health', (req, res) => {
  res.json({ status: 'Question routes working' });
});