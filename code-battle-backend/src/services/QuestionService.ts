import { Question, QUESTIONS, getRandomQuestions, getQuestionById, getDifficultyPoints } from '../data/questions.js';
import { QuestionDifficulty, QuestionType, ProgrammingLanguage } from '../types';

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
  excludeIds?: string[];
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
   * Generate a set of questions for a battle based on user skill levels
   */
  public generateBattleQuestions(
    playerElo: number,
    opponentElo: number,
    count: number = 10
  ): BattleQuestionSet {
    const avgElo = (playerElo + opponentElo) / 2;
    const difficulty = this.elotoDifficulty(avgElo);

    // Mix of difficulties based on ELO
    const questionMix = this.getQuestionMixForElo(avgElo, count);

    let selectedQuestions: Question[] = [];

    // Get questions for each difficulty level in the mix
    for (const [diff, qty] of Object.entries(questionMix)) {
      if (qty > 0) {
        const questions = getRandomQuestions(qty, {
          difficulty: diff as Question['difficulty']
        });
        selectedQuestions.push(...questions);
      }
    }

    // If we don't have enough questions, fill with any difficulty
    if (selectedQuestions.length < count) {
      const needed = count - selectedQuestions.length;
      const excludeIds = selectedQuestions.map(q => q.id);
      const additional = getRandomQuestions(needed);
      selectedQuestions.push(...additional);
    }

    // Shuffle the final set
    selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random());
    selectedQuestions = selectedQuestions.slice(0, count);

    const totalPoints = selectedQuestions.reduce((sum, q) => sum + q.points, 0);
    const languages = [...new Set(selectedQuestions.map(q => q.language))];

    return {
      id: this.generateBattleId(),
      questions: selectedQuestions,
      totalPossiblePoints: totalPoints,
      averageDifficulty: difficulty,
      languages: languages
    };
  }

  /**
   * Legacy method for backward compatibility
   */
  async generateBattleQuestions(): Promise<Question[]> {
    const questionSet = this.generateBattleQuestions(1200, 1200, 10);
    return questionSet.questions;
  }

  /**
   * Get questions filtered by various criteria
   */
  public getQuestions(filters: QuestionFilters = {}, limit?: number): Question[] {
    let questions = [...QUESTIONS];

    if (filters.difficulty) {
      questions = questions.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters.language) {
      questions = questions.filter(q => q.language === filters.language);
    }

    if (filters.category) {
      questions = questions.filter(q => q.category === filters.category);
    }

    if (filters.excludeIds && filters.excludeIds.length > 0) {
      questions = questions.filter(q => !filters.excludeIds!.includes(q.id));
    }

    if (limit) {
      questions = questions.slice(0, limit);
    }

    return questions;
  }

  /**
   * Get a specific question by ID
   */
  public getQuestion(id: string): Question | null {
    return getQuestionById(id) || null;
  }

  async getQuestionsByLanguage(language: ProgrammingLanguage): Promise<Question[]> {
    return this.getQuestions({ language: language as Question['language'] });
  }

  async getQuestionsByDifficulty(difficulty: QuestionDifficulty): Promise<Question[]> {
    return this.getQuestions({ difficulty: difficulty as Question['difficulty'] });
  }

  async getQuestionById(id: string): Promise<Question | null> {
    return this.getQuestion(id);
  }

  /**
   * Validate answer and calculate points
   */
  public validateAnswer(questionId: string, answerIndex: number): {
    correct: boolean;
    points: number;
    explanation: string;
    correctAnswer: number;
  } {
    const question = this.getQuestion(questionId);

    if (!question) {
      return {
        correct: false,
        points: 0,
        explanation: 'Question not found',
        correctAnswer: -1
      };
    }

    const correct = answerIndex === question.correctAnswer;

    return {
      correct,
      points: correct ? question.points : 0,
      explanation: question.explanation,
      correctAnswer: question.correctAnswer
    };
  }

  /**
   * Get statistics about the question database
   */
  public getQuestionStats(): {
    total: number;
    byDifficulty: Record<string, number>;
    byLanguage: Record<string, number>;
    byCategory: Record<string, number>;
  } {
    const stats = {
      total: QUESTIONS.length,
      byDifficulty: {} as Record<string, number>,
      byLanguage: {} as Record<string, number>,
      byCategory: {} as Record<string, number>
    };

    QUESTIONS.forEach(q => {
      // Count by difficulty
      stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;

      // Count by language
      stats.byLanguage[q.language] = (stats.byLanguage[q.language] || 0) + 1;

      // Count by category
      stats.byCategory[q.category] = (stats.byCategory[q.category] || 0) + 1;
    });

    return stats;
  }

  /**
   * Convert ELO rating to difficulty level
   */
  private elotoDifficulty(elo: number): Question['difficulty'] {
    if (elo < 1200) return 'beginner';
    if (elo < 1500) return 'intermediate';
    if (elo < 1800) return 'advanced';
    return 'expert';
  }

  /**
   * Get question difficulty mix based on ELO
   */
  private getQuestionMixForElo(avgElo: number, totalQuestions: number): Record<string, number> {
    const mix: Record<string, number> = {
      'beginner': 0,
      'intermediate': 0,
      'advanced': 0,
      'expert': 0
    };

    if (avgElo < 1000) {
      // New players: mostly beginner with some intermediate
      mix['beginner'] = Math.floor(totalQuestions * 0.8);
      mix['intermediate'] = Math.floor(totalQuestions * 0.2);
    } else if (avgElo < 1200) {
      // Bronze: mix of beginner and intermediate
      mix['beginner'] = Math.floor(totalQuestions * 0.6);
      mix['intermediate'] = Math.floor(totalQuestions * 0.4);
    } else if (avgElo < 1500) {
      // Silver: mostly intermediate with some beginner and advanced
      mix['beginner'] = Math.floor(totalQuestions * 0.2);
      mix['intermediate'] = Math.floor(totalQuestions * 0.6);
      mix['advanced'] = Math.floor(totalQuestions * 0.2);
    } else if (avgElo < 1800) {
      // Gold: intermediate and advanced
      mix['intermediate'] = Math.floor(totalQuestions * 0.4);
      mix['advanced'] = Math.floor(totalQuestions * 0.6);
    } else if (avgElo < 2000) {
      // Platinum: mostly advanced with some expert
      mix['advanced'] = Math.floor(totalQuestions * 0.7);
      mix['expert'] = Math.floor(totalQuestions * 0.3);
    } else {
      // Diamond/Master: advanced and expert
      mix['advanced'] = Math.floor(totalQuestions * 0.4);
      mix['expert'] = Math.floor(totalQuestions * 0.6);
    }

    // Ensure we have the right total
    const currentTotal = Object.values(mix).reduce((sum, count) => sum + count, 0);
    if (currentTotal < totalQuestions) {
      // Add remaining questions to the most appropriate difficulty
      const mainDifficulty = this.elotoDifficulty(avgElo);
      mix[mainDifficulty] += totalQuestions - currentTotal;
    }

    return mix;
  }

  /**
   * Generate a unique battle ID
   */
  private generateBattleId(): string {
    return `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get recommended languages based on user preferences
   */
  public getRecommendedLanguages(userPreferences: string[]): Question['language'][] {
    const available: Question['language'][] = ['python', 'java', 'cpp'];

    // Return user preferences that are available
    const recommended = userPreferences.filter(lang =>
      available.includes(lang as Question['language'])
    ) as Question['language'][];

    // If no preferences match, return all available
    return recommended.length > 0 ? recommended : available;
  }

  /**
   * Get practice questions for specific weak areas
   */
  public getPracticeQuestions(
    weakCategories: Question['category'][],
    userLevel: Question['difficulty'],
    count: number = 5
  ): Question[] {
    const questions: Question[] = [];

    for (const category of weakCategories) {
      const categoryQuestions = getRandomQuestions(
        Math.ceil(count / weakCategories.length),
        {
          category,
          difficulty: userLevel
        }
      );
      questions.push(...categoryQuestions);
    }

    return questions.slice(0, count);
  }

  // This would integrate with Google Gemini for generating questions
  async generateQuestion(
    language: ProgrammingLanguage,
    difficulty: QuestionDifficulty,
    type: QuestionType
  ): Promise<Question> {
    // Placeholder - would use AI to generate questions
    return {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      language: language as Question['language'],
      difficulty: difficulty as Question['difficulty'],
      category: 'algorithms' as Question['category'],
      question: 'This would be generated by AI',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
      explanation: 'AI generated explanation',
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
      timeLimit: 30,
      tags: ['ai-generated']
    };
  }
}