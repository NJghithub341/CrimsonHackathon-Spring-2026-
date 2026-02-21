# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: TBD

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Auth Endpoints

### POST `/auth/register`
Register a new user with questionnaire for ELO estimation.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe",
  "questionnaire": {
    "experienceLevel": "intermediate",
    "knownLanguages": ["python", "java"],
    "yearsExperience": 2,
    "previousProjects": 5,
    "comfortWithDataStructures": 7,
    "comfortWithAlgorithms": 6
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "elo": 1250,
    "level": 1,
    "experience": 0
  },
  "token": "jwt_token"
}
```

### POST `/auth/login`
Login existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": { /* user object */ },
  "token": "jwt_token"
}
```

### GET `/auth/me`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": { /* user object */ }
}
```

## User Endpoints

### PATCH `/users/profile`
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "displayName": "New Name",
  "preferredLanguages": ["python", "cpp"]
}
```

### GET `/users/leaderboard`
Get global leaderboard.

**Query Parameters:**
- `limit`: Number of users to return (default: 50)
- `offset`: Pagination offset

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "id": "user_id",
      "displayName": "Player1",
      "elo": 1800,
      "level": 15,
      "rank": 1
    }
  ]
}
```

## Battle Endpoints

### POST `/battles/create`
Create a new battle (used internally by matchmaking).

### GET `/battles/:battleId`
Get battle details.

**Response:**
```json
{
  "success": true,
  "battle": {
    "id": "battle_id",
    "players": ["user1", "user2"],
    "status": "active",
    "currentQuestionIndex": 2,
    "questions": [ /* question objects */ ],
    "startTime": "2024-01-01T00:00:00Z"
  }
}
```

### POST `/battles/:battleId/answer`
Submit answer to battle question.

**Request Body:**
```json
{
  "questionIndex": 2,
  "answer": "option_a",
  "timeTaken": 15.5
}
```

## Matchmaking Endpoints

### POST `/matchmaking/join`
Join matchmaking queue.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "preferredLanguages": ["python", "java"]
}
```

**Response:**
```json
{
  "success": true,
  "inQueue": true,
  "queuePosition": 3,
  "estimatedWaitTime": 30
}
```

### DELETE `/matchmaking/leave`
Leave matchmaking queue.

## Question Endpoints

### GET `/questions/random`
Get random questions for practice.

**Query Parameters:**
- `language`: Programming language filter
- `difficulty`: Difficulty filter
- `type`: Question type filter
- `count`: Number of questions (default: 10)

### POST `/questions/generate`
Generate new questions using AI (admin only).

## WebSocket Events

### Client → Server Events

#### `authenticate`
```json
{
  "userId": "user_id",
  "token": "jwt_token"
}
```

#### `join-matchmaking`
```json
{
  "userId": "user_id",
  "elo": 1200,
  "preferredLanguages": ["python", "java"]
}
```

#### `leave-matchmaking`
```json
{
  "userId": "user_id"
}
```

#### `join-battle`
```json
{
  "battleId": "battle_id",
  "userId": "user_id"
}
```

#### `battle-answer`
```json
{
  "battleId": "battle_id",
  "userId": "user_id",
  "questionIndex": 2,
  "answer": "option_a",
  "timeTaken": 15.5
}
```

### Server → Client Events

#### `match-found`
```json
{
  "battleId": "battle_id",
  "opponent": {
    "id": "opponent_id",
    "displayName": "Opponent",
    "elo": 1250
  },
  "countdown": 5
}
```

#### `battle-start`
```json
{
  "battleId": "battle_id",
  "question": { /* first question */ },
  "questionIndex": 0
}
```

#### `player-answered`
```json
{
  "userId": "user_id",
  "questionIndex": 2,
  "timeTaken": 15.5
}
```

#### `next-question`
```json
{
  "question": { /* question object */ },
  "questionIndex": 3
}
```

#### `battle-finished`
```json
{
  "results": {
    "battleId": "battle_id",
    "winner": "user_id",
    "players": {
      "user1": {
        "correctAnswers": 7,
        "totalTime": 180.5,
        "points": 245
      },
      "user2": {
        "correctAnswers": 6,
        "totalTime": 195.2,
        "points": 220
      }
    },
    "eloChanges": {
      "user1": 15,
      "user2": -15
    }
  }
}
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired token
- `USER_NOT_FOUND`: User does not exist
- `BATTLE_NOT_FOUND`: Battle does not exist
- `ALREADY_IN_QUEUE`: User already in matchmaking queue
- `VALIDATION_ERROR`: Invalid request data