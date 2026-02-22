import { EloService } from './EloService';
import { User } from '../types';

// Mock in-memory storage for testing without Firebase
const mockUsers = new Map<string, User>();

export class MockUserService {
  private eloService = new EloService();

  async createUser(
    firebaseUid: string,
    email: string,
    displayName: string,
    questionnaire: any
  ): Promise<User> {
    try {
      // Calculate initial ELO based on questionnaire
      const initialElo = this.eloService.calculateInitialElo(questionnaire);

      const user: User = {
        id: firebaseUid,
        email,
        displayName,
        elo: initialElo,
        level: 1,
        experience: 0,
        preferredLanguages: questionnaire.preferredLanguages?.length > 0
          ? questionnaire.preferredLanguages
          : ['python'],
        learningTrack: questionnaire.experienceLevel || 'beginner',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsers.set(firebaseUid, user);
      console.log(`Mock user created: ${displayName} (ELO: ${initialElo})`);

      return user;
    } catch (error) {
      console.error('Error creating mock user:', error);
      throw new Error('Failed to create user profile');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    return mockUsers.get(userId) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of mockUsers.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const user = mockUsers.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    mockUsers.set(userId, updatedUser);
    return updatedUser;
  }

  async getLeaderboard(limit: number = 50): Promise<User[]> {
    const users = Array.from(mockUsers.values());
    return users
      .sort((a, b) => b.elo - a.elo)
      .slice(0, limit);
  }
}