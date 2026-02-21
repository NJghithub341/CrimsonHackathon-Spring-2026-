import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Question {
  id: string;
  language: 'python' | 'java' | 'cpp';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'syntax' | 'algorithms' | 'data_structures' | 'oop' | 'debugging' | 'optimization';
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  timeLimit: number;
  tags: string[];
}

export interface BattleQuestionSet {
  id: string;
  questions: Question[];
  totalPossiblePoints: number;
  averageDifficulty: string;
  languages: string[];
}

export interface QuestionFilters {
  difficulty?: Question['difficulty'];
  language?: Question['language'];
  category?: Question['category'];
  limit?: number;
}

export interface ValidationResult {
  correct: boolean;
  points: number;
  explanation: string;
  correctAnswer: number;
}

export class QuestionService {
  private static instance: QuestionService;

  public static getInstance(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService();
    }
    return QuestionService.instance;
  }

  /**
   * Get questions with optional filters
   */
  async getQuestions(filters: QuestionFilters = {}): Promise<Question[]> {
    try {
      const params = new URLSearchParams();

      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.language) params.append('language', filters.language);
      if (filters.category) params.append('category', filters.category);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await axios.get(`${API_BASE_URL}/questions?${params.toString()}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  /**
   * Get a specific question by ID
   */
  async getQuestionById(id: string): Promise<Question> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/${id}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Question not found');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  }

  /**
   * Generate battle questions based on player ELOs
   */
  async generateBattleQuestions(
    playerElo: number,
    opponentElo: number,
    count: number = 10
  ): Promise<BattleQuestionSet> {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_BASE_URL}/questions/battle`,
        {
          playerElo,
          opponentElo,
          count
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to generate battle questions');
      }
    } catch (error) {
      console.error('Error generating battle questions:', error);
      throw error;
    }
  }

  /**
   * Validate an answer and get result
   */
  async validateAnswer(questionId: string, answerIndex: number): Promise<ValidationResult> {
    try {
      const response = await axios.post(`${API_BASE_URL}/questions/${questionId}/answer`, {
        answer: answerIndex
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to validate answer');
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      throw error;
    }
  }

  /**
   * Get question database statistics
   */
  async getQuestionStats(): Promise<{
    total: number;
    byDifficulty: Record<string, number>;
    byLanguage: Record<string, number>;
    byCategory: Record<string, number>;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/stats`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch question stats');
      }
    } catch (error) {
      console.error('Error fetching question stats:', error);
      throw error;
    }
  }

  /**
   * Get practice questions for weak areas
   */
  async getPracticeQuestions(
    categories: Question['category'][],
    difficulty: Question['difficulty'],
    count: number = 5
  ): Promise<Question[]> {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_BASE_URL}/questions/practice`,
        {
          categories,
          difficulty,
          count
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to get practice questions');
      }
    } catch (error) {
      console.error('Error getting practice questions:', error);
      throw error;
    }
  }

  /**
   * Get recommended languages for user
   */
  async getRecommendedLanguages(preferences: string[]): Promise<Question['language'][]> {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${API_BASE_URL}/questions/recommended-languages`,
        {
          preferences
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to get recommended languages');
      }
    } catch (error) {
      console.error('Error getting recommended languages:', error);
      throw error;
    }
  }

  /**
   * Get questions by language (legacy method for backward compatibility)
   */
  async getQuestionsByLanguage(language: Question['language']): Promise<Question[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/language/${language}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch questions by language');
      }
    } catch (error) {
      console.error('Error fetching questions by language:', error);
      throw error;
    }
  }

  /**
   * Get questions by difficulty (legacy method for backward compatibility)
   */
  async getQuestionsByDifficulty(difficulty: Question['difficulty']): Promise<Question[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions/difficulty/${difficulty}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch questions by difficulty');
      }
    } catch (error) {
      console.error('Error fetching questions by difficulty:', error);
      throw error;
    }
  }

  /**
   * Convert legacy question format to new format
   */
  convertLegacyQuestion(legacyQuestion: any): Question {
    return {
      id: legacyQuestion.id,
      language: legacyQuestion.language || 'python',
      difficulty: legacyQuestion.difficulty === 'easy' ? 'beginner' :
                  legacyQuestion.difficulty === 'medium' ? 'intermediate' :
                  legacyQuestion.difficulty === 'hard' ? 'advanced' : 'expert',
      category: legacyQuestion.category || 'algorithms',
      question: legacyQuestion.question || legacyQuestion.content,
      code: legacyQuestion.code,
      options: legacyQuestion.options || [],
      correctAnswer: typeof legacyQuestion.correctAnswer === 'string'
        ? legacyQuestion.options?.indexOf(legacyQuestion.correctAnswer) || 0
        : legacyQuestion.correctAnswer || 0,
      explanation: legacyQuestion.explanation || '',
      points: legacyQuestion.points || 10,
      timeLimit: legacyQuestion.timeLimit || 30,
      tags: legacyQuestion.tags || []
    };
  }
}