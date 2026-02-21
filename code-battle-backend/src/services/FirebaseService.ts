import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

class FirebaseService {
  private static instance: FirebaseService;
  private initialized = false;

  private constructor() {
    this.initializeFirebase();
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private initializeFirebase(): void {
    if (this.initialized || getApps().length > 0) {
      return;
    }

    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.warn('Firebase credentials not found. Firebase features will be disabled.');
        return;
      }

      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      this.initialized = true;
      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase:', error);
    }
  }

  public getAuth() {
    if (!this.initialized) {
      throw new Error('Firebase not initialized');
    }
    return getAuth();
  }

  public getFirestore() {
    if (!this.initialized) {
      throw new Error('Firebase not initialized');
    }
    return getFirestore();
  }

  public async verifyIdToken(idToken: string) {
    try {
      const decodedToken = await this.getAuth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  public async createUser(email: string, password: string, displayName: string) {
    try {
      const userRecord = await this.getAuth().createUser({
        email,
        password,
        displayName,
      });

      return userRecord;
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  public async getUserById(uid: string) {
    try {
      const userRecord = await this.getAuth().getUser(uid);
      return userRecord;
    } catch (error: any) {
      throw new Error(`User not found: ${error.message}`);
    }
  }

  public async updateUser(uid: string, properties: any) {
    try {
      const userRecord = await this.getAuth().updateUser(uid, properties);
      return userRecord;
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  public async deleteUser(uid: string) {
    try {
      await this.getAuth().deleteUser(uid);
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }
}

export default FirebaseService.getInstance();