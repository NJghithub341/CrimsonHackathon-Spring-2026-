import { Router } from 'express';
import { AudioController } from '../controllers/AudioController';
import { authenticateToken } from '../middleware/auth';

export const audioRoutes = Router();

// Public routes
audioRoutes.get('/health', (req, res) => {
  res.json({ status: 'Audio routes working' });
});

// Get service status (public for debugging)
audioRoutes.get('/status', AudioController.getServiceStatus);

// Get available voices (public for voice selection UI)
audioRoutes.get('/voices', AudioController.getAvailableVoices);

// Protected routes (require authentication)
audioRoutes.use(authenticateToken);

// Generate event-based audio
audioRoutes.post('/generate-event', AudioController.generateEventAudio);

// Generate battle result feedback
audioRoutes.post('/battle-result', AudioController.generateBattleResultAudio);

// Generate question hint audio
audioRoutes.post('/question-hint', AudioController.generateQuestionHintAudio);

// Generate streak announcement
audioRoutes.post('/streak', AudioController.generateStreakAudio);

// Generate custom speech
audioRoutes.post('/speech', AudioController.generateCustomSpeech);

// Cleanup old audio files (admin-like function)
audioRoutes.post('/cleanup', AudioController.cleanupAudioFiles);