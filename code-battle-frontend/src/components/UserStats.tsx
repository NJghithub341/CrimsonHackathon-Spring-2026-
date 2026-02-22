import React from 'react';
import { Trophy, Target, Clock, Zap, Award, TrendingUp, Star, Code } from 'lucide-react';

interface UserStatsData {
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;
  winRate: number;
  averageResponseTime: number;
  questionsCorrect: number;
  totalQuestions: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  favoriteLanguage: string;
  practiceSessionsCompleted: number;
}

interface UserStatsProps {
  stats: UserStatsData;
}

export const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number | React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ icon, label, value, color, subtitle }) => (
    <div className="card p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
          {subtitle && (
            <div className="text-xs text-gray-500">{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(0)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getWinRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Battle Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
          Battle Statistics
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Trophy className="w-6 h-6 text-yellow-600" />}
            label="Battles Won"
            value={stats.battlesWon}
            color="bg-yellow-100"
            subtitle={`${stats.totalBattles} total battles`}
          />
          <StatCard
            icon={<Target className="w-6 h-6 text-blue-600" />}
            label="Win Rate"
            value={
              <span className={getWinRateColor(stats.winRate)}>
                {stats.winRate.toFixed(1)}%
              </span>
            }
            color="bg-blue-100"
            subtitle={`${stats.battlesLost} losses`}
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            label="Avg Response Time"
            value={formatTime(stats.averageResponseTime)}
            color="bg-purple-100"
          />
          <StatCard
            icon={<Zap className="w-6 h-6 text-green-600" />}
            label="Current Streak"
            value={stats.currentStreak}
            color="bg-green-100"
            subtitle={`${stats.longestStreak} longest`}
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Performance Metrics
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<Award className="w-6 h-6 text-green-600" />}
            label="Questions Correct"
            value={stats.questionsCorrect}
            color="bg-green-100"
            subtitle={`${stats.totalQuestions} total answered`}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
            label="Accuracy Rate"
            value={
              <span className={getAccuracyColor(stats.accuracy)}>
                {stats.accuracy.toFixed(1)}%
              </span>
            }
            color="bg-blue-100"
          />
          <StatCard
            icon={<Code className="w-6 h-6 text-indigo-600" />}
            label="Favorite Language"
            value={stats.favoriteLanguage === 'cpp' ? 'C++' : stats.favoriteLanguage}
            color="bg-indigo-100"
          />
        </div>
      </div>

      {/* Learning Progress */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-primary-600" />
          Learning Progress
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<Star className="w-6 h-6 text-primary-600" />}
            label="Total XP"
            value={stats.totalXP.toLocaleString()}
            color="bg-primary-100"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-yellow-600" />}
            label="Current Level"
            value={stats.level}
            color="bg-yellow-100"
            subtitle={`${stats.totalXP % 1000}/1000 to next`}
          />
          <StatCard
            icon={<Target className="w-6 h-6 text-green-600" />}
            label="Practice Sessions"
            value={stats.practiceSessionsCompleted}
            color="bg-green-100"
            subtitle="Completed"
          />
        </div>
      </div>

      {/* Detailed Performance Breakdown */}
      <div className="card">
        <h4 className="font-semibold text-gray-900 mb-4">Performance Breakdown</h4>
        <div className="space-y-4">
          {/* Win Rate Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Win Rate</span>
              <span className={getWinRateColor(stats.winRate)}>
                {stats.winRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  stats.winRate >= 70 ? 'bg-green-500' :
                  stats.winRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
          </div>

          {/* Accuracy Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Answer Accuracy</span>
              <span className={getAccuracyColor(stats.accuracy)}>
                {stats.accuracy.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  stats.accuracy >= 80 ? 'bg-green-500' :
                  stats.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${stats.accuracy}%` }}
              />
            </div>
          </div>

          {/* Level Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Level {stats.level} Progress</span>
              <span>{stats.totalXP % 1000}/1000 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${(stats.totalXP % 1000) / 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-900 mb-2">Battle Summary</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• {stats.battlesWon} victories out of {stats.totalBattles} battles</div>
            <div>• {stats.currentStreak} game win streak</div>
            <div>• Average {formatTime(stats.averageResponseTime)} response time</div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
          <h4 className="font-semibold text-green-900 mb-2">Learning Summary</h4>
          <div className="text-sm text-green-800 space-y-1">
            <div>• Level {stats.level} with {stats.totalXP.toLocaleString()} XP</div>
            <div>• {stats.accuracy.toFixed(1)}% accuracy rate</div>
            <div>• {stats.practiceSessionsCompleted} practice sessions completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};