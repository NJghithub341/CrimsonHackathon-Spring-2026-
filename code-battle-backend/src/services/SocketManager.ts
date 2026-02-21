import { Server as SocketIOServer, Socket } from 'socket.io';
import { MatchmakingService } from './MatchmakingService';
import { BattleService } from './BattleService';

export class SocketManager {
  private io: SocketIOServer;
  private matchmakingService: MatchmakingService;
  private battleService: BattleService;
  private connectedUsers: Map<string, string> = new Map(); // socketId -> userId

  constructor(io: SocketIOServer) {
    this.io = io;
    this.matchmakingService = new MatchmakingService();
    this.battleService = new BattleService();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('authenticate', (data: { userId: string, token: string }) => {
        // TODO: Verify JWT token
        this.connectedUsers.set(socket.id, data.userId);
        socket.join(`user:${data.userId}`);
        console.log(`User ${data.userId} authenticated`);
      });

      socket.on('join-matchmaking', async (data: { userId: string, elo: number, preferredLanguages: string[] }) => {
        try {
          console.log(`User ${data.userId} joining matchmaking queue`);

          const match = await this.matchmakingService.findMatch({
            userId: data.userId,
            elo: data.elo,
            preferredLanguages: data.preferredLanguages as any,
            timestamp: new Date()
          });

          if (match) {
            // Match found - notify both players
            const battleId = await this.battleService.createBattle(match.player1.userId, match.player2.userId);

            this.io.to(`user:${match.player1.userId}`).emit('match-found', {
              battleId,
              opponent: match.player2,
              countdown: 5
            });

            this.io.to(`user:${match.player2.userId}`).emit('match-found', {
              battleId,
              opponent: match.player1,
              countdown: 5
            });

            console.log(`Match created: ${match.player1.userId} vs ${match.player2.userId}`);
          } else {
            // Added to queue
            socket.emit('matchmaking-joined', { inQueue: true });
          }
        } catch (error) {
          console.error('Matchmaking error:', error);
          socket.emit('error', { message: 'Failed to join matchmaking' });
        }
      });

      socket.on('leave-matchmaking', (data: { userId: string }) => {
        this.matchmakingService.removeFromQueue(data.userId);
        socket.emit('matchmaking-left');
        console.log(`User ${data.userId} left matchmaking queue`);
      });

      socket.on('join-battle', (data: { battleId: string, userId: string }) => {
        socket.join(`battle:${data.battleId}`);
        console.log(`User ${data.userId} joined battle ${data.battleId}`);
      });

      socket.on('battle-answer', async (data: {
        battleId: string,
        userId: string,
        questionIndex: number,
        answer: string,
        timeTaken: number
      }) => {
        try {
          const result = await this.battleService.submitAnswer(
            data.battleId,
            data.userId,
            data.questionIndex,
            data.answer,
            data.timeTaken
          );

          // Broadcast answer to battle room
          this.io.to(`battle:${data.battleId}`).emit('player-answered', {
            userId: data.userId,
            questionIndex: data.questionIndex,
            timeTaken: data.timeTaken
          });

          if (result.battleFinished) {
            // Battle is complete
            this.io.to(`battle:${data.battleId}`).emit('battle-finished', {
              results: result.battleResults
            });
          } else if (result.nextQuestion) {
            // Move to next question
            setTimeout(() => {
              this.io.to(`battle:${data.battleId}`).emit('next-question', {
                question: result.nextQuestion,
                questionIndex: data.questionIndex + 1
              });
            }, 2000); // 2 second delay between questions
          }
        } catch (error) {
          console.error('Battle answer error:', error);
          socket.emit('error', { message: 'Failed to submit answer' });
        }
      });

      socket.on('disconnect', () => {
        const userId = this.connectedUsers.get(socket.id);
        if (userId) {
          this.matchmakingService.removeFromQueue(userId);
          this.connectedUsers.delete(socket.id);
          console.log(`User ${userId} disconnected`);
        }
      });
    });
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }
}