import { Router } from 'express';
import { MatchmakingController } from '../controllers/MatchmakingController';
import { MatchmakingService } from '../services/MatchmakingService';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Create singleton instance
const matchmakingService = new MatchmakingService();
const matchmakingController = new MatchmakingController(matchmakingService);

// All routes require authentication
router.use(authenticateToken);

// Queue management
router.post('/queue/join', matchmakingController.joinQueue);
router.post('/queue/leave', matchmakingController.leaveQueue);
router.get('/queue/status', matchmakingController.getQueueStatus);

// Match management
router.post('/matches/:matchId/accept', matchmakingController.acceptMatch);
router.post('/matches/:matchId/decline', matchmakingController.declineMatch);
router.get('/matches/:matchId', matchmakingController.getMatchDetails);

// Admin endpoints (TODO: Add admin middleware)
router.get('/admin/queue', matchmakingController.getQueueSnapshot);
router.post('/admin/force-match', matchmakingController.forceMatch);

export { router as matchmakingRoutes, matchmakingService };