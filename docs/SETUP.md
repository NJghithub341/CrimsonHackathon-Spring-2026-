# Setup Guide

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## API Keys Required

You'll need the following API keys:

1. **Firebase Project**
   - Create project at https://console.firebase.google.com/
   - Enable Authentication and Firestore
   - Download service account key

2. **Google Gemini API**
   - Get API key from https://makersuite.google.com/app/apikey

3. **ElevenLabs API**
   - Sign up at https://elevenlabs.io/
   - Get API key from dashboard

## Environment Setup

### Backend Environment Variables

Create `code-battle-backend/.env`:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# ElevenLabs API
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Frontend Environment Variables (Optional)

Create `code-battle-frontend/.env`:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001

# Firebase Config (if using client-side Firebase)
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd CrimsonHackathon-Spring-2026-
```

### 2. Setup Backend

```bash
cd code-battle-backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys
nano .env  # or your preferred editor

# Start development server
npm run dev
```

The backend server will start on `http://localhost:3001`

### 3. Setup Frontend

```bash
cd ../code-battle-frontend
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Firebase Setup

### 1. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name: `codebattle-hackathon`
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. Go to Authentication → Sign-in method
2. Enable Email/Password
3. Configure authorized domains (add localhost:5173)

### 3. Setup Firestore Database

1. Go to Firestore Database
2. Create database in test mode
3. Choose a region close to your users

### 4. Generate Service Account Key

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the required fields for your `.env`

### 5. Firebase Security Rules

Add these Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Anyone can read questions
    match /questions/{questionId} {
      allow read: if request.auth != null;
    }

    // Battle participants can read battle data
    match /battles/{battleId} {
      allow read: if request.auth != null &&
        request.auth.uid in resource.data.players;
    }

    // Public leaderboard
    match /leaderboard/{document} {
      allow read: if request.auth != null;
    }
  }
}
```

## Development Workflow

### Running Both Servers

Option 1 - Separate terminals:
```bash
# Terminal 1 - Backend
cd code-battle-backend
npm run dev

# Terminal 2 - Frontend
cd code-battle-frontend
npm run dev
```

Option 2 - Using concurrently (install globally):
```bash
npm install -g concurrently
concurrently "cd code-battle-backend && npm run dev" "cd code-battle-frontend && npm run dev"
```

### Testing the Setup

1. **Backend Health Check:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Frontend Access:**
   Open `http://localhost:5173` in your browser

3. **WebSocket Connection:**
   Check browser console for Socket.io connection logs

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill processes on ports
   lsof -ti:3001 | xargs kill -9
   lsof -ti:5173 | xargs kill -9
   ```

2. **Firebase connection issues:**
   - Check your service account key format
   - Ensure private key includes `\n` for line breaks
   - Verify project ID matches

3. **CORS errors:**
   - Check FRONTEND_URL in backend .env
   - Ensure both servers are running

4. **TypeScript compilation errors:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode

Enable debug logging:

**Backend:**
```bash
DEBUG=socket.io:* npm run dev
```

**Frontend:**
```bash
# Add to vite.config.ts
export default defineConfig({
  // ... other config
  define: {
    __DEV__: true
  }
})
```

## Production Deployment

See `/docs/DEPLOYMENT.md` for production deployment instructions.