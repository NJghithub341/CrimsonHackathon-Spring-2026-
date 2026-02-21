import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchmakingQueue } from '../components/MatchmakingQueue';

export const Matchmaking: React.FC = () => {
  const navigate = useNavigate();

  const handleMatchReady = (match: any) => {
    console.log('Match ready:', match);
    // Navigate to battle interface
    navigate(`/battle/${match.id}`);
  };

  return <MatchmakingQueue onMatchReady={handleMatchReady} />;
};