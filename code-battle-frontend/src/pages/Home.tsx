import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code, Zap, Trophy, Users } from 'lucide-react';

export const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="hero-section text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Master Programming Through <span className="text-primary-600">Competition</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Learn programming concepts through interactive lessons and test your skills
          in real-time 1v1 coding battles. Climb the ranks and become a programming champion!
        </p>

        {currentUser ? (
          <div className="space-x-4">
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
              Go to Dashboard
            </Link>
            <Link to="/matchmaking" className="btn-secondary text-lg px-8 py-3">
              Find Battle
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Start Learning
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div className="features-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
        <div className="feature-card text-center">
          <div className="icon-wrapper bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
          <p className="text-gray-600">
            Learn Python, Java, and C++ through hands-on exercises and challenges
          </p>
        </div>

        <div className="feature-card text-center">
          <div className="icon-wrapper bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Real-time Battles</h3>
          <p className="text-gray-600">
            Face off against opponents in fast-paced 30-second coding challenges
          </p>
        </div>

        <div className="feature-card text-center">
          <div className="icon-wrapper bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">ELO Ranking</h3>
          <p className="text-gray-600">
            Climb the leaderboard with our chess-inspired ranking system
          </p>
        </div>

        <div className="feature-card text-center">
          <div className="icon-wrapper bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Matchmaking</h3>
          <p className="text-gray-600">
            Get matched with opponents of similar skill level for fair competition
          </p>
        </div>
      </div>

      <div className="how-it-works py-16 bg-white rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="step">
            <div className="step-number bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign Up & Assess</h3>
            <p className="text-gray-600">
              Create your account and take our skill assessment to determine your starting ELO
            </p>
          </div>

          <div className="step">
            <div className="step-number bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Learn & Practice</h3>
            <p className="text-gray-600">
              Study programming concepts through our Duolingo-style learning modules
            </p>
          </div>

          <div className="step">
            <div className="step-number bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Battle & Rank Up</h3>
            <p className="text-gray-600">
              Enter matchmaking to battle other players and climb the global leaderboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};