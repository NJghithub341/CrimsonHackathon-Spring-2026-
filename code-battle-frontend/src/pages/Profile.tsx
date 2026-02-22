import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EloChart } from '../components/EloChart';
import { UserStats } from '../components/UserStats';
import { Edit, Save, X, User, Trophy, BarChart3 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: currentUser?.displayName || '',
    preferredLanguages: currentUser?.preferredLanguages || [],
  });

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

  const mockEloHistory = [
    { date: new Date('2024-01-10'), elo: 1150, change: +8, reason: 'Won battle vs. David' },
    { date: new Date('2024-01-12'), elo: 1165, change: +15, reason: 'Won battle vs. Emma' },
    { date: new Date('2024-01-14'), elo: 1152, change: -13, reason: 'Lost battle vs. Frank' },
    { date: new Date('2024-01-15'), elo: 1180, change: +12, reason: 'Won battle vs. Alice' },
    { date: new Date('2024-01-16'), elo: 1192, change: +12, reason: 'Won battle vs. Bob' },
    { date: new Date('2024-01-17'), elo: 1177, change: -15, reason: 'Lost battle vs. Carol' },
    { date: new Date('2024-01-18'), elo: currentUser.elo, change: currentUser.elo - 1177, reason: 'Won practice match' },
  ];

  const handleSaveProfile = () => {
    // TODO: Save profile changes to backend
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      displayName: currentUser.displayName,
      preferredLanguages: currentUser.preferredLanguages || [],
    });
    setIsEditing(false);
  };

  const availableLanguages = ['python', 'java', 'cpp'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                    className="input w-full max-w-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Languages
                  </label>
                  <div className="flex space-x-2">
                    {availableLanguages.map((lang) => (
                      <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.preferredLanguages.includes(lang as any)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditForm({
                                ...editForm,
                                preferredLanguages: [...editForm.preferredLanguages, lang as any],
                              });
                            } else {
                              setEditForm({
                                ...editForm,
                                preferredLanguages: editForm.preferredLanguages.filter(l => l !== lang),
                              });
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm capitalize">{lang === 'cpp' ? 'C++' : lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveProfile}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentUser.displayName}</h2>
                <p className="text-gray-600 mb-4">{currentUser.email}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Account Level</h3>
                    <p className="text-lg font-semibold text-gray-900">Level {currentUser.level}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Total Experience</h3>
                    <p className="text-lg font-semibold text-gray-900">{currentUser.experience.toLocaleString()} XP</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Preferred Languages</h3>
                    <div className="flex space-x-2">
                      {currentUser.preferredLanguages?.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm capitalize"
                        >
                          {lang === 'cpp' ? 'C++' : lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Member Since</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Stats Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* ELO Chart */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              ELO Rating
            </h3>
          </div>
          <EloChart
            currentElo={currentUser.elo}
            history={mockEloHistory}
          />
        </div>

        {/* Achievement Summary */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Achievement Summary
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-900">{mockStats.battlesWon}</div>
                  <div className="text-sm text-yellow-700">Total Victories</div>
                  <div className="text-xs text-yellow-600">
                    {mockStats.winRate.toFixed(1)}% win rate
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-900">{mockStats.currentStreak}</div>
                  <div className="text-sm text-green-700">Current Streak</div>
                  <div className="text-xs text-green-600">
                    Best: {mockStats.longestStreak} wins
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{mockStats.accuracy.toFixed(1)}%</div>
              <div className="text-xs text-gray-600">Accuracy</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{mockStats.averageResponseTime.toFixed(1)}s</div>
              <div className="text-xs text-gray-600">Avg Response</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{mockStats.practiceSessionsCompleted}</div>
              <div className="text-xs text-gray-600">Practice Sessions</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{mockStats.questionsCorrect}</div>
              <div className="text-xs text-gray-600">Correct Answers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Detailed Statistics</h3>
        <UserStats stats={mockStats} />
      </div>
    </div>
  );
};