import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BattleInterface } from '../components/BattleInterface';

export const Battle: React.FC = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const [battleData, setBattleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!battleId) {
      navigate('/matchmaking');
      return;
    }

    // Mock battle data - would come from API/WebSocket
    setTimeout(() => {
      setBattleData({
        battleId,
        opponent: {
          userId: 'opponent-123',
          displayName: 'CodeNinja',
          elo: 1250,
        },
        language: 'python',
        difficulty: 'medium',
      });
      setLoading(false);
    }, 1000);
  }, [battleId, navigate]);

  const handleBattleEnd = (result: any) => {
    console.log('Battle ended:', result);
    // TODO: Show results modal, update ELO, navigate back
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚔️</div>
          <div className="text-2xl text-white pixel-font">LOADING BATTLE...</div>
          <div className="text-sm text-gray-400 pixel-font mt-2">Preparing weapons of code destruction</div>
        </div>
        <style jsx>{`
          .pixel-font {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
            image-rendering: pixelated;
          }
        `}</style>
      </div>
    );
  }

  if (!battleData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💀</div>
          <div className="text-2xl text-red-400 pixel-font">BATTLE NOT FOUND</div>
          <button
            onClick={() => navigate('/matchmaking')}
            className="mt-4 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 border-2 border-yellow-400 text-black pixel-font font-bold"
          >
            RETURN TO MATCHMAKING
          </button>
        </div>
        <style jsx>{`
          .pixel-font {
            font-family: 'Courier New', monospace;
            font-weight: bold;
            text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
            image-rendering: pixelated;
          }
        `}</style>
      </div>
    );
  }

  return (
    <BattleInterface
      battleId={battleId!}
      opponent={battleData.opponent}
      onBattleEnd={handleBattleEnd}
    />
  );
};