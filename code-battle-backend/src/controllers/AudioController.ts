import { Request, Response } from 'express';
import ElevenLabsService, { AudioEvent } from '../services/ElevenLabsService';

const audioService = new ElevenLabsService();

export class AudioController {
  /**
   * Generate audio for a specific event
   * POST /api/audio/generate-event
   * Body: { event: AudioEvent, customText?: string, voiceId?: string }
   */
  static async generateEventAudio(req: Request, res: Response) {
    try {
      const { event, customText, voiceId } = req.body;

      if (!event) {
        return res.status(400).json({
          success: false,
          error: 'Event type is required'
        });
      }

      const config = voiceId ? { voiceId } : {};
      const audioUrl = await audioService.generateEventAudio(event, customText, config);

      if (!audioUrl) {
        return res.status(503).json({
          success: false,
          error: 'Audio service not available'
        });
      }

      res.json({
        success: true,
        data: {
          audioUrl,
          event
        }
      });
    } catch (error) {
      console.error('Error generating event audio:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate audio'
      });
    }
  }

  /**
   * Generate dynamic battle result feedback
   * POST /api/audio/battle-result
   * Body: { playerName: string, score: number, result: 'win'|'loss'|'tie', eloChange: number }
   */
  static async generateBattleResultAudio(req: Request, res: Response) {
    try {
      const { playerName, score, result, eloChange } = req.body;

      if (!playerName || score === undefined || !result || eloChange === undefined) {
        return res.status(400).json({
          success: false,
          error: 'playerName, score, result, and eloChange are required'
        });
      }

      const audioUrl = await audioService.generateDynamicFeedback(
        playerName,
        score,
        result,
        eloChange
      );

      if (!audioUrl) {
        return res.status(503).json({
          success: false,
          error: 'Audio service not available'
        });
      }

      res.json({
        success: true,
        data: {
          audioUrl,
          playerName,
          result
        }
      });
    } catch (error) {
      console.error('Error generating battle result audio:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate battle result audio'
      });
    }
  }

  /**
   * Generate hint audio for a question
   * POST /api/audio/question-hint
   * Body: { hint: string, difficulty: string }
   */
  static async generateQuestionHintAudio(req: Request, res: Response) {
    try {
      const { hint, difficulty } = req.body;

      if (!hint) {
        return res.status(400).json({
          success: false,
          error: 'Hint text is required'
        });
      }

      const audioUrl = await audioService.generateQuestionHintAudio(
        hint,
        difficulty || 'intermediate'
      );

      if (!audioUrl) {
        return res.status(503).json({
          success: false,
          error: 'Audio service not available'
        });
      }

      res.json({
        success: true,
        data: {
          audioUrl,
          hint
        }
      });
    } catch (error) {
      console.error('Error generating hint audio:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate hint audio'
      });
    }
  }

  /**
   * Generate streak announcement audio
   * POST /api/audio/streak
   * Body: { streakCount: number }
   */
  static async generateStreakAudio(req: Request, res: Response) {
    try {
      const { streakCount } = req.body;

      if (!streakCount || streakCount < 2) {
        return res.status(400).json({
          success: false,
          error: 'Valid streak count (>= 2) is required'
        });
      }

      const audioUrl = await audioService.generateStreakAnnouncement(streakCount);

      if (!audioUrl) {
        return res.status(503).json({
          success: false,
          error: 'Audio service not available'
        });
      }

      res.json({
        success: true,
        data: {
          audioUrl,
          streakCount
        }
      });
    } catch (error) {
      console.error('Error generating streak audio:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate streak audio'
      });
    }
  }

  /**
   * Generate custom speech audio
   * POST /api/audio/speech
   * Body: { text: string, voiceId?: string, stability?: number, similarityBoost?: number }
   */
  static async generateCustomSpeech(req: Request, res: Response) {
    try {
      const { text, voiceId, stability, similarityBoost } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Text is required'
        });
      }

      // Limit text length to prevent abuse
      if (text.length > 500) {
        return res.status(400).json({
          success: false,
          error: 'Text must be 500 characters or less'
        });
      }

      const config = {
        voiceId: voiceId || undefined,
        stability: stability || undefined,
        similarityBoost: similarityBoost || undefined
      };

      const audio = await audioService.generateSpeech(text, config);

      if (!audio) {
        return res.status(503).json({
          success: false,
          error: 'Audio service not available'
        });
      }

      // Return the audio as a downloadable file
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'attachment; filename="speech.mp3"');
      res.send(audio);
    } catch (error) {
      console.error('Error generating custom speech:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate speech'
      });
    }
  }

  /**
   * Get available voices
   * GET /api/audio/voices
   */
  static async getAvailableVoices(req: Request, res: Response) {
    try {
      const voices = await audioService.getAvailableVoices();

      res.json({
        success: true,
        data: {
          voices,
          count: voices.length
        }
      });
    } catch (error) {
      console.error('Error fetching voices:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch available voices'
      });
    }
  }

  /**
   * Get service status
   * GET /api/audio/status
   */
  static async getServiceStatus(req: Request, res: Response) {
    try {
      const isReady = audioService.isReady();

      res.json({
        success: true,
        data: {
          isReady,
          service: 'ElevenLabs',
          features: [
            'Event audio generation',
            'Dynamic battle feedback',
            'Question hints',
            'Streak announcements',
            'Custom speech synthesis'
          ]
        }
      });
    } catch (error) {
      console.error('Error getting service status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get service status'
      });
    }
  }

  /**
   * Clean up old audio files
   * POST /api/audio/cleanup
   * Body: { maxAgeHours?: number }
   */
  static async cleanupAudioFiles(req: Request, res: Response) {
    try {
      const { maxAgeHours = 24 } = req.body;

      await audioService.cleanupOldAudioFiles(maxAgeHours);

      res.json({
        success: true,
        message: `Cleaned up audio files older than ${maxAgeHours} hours`
      });
    } catch (error) {
      console.error('Error cleaning up audio files:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cleanup audio files'
      });
    }
  }
}