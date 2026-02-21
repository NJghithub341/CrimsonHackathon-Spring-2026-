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
  language: 'python' | 'java' | 'cpp';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'syntax' | 'algorithms' | 'data_structures' | 'oop' | 'debugging' | 'optimization';
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  points: number;
  timeLimit: number; // seconds
  tags: string[];
}

export interface Battle {
  id: string;
  players: [string, string];
  status: 'waiting' | 'active' | 'finished';
  questions: Question[];
  currentQuestionIndex: number;
  playerAnswers: {
    [playerId: string]: {
      answers: (number | null)[];
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
  id: string;
  userId: string;
  displayName: string;
  elo: number;
  preferredLanguages: ProgrammingLanguage[];
  timestamp: Date;
  maxWaitTime: number;
  socketId?: string;
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