import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  displayName: string;
  elo: number;
  level: number;
  experience: number;
  preferredLanguages: ProgrammingLanguage[];
  learningTrack: LearningTrack;
  createdAt: Date;
  updatedAt: Date;
  passwordHash?: string;
}

export type ProgrammingLanguage = 'python' | 'java' | 'cpp';

export type LearningTrack = 'beginner' | 'intermediate' | 'advanced';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type QuestionType = 'multiple-choice' | 'coding' | 'concept' | 'os';

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  language: ProgrammingLanguage;
  title: string;
  content: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  timeLimit: number;
  points: number;
}

export interface Battle {
  id: string;
  players: [string, string];
  status: 'waiting' | 'active' | 'finished';
  questions: Question[];
  currentQuestionIndex: number;
  playerAnswers: {
    [playerId: string]: {
      answers: (string | null)[];
      timeTaken: number[];
    };
  };
  startTime: Date;
  endTime?: Date;
  winner?: string;
  eloChanges: {
    [playerId: string]: number;
  };
}

export interface MatchmakingRequest {
  userId: string;
  elo: number;
  preferredLanguages: ProgrammingLanguage[];
  timestamp: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}