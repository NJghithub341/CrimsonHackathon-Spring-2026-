import React from 'react';
import { Trophy, Target, Clock, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface BattleResultsProps {
  result: {
    winner: 'player' | 'opponent' | 'draw';
    playerScore: number;
    opponentScore: number;
    playerStats: {
      questionsCorrect: number;
      avgResponseTime: number;
      streak: number;
      accuracy: number;
    };
    opponentStats: {
      questionsCorrect: number;
      avgResponseTime: number;
      streak: number;
      accuracy: number;
    };
    eloChange: number;
    xpGained: number;
    battleDuration: number;
  };
  playerName: string;
  opponentName: string;
  onClose: () => void;
}

export const BattleResults: React.FC<BattleResultsProps> = ({
  result,
  playerName,
  opponentName,
  onClose,
}) => {
  const isVictory = result.winner === 'player';
  const isDraw = result.winner === 'draw';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full">
        {/* Main Result Banner */}
        <div className={`pixel-container p-8 mb-6 ${
          isVictory ? 'border-yellow-400 bg-gradient-to-r from-yellow-900 to-orange-900'
          : isDraw ? 'border-blue-400 bg-gradient-to-r from-blue-900 to-purple-900'
          : 'border-red-400 bg-gradient-to-r from-red-900 to-pink-900'
        }`}>
          <div className="text-center">
            {/* Result Icon */}
            <div className="text-8xl pixel-avatar mb-4">
              {isVictory ? '👑' : isDraw ? '🤝' : '💀'}
            </div>

            {/* Result Text */}
            <div className={`pixel-font text-6xl mb-4 ${
              isVictory ? 'text-yellow-400'
              : isDraw ? 'text-blue-400'
              : 'text-red-400'
            }`}>
              {isVictory ? 'VICTORY!' : isDraw ? 'DRAW!' : 'DEFEAT!'}
            </div>

            {/* ELO Change */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="pixel-score">
                <div className="flex items-center space-x-2">
                  {result.eloChange > 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  )}
                  <span className={`pixel-font ${
                    result.eloChange > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.eloChange > 0 ? '+' : ''}{result.eloChange} ELO
                  </span>
                </div>
              </div>

              <div className="pixel-score">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-purple-400" />
                  <span className="pixel-font text-purple-400">+{result.xpGained} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Comparison */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Player Stats */}
          <div className="pixel-container p-6 bg-blue-900 border-blue-400">
            <div className="text-center">
              <div className="text-4xl pixel-avatar mb-3">🧙‍♂️</div>
              <div className="pixel-font text-blue-200 mb-4">{playerName}</div>

              <div className="space-y-3">
                <div className="pixel-score">
                  <div className="pixel-font text-2xl text-yellow-400">
                    {result.playerScore}
                  </div>
                  <div className="pixel-font-small text-gray-300">POINTS</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="pixel-font-small text-gray-300">Correct:</span>
                    <span className="pixel-font-small text-green-400">
                      {result.playerStats.questionsCorrect}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="pixel-font-small text-gray-300">Accuracy:</span>
                    <span className="pixel-font-small text-blue-400">
                      {result.playerStats.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="pixel-font-small text-gray-300">Avg Time:</span>
                    <span className="pixel-font-small text-yellow-400">
                      {result.playerStats.avgResponseTime.toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="pixel-font-small text-gray-300">Streak:</span>
                    <span className="pixel-font-small text-orange-400">
                      {result.playerStats.streak}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="pixel-container p-6 bg-gray-800 border-gray-600 flex items-center justify-center">
            <div className="text-center">
              <div className="pixel-font text-4xl text-white mb-2">VS</div>
              <div className="pixel-timer">
                {Math.floor(result.battleDuration / 60)}:
                {(result.battleDuration % 60).toString().padStart(2, '0')}
              </div>
              <div className="pixel-font-small text-gray-400 mt-2">BATTLE TIME</div>
            </div>
          </div>

          {/* Opponent Stats */}
          <div className="pixel-container p-6 bg-red-900 border-red-400">
            <div className="text-center">
              <div className="text-4xl pixel-avatar mb-3">🧙‍♀️</div>
              <div className="pixel-font text-red-200 mb-4">{opponentName}</div>

              <div className="space-y-3">
                <div className="pixel-score">
                  <div className="pixel-font text-2xl text-yellow-400">
                    {result.opponentScore}
                  </div>
                  <div className="pixel-font-small text-gray-300">POINTS</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="pixel-font-small text-gray-300">Correct:</span>
                    <span className="pixel-font-small text-green-400">
                      {result.opponentStats.questionsCorrect}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="pixel-font-small text-gray-300">Accuracy:</span>
                    <span className="pixel-font-small text-blue-400">
                      {result.opponentStats.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="pixel-font-small text-gray-300">Avg Time:</span>
                    <span className="pixel-font-small text-yellow-400">
                      {result.opponentStats.avgResponseTime.toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="pixel-font-small text-gray-300">Streak:</span>
                    <span className="pixel-font-small text-orange-400">
                      {result.opponentStats.streak}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {result.playerStats.accuracy >= 80 && (
            <div className="pixel-container p-4 bg-purple-900 border-purple-400">
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="pixel-font text-purple-200">SHARPSHOOTER</div>
                <div className="pixel-font-small text-gray-400">80%+ Accuracy</div>
              </div>
            </div>
          )}

          {result.playerStats.avgResponseTime < 10 && (
            <div className="pixel-container p-4 bg-green-900 border-green-400">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="pixel-font text-green-200">LIGHTNING</div>
                <div className="pixel-font-small text-gray-400">Sub-10s Average</div>
              </div>
            </div>
          )}

          {result.playerStats.streak >= 5 && (
            <div className="pixel-container p-4 bg-orange-900 border-orange-400">
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <div className="pixel-font text-orange-200">ON FIRE</div>
                <div className="pixel-font-small text-gray-400">5+ Streak</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="pixel-btn-primary px-8 py-4"
          >
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span className="pixel-font">CONTINUE</span>
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/matchmaking'}
            className="pixel-btn-secondary px-8 py-4"
          >
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span className="pixel-font">REMATCH</span>
            </div>
          </button>
        </div>

        {/* Fun Messages */}
        <div className="text-center mt-6">
          <div className="pixel-font-small text-gray-400">
            {isVictory
              ? [
                  "Your code was unstoppable!",
                  "Victory through superior algorithms!",
                  "You've mastered the art of code warfare!",
                  "The bugs fear your debugging skills!",
                ][Math.floor(Math.random() * 4)]
              : isDraw
              ? [
                  "An honorable draw between code warriors!",
                  "Equally matched in the art of programming!",
                  "Both fighters showed exceptional skill!",
                ][Math.floor(Math.random() * 3)]
              : [
                  "Every defeat is a lesson learned!",
                  "The code will remember this battle!",
                  "Train harder, return stronger!",
                  "Your opponent was formidable today!",
                ][Math.floor(Math.random() * 4)]
            }
          </div>
        </div>
      </div>
    </div>
  );
};