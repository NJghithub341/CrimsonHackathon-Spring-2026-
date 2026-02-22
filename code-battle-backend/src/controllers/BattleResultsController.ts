import { Request, Response } from 'express';
import { BattleService } from '../services/BattleService';
import { EloService } from '../services/EloService';
import { UserService } from '../services/UserService';
import { MockUserService } from '../services/MockUserService';
import FirebaseService from '../services/FirebaseService';

const battleService = new BattleService();
const eloService = new EloService();
const userService = new UserService();
const mockUserService = new MockUserService();

export class BattleResultsController {
  /**
   * Get battle results by battle ID
   * GET /api/battle-results/:battleId
   */
  static async getBattleResults(req: Request, res: Response) {
    try {
      const { battleId } = req.params;

      if (typeof battleId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid battle ID'
        });
      }

      const battle = battleService.getBattle(battleId);
      if (!battle) {
        return res.status(404).json({
          success: false,
          error: 'Battle not found'
        });
      }

      if (battle.status !== 'finished') {
        return res.status(400).json({
          success: false,
          error: 'Battle is not finished yet'
        });
      }

      // Get detailed results
      const results = {
        battleId: battle.id,
        status: battle.status,
        players: battle.players,
        winner: battle.winner,
        startTime: battle.startTime,
        endTime: battle.endTime,
        duration: battle.endTime && battle.startTime
          ? (battle.endTime.getTime() - battle.startTime.getTime()) / 1000
          : 0,
        questions: battle.questions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points,
          timeLimit: q.timeLimit
        })),
        playerAnswers: battle.playerAnswers,
        eloChanges: battle.eloChanges,
        totalQuestions: battle.questions.length
      };

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Error getting battle results:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get battle results'
      });
    }
  }

  /**
   * Get player performance analytics
   * GET /api/battle-results/:battleId/analytics/:playerId
   */
  static async getPlayerAnalytics(req: Request, res: Response) {
    try {
      const { battleId, playerId } = req.params;

      if (typeof battleId !== 'string' || typeof playerId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid battle ID or player ID'
        });
      }

      const battle = battleService.getBattle(battleId);
      if (!battle) {
        return res.status(404).json({
          success: false,
          error: 'Battle not found'
        });
      }

      if (!battle.players.includes(playerId as string)) {
        return res.status(404).json({
          success: false,
          error: 'Player not found in this battle'
        });
      }

      // Calculate detailed analytics
      const playerAnswers = battle.playerAnswers[playerId as string];
      let correctAnswers = 0;
      let totalTime = 0;
      let points = 0;
      let fastestAnswer = Infinity;
      let slowestAnswer = 0;
      let questionAnalytics: any[] = [];

      battle.questions.forEach((question, index) => {
        const playerAnswer = playerAnswers.answers[index];
        const timeTaken = playerAnswers.timeTaken[index];
        const isCorrect = playerAnswer === question.correctAnswer;

        if (isCorrect) {
          correctAnswers++;
          const speedBonus = Math.max(0, (question.timeLimit - timeTaken) / question.timeLimit);
          const questionPoints = Math.round(question.points * (1 + speedBonus * 0.5));
          points += questionPoints;
        }

        totalTime += timeTaken;
        fastestAnswer = Math.min(fastestAnswer, timeTaken);
        slowestAnswer = Math.max(slowestAnswer, timeTaken);

        questionAnalytics.push({
          questionIndex: index,
          questionId: question.id,
          difficulty: question.difficulty,
          category: question.category,
          language: question.language,
          playerAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          timeTaken,
          pointsEarned: isCorrect ? Math.round(question.points * (1 + Math.max(0, (question.timeLimit - timeTaken) / question.timeLimit) * 0.5)) : 0,
          timeLimit: question.timeLimit,
          efficiency: timeTaken > 0 ? (question.timeLimit / timeTaken) : 0
        });
      });

      const analytics = {
        playerId,
        battleId,
        performance: {
          correctAnswers,
          totalQuestions: battle.questions.length,
          accuracy: correctAnswers / battle.questions.length,
          totalTime,
          averageTime: totalTime / battle.questions.length,
          points,
          fastestAnswer: fastestAnswer === Infinity ? 0 : fastestAnswer,
          slowestAnswer
        },
        eloChange: battle.eloChanges[playerId] || 0,
        questionBreakdown: questionAnalytics,
        strengths: BattleResultsController.identifyStrengths(questionAnalytics),
        weaknesses: BattleResultsController.identifyWeaknesses(questionAnalytics),
        recommendations: BattleResultsController.generateRecommendations(questionAnalytics)
      };

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error getting player analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get player analytics'
      });
    }
  }

  /**
   * Get battle leaderboard/comparison
   * GET /api/battle-results/:battleId/leaderboard
   */
  static async getBattleLeaderboard(req: Request, res: Response) {
    try {
      const { battleId } = req.params;

      if (typeof battleId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid battle ID'
        });
      }

      const battle = battleService.getBattle(battleId);
      if (!battle) {
        return res.status(404).json({
          success: false,
          error: 'Battle not found'
        });
      }

      const leaderboard = battle.players.map(playerId => {
        const playerAnswers = battle.playerAnswers[playerId as string];
        let correctAnswers = 0;
        let totalTime = 0;
        let points = 0;

        battle.questions.forEach((question, index) => {
          const playerAnswer = playerAnswers.answers[index];
          const timeTaken = playerAnswers.timeTaken[index];

          if (playerAnswer === question.correctAnswer) {
            correctAnswers++;
            const speedBonus = Math.max(0, (question.timeLimit - timeTaken) / question.timeLimit);
            points += Math.round(question.points * (1 + speedBonus * 0.5));
          }

          totalTime += timeTaken;
        });

        return {
          playerId,
          rank: 0, // Will be calculated after sorting
          correctAnswers,
          accuracy: correctAnswers / battle.questions.length,
          totalTime,
          averageTime: totalTime / battle.questions.length,
          points,
          eloChange: battle.eloChanges[playerId] || 0,
          isWinner: battle.winner === playerId
        };
      });

      // Sort by points (primary), then by accuracy (secondary), then by time (tertiary)
      leaderboard.sort((a, b) => {
        if (a.points !== b.points) return b.points - a.points;
        if (a.accuracy !== b.accuracy) return b.accuracy - a.accuracy;
        return a.averageTime - b.averageTime;
      });

      // Assign ranks
      leaderboard.forEach((player, index) => {
        player.rank = index + 1;
      });

      res.json({
        success: true,
        data: {
          battleId,
          leaderboard,
          battleMetrics: {
            totalQuestions: battle.questions.length,
            averageAccuracy: leaderboard.reduce((sum, p) => sum + p.accuracy, 0) / leaderboard.length,
            averageTime: leaderboard.reduce((sum, p) => sum + p.averageTime, 0) / leaderboard.length,
            winner: battle.winner
          }
        }
      });
    } catch (error) {
      console.error('Error getting battle leaderboard:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get battle leaderboard'
      });
    }
  }

  /**
   * Update player ELO based on battle results
   * POST /api/battle-results/:battleId/update-elo
   */
  static async updatePlayerElo(req: Request, res: Response) {
    try {
      const { battleId } = req.params;
      const { playerId } = req.body;

      if (typeof battleId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid battle ID'
        });
      }

      if (!playerId) {
        return res.status(400).json({
          success: false,
          error: 'Player ID is required'
        });
      }

      const battle = battleService.getBattle(battleId);
      if (!battle) {
        return res.status(404).json({
          success: false,
          error: 'Battle not found'
        });
      }

      if (!battle.players.includes(playerId as string)) {
        return res.status(404).json({
          success: false,
          error: 'Player not found in this battle'
        });
      }

      const eloChange = battle.eloChanges[playerId];
      if (eloChange === undefined) {
        return res.status(400).json({
          success: false,
          error: 'No ELO change calculated for this player'
        });
      }

      // Get current user and update ELO
      let user;
      if (FirebaseService.isInitialized()) {
        user = await userService.getUserById(playerId);
      } else {
        user = await mockUserService.getUserById(playerId);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const newElo = Math.max(800, user.elo + eloChange); // Minimum ELO of 800
      const newRank = eloService.getEloRank(newElo);

      // Update user ELO
      if (FirebaseService.isInitialized()) {
        await userService.updateUserElo(playerId, eloChange);
      } else {
        await mockUserService.updateUser(playerId, { elo: newElo });
      }

      res.json({
        success: true,
        data: {
          playerId,
          battleId,
          oldElo: user.elo,
          newElo,
          eloChange,
          oldRank: eloService.getEloRank(user.elo),
          newRank
        }
      });
    } catch (error) {
      console.error('Error updating player ELO:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update player ELO'
      });
    }
  }

  // Helper methods for analytics
  private static identifyStrengths(questionAnalytics: any[]): string[] {
    const strengths: string[] = [];

    // Analyze by category
    const categoryPerformance = new Map<string, { correct: number, total: number }>();

    questionAnalytics.forEach(qa => {
      if (!categoryPerformance.has(qa.category)) {
        categoryPerformance.set(qa.category, { correct: 0, total: 0 });
      }
      const perf = categoryPerformance.get(qa.category)!;
      perf.total++;
      if (qa.isCorrect) perf.correct++;
    });

    categoryPerformance.forEach((perf, category) => {
      if (perf.total >= 2 && perf.correct / perf.total >= 0.8) {
        strengths.push(`Strong in ${category} (${Math.round(perf.correct / perf.total * 100)}% accuracy)`);
      }
    });

    // Speed analysis
    const fastAnswers = questionAnalytics.filter(qa => qa.efficiency > 1.2).length;
    if (fastAnswers >= questionAnalytics.length * 0.5) {
      strengths.push('Quick problem solving');
    }

    return strengths;
  }

  private static identifyWeaknesses(questionAnalytics: any[]): string[] {
    const weaknesses: string[] = [];

    // Analyze by category
    const categoryPerformance = new Map<string, { correct: number, total: number }>();

    questionAnalytics.forEach(qa => {
      if (!categoryPerformance.has(qa.category)) {
        categoryPerformance.set(qa.category, { correct: 0, total: 0 });
      }
      const perf = categoryPerformance.get(qa.category)!;
      perf.total++;
      if (qa.isCorrect) perf.correct++;
    });

    categoryPerformance.forEach((perf, category) => {
      if (perf.total >= 2 && perf.correct / perf.total <= 0.4) {
        weaknesses.push(`Needs improvement in ${category} (${Math.round(perf.correct / perf.total * 100)}% accuracy)`);
      }
    });

    // Time management analysis
    const slowAnswers = questionAnalytics.filter(qa => qa.timeTaken > qa.timeLimit * 0.8).length;
    if (slowAnswers >= questionAnalytics.length * 0.6) {
      weaknesses.push('Time management - consider practicing under time pressure');
    }

    return weaknesses;
  }

  private static generateRecommendations(questionAnalytics: any[]): string[] {
    const recommendations: string[] = [];

    // Get most common wrong categories
    const wrongCategories = questionAnalytics
      .filter(qa => !qa.isCorrect)
      .map(qa => qa.category);

    const categoryCounts = new Map<string, number>();
    wrongCategories.forEach(cat => {
      categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
    });

    if (categoryCounts.size > 0) {
      const mostProblematic = Array.from(categoryCounts.entries())
        .sort((a, b) => b[1] - a[1])[0];

      recommendations.push(`Focus practice on ${mostProblematic[0]} problems`);
    }

    // Speed recommendations
    const averageEfficiency = questionAnalytics.reduce((sum, qa) => sum + qa.efficiency, 0) / questionAnalytics.length;
    if (averageEfficiency < 0.8) {
      recommendations.push('Practice solving problems more quickly - try timed practice sessions');
    }

    // Accuracy recommendations
    const accuracy = questionAnalytics.filter(qa => qa.isCorrect).length / questionAnalytics.length;
    if (accuracy < 0.7) {
      recommendations.push('Review fundamentals - accuracy is more important than speed');
    }

    return recommendations;
  }
}