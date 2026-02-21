export class EloService {
  private readonly K_FACTOR = 32; // Standard K-factor for ELO calculation

  calculateEloChange(playerElo: number, opponentElo: number, result: number): number {
    // result: 1 = win, 0.5 = draw, 0 = loss
    const expectedScore = this.calculateExpectedScore(playerElo, opponentElo);
    const eloChange = Math.round(this.K_FACTOR * (result - expectedScore));

    return eloChange;
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