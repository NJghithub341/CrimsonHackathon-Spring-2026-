import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import FirebaseService from '../services/FirebaseService';
import { UserService } from '../services/UserService';
import { MockUserService } from '../services/MockUserService';
import { generateJWT } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AuthController {
  private userService = new UserService();
  private mockUserService = new MockUserService();

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, displayName, questionnaire } = req.body;

      // Validate input
      if (!email || !password || !displayName) {
        throw new AppError('Email, password, and display name are required', 400);
      }

      if (password.length < 6) {
        throw new AppError('Password must be at least 6 characters', 400);
      }

      let user;
      const userId = uuidv4();

      if (FirebaseService.isInitialized()) {
        // Use Firebase when available
        try {
          const firebaseUser = await FirebaseService.createUser(email, password, displayName);
          user = await this.userService.createUser(
            firebaseUser.uid,
            email,
            displayName,
            questionnaire || {}
          );
        } catch (error: any) {
          console.error('Firebase registration error:', error);
          throw new AppError(error.message.includes('email-already-exists') ? 'Email already exists' : 'Registration failed', 400);
        }
      } else {
        // Use mock service for testing when Firebase is not configured
        console.log('Using mock user service - Firebase not configured');

        // Check if email already exists in mock storage
        const existingUser = await this.mockUserService.getUserByEmail(email);
        if (existingUser) {
          throw new AppError('Email already exists', 409);
        }

        user = await this.mockUserService.createUser(
          userId,
          email,
          displayName,
          questionnaire || {}
        );
      }

      // Generate JWT token
      const token = generateJWT(user.id, user.email);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          elo: user.elo,
          level: user.level,
          experience: user.experience,
          preferredLanguages: user.preferredLanguages,
          learningTrack: user.learningTrack,
        },
        token,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      // For Firebase Auth, we'll use a different approach
      // Since Firebase handles authentication, we need to verify the user exists
      // This is a simplified version - in production, you'd use Firebase client SDK on frontend

      // Get user by email (this is a workaround - normally done on client side)
      const firebaseUser = await FirebaseService.getAuth().getUserByEmail(email);

      if (!firebaseUser) {
        throw new AppError('Invalid credentials', 401);
      }

      // Get user profile from Firestore
      const user = await this.userService.getUserById(firebaseUser.uid);

      if (!user) {
        throw new AppError('User profile not found', 404);
      }

      // Generate JWT token
      const token = generateJWT(user.id, user.email);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          elo: user.elo,
          level: user.level,
          experience: user.experience,
          preferredLanguages: user.preferredLanguages,
          learningTrack: user.learningTrack,
        },
        token,
      });
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.message.includes('user-not-found')) {
        throw new AppError('Invalid credentials', 401);
      }

      throw error;
    }
  };

  loginWithFirebaseToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        throw new AppError('Firebase ID token is required', 400);
      }

      // Verify Firebase ID token
      const decodedToken = await FirebaseService.verifyIdToken(idToken);

      // Get or create user profile
      let user = await this.userService.getUserById(decodedToken.uid);

      if (!user) {
        // Create user profile if it doesn't exist
        user = await this.userService.createUser(
          decodedToken.uid,
          decodedToken.email || '',
          decodedToken.name || 'Anonymous',
          {}
        );
      }

      // Generate JWT token
      const token = generateJWT(user.id, user.email);

      res.json({
        success: true,
        message: 'Firebase login successful',
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          elo: user.elo,
          level: user.level,
          experience: user.experience,
          preferredLanguages: user.preferredLanguages,
          learningTrack: user.learningTrack,
        },
        token,
      });
    } catch (error: any) {
      console.error('Firebase login error:', error);
      throw new AppError('Invalid Firebase token', 401);
    }
  };

  getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      res.json({
        success: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          displayName: req.user.displayName,
          elo: req.user.elo,
          level: req.user.level,
          experience: req.user.experience,
          preferredLanguages: req.user.preferredLanguages,
          learningTrack: req.user.learningTrack,
        },
      });
    } catch (error) {
      console.error('Get me error:', error);
      throw error;
    }
  };

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const updates = req.body;

      // Filter allowed updates
      const allowedUpdates = [
        'displayName',
        'preferredLanguages',
        'learningTrack',
      ];

      const filteredUpdates: any = {};
      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });

      // Update user profile
      const updatedUser = await this.userService.updateUser(req.user.id, filteredUpdates);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          elo: updatedUser.elo,
          level: updatedUser.level,
          experience: updatedUser.experience,
          preferredLanguages: updatedUser.preferredLanguages,
          learningTrack: updatedUser.learningTrack,
        },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new AppError('Current password and new password are required', 400);
      }

      if (newPassword.length < 6) {
        throw new AppError('New password must be at least 6 characters', 400);
      }

      // Update password in Firebase
      await FirebaseService.updateUser(req.user.id, {
        password: newPassword,
      });

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      throw new AppError('Failed to change password', 500);
    }
  };

  deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      // Delete from Firebase Auth
      await FirebaseService.deleteUser(req.user.id);

      // Delete from Firestore
      await this.userService.deleteUser(req.user.id);

      res.json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      console.error('Delete account error:', error);
      throw new AppError('Failed to delete account', 500);
    }
  };
}