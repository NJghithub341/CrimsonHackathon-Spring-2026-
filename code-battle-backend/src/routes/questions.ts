import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController.js';
import { authenticateToken } from '../middleware/auth.js';

export const questionRoutes = Router();

// Public routes
questionRoutes.get('/health', (req, res) => {
  res.json({ status: 'Question routes working' });
});

// Get question statistics
questionRoutes.get('/stats', QuestionController.getQuestionStats);

// Get questions with filters
questionRoutes.get('/', QuestionController.getQuestions);

// Get specific question by ID
questionRoutes.get('/:id', QuestionController.getQuestionById);

// Validate answer for a question
questionRoutes.post('/:id/answer', QuestionController.validateAnswer);

// Legacy routes for backward compatibility
questionRoutes.get('/language/:language', QuestionController.getQuestionsByLanguage);
questionRoutes.get('/difficulty/:difficulty', QuestionController.getQuestionsByDifficulty);

// Protected routes (require authentication)
questionRoutes.use(authenticateToken);

// Generate battle questions
questionRoutes.post('/battle', QuestionController.generateBattleQuestions);

// Get practice questions
questionRoutes.post('/practice', QuestionController.getPracticeQuestions);

// Get recommended languages
questionRoutes.post('/recommended-languages', QuestionController.getRecommendedLanguages);