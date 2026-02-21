import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Please log in to access your dashboard.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, {currentUser.displayName}!
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Your Stats</h3>
          <div className="space-y-2">
            <p>ELO: <span className="font-bold text-primary-600">{currentUser.elo}</span></p>
            <p>Level: <span className="font-bold">{currentUser.level}</span></p>
            <p>Experience: <span className="font-bold">{currentUser.experience} XP</span></p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full btn-primary">Find Battle</button>
            <button className="w-full btn-secondary">Continue Learning</button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          <p className="text-gray-600">No recent battles</p>
        </div>
      </div>
    </div>
  );
};