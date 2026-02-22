import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Users, Clock, Trophy, Zap, X, Check, AlertCircle, Loader } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface QueueStats {
  totalPlayers: number;
  averageElo: number;
  averageWaitTime: number;
  eloDistribution: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    diamond: number;
    master: number;
  };
}

interface Match {
  id: string;
  player1: {
    userId: string;
    displayName: string;
    elo: number;
  };
  player2: {
    userId: string;
    displayName: string;
    elo: number;
  };
  language: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'accepted' | 'declined' | 'started' | 'completed';
  acceptedBy: string[];
}

interface MatchmakingQueueProps {
  onMatchReady: (match: Match) => void;
}

export const MatchmakingQueue: React.FC<MatchmakingQueueProps> = ({ onMatchReady }) => {
  const { currentUser } = useAuth();
  const [inQueue, setInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['python']);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [waitTime, setWaitTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableLanguages = [
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚡' },
  ];

  // Poll for queue status and match updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inQueue || currentMatch) {
      interval = setInterval(async () => {
        await checkQueueStatus();
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [inQueue, currentMatch]);

  // Wait time counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (inQueue && !currentMatch) {
      interval = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [inQueue, currentMatch]);

  const joinQueue = async () => {
    if (!currentUser) return;

    if (selectedLanguages.length === 0) {
      setError('Please select at least one programming language');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/matchmaking/queue/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          preferredLanguages: selectedLanguages,
          maxWaitTime: 300, // 5 minutes
        }),
      });

      const data = await response.json();

      if (data.success) {
        setInQueue(true);
        setQueuePosition(data.data.queuePosition);
        setEstimatedWaitTime(data.data.estimatedWaitTime);
        setQueueStats(data.data.queueStats);
        setWaitTime(0);
      } else {
        throw new Error(data.message || 'Failed to join queue');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const leaveQueue = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/matchmaking/queue/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setInQueue(false);
        setQueuePosition(null);
        setEstimatedWaitTime(null);
        setCurrentMatch(null);
        setWaitTime(0);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkQueueStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/matchmaking/queue/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const { inQueue: stillInQueue, queuePosition: newPosition, queueStats: newStats, pendingMatch } = data.data;

        // Match found — surface it immediately
        if (pendingMatch) {
          setCurrentMatch(pendingMatch);
          setInQueue(false);
          setQueuePosition(null);
        } else if (!stillInQueue && inQueue) {
          setInQueue(false);
          setQueuePosition(null);
        } else if (stillInQueue) {
          setQueuePosition(newPosition);
          setQueueStats(newStats);
        }
      }
    } catch (err) {
      console.error('Failed to check queue status:', err);
    }
  };

  const acceptMatch = async () => {
    if (!currentMatch) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/matchmaking/matches/${currentMatch.id}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedMatch = data.data.match;
        setCurrentMatch(updatedMatch);

        // If both players accepted, start the battle
        if (updatedMatch.status === 'accepted') {
          onMatchReady(updatedMatch);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const declineMatch = async () => {
    if (!currentMatch) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/matchmaking/matches/${currentMatch.id}/decline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCurrentMatch(null);
        setInQueue(true);
        setQueuePosition(data.data.queuePosition);
        setWaitTime(0);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRankName = (elo: number) => {
    if (elo < 1000) return 'Bronze';
    if (elo < 1200) return 'Silver';
    if (elo < 1400) return 'Gold';
    if (elo < 1600) return 'Platinum';
    if (elo < 1800) return 'Diamond';
    return 'Master';
  };

  // Match found modal
  if (currentMatch) {
    const opponent = currentMatch.player1.userId === currentUser?.id ? currentMatch.player2 : currentMatch.player1;
    const hasAccepted = currentMatch.acceptedBy.includes(currentUser?.id || '');
    const opponentAccepted = currentMatch.acceptedBy.includes(opponent.userId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Found!</h2>
            <p className="text-gray-600">You've been matched with an opponent</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="font-semibold text-gray-900">{currentUser?.displayName}</div>
                <div className="text-sm text-gray-600">{getRankName(currentUser?.elo || 0)}</div>
                <div className="text-sm font-medium text-primary-600">{currentUser?.elo} ELO</div>
              </div>

              <div className="text-center mx-4">
                <div className="text-2xl mb-1">⚔️</div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentMatch.difficultyLevel)}`}>
                  {currentMatch.difficultyLevel}
                </div>
              </div>

              <div className="text-center">
                <div className="font-semibold text-gray-900">{opponent.displayName}</div>
                <div className="text-sm text-gray-600">{getRankName(opponent.elo)}</div>
                <div className="text-sm font-medium text-primary-600">{opponent.elo} ELO</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Language</div>
              <div className="font-semibold text-gray-900 capitalize">
                {currentMatch.language === 'cpp' ? 'C++' : currentMatch.language}
              </div>
            </div>

            {/* Acceptance status */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg border-2 text-center ${
                hasAccepted ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-center mb-1">
                  {hasAccepted ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="text-sm font-medium">You</div>
                <div className="text-xs text-gray-600">
                  {hasAccepted ? 'Ready' : 'Waiting'}
                </div>
              </div>

              <div className={`p-3 rounded-lg border-2 text-center ${
                opponentAccepted ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-center mb-1">
                  {opponentAccepted ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="text-sm font-medium">{opponent.displayName}</div>
                <div className="text-xs text-gray-600">
                  {opponentAccepted ? 'Ready' : 'Waiting'}
                </div>
              </div>
            </div>
          </div>

          {!hasAccepted && (
            <div className="flex space-x-3">
              <button
                onClick={acceptMatch}
                disabled={loading}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Accept</span>
              </button>
              <button
                onClick={declineMatch}
                disabled={loading}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Decline</span>
              </button>
            </div>
          )}

          {hasAccepted && !opponentAccepted && (
            <div className="text-center">
              <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-gray-600">Waiting for opponent to accept...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!inQueue ? (
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Battle</h1>
            <p className="text-gray-600">
              Challenge other programmers in real-time coding battles
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Programming Languages
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {availableLanguages.map((lang) => (
                  <label
                    key={lang.id}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedLanguages.includes(lang.id)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLanguages([...selectedLanguages, lang.id]);
                        } else {
                          setSelectedLanguages(selectedLanguages.filter(l => l !== lang.id));
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-2xl">{lang.icon}</span>
                    <span className="font-medium">{lang.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={joinQueue}
              disabled={loading || selectedLanguages.length === 0}
              className="w-full btn-primary flex items-center justify-center space-x-3 py-4 text-lg"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>Join Matchmaking Queue</span>
            </button>

            <div className="text-center text-sm text-gray-600">
              <p>• Fair matchmaking based on your ELO rating</p>
              <p>• 10 questions per battle, 30 seconds each</p>
              <p>• Gain or lose ELO based on performance</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Searching for Opponent</h2>
            <p className="text-gray-600">
              Finding a worthy challenger for you...
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Wait Time</span>
              </div>
              <span className="font-mono text-lg font-semibold text-gray-900">
                {formatTime(waitTime)}
              </span>
            </div>

            {queuePosition && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">Position in Queue</span>
                </div>
                <span className="font-semibold text-gray-900">#{queuePosition}</span>
              </div>
            )}

            {estimatedWaitTime && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">Estimated Wait</span>
                </div>
                <span className="font-semibold text-blue-900">
                  ~{Math.ceil(estimatedWaitTime / 60)} min
                </span>
              </div>
            )}
          </div>

          {queueStats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{queueStats.totalPlayers}</div>
                <div className="text-xs text-gray-600">Players Online</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{queueStats.averageElo}</div>
                <div className="text-xs text-gray-600">Average ELO</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{queueStats.averageWaitTime}s</div>
                <div className="text-xs text-gray-600">Avg Wait</div>
              </div>
            </div>
          )}

          <button
            onClick={leaveQueue}
            disabled={loading}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Leave Queue</span>
          </button>
        </div>
      )}

      {/* Current user info */}
      {currentUser && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Your Battle Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{currentUser.elo}</div>
              <div className="text-sm text-gray-600">ELO Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{getRankName(currentUser.elo)}</div>
              <div className="text-sm text-gray-600">Current Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{currentUser.level}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {currentUser.preferredLanguages?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};