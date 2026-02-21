import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, ProgrammingLanguage, QuestionDifficulty } from '../types';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized: boolean = false;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      this.isInitialized = true;
      console.log('🤖 Gemini AI service initialized');
    } else {
      console.warn('⚠️ GOOGLE_GEMINI_API_KEY not found. AI features will be disabled.');
    }
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  async generateQuestion(
    language: ProgrammingLanguage,
    difficulty: string,
    category: string,
    userWeakAreas?: string[]
  ): Promise<Question> {
    if (!this.isInitialized) {
      throw new Error('Gemini service not initialized');
    }

    const difficultyMap: Record<string, string> = {
      'beginner': 'very easy, suitable for someone just starting programming',
      'intermediate': 'moderate difficulty, requires basic programming knowledge',
      'advanced': 'challenging, requires solid programming experience',
      'expert': 'very difficult, suitable for experienced programmers'
    };

    const weakAreasContext = userWeakAreas?.length
      ? `Focus on these weak areas: ${userWeakAreas.join(', ')}. `
      : '';

    const prompt = `Generate a multiple choice programming question with the following requirements:

LANGUAGE: ${language}
DIFFICULTY: ${difficulty} (${difficultyMap[difficulty] || 'moderate'})
CATEGORY: ${category}
${weakAreasContext}

Create a JSON response with this exact structure:
{
  "question": "Clear, concise question text",
  "code": "Optional code snippet if needed (can be null)",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0,
  "explanation": "Detailed explanation of why the answer is correct",
  "points": 10,
  "timeLimit": 30,
  "tags": ["tag1", "tag2"]
}

Guidelines:
- Question should test practical ${language} knowledge
- Code should be realistic and relevant
- Options should be plausible but only one correct
- Explanation should be educational
- Points: beginner=10, intermediate=15, advanced=20, expert=25
- Time limit: 30-60 seconds based on complexity
- Include 2-3 relevant tags

Return only valid JSON, no additional text.`;

    try {
      if (!this.model) {
        throw new Error('Model not initialized');
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      const questionData = JSON.parse(jsonMatch[0]);

      // Generate unique ID and add required fields
      const question: Question = {
        id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        language: language as Question['language'],
        difficulty: difficulty as Question['difficulty'],
        category: category as Question['category'],
        question: questionData.question,
        code: questionData.code || undefined,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        points: questionData.points || this.getPointsForDifficulty(difficulty),
        timeLimit: questionData.timeLimit || 30,
        tags: [...(questionData.tags || []), 'ai-generated']
      };

      return question;
    } catch (error) {
      console.error('Error generating question with Gemini:', error);
      throw new Error('Failed to generate question');
    }
  }

  async analyzeCode(
    code: string,
    language: ProgrammingLanguage,
    context?: string
  ): Promise<{
    issues: Array<{
      line?: number;
      type: 'error' | 'warning' | 'suggestion';
      message: string;
      severity: 'high' | 'medium' | 'low';
    }>;
    suggestions: string[];
    complexity: 'low' | 'medium' | 'high';
    readability: number; // 1-10 score
  }> {
    if (!this.isInitialized) {
      throw new Error('Gemini service not initialized');
    }

    const contextInfo = context ? `Context: ${context}\n\n` : '';
    const prompt = `Analyze this ${language} code for issues, improvements, and quality:

${contextInfo}Code:
\`\`\`${language}
${code}
\`\`\`

Provide analysis in JSON format:
{
  "issues": [
    {
      "line": 5,
      "type": "error",
      "message": "Description of issue",
      "severity": "high"
    }
  ],
  "suggestions": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2"
  ],
  "complexity": "medium",
  "readability": 7
}

Focus on:
- Syntax errors and bugs
- Performance issues
- Code style and best practices
- Security concerns
- Readability improvements

Return only valid JSON.`;

    try {
      if (!this.model) {
        throw new Error('Model not initialized');
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from Gemini');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error analyzing code with Gemini:', error);
      throw new Error('Failed to analyze code');
    }
  }

  async generateHint(
    question: Question,
    userAnswer?: number,
    timeSpent?: number
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Gemini service not initialized');
    }

    const userContext = userAnswer !== undefined
      ? `User selected option ${userAnswer}: "${question.options[userAnswer]}". `
      : '';

    const timeContext = timeSpent
      ? `User has spent ${timeSpent} seconds on this question. `
      : '';

    const prompt = `Provide a helpful hint for this programming question:

Question: ${question.question}
${question.code ? `Code: ${question.code}` : ''}
Options: ${question.options.map((opt, i) => `${i}: ${opt}`).join(', ')}
Correct Answer: ${question.correctAnswer}

${userContext}${timeContext}

Generate a helpful hint that:
- Guides toward the correct answer without giving it away
- Explains relevant concepts
- Is encouraging and educational
- Doesn't exceed 100 words

Return only the hint text, no additional formatting.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating hint with Gemini:', error);
      return 'Consider the fundamental concepts related to this topic and think about common patterns in programming.';
    }
  }

  async generatePracticeSet(
    userWeakAreas: string[],
    language: ProgrammingLanguage,
    difficulty: string,
    count: number = 5
  ): Promise<Question[]> {
    const questions: Question[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const category = userWeakAreas[i % userWeakAreas.length];
        const question = await this.generateQuestion(
          language,
          difficulty,
          category,
          userWeakAreas
        );
        questions.push(question);

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error generating practice question ${i + 1}:`, error);
      }
    }

    return questions;
  }

  private getPointsForDifficulty(difficulty: string): number {
    switch (difficulty) {
      case 'beginner': return 10;
      case 'intermediate': return 15;
      case 'advanced': return 20;
      case 'expert': return 25;
      default: return 10;
    }
  }
}

export default GeminiService;