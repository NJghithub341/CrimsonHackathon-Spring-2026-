import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EloChart } from '../components/EloChart';
import { UserStats } from '../components/UserStats';
import { LearningTracks } from '../components/LearningTracks';
import { Zap, Target, BookOpen, Trophy } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return null;
  if (!currentUser) return <Navigate to="/" replace />;

  // Mock data for demonstration - would come from backend
  const mockStats = {
    battlesWon: 23,
    battlesLost: 12,
    totalBattles: 35,
    winRate: 65.7,
    averageResponseTime: 18.4,
    questionsCorrect: 142,
    totalQuestions: 178,
    accuracy: 79.8,
    currentStreak: 5,
    longestStreak: 12,
    totalXP: currentUser.experience,
    level: currentUser.level,
    favoriteLanguage: currentUser.preferredLanguages?.[0] || 'python',
    practiceSessionsCompleted: 28,
  };

  const mockTracks = [
    {
      id: 'python-basics',
      name: 'Python Fundamentals',
      description: 'Master Python basics and data structures',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      language: 'python' as const,
      color: 'bg-blue-500',
      completedModules: 8,
      totalModules: 15,
      estimatedCompletion: 12,
      modules: [
        {
          id: 'variables',
          title: 'Variables and Data Types',
          description: 'Learn about Python variables, strings, numbers, and booleans',
          difficulty: 'easy' as const,
          estimatedTime: 30,
          xpReward: 50,
          isCompleted: true,
          isLocked: false,
        },
        {
          id: 'control-flow',
          title: 'Control Flow',
          description: 'Master if statements, loops, and conditional logic',
          difficulty: 'medium' as const,
          estimatedTime: 45,
          xpReward: 75,
          isCompleted: false,
          isLocked: false,
        },
        {
          id: 'functions',
          title: 'Functions and Scope',
          description: 'Create reusable code with functions and understand scope',
          difficulty: 'medium' as const,
          estimatedTime: 60,
          xpReward: 100,
          isCompleted: false,
          isLocked: true,
          prerequisite: 'Control Flow',
        },
      ],
    },
  ];

  const handleStartModule = (trackId: string, moduleId: string) => {
    console.log(`Starting module ${moduleId} in track ${trackId}`);
    // TODO: Navigate to learning module
  };

  const handleSelectTrack = (trackId: string) => {
    console.log(`Selecting track ${trackId}`);
    // TODO: Navigate to track overview
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {currentUser.displayName}!
        </h1>
        <div className="flex space-x-3">
          <button className="btn-primary flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Find Battle</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Continue Learning</span>
          </button>
        </div>
      </div>

      {/* ELO and Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <EloChart
            currentElo={currentUser.elo}
            history={[
              { date: new Date('2024-01-15'), elo: 1180, change: +12, reason: 'Won battle vs. Alice' },
              { date: new Date('2024-01-16'), elo: 1192, change: +12, reason: 'Won battle vs. Bob' },
              { date: new Date('2024-01-17'), elo: 1177, change: -15, reason: 'Lost battle vs. Carol' },
              { date: new Date('2024-01-18'), elo: currentUser.elo, change: currentUser.elo - 1177, reason: 'Won practice match' },
            ]}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-900">{mockStats.battlesWon}</div>
                  <div className="text-sm text-green-700">Battles Won</div>
                  <div className="text-xs text-green-600">{mockStats.winRate.toFixed(1)}% win rate</div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">{mockStats.accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-blue-700">Accuracy</div>
                  <div className="text-xs text-blue-600">{mockStats.questionsCorrect} correct</div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500">
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-900">{mockStats.currentStreak}</div>
                  <div className="text-sm text-purple-700">Current Streak</div>
                  <div className="text-xs text-purple-600">Best: {mockStats.longestStreak}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Tracks */}
      <LearningTracks
        userTracks={mockTracks}
        onStartModule={handleStartModule}
        onSelectTrack={handleSelectTrack}
      />

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Completed "Variables and Data Types" module</span>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Won battle against Alice (+12 ELO)</span>
            </div>
            <span className="text-xs text-gray-500">1 day ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Started Python Fundamentals track</span>
            </div>
            <span className="text-xs text-gray-500">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};