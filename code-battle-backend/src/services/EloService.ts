export interface BattlePerformance {
  correctAnswers: number;
  totalQuestions: number;
  totalTime: number;
  points: number;
  averageTime: number;
  accuracy: number;
}

export interface BattleResult {
  winner: string | null;
  player1Performance: BattlePerformance;
  player2Performance: BattlePerformance;
  eloChanges: { [playerId: string]: number };
  battleDuration: number;
  battleType: 'ranked' | 'casual';
}

export class EloService {
  private readonly K_FACTOR = 32; // Standard K-factor for ELO calculation
  private readonly MIN_ELO_CHANGE = 1; // Minimum ELO change to prevent stagnation
  private readonly MAX_ELO_CHANGE = 50; // Maximum ELO change to prevent huge swings

  calculateEloChange(playerElo: number, opponentElo: number, result: number): number {
    // result: 1 = win, 0.5 = draw, 0 = loss
    const expectedScore = this.calculateExpectedScore(playerElo, opponentElo);
    let eloChange = this.K_FACTOR * (result - expectedScore);

    // Apply dynamic K-factor based on ELO difference
    const eloDifference = Math.abs(playerElo - opponentElo);
    if (eloDifference > 300) {
      // Reduce K-factor for very uneven matches
      eloChange *= 0.7;
    }

    // Cap the ELO change
    eloChange = Math.max(-this.MAX_ELO_CHANGE, Math.min(this.MAX_ELO_CHANGE, eloChange));

    // Ensure minimum change for active play
    if (Math.abs(eloChange) < this.MIN_ELO_CHANGE) {
      eloChange = result > 0.5 ? this.MIN_ELO_CHANGE : -this.MIN_ELO_CHANGE;
    }

    return Math.round(eloChange);
  }

  calculateBattleResult(
    player1Id: string,
    player2Id: string,
    player1Elo: number,
    player2Elo: number,
    player1Performance: BattlePerformance,
    player2Performance: BattlePerformance,
    battleDuration: number,
    battleType: 'ranked' | 'casual' = 'ranked'
  ): BattleResult {
    // Determine winner based on multiple factors
    const winner = this.determineWinner(player1Performance, player2Performance);

    // Calculate ELO changes for ranked battles only
    let eloChanges: { [playerId: string]: number } = {};

    if (battleType === 'ranked') {
      let result1: number, result2: number;

      if (winner === player1Id) {
        result1 = 1; // player1 wins
        result2 = 0; // player2 loses
      } else if (winner === player2Id) {
        result1 = 0; // player1 loses
        result2 = 1; // player2 wins
      } else {
        result1 = 0.5; // draw
        result2 = 0.5; // draw
      }

      // Apply performance modifiers
      const player1Modifier = this.calculatePerformanceModifier(player1Performance);
      const player2Modifier = this.calculatePerformanceModifier(player2Performance);

      let player1EloChange = this.calculateEloChange(player1Elo, player2Elo, result1);
      let player2EloChange = this.calculateEloChange(player2Elo, player1Elo, result2);

      // Apply performance modifiers
      player1EloChange = Math.round(player1EloChange * player1Modifier);
      player2EloChange = Math.round(player2EloChange * player2Modifier);

      eloChanges[player1Id] = player1EloChange;
      eloChanges[player2Id] = player2EloChange;
    }

    return {
      winner,
      player1Performance,
      player2Performance,
      eloChanges,
      battleDuration,
      battleType
    };
  }

  private determineWinner(p1: BattlePerformance, p2: BattlePerformance): string | null {
    // Primary: Compare points scored
    if (p1.points > p2.points) return 'player1';
    if (p2.points > p1.points) return 'player2';

    // Secondary: Compare accuracy
    if (p1.accuracy > p2.accuracy) return 'player1';
    if (p2.accuracy > p1.accuracy) return 'player2';

    // Tertiary: Compare average time (faster is better)
    if (p1.averageTime < p2.averageTime) return 'player1';
    if (p2.averageTime < p1.averageTime) return 'player2';

    // It's a tie
    return null;
  }

  private calculatePerformanceModifier(performance: BattlePerformance): number {
    let modifier = 1.0;

    // Accuracy bonus/penalty
    if (performance.accuracy >= 0.9) {
      modifier += 0.2; // 20% bonus for 90%+ accuracy
    } else if (performance.accuracy >= 0.8) {
      modifier += 0.1; // 10% bonus for 80%+ accuracy
    } else if (performance.accuracy < 0.5) {
      modifier -= 0.1; // 10% penalty for <50% accuracy
    }

    // Speed bonus (average time per question)
    if (performance.averageTime < 15) {
      modifier += 0.15; // 15% bonus for very fast answers
    } else if (performance.averageTime < 20) {
      modifier += 0.05; // 5% bonus for fast answers
    } else if (performance.averageTime > 40) {
      modifier -= 0.05; // 5% penalty for slow answers
    }

    // Perfect score bonus
    if (performance.accuracy === 1.0) {
      modifier += 0.1; // Additional 10% for perfect score
    }

    // Cap the modifier between 0.7 and 1.5
    return Math.max(0.7, Math.min(1.5, modifier));
  }

  private calculateExpectedScore(playerElo: number, opponentElo: number): number {
    return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  }

  calculateInitialElo(questionnaire: any): number {
    let baseElo = 1200; // Starting ELO

    // If no questionnaire provided, return default
    if (!questionnaire) {
      return baseElo;
    }

    // Experience level (primary factor)
    switch (questionnaire.experienceLevel) {
      case 'beginner':
        baseElo = 1000;
        break;
      case 'intermediate':
        baseElo = 1200;
        break;
      case 'advanced':
        baseElo = 1400;
        break;
      default:
        baseElo = 1200;
    }

    // Years of experience
    const yearsBonus = Math.min((questionnaire.yearsExperience || 0) * 20, 200);
    baseElo += yearsBonus;

    // Number of languages known
    const languageBonus = (questionnaire.preferredLanguages?.length || 1) * 30;
    baseElo += languageBonus;

    // Project experience
    const projectBonus = Math.min((questionnaire.previousProjects || 0) * 5, 150);
    baseElo += projectBonus;

    // Skill self-assessment (data structures and algorithms)
    const dsScore = questionnaire.comfortWithDataStructures || 1;
    const algoScore = questionnaire.comfortWithAlgorithms || 1;
    const skillBonus = ((dsScore + algoScore) / 2 - 1) * 30; // 0-270 bonus
    baseElo += skillBonus;

    // Coding frequency
    const frequencyMultiplier = {
      'daily': 1.2,
      'weekly': 1.0,
      'monthly': 0.8,
      'rarely': 0.6
    };
    const multiplier = frequencyMultiplier[questionnaire.codingFrequency as keyof typeof frequencyMultiplier] || 1.0;
    baseElo = baseElo * multiplier;

    // Open source experience
    if (questionnaire.hasContributedToOpenSource) {
      baseElo += 100;
    }

    // Competitive programming experience
    if (questionnaire.hasCompetitiveProgrammingExperience) {
      baseElo += 150;
    }

    // Favorite topics bonus (indicates depth of interest)
    const topicsBonus = Math.min((questionnaire.favoriteTopics?.length || 0) * 10, 80);
    baseElo += topicsBonus;

    // Apply some randomization to prevent clustering
    const randomAdjustment = (Math.random() - 0.5) * 50;
    baseElo += randomAdjustment;

    // Cap between 800-1800 for initial rating
    return Math.round(Math.max(800, Math.min(1800, baseElo)));
  }

  getEloRank(elo: number): string {
    if (elo < 1000) return 'Bronze';
    if (elo < 1200) return 'Silver';
    if (elo < 1400) return 'Gold';
    if (elo < 1600) return 'Platinum';
    if (elo < 1800) return 'Diamond';
    return 'Master';
  }
}