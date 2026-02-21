import { Request, Response } from 'express';
import { QuestionService } from '../services/QuestionService.js';
import { authenticateToken } from '../middleware/auth.js';

const questionService = QuestionService.getInstance();

export class QuestionController {

  /**
   * Get questions with optional filters
   * GET /api/questions?difficulty=beginner&language=python&category=syntax&limit=5
   */
  static async getQuestions(req: Request, res: Response) {
    try {
      const { difficulty, language, category, limit } = req.query;

      const filters: any = {};

      if (difficulty) filters.difficulty = difficulty as string;
      if (language) filters.language = language as string;
      if (category) filters.category = category as string;

      const limitNumber = limit ? parseInt(limit as string) : undefined;

      const questions = questionService.getQuestions(filters, limitNumber);

      res.json({
        success: true,
        data: questions,
        count: questions.length
      });
    } catch (error) {
      console.error('Error getting questions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get questions'
      });
    }
  }

  /**
   * Get a specific question by ID
   * GET /api/questions/:id
   */
  static async getQuestionById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid question ID'
        });
      }

      const question = questionService.getQuestion(id);

      if (!question) {
        return res.status(404).json({
          success: false,
          error: 'Question not found'
        });
      }

      res.json({
        success: true,
        data: question
      });
    } catch (error) {
      console.error('Error getting question:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get question'
      });
    }
  }

  /**
   * Generate battle questions based on player ELOs
   * POST /api/questions/battle
   * Body: { playerElo: number, opponentElo: number, count?: number }
   */
  static async generateBattleQuestions(req: Request, res: Response) {
    try {
      const { playerElo, opponentElo, count = 10 } = req.body;

      if (!playerElo || !opponentElo) {
        return res.status(400).json({
          success: false,
          error: 'Player and opponent ELO required'
        });
      }

      const battleQuestionSet = questionService.generateBattleQuestions(
        playerElo,
        opponentElo,
        count
      );

      res.json({
        success: true,
        data: battleQuestionSet
      });
    } catch (error) {
      console.error('Error generating battle questions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate battle questions'
      });
    }
  }

  /**
   * Validate answer and get result
   * POST /api/questions/:id/answer
   * Body: { answer: number }
   */
  static async validateAnswer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { answer } = req.body;

      if (answer === undefined || answer === null) {
        return res.status(400).json({
          success: false,
          error: 'Answer index required'
        });
      }

      const result = questionService.validateAnswer(id as string, answer);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error validating answer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to validate answer'
      });
    }
  }

  /**
   * Get question database statistics
   * GET /api/questions/stats
   */
  static async getQuestionStats(req: Request, res: Response) {
    try {
      const stats = questionService.getQuestionStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting question stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get question stats'
      });
    }
  }

  /**
   * Get practice questions for weak areas
   * POST /api/questions/practice
   * Body: { categories: string[], difficulty: string, count?: number }
   */
  static async getPracticeQuestions(req: Request, res: Response) {
    try {
      const { categories, difficulty, count = 5 } = req.body;

      if (!categories || !Array.isArray(categories) || !difficulty) {
        return res.status(400).json({
          success: false,
          error: 'Categories array and difficulty required'
        });
      }

      const questions = questionService.getPracticeQuestions(
        categories,
        difficulty,
        count
      );

      res.json({
        success: true,
        data: questions,
        count: questions.length
      });
    } catch (error) {
      console.error('Error getting practice questions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get practice questions'
      });
    }
  }

  /**
   * Get recommended languages for user
   * POST /api/questions/recommended-languages
   * Body: { preferences: string[] }
   */
  static async getRecommendedLanguages(req: Request, res: Response) {
    try {
      const { preferences = [] } = req.body;

      const recommendations = questionService.getRecommendedLanguages(preferences);

      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error('Error getting recommended languages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recommended languages'
      });
    }
  }

  /**
   * Get questions by language (legacy endpoint)
   * GET /api/questions/language/:language
   */
  static async getQuestionsByLanguage(req: Request, res: Response) {
    try {
      const { language } = req.params;

      const questions = questionService.getQuestions({ language: language as any });

      res.json({
        success: true,
        data: questions,
        count: questions.length
      });
    } catch (error) {
      console.error('Error getting questions by language:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get questions by language'
      });
    }
  }

  /**
   * Get questions by difficulty (legacy endpoint)
   * GET /api/questions/difficulty/:difficulty
   */
  static async getQuestionsByDifficulty(req: Request, res: Response) {
    try {
      const { difficulty } = req.params;

      const questions = questionService.getQuestions({ difficulty: difficulty as any });

      res.json({
        success: true,
        data: questions,
        count: questions.length
      });
    } catch (error) {
      console.error('Error getting questions by difficulty:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get questions by difficulty'
      });
    }
  }

  /**
   * Generate AI-powered question
   * POST /api/questions/ai-generate
   * Body: { language: string, difficulty: string, category?: string }
   */
  static async generateAIQuestion(req: Request, res: Response) {
    try {
      const { language, difficulty, category } = req.body;

      if (!language || !difficulty) {
        return res.status(400).json({
          success: false,
          error: 'Language and difficulty are required'
        });
      }

      const question = await questionService.generateQuestion(language, difficulty, category);

      res.json({
        success: true,
        data: question
      });
    } catch (error) {
      console.error('Error generating AI question:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate AI question'
      });
    }
  }

  /**
   * Get AI-powered hint for a question
   * POST /api/questions/:id/hint
   * Body: { userAnswer?: number, timeSpent?: number }
   */
  static async getQuestionHint(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userAnswer, timeSpent } = req.body;

      const hint = await questionService.generateHint(id as string, userAnswer, timeSpent);

      res.json({
        success: true,
        data: { hint }
      });
    } catch (error) {
      console.error('Error getting question hint:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get question hint'
      });
    }
  }

  /**
   * Analyze user code with AI
   * POST /api/questions/analyze-code
   * Body: { code: string, language: string, context?: string }
   */
  static async analyzeCode(req: Request, res: Response) {
    try {
      const { code, language, context } = req.body;

      if (!code || !language) {
        return res.status(400).json({
          success: false,
          error: 'Code and language are required'
        });
      }

      const analysis = await questionService.analyzeUserCode(code, language, context);

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      console.error('Error analyzing code:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze code'
      });
    }
  }

  /**
   * Generate adaptive questions based on user's weak areas
   * POST /api/questions/adaptive
   * Body: { weakAreas: string[], language: string, difficulty: string, count?: number }
   */
  static async generateAdaptiveQuestions(req: Request, res: Response) {
    try {
      const { weakAreas, language, difficulty, count = 5 } = req.body;

      if (!weakAreas || !Array.isArray(weakAreas) || !language || !difficulty) {
        return res.status(400).json({
          success: false,
          error: 'Weak areas array, language, and difficulty are required'
        });
      }

      const questions = await questionService.generateAdaptiveQuestions(
        weakAreas,
        language,
        difficulty,
        count
      );

      res.json({
        success: true,
        data: questions,
        count: questions.length
      });
    } catch (error) {
      console.error('Error generating adaptive questions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate adaptive questions'
      });
    }
  }
}