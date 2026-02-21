import { MatchmakingRequest, ProgrammingLanguage } from '../types';

interface MatchResult {
  player1: MatchmakingRequest;
  player2: MatchmakingRequest;
}

export class MatchmakingService {
  private queue: MatchmakingRequest[] = [];
  private readonly ELO_RANGE = 100; // Initial ELO range for matching

  async findMatch(request: MatchmakingRequest): Promise<MatchResult | null> {
    // Remove any existing request from this user
    this.removeFromQueue(request.userId);

    // Look for a match in the current queue
    const potentialMatch = this.findPotentialMatch(request);

    if (potentialMatch) {
      // Remove the matched player from queue
      this.removeFromQueue(potentialMatch.userId);
      return {
        player1: request,
        player2: potentialMatch
      };
    }

    // No match found, add to queue
    this.queue.push(request);
    return null;
  }

  private findPotentialMatch(request: MatchmakingRequest): MatchmakingRequest | null {
    const currentTime = new Date();

    for (const candidate of this.queue) {
      // Skip if same user
      if (candidate.userId === request.userId) continue;

      // Check ELO range (expand over time)
      const waitTime = currentTime.getTime() - candidate.timestamp.getTime();
      const expandedRange = this.ELO_RANGE + (waitTime / 1000) * 10; // Expand by 10 ELO per second

      const eloDiff = Math.abs(request.elo - candidate.elo);
      if (eloDiff > expandedRange) continue;

      // Check if they have at least one language in common
      const hasCommonLanguage = request.preferredLanguages.some(lang =>
        candidate.preferredLanguages.includes(lang)
      );

      if (hasCommonLanguage) {
        return candidate;
      }
    }

    return null;
  }

  removeFromQueue(userId: string): void {
    this.queue = this.queue.filter(request => request.userId !== userId);
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getQueuePosition(userId: string): number {
    return this.queue.findIndex(request => request.userId === userId) + 1;
  }
}