import { Response } from 'express';
import { AuthRequest, MatchmakingRequest } from '../types';
import { MatchmakingService } from '../services/MatchmakingService';
import { AppError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

export class MatchmakingController {
  private matchmakingService: MatchmakingService;

  constructor(matchmakingService: MatchmakingService) {
    this.matchmakingService = matchmakingService;
  }

  joinQueue = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { preferredLanguages, maxWaitTime } = req.body;

      if (!preferredLanguages || !Array.isArray(preferredLanguages) || preferredLanguages.length === 0) {
        throw new AppError('Preferred languages are required', 400);
      }

      const matchmakingRequest: MatchmakingRequest = {
        id: uuidv4(),
        userId: req.user.id,
        displayName: req.user.displayName,
        elo: req.user.elo,
        preferredLanguages,
        timestamp: new Date(),
        maxWaitTime: maxWaitTime || 300, // 5 minutes default
      };

      this.matchmakingService.addToQueue(matchmakingRequest);

      res.json({
        success: true,
        message: 'Added to matchmaking queue',
        data: {
          queuePosition: this.matchmakingService.getQueuePosition(req.user.id),
          estimatedWaitTime: this.calculateEstimatedWaitTime(req.user.elo),
          queueStats: this.matchmakingService.getQueueStats(),
        },
      });
    } catch (error) {
      throw error;
    }
  };

  leaveQueue = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const removed = this.matchmakingService.removeFromQueue(req.user.id);

      res.json({
        success: true,
        message: removed ? 'Removed from queue' : 'Not in queue',
        data: {
          queueStats: this.matchmakingService.getQueueStats(),
        },
      });
    } catch (error) {
      throw error;
    }
  };

  getQueueStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const queuePosition = this.matchmakingService.getQueuePosition(req.user.id);
      const queueStats = this.matchmakingService.getQueueStats();

      res.json({
        success: true,
        data: {
          inQueue: queuePosition > 0,
          queuePosition: queuePosition || null,
          estimatedWaitTime: queuePosition > 0 ? this.calculateEstimatedWaitTime(req.user.elo) : null,
          queueStats,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  acceptMatch = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { matchId } = req.params;
      if (!matchId || typeof matchId !== 'string') {
        throw new AppError('Match ID is required', 400);
      }

      const success = this.matchmakingService.acceptMatch(matchId, req.user.id);
      if (!success) {
        throw new AppError('Unable to accept match', 400);
      }

      const match = this.matchmakingService.getMatch(matchId);

      res.json({
        success: true,
        message: 'Match accepted',
        data: {
          match,
          waitingForOtherPlayer: match?.acceptedBy.length === 1,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  declineMatch = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { matchId } = req.params;
      if (!matchId || typeof matchId !== 'string') {
        throw new AppError('Match ID is required', 400);
      }

      const success = this.matchmakingService.declineMatch(matchId, req.user.id);
      if (!success) {
        throw new AppError('Unable to decline match', 400);
      }

      res.json({
        success: true,
        message: 'Match declined, returned to queue',
        data: {
          queuePosition: this.matchmakingService.getQueuePosition(req.user.id),
          queueStats: this.matchmakingService.getQueueStats(),
        },
      });
    } catch (error) {
      throw error;
    }
  };

  getMatchDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { matchId } = req.params;
      if (!matchId || typeof matchId !== 'string') {
        throw new AppError('Match ID is required', 400);
      }

      const match = this.matchmakingService.getMatch(matchId);

      if (!match) {
        throw new AppError('Match not found', 404);
      }

      // Check if user is part of this match
      const isPlayer = match.player1.userId === req.user.id || match.player2.userId === req.user.id;
      if (!isPlayer) {
        throw new AppError('Access denied', 403);
      }

      res.json({
        success: true,
        data: {
          match,
          opponent: match.player1.userId === req.user.id ? match.player2 : match.player1,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  // Admin endpoints
  getQueueSnapshot = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // TODO: Add admin authorization check
      const snapshot = this.matchmakingService.getQueueSnapshot();

      res.json({
        success: true,
        data: snapshot,
      });
    } catch (error) {
      throw error;
    }
  };

  forceMatch = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // TODO: Add admin authorization check
      const { userId1, userId2 } = req.body;

      if (!userId1 || !userId2) {
        throw new AppError('Both user IDs are required', 400);
      }

      const match = this.matchmakingService.forceMatch(userId1, userId2);
      if (!match) {
        throw new AppError('Unable to create match - users not in queue', 400);
      }

      res.json({
        success: true,
        message: 'Match forced',
        data: { match },
      });
    } catch (error) {
      throw error;
    }
  };

  private calculateEstimatedWaitTime(userElo: number): number {
    const stats = this.matchmakingService.getQueueStats();

    // Base wait time calculation based on queue size and ELO distribution
    let estimatedWait = 30; // Base 30 seconds

    // Adjust based on queue size
    if (stats.totalPlayers < 5) {
      estimatedWait += 60; // Add 1 minute for small queue
    } else if (stats.totalPlayers < 10) {
      estimatedWait += 30; // Add 30 seconds for medium queue
    }

    // Adjust based on ELO rarity
    const eloDistribution = stats.eloDistribution;
    let userTier: keyof typeof eloDistribution;

    if (userElo < 1000) userTier = 'bronze';
    else if (userElo < 1200) userTier = 'silver';
    else if (userElo < 1400) userTier = 'gold';
    else if (userElo < 1600) userTier = 'platinum';
    else if (userElo < 1800) userTier = 'diamond';
    else userTier = 'master';

    const tierPlayers = eloDistribution[userTier];
    if (tierPlayers < 2) {
      estimatedWait += 90; // Add 1.5 minutes for rare ELO range
    } else if (tierPlayers < 4) {
      estimatedWait += 45; // Add 45 seconds for uncommon ELO range
    }

    return Math.min(estimatedWait, 300); // Cap at 5 minutes
  }
}