import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import FirebaseService from '../services/FirebaseService';
import { UserService } from '../services/UserService';
import { MockUserService } from '../services/MockUserService';
import { AuthRequest, JWTPayload } from '../types';
import { AppError } from './errorHandler';

const userService = new UserService();
const mockUserService = new MockUserService();

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError('JWT_SECRET not configured', 500);
    }
    const decoded = jwt.verify(token, secret) as JWTPayload;

    // Get user from database (try Firebase first, then mock)
    let user;
    if (FirebaseService.isInitialized()) {
      user = await userService.getUserById(decoded.userId);
    } else {
      user = await mockUserService.getUserById(decoded.userId);
    }

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const authenticateFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError('Access token required', 401);
    }

    // Verify Firebase ID token
    const decodedToken = await FirebaseService.verifyIdToken(token);

    // Get user from database
    const user = await userService.getUserById(decodedToken.uid);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.message === 'Invalid token') {
      next(new AppError('Invalid Firebase token', 401));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) return;
        const decoded = jwt.verify(token, secret) as JWTPayload;
        let user;
        if (FirebaseService.isInitialized()) {
          user = await userService.getUserById(decoded.userId);
        } else {
          user = await mockUserService.getUserById(decoded.userId);
        }
        if (user) {
          req.user = user;
        }
      } catch (error) {
        // Ignore token errors in optional auth
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const generateJWT = (userId: string, email: string): string => {
  const payload: JWTPayload = {
    userId,
    email,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as SignOptions);
};