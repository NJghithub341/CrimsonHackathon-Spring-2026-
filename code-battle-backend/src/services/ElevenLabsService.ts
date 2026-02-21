import * as fs from 'fs';
import * as path from 'path';

export type AudioEvent =
  | 'battle_start'
  | 'battle_end'
  | 'correct_answer'
  | 'incorrect_answer'
  | 'time_warning'
  | 'victory'
  | 'defeat'
  | 'level_up'
  | 'streak_bonus'
  | 'question_hint';

export interface AudioConfig {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export class ElevenLabsService {
  private isInitialized: boolean = false;
  private audioCache: Map<string, Buffer> = new Map();
  private audioDir: string;

  constructor() {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    // Create audio directory
    this.audioDir = path.join(process.cwd(), 'public', 'audio');
    this.ensureAudioDirectory();

    if (apiKey) {
      this.isInitialized = true;
      console.log('🔊 ElevenLabs service initialized (Mock Mode)');
    } else {
      console.warn('⚠️ ELEVENLABS_API_KEY not found. Audio features will be disabled.');
    }
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  private ensureAudioDirectory(): void {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    if (!fs.existsSync(this.audioDir)) {
      fs.mkdirSync(this.audioDir, { recursive: true });
    }
  }

  async generateSpeech(
    text: string,
    config: AudioConfig = {}
  ): Promise<Buffer | null> {
    if (!this.isInitialized) {
      return null;
    }

    try {
      // Mock implementation - in real implementation this would call ElevenLabs API
      console.log(`Mock: Generating speech for: "${text}" with config:`, config);

      // Create a simple mock audio buffer (empty for now)
      const mockAudioData = Buffer.from([]);
      return mockAudioData;
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }

  async generateEventAudio(
    event: AudioEvent,
    customText?: string,
    config: AudioConfig = {}
  ): Promise<string | null> {
    if (!this.isInitialized) {
      return null;
    }

    const text = customText || this.getDefaultTextForEvent(event);
    console.log(`Mock: Generating event audio for ${event}: "${text}"`);

    // Mock URL for audio file
    const mockAudioUrl = `/audio/mock_${event}_${Date.now()}.mp3`;
    return mockAudioUrl;
  }

  private getDefaultTextForEvent(event: AudioEvent): string {
    const eventTexts: Record<AudioEvent, string> = {
      'battle_start': 'Battle begins! Show your coding skills!',
      'battle_end': 'Battle complete! Great job everyone!',
      'correct_answer': 'Correct! Excellent work!',
      'incorrect_answer': 'Not quite right, but keep learning!',
      'time_warning': 'Quick! Time is running out!',
      'victory': 'Outstanding! You are victorious!',
      'defeat': 'Good effort! You will get them next time!',
      'level_up': 'Congratulations! You have leveled up!',
      'streak_bonus': 'Amazing streak! Bonus points earned!',
      'question_hint': 'Here is a helpful hint for you!'
    };

    return eventTexts[event] || 'Game event triggered!';
  }

  async generateDynamicFeedback(
    playerName: string,
    score: number,
    battleResult: 'win' | 'loss' | 'tie',
    eloChange: number
  ): Promise<string | null> {
    if (!this.isInitialized) {
      return null;
    }

    let text = '';

    if (battleResult === 'win') {
      text = `Congratulations ${playerName}! You scored ${score} points and won the battle! `;
      if (eloChange > 0) {
        text += `Your rating increased by ${eloChange} points!`;
      }
    } else if (battleResult === 'loss') {
      text = `Good effort ${playerName}! You scored ${score} points. `;
      if (eloChange < 0) {
        text += `Don't worry, keep practicing to improve your rating!`;
      }
    } else {
      text = `Great match ${playerName}! You tied with ${score} points. Your skills are well matched!`;
    }

    console.log(`Mock: Generating dynamic feedback: "${text}"`);
    return `/audio/mock_battle_result_${Date.now()}.mp3`;
  }

  async generateQuestionHintAudio(
    hint: string,
    questionDifficulty: string
  ): Promise<string | null> {
    if (!this.isInitialized) {
      return null;
    }

    const enhancedHint = `Here's a hint: ${hint}`;
    console.log(`Mock: Generating hint audio (${questionDifficulty}): "${enhancedHint}"`);
    return `/audio/mock_hint_${Date.now()}.mp3`;
  }

  async generateStreakAnnouncement(streakCount: number): Promise<string | null> {
    if (!this.isInitialized) {
      return null;
    }

    let text = '';
    if (streakCount === 5) {
      text = 'Five in a row! You are on fire!';
    } else if (streakCount === 10) {
      text = 'Ten correct answers! Incredible streak!';
    } else if (streakCount >= 15) {
      text = `${streakCount} correct answers! You are absolutely unstoppable!`;
    } else {
      text = `${streakCount} correct answers in a row! Keep it up!`;
    }

    console.log(`Mock: Generating streak announcement: "${text}"`);
    return `/audio/mock_streak_${streakCount}_${Date.now()}.mp3`;
  }

  // Clean up old audio files
  async cleanupOldAudioFiles(maxAgeHours: number = 24): Promise<void> {
    const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds
    const now = Date.now();

    try {
      if (!fs.existsSync(this.audioDir)) {
        return;
      }

      const files = fs.readdirSync(this.audioDir);

      for (const file of files) {
        const filePath = path.join(this.audioDir, file);

        if (!fs.existsSync(filePath)) {
          continue;
        }

        const stats = fs.statSync(filePath);

        // Skip pre-generated files (they don't have timestamp in name)
        if (!file.includes('_')) {
          continue;
        }

        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned up old audio file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up audio files:', error);
    }
  }

  // Get available voices - mock data
  async getAvailableVoices(): Promise<any[]> {
    if (!this.isInitialized) {
      return [];
    }

    // Mock voice data
    return [
      {
        voice_id: 'pNInz6obpgDQGcFmaJgB',
        name: 'Adam',
        category: 'premade',
        description: 'Middle-aged American male'
      },
      {
        voice_id: 'EXAVITQu4vr4xnSDxMaL',
        name: 'Bella',
        category: 'premade',
        description: 'Young American female'
      },
      {
        voice_id: 'pFGYVirHQHF2hJhpYyT7',
        name: 'Sarah',
        category: 'premade',
        description: 'Young American female'
      }
    ];
  }
}

export default ElevenLabsService;