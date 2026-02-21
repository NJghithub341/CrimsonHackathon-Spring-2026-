import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EloHistoryPoint {
  date: Date;
  elo: number;
  change: number;
  reason: string;
}

interface EloChartProps {
  currentElo: number;
  history?: EloHistoryPoint[];
  rank?: string;
}

export const EloChart: React.FC<EloChartProps> = ({ currentElo, history = [], rank }) => {
  const getRankInfo = (elo: number) => {
    if (elo < 1000) return { name: 'Bronze', color: 'text-yellow-600 bg-yellow-100', next: 1000 };
    if (elo < 1200) return { name: 'Silver', color: 'text-gray-600 bg-gray-100', next: 1200 };
    if (elo < 1400) return { name: 'Gold', color: 'text-yellow-500 bg-yellow-50', next: 1400 };
    if (elo < 1600) return { name: 'Platinum', color: 'text-blue-600 bg-blue-100', next: 1600 };
    if (elo < 1800) return { name: 'Diamond', color: 'text-purple-600 bg-purple-100', next: 1800 };
    return { name: 'Master', color: 'text-red-600 bg-red-100', next: null };
  };

  const rankInfo = getRankInfo(currentElo);
  const progressToNext = rankInfo.next ? ((currentElo - (rankInfo.next - 200)) / 200) * 100 : 100;

  const recentChange = history.length > 0 ? history[history.length - 1].change : 0;

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="card space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${rankInfo.color}`}>
            {rankInfo.name}
          </span>
          {recentChange !== 0 && (
            <div className={`flex items-center space-x-1 ${getChangeColor(recentChange)}`}>
              {getChangeIcon(recentChange)}
              <span className="text-sm font-medium">
                {recentChange > 0 ? '+' : ''}{recentChange}
              </span>
            </div>
          )}
        </div>
        <div className="text-4xl font-bold text-gray-900 mb-1">{currentElo}</div>
        <div className="text-gray-600">Current ELO Rating</div>
      </div>

      {/* Progress to next rank */}
      {rankInfo.next && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress to {getRankInfo(rankInfo.next).name}</span>
            <span>{rankInfo.next - currentElo} ELO needed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, progressToNext))}%` }}
            />
          </div>
        </div>
      )}

      {/* ELO History */}
      {history.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recent History</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.slice(-10).reverse().map((point, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{point.reason}</div>
                  <div className="text-xs text-gray-500">
                    {point.date.toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{point.elo}</span>
                  <div className={`flex items-center space-x-1 ${getChangeColor(point.change)}`}>
                    {getChangeIcon(point.change)}
                    <span className="text-sm font-medium">
                      {point.change > 0 ? '+' : ''}{point.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mini Chart Visualization */}
      {history.length > 1 && (
        <div className="relative h-24 bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-500 mb-1">ELO Trend</div>
          <svg className="w-full h-16" viewBox="0 0 300 60">
            <defs>
              <linearGradient id="eloGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
              </linearGradient>
            </defs>

            {/* Generate path for ELO history */}
            {(() => {
              const recentHistory = history.slice(-20);
              const minElo = Math.min(...recentHistory.map(h => h.elo));
              const maxElo = Math.max(...recentHistory.map(h => h.elo));
              const eloRange = maxElo - minElo || 100;

              const points = recentHistory.map((point, index) => {
                const x = (index / (recentHistory.length - 1)) * 300;
                const y = 50 - ((point.elo - minElo) / eloRange) * 40;
                return `${x},${y}`;
              });

              const pathD = `M ${points.join(' L ')}`;
              const areaD = `${pathD} L 300,50 L 0,50 Z`;

              return (
                <>
                  <path d={areaD} fill="url(#eloGradient)" />
                  <path d={pathD} stroke="#3b82f6" strokeWidth="2" fill="none" />
                  {/* Current point */}
                  <circle
                    cx={points[points.length - 1]?.split(',')[0] || 0}
                    cy={points[points.length - 1]?.split(',')[1] || 0}
                    r="3"
                    fill="#3b82f6"
                  />
                </>
              );
            })()}
          </svg>
        </div>
      )}
    </div>
  );
};