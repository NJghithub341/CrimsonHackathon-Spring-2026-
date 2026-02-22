import { Router } from 'express';
import { BattleResultsController } from '../controllers/BattleResultsController';
import { authenticateToken } from '../middleware/auth';

export const battleResultsRoutes = Router();

// Public routes
battleResultsRoutes.get('/health', (req, res) => {
  res.json({ status: 'Battle results routes working' });
});

// Protected routes (require authentication)
battleResultsRoutes.use(authenticateToken);

// Get battle results by battle ID
battleResultsRoutes.get('/:battleId', BattleResultsController.getBattleResults);

// Get player analytics for specific battle
battleResultsRoutes.get('/:battleId/analytics/:playerId', BattleResultsController.getPlayerAnalytics);

// Get battle leaderboard/comparison
battleResultsRoutes.get('/:battleId/leaderboard', BattleResultsController.getBattleLeaderboard);

// Update player ELO based on battle results
battleResultsRoutes.post('/:battleId/update-elo', BattleResultsController.updatePlayerElo);