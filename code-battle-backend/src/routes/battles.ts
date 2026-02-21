import { Router } from 'express';

export const battleRoutes = Router();

battleRoutes.get('/health', (req, res) => {
  res.json({ status: 'Battle routes working' });
});