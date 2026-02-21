import FirebaseService from './FirebaseService';
import { EloService } from './EloService';
import { User, ProgrammingLanguage, LearningTrack } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
  private eloService = new EloService();
  private usersCollection = 'users';

  private getFirestore() {
    if (!FirebaseService.isInitialized()) {
      throw new Error('Firebase not initialized. Please configure Firebase credentials.');
    }
    return FirebaseService.getFirestore();
  }

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
          : ['python'], // Default to Python if none specified
        learningTrack: questionnaire.experienceLevel || 'beginner',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.getFirestore().collection(this.usersCollection).doc(firebaseUid).set({
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user profile');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const doc = await this.getFirestore().collection(this.usersCollection).doc(userId).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        id: doc.id,
        email: data.email,
        displayName: data.displayName,
        elo: data.elo,
        level: data.level,
        experience: data.experience,
        preferredLanguages: data.preferredLanguages,
        learningTrack: data.learningTrack,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await this.getFirestore()
        .collection(this.usersCollection)
        .doc(userId)
        .update(updateData);

      const updatedUser = await this.getUserById(userId);
      if (!updatedUser) {
        throw new Error('User not found after update');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async updateUserElo(userId: string, eloChange: number): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const newElo = Math.max(0, user.elo + eloChange);
      const newLevel = this.calculateLevel(user.experience);

      await this.updateUser(userId, {
        elo: newElo,
        level: newLevel,
      });
    } catch (error) {
      console.error('Error updating user ELO:', error);
      throw new Error('Failed to update user ELO');
    }
  }

  async addExperience(userId: string, xp: number): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const newExperience = user.experience + xp;
      const newLevel = this.calculateLevel(newExperience);

      await this.updateUser(userId, {
        experience: newExperience,
        level: newLevel,
      });
    } catch (error) {
      console.error('Error adding experience:', error);
      throw new Error('Failed to add experience');
    }
  }

  async getLeaderboard(limit: number = 50, offset: number = 0): Promise<User[]> {
    try {
      const snapshot = await this.getFirestore()
        .collection(this.usersCollection)
        .orderBy('elo', 'desc')
        .limit(limit)
        .offset(offset)
        .get();

      const users: User[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        users.push({
          id: doc.id,
          email: data.email,
          displayName: data.displayName,
          elo: data.elo,
          level: data.level,
          experience: data.experience,
          preferredLanguages: data.preferredLanguages,
          learningTrack: data.learningTrack,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      return users;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw new Error('Failed to get leaderboard');
    }
  }

  async getUsersByEloRange(minElo: number, maxElo: number): Promise<User[]> {
    try {
      const snapshot = await this.getFirestore()
        .collection(this.usersCollection)
        .where('elo', '>=', minElo)
        .where('elo', '<=', maxElo)
        .get();

      const users: User[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        users.push({
          id: doc.id,
          email: data.email,
          displayName: data.displayName,
          elo: data.elo,
          level: data.level,
          experience: data.experience,
          preferredLanguages: data.preferredLanguages,
          learningTrack: data.learningTrack,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      return users;
    } catch (error) {
      console.error('Error getting users by ELO range:', error);
      throw new Error('Failed to get users by ELO range');
    }
  }

  private calculateLevel(experience: number): number {
    // Level calculation: Every 1000 XP = 1 level
    return Math.floor(experience / 1000) + 1;
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.getFirestore().collection(this.usersCollection).doc(userId).delete();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    try {
      // Firestore doesn't support full-text search, so we'll do a simple prefix search
      const snapshot = await this.getFirestore()
        .collection(this.usersCollection)
        .where('displayName', '>=', query)
        .where('displayName', '<=', query + '\uf8ff')
        .limit(limit)
        .get();

      const users: User[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        users.push({
          id: doc.id,
          email: data.email,
          displayName: data.displayName,
          elo: data.elo,
          level: data.level,
          experience: data.experience,
          preferredLanguages: data.preferredLanguages,
          learningTrack: data.learningTrack,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Failed to search users');
    }
  }
}