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
    this.setupMatchmakingEvents();
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

      socket.on('join-matchmaking', async (data: { userId: string, displayName: string, elo: number, preferredLanguages: string[] }) => {
        try {
          console.log(`User ${data.userId} joining matchmaking queue`);

          this.matchmakingService.addToQueue({
            id: socket.id,
            userId: data.userId,
            displayName: data.displayName,
            elo: data.elo,
            preferredLanguages: data.preferredLanguages as any,
            timestamp: new Date(),
            maxWaitTime: 300,
            socketId: socket.id
          });

          // Emit queue joined confirmation
          socket.emit('queue-joined', {
            position: this.matchmakingService.getQueuePosition(data.userId),
            stats: this.matchmakingService.getQueueStats()
          });
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

  private setupMatchmakingEvents(): void {
    // Listen for matchmaking events
    this.matchmakingService.on('matchFound', (match) => {
      console.log(`Match found: ${match.player1.displayName} vs ${match.player2.displayName}`);

      // Notify both players about the match
      this.io.to(`user:${match.player1.userId}`).emit('match-found', {
        match,
        opponent: match.player2
      });

      this.io.to(`user:${match.player2.userId}`).emit('match-found', {
        match,
        opponent: match.player1
      });
    });

    this.matchmakingService.on('matchReady', async (match) => {
      console.log(`Match ready: ${match.player1.displayName} vs ${match.player2.displayName}`);

      try {
        // Create battle
        const battleId = await this.battleService.createBattle(match.player1.userId, match.player2.userId);

        // Notify players to start battle
        this.io.to(`user:${match.player1.userId}`).emit('battle-ready', {
          battleId,
          matchId: match.id,
          opponent: match.player2
        });

        this.io.to(`user:${match.player2.userId}`).emit('battle-ready', {
          battleId,
          matchId: match.id,
          opponent: match.player1
        });
      } catch (error) {
        console.error('Failed to create battle:', error);
      }
    });

    this.matchmakingService.on('queueUpdated', (stats) => {
      // Broadcast queue stats to all connected clients
      this.io.emit('queue-stats', stats);
    });
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }
}