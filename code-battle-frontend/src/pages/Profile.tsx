import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Profile: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">{currentUser.displayName}</h2>
        <div className="space-y-2">
          <p>Email: {currentUser.email}</p>
          <p>ELO: {currentUser.elo}</p>
          <p>Level: {currentUser.level}</p>
          <p>Experience: {currentUser.experience} XP</p>
        </div>
      </div>
    </div>
  );
};