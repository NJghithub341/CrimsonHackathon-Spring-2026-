import React from 'react';
import { MatchmakingQueue } from '../components/MatchmakingQueue';

export const Matchmaking: React.FC = () => {
  const handleMatchReady = (match: any) => {
    console.log('Match ready:', match);
    // TODO: Navigate to battle interface
    alert(`Match ready! Starting battle in ${match.language} (${match.difficultyLevel} difficulty)`);
  };

  return <MatchmakingQueue onMatchReady={handleMatchReady} />;
};