import { v4 as uuidv4 } from 'uuid';
import { Battle, Question } from '../types';
import { QuestionService } from './QuestionService';
import { EloService } from './EloService';

interface BattleResult {
  battleFinished: boolean;
  nextQuestion?: Question;
  battleResults?: any;
}

export class BattleService {
  private battles: Map<string, Battle> = new Map();
  private questionService = new QuestionService();
  private eloService = new EloService();

  async createBattle(player1Id: string, player2Id: string): Promise<string> {
    const battleId = uuidv4();

    // Generate questions for the battle
    const questions = await this.questionService.generateBattleQuestions();

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
    answer: string,
    timeTaken: number
  ): Promise<BattleResult> {
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

  private calculateBattleResults(battle: Battle) {
    const results: any = {
      battleId: battle.id,
      players: {},
      winner: null,
      eloChanges: {}
    };

    // Calculate scores for each player
    battle.players.forEach(playerId => {
      let correctAnswers = 0;
      let totalTime = 0;
      let points = 0;

      battle.questions.forEach((question, index) => {
        const playerAnswer = battle.playerAnswers[playerId].answers[index];
        const timeTaken = battle.playerAnswers[playerId].timeTaken[index];

        if (playerAnswer === question.correctAnswer) {
          correctAnswers++;
          // Award points based on speed (faster = more points)
          const speedBonus = Math.max(0, question.timeLimit - timeTaken) / question.timeLimit;
          points += question.points * (1 + speedBonus);
        }

        totalTime += timeTaken;
      });

      results.players[playerId] = {
        correctAnswers,
        totalTime,
        points: Math.round(points)
      };
    });

    // Determine winner
    const [player1, player2] = battle.players;
    const player1Score = results.players[player1];
    const player2Score = results.players[player2];

    if (player1Score.points > player2Score.points) {
      results.winner = player1;
    } else if (player2Score.points > player1Score.points) {
      results.winner = player2;
    } else {
      // Tie - winner is determined by total time (faster wins)
      results.winner = player1Score.totalTime < player2Score.totalTime ? player1 : player2;
    }

    // Calculate ELO changes (placeholder - would integrate with user service)
    const eloChange = 15; // Simplified ELO change
    results.eloChanges[results.winner] = eloChange;
    results.eloChanges[results.winner === player1 ? player2 : player1] = -eloChange;

    battle.eloChanges = results.eloChanges;

    return results;
  }

  getBattle(battleId: string): Battle | undefined {
    return this.battles.get(battleId);
  }
}