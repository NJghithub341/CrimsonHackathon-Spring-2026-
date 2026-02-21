import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/auth';

const authController = new AuthController();
export const authRoutes = Router();

// Health check
authRoutes.get('/health', (req, res) => {
  res.json({ status: 'Auth routes working', firebase: process.env.FIREBASE_PROJECT_ID ? 'configured' : 'not configured' });
});

// Public routes
authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.post('/firebase-login', authController.loginWithFirebaseToken);

// Protected routes
authRoutes.get('/me', authenticateToken, authController.getMe);
authRoutes.patch('/profile', authenticateToken, authController.updateProfile);
authRoutes.patch('/change-password', authenticateToken, authController.changePassword);
authRoutes.delete('/account', authenticateToken, authController.deleteAccount);