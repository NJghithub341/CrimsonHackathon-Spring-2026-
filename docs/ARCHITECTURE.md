# System Architecture

## Overview

CodeBattle is a real-time competitive programming learning platform built with a modern, scalable architecture that supports both educational content and live multiplayer battles.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   Mobile App    │    │   Admin Panel   │
│   (React SPA)   │    │   (Future)      │    │   (Future)      │
└─────────┬───────┘    └─────────────────┘    └─────────────────┘
          │
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                    Frontend Layer                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │   Learning   │ │  Battle UI   │ │ Matchmaking  │           │
│  │  Interface   │ │   Component  │ │    Queue     │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
└─────────┬────────────────────────────────────────────────────────┘
          │ HTTP/REST + WebSocket
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                     API Gateway                                 │
│           (Express.js + CORS + Security Middleware)             │
└─────────┬────────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                   Backend Services                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │    Auth      │ │  Battle      │ │ Matchmaking  │           │
│  │   Service    │ │   Engine     │ │   Service    │           │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘           │
│         │                │                │                   │
│  ┌──────▼───────┐ ┌──────▼───────┐ ┌──────▼───────┐           │
│  │   Question   │ │   ELO        │ │  WebSocket   │           │
│  │   Service    │ │   Service    │ │   Manager    │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
└─────────┬────────────────────────────────────────────────────────┘
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                  External Services                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │   Firebase   │ │   Google     │ │  ElevenLabs  │           │
│  │  (Auth+DB)   │ │   Gemini     │ │   (Audio)    │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
└──────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Architecture

#### Technology Stack
- **React 18**: UI framework with hooks and context
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast development build tool
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Socket.io Client**: Real-time communication

#### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Input, Modal)
│   ├── battle/          # Battle-specific components
│   ├── learning/        # Learning interface components
│   └── matchmaking/     # Queue and matchmaking UI
├── pages/              # Route-level pages
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── services/           # API communication layer
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

#### State Management
- **React Context**: Global state (auth, user profile)
- **Local State**: Component-specific state with useState
- **WebSocket State**: Real-time battle state via Socket.io

### Backend Architecture

#### Technology Stack
- **Node.js + TypeScript**: Runtime and type safety
- **Express.js**: Web framework and routing
- **Socket.io**: WebSocket server for real-time features
- **Firebase Admin SDK**: Authentication and database
- **JWT**: Stateless authentication tokens

#### Service-Oriented Architecture
```
src/
├── controllers/        # Request handlers
├── services/          # Business logic layer
│   ├── AuthService    # Authentication & user management
│   ├── BattleService  # Battle logic and state management
│   ├── MatchmakingService # Player pairing algorithm
│   ├── QuestionService    # Question generation & retrieval
│   └── EloService     # Rating calculation
├── middleware/        # Express middleware
├── routes/           # API route definitions
├── types/            # Shared type definitions
└── utils/            # Helper functions
```

## Data Flow

### User Authentication Flow
```
User → Frontend → Backend → Firebase Auth → JWT Token → User Profile
```

### Battle Flow
```
1. User joins queue → MatchmakingService
2. Match found → BattleService creates battle
3. Players join battle room via WebSocket
4. Questions served one by one
5. Answers collected and validated
6. Results calculated → ELO updated
7. Battle cleanup
```

### Learning Flow
```
1. User selects lesson → QuestionService
2. Questions generated/retrieved → AI Integration
3. Progress tracked locally
4. Completion synced to Firebase
5. XP and level updated
```

## Real-Time Communication

### WebSocket Events Architecture

```
Client                    Server
  │                         │
  ├─ authenticate ──────────▶│
  │                         ├─ validate token
  │◀──────── authenticated ─│
  │                         │
  ├─ join-matchmaking ──────▶│
  │                         ├─ add to queue
  │                         ├─ find match?
  │◀──────── match-found ───│
  │                         │
  ├─ join-battle ───────────▶│
  │◀──────── battle-start ──│
  │                         │
  ├─ battle-answer ─────────▶│
  │                         ├─ validate answer
  │◀──── player-answered ───│
  │◀──────── next-question ─│
  │                         │
  │◀──── battle-finished ───│
```

## Database Schema

### Firebase Firestore Collections

#### Users Collection
```json
{
  "id": "string",
  "email": "string",
  "displayName": "string",
  "elo": "number",
  "level": "number",
  "experience": "number",
  "preferredLanguages": "array",
  "learningTrack": "string",
  "stats": {
    "battlesWon": "number",
    "battlesLost": "number",
    "questionsCorrect": "number",
    "averageResponseTime": "number"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Battles Collection
```json
{
  "id": "string",
  "players": ["userId1", "userId2"],
  "status": "waiting|active|finished",
  "questions": "array",
  "answers": {
    "userId1": "array",
    "userId2": "array"
  },
  "results": "object",
  "createdAt": "timestamp"
}
```

#### Questions Collection
```json
{
  "id": "string",
  "type": "multiple-choice|coding|concept|os",
  "difficulty": "easy|medium|hard",
  "language": "python|java|cpp",
  "title": "string",
  "content": "string",
  "options": "array",
  "correctAnswer": "string",
  "explanation": "string",
  "timeLimit": "number",
  "points": "number",
  "tags": "array",
  "createdBy": "ai|admin|community"
}
```

## Security Architecture

### Authentication & Authorization
- **Firebase Authentication**: Identity management
- **JWT Tokens**: Stateless session management
- **Route Guards**: Protected API endpoints
- **CORS**: Cross-origin resource sharing control
- **Helmet.js**: Security headers

### Data Validation
- **Input Sanitization**: All user inputs validated
- **Schema Validation**: TypeScript + runtime validation
- **Rate Limiting**: API abuse prevention
- **WebSocket Authentication**: Token-based socket auth

### Security Best Practices
- Environment variables for secrets
- No sensitive data in client code
- HTTPS in production
- Firebase security rules
- SQL injection prevention (N/A - NoSQL)

## Scalability Considerations

### Horizontal Scaling
- **Stateless Backend**: Can run multiple instances
- **WebSocket Clustering**: Redis adapter for multi-server
- **Database Sharding**: Firebase automatic scaling
- **CDN**: Static asset delivery

### Performance Optimization
- **Code Splitting**: Lazy loading of routes
- **Memoization**: React.memo and useMemo
- **Connection Pooling**: Database connections
- **Caching**: Question caching, user session caching

### Monitoring & Observability
- **Error Tracking**: Console errors and API failures
- **Performance Metrics**: Response times, battle completion rates
- **User Analytics**: Learning progress, engagement metrics
- **Health Checks**: Service availability monitoring

## AI Integration Architecture

### Google Gemini Integration
- **Question Generation**: Dynamic content creation
- **Code Analysis**: Answer validation for coding questions
- **Difficulty Adjustment**: Adaptive question difficulty
- **Content Moderation**: Inappropriate content filtering

### ElevenLabs Integration
- **Audio Feedback**: Success/failure sounds
- **Voice Narration**: Question reading (accessibility)
- **Dynamic Audio**: Context-aware sound effects
- **Audio Caching**: Prevent redundant API calls

## Future Architecture Considerations

### Microservices Migration
- Individual services can be extracted to separate containers
- API Gateway pattern for service discovery
- Event-driven architecture with message queues

### Mobile App Architecture
- React Native frontend
- Shared API backend
- Push notifications for match invitations

### Advanced Features
- Machine learning for personalized learning paths
- Video streaming for coding tutorials
- Community features (forums, tournaments)
- Advanced analytics and reporting