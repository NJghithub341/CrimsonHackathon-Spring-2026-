import { EventEmitter } from 'events';
import { MatchmakingRequest, ProgrammingLanguage } from '../types';
import { randomUUID } from 'crypto';

export interface Match {
  id: string;
  player1: MatchmakingRequest;
  player2: MatchmakingRequest;
  language: ProgrammingLanguage;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'started' | 'completed';
  acceptedBy: string[];
}

export interface QueueStats {
  totalPlayers: number;
  averageElo: number;
  averageWaitTime: number;
  eloDistribution: {
    bronze: number;    // < 1000
    silver: number;    // 1000-1200
    gold: number;      // 1200-1400
    platinum: number;  // 1400-1600
    diamond: number;   // 1600-1800
    master: number;    // 1800+
  };
}

export class MatchmakingService extends EventEmitter {
  private queue: Map<string, MatchmakingRequest> = new Map();
  private matches: Map<string, Match> = new Map();

  // Configuration
  private readonly MAX_ELO_DIFFERENCE = 200;
  private readonly WAIT_TIME_INCREASE_THRESHOLD = 30; // seconds
  private readonly ELO_EXPANSION_RATE = 50; // ELO difference increases by this amount every 30 seconds
  private readonly MAX_WAIT_TIME = 300; // 5 minutes default max wait time
  private readonly MATCH_ACCEPTANCE_TIMEOUT = 30000; // 30 seconds to accept match

  constructor() {
    super();
    this.startPeriodicMatchmaking();
    this.startCleanupTimer();
  }

  public addToQueue(request: MatchmakingRequest): void {
    // Ensure request has required fields
    const enhancedRequest: MatchmakingRequest = {
      ...request,
      id: request.id || randomUUID(),
      timestamp: new Date(),
    };

    console.log(`Adding user ${enhancedRequest.displayName} (ELO: ${enhancedRequest.elo}) to matchmaking queue`);

    this.queue.set(enhancedRequest.userId, enhancedRequest);
    this.emit('queueJoined', enhancedRequest);
    this.emit('queueUpdated', this.getQueueStats());

    // Try immediate matchmaking
    this.tryMatchmaking();
  }

  public removeFromQueue(userId: string): boolean {
    const removed = this.queue.delete(userId);
    if (removed) {
      console.log(`Removed user from matchmaking queue: ${userId}`);
      this.emit('queueLeft', userId);
      this.emit('queueUpdated', this.getQueueStats());
    }
    return removed;
  }

  public getQueueStats(): QueueStats {
    const requests = Array.from(this.queue.values());
    const now = Date.now();

    const eloDistribution = {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      diamond: 0,
      master: 0,
    };

    requests.forEach(req => {
      if (req.elo < 1000) eloDistribution.bronze++;
      else if (req.elo < 1200) eloDistribution.silver++;
      else if (req.elo < 1400) eloDistribution.gold++;
      else if (req.elo < 1600) eloDistribution.platinum++;
      else if (req.elo < 1800) eloDistribution.diamond++;
      else eloDistribution.master++;
    });

    return {
      totalPlayers: requests.length,
      averageElo: requests.length > 0
        ? Math.round(requests.reduce((sum, req) => sum + req.elo, 0) / requests.length)
        : 0,
      averageWaitTime: requests.length > 0
        ? Math.round(requests.reduce((sum, req) =>
            sum + (now - req.timestamp.getTime()) / 1000, 0) / requests.length)
        : 0,
      eloDistribution,
    };
  }

  public getQueuePosition(userId: string): number {
    const requests = Array.from(this.queue.values())
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return requests.findIndex(req => req.userId === userId) + 1;
  }

  public acceptMatch(matchId: string, userId: string): boolean {
    const match = this.matches.get(matchId);
    if (!match || match.status !== 'pending') return false;

    const isPlayer = match.player1.userId === userId || match.player2.userId === userId;
    if (!isPlayer) return false;

    // Add user to accepted list
    if (!match.acceptedBy.includes(userId)) {
      match.acceptedBy.push(userId);
    }

    // Check if both players have accepted
    if (match.acceptedBy.length === 2) {
      match.status = 'accepted';
      this.emit('matchReady', match);
      console.log(`Match ready: ${match.player1.displayName} vs ${match.player2.displayName}`);
    }

    return true;
  }

  public declineMatch(matchId: string, userId: string): boolean {
    const match = this.matches.get(matchId);
    if (!match || match.status !== 'pending') return false;

    const isPlayer = match.player1.userId === userId || match.player2.userId === userId;
    if (!isPlayer) return false;

    match.status = 'declined';

    // Put both players back in queue with reset timestamp
    const player1 = { ...match.player1, timestamp: new Date() };
    const player2 = { ...match.player2, timestamp: new Date() };

    this.queue.set(player1.userId, player1);
    this.queue.set(player2.userId, player2);

    this.matches.delete(matchId);
    this.emit('matchDeclined', match);
    this.emit('queueUpdated', this.getQueueStats());

    console.log(`Match declined by ${userId}, players returned to queue`);
    return true;
  }

  public getMatch(matchId: string): Match | undefined {
    return this.matches.get(matchId);
  }

  public getAllMatches(): Match[] {
    return Array.from(this.matches.values());
  }

  private tryMatchmaking(): void {
    if (this.queue.size < 2) return;

    const requests = Array.from(this.queue.values());
    const now = Date.now();

    // Sort by priority: longer wait time first, then by ELO balance
    requests.sort((a, b) => {
      const waitDiffA = now - a.timestamp.getTime();
      const waitDiffB = now - b.timestamp.getTime();

      // Prioritize players waiting longer
      const waitTimeDiff = waitDiffB - waitDiffA;
      if (Math.abs(waitTimeDiff) > 15000) return waitTimeDiff > 0 ? 1 : -1; // 15 second threshold

      // Then prefer more balanced matches (closer to median ELO)
      const medianElo = 1200;
      return Math.abs(a.elo - medianElo) - Math.abs(b.elo - medianElo);
    });

    for (let i = 0; i < requests.length - 1; i++) {
      const player1 = requests[i];

      for (let j = i + 1; j < requests.length; j++) {
        const player2 = requests[j];

        if (this.canMatch(player1, player2)) {
          this.createMatch(player1, player2);
          return; // Only create one match per iteration
        }
      }
    }
  }

  private canMatch(player1: MatchmakingRequest, player2: MatchmakingRequest): boolean {
    const now = Date.now();
    const player1WaitTime = (now - player1.timestamp.getTime()) / 1000;
    const player2WaitTime = (now - player2.timestamp.getTime()) / 1000;

    // Calculate dynamic ELO range based on longer wait time
    const maxWaitTime = Math.max(player1WaitTime, player2WaitTime);
    const eloRange = this.MAX_ELO_DIFFERENCE +
      Math.floor(maxWaitTime / this.WAIT_TIME_INCREASE_THRESHOLD) * this.ELO_EXPANSION_RATE;

    // Check ELO difference
    const eloDiff = Math.abs(player1.elo - player2.elo);
    if (eloDiff > eloRange) return false;

    // Check common languages
    const commonLanguages = player1.preferredLanguages.filter(lang =>
      player2.preferredLanguages.includes(lang)
    );

    return commonLanguages.length > 0;
  }

  private createMatch(player1: MatchmakingRequest, player2: MatchmakingRequest): void {
    // Remove players from queue
    this.queue.delete(player1.userId);
    this.queue.delete(player2.userId);

    // Select random common language
    const commonLanguages = player1.preferredLanguages.filter(lang =>
      player2.preferredLanguages.includes(lang)
    );
    const selectedLanguage = commonLanguages[Math.floor(Math.random() * commonLanguages.length)] as ProgrammingLanguage;

    // Determine difficulty based on average ELO
    const averageElo = (player1.elo + player2.elo) / 2;
    let difficultyLevel: 'easy' | 'medium' | 'hard';
    if (averageElo < 1000) {
      difficultyLevel = 'easy';
    } else if (averageElo < 1400) {
      difficultyLevel = 'medium';
    } else {
      difficultyLevel = 'hard';
    }

    const match: Match = {
      id: randomUUID(),
      player1,
      player2,
      language: selectedLanguage,
      difficultyLevel,
      createdAt: new Date(),
      status: 'pending',
      acceptedBy: [],
    };

    this.matches.set(match.id, match);

    // Set timeout for match acceptance
    setTimeout(() => {
      if (this.matches.has(match.id) && this.matches.get(match.id)!.status === 'pending') {
        this.declineMatch(match.id, 'system'); // Auto-decline if not accepted
      }
    }, this.MATCH_ACCEPTANCE_TIMEOUT);

    console.log(`Match found: ${player1.displayName} (${player1.elo}) vs ${player2.displayName} (${player2.elo}) - ${selectedLanguage} (${difficultyLevel})`);

    this.emit('matchFound', match);
    this.emit('queueUpdated', this.getQueueStats());
  }

  private startPeriodicMatchmaking(): void {
    setInterval(() => {
      this.tryMatchmaking();
    }, 5000); // Try matchmaking every 5 seconds
  }

  private startCleanupTimer(): void {
    setInterval(() => {
      const now = Date.now();

      // Remove expired requests
      for (const [userId, request] of this.queue.entries()) {
        const waitTime = (now - request.timestamp.getTime()) / 1000;
        if (waitTime > this.MAX_WAIT_TIME) {
          this.removeFromQueue(userId);
          this.emit('queueTimeout', request);
        }
      }

      // Clean up old matches
      for (const [matchId, match] of this.matches.entries()) {
        const age = (now - match.createdAt.getTime()) / 1000;
        if (age > 3600 && ['completed', 'declined'].includes(match.status)) { // 1 hour
          this.matches.delete(matchId);
        }
      }
    }, 30000); // Cleanup every 30 seconds
  }

  // Admin/testing methods
  public forceMatch(userId1: string, userId2: string): Match | null {
    const request1 = this.queue.get(userId1);
    const request2 = this.queue.get(userId2);

    if (request1 && request2) {
      this.createMatch(request1, request2);
      return Array.from(this.matches.values()).pop() || null;
    }
    return null;
  }

  public getQueueSnapshot() {
    return {
      queue: Array.from(this.queue.values()),
      matches: Array.from(this.matches.values()),
      stats: this.getQueueStats(),
    };
  }
}