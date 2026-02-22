import { v4 as uuidv4 } from 'uuid';
import { Battle, Question } from '../types';
import { QuestionService } from './QuestionService';
import { EloService, BattlePerformance, BattleResult as EloBattleResult } from './EloService';

interface BattleSubmissionResult {
  battleFinished: boolean;
  nextQuestion?: Question;
  battleResults?: EloBattleResult;
}

export class BattleService {
  private battles: Map<string, Battle> = new Map();
  private questionService = new QuestionService();
  private eloService = new EloService();

  async createBattle(player1Id: string, player2Id: string): Promise<string> {
    const battleId = uuidv4();

    // Generate questions for the battle (using legacy method for now)
    const questions = await this.questionService.generateBattleQuestionsLegacy();

    const battle: Battle = {
      id: battleId,
      players: [player1Id, player2Id],
      status: 'waiting',
      questions,
      currentQuestionIndex: 0,
      playerAnswers: {
        [player1Id]: {
          answers: new Array(questions.length).fill(null),
          timeTaken: new Array(questions.length).fill(0)
        },
        [player2Id]: {
          answers: new Array(questions.length).fill(null),
          timeTaken: new Array(questions.length).fill(0)
        }
      },
      startTime: new Date(),
      eloChanges: {}
    };

    this.battles.set(battleId, battle);
    return battleId;
  }

  async submitAnswer(
    battleId: string,
    userId: string,
    questionIndex: number,
    answer: number,
    timeTaken: number
  ): Promise<BattleSubmissionResult> {
    const battle = this.battles.get(battleId);
    if (!battle) {
      throw new Error('Battle not found');
    }

    // Update player's answer
    battle.playerAnswers[userId].answers[questionIndex] = answer;
    battle.playerAnswers[userId].timeTaken[questionIndex] = timeTaken;

    // Check if both players have answered the current question
    const allAnswered = battle.players.every(playerId =>
      battle.playerAnswers[playerId].answers[questionIndex] !== null
    );

    if (allAnswered) {
      // Move to next question or finish battle
      const isLastQuestion = questionIndex >= battle.questions.length - 1;

      if (isLastQuestion) {
        // Battle finished
        battle.status = 'finished';
        battle.endTime = new Date();

        const results = this.calculateBattleResults(battle);
        return {
          battleFinished: true,
          battleResults: results
        };
      } else {
        // Move to next question
        battle.currentQuestionIndex = questionIndex + 1;
        return {
          battleFinished: false,
          nextQuestion: battle.questions[questionIndex + 1]
        };
      }
    }

    return { battleFinished: false };
  }

  private calculateBattleResults(battle: Battle): EloBattleResult {
    const [player1Id, player2Id] = battle.players;

    // Calculate performance for each player
    const player1Performance = this.calculatePlayerPerformance(battle, player1Id);
    const player2Performance = this.calculatePlayerPerformance(battle, player2Id);

    // Calculate battle duration
    const battleDuration = battle.endTime && battle.startTime
      ? (battle.endTime.getTime() - battle.startTime.getTime()) / 1000
      : 0;

    // Mock player ELOs (in a real implementation, these would come from user service)
    const player1Elo = 1200; // Would be fetched from user data
    const player2Elo = 1200; // Would be fetched from user data

    // Use ELO service to calculate comprehensive battle results
    const results = this.eloService.calculateBattleResult(
      player1Id,
      player2Id,
      player1Elo,
      player2Elo,
      player1Performance,
      player2Performance,
      battleDuration,
      'ranked'
    );

    // Update battle object with ELO changes
    battle.eloChanges = results.eloChanges;
    battle.winner = results.winner === 'player1' ? player1Id :
                   results.winner === 'player2' ? player2Id : undefined;

    return results;
  }

  private calculatePlayerPerformance(battle: Battle, playerId: string): BattlePerformance {
    let correctAnswers = 0;
    let totalTime = 0;
    let points = 0;

    battle.questions.forEach((question, index) => {
      const playerAnswer = battle.playerAnswers[playerId].answers[index];
      const timeTaken = battle.playerAnswers[playerId].timeTaken[index];

      totalTime += timeTaken;

      if (playerAnswer === question.correctAnswer) {
        correctAnswers++;
        // Award points based on speed (faster = more points)
        const speedBonus = Math.max(0, (question.timeLimit - timeTaken) / question.timeLimit);
        points += Math.round(question.points * (1 + speedBonus * 0.5)); // 50% speed bonus cap
      }
    });

    const totalQuestions = battle.questions.length;
    const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
    const averageTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;

    return {
      correctAnswers,
      totalQuestions,
      totalTime,
      points,
      averageTime,
      accuracy
    };
  }

  getBattle(battleId: string): Battle | undefined {
    return this.battles.get(battleId);
  }
}