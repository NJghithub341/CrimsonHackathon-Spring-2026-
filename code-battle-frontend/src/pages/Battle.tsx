import React from 'react';
import { useParams } from 'react-router-dom';

export const Battle: React.FC = () => {
  const { battleId } = useParams<{ battleId: string }>();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Battle {battleId}</h1>
      <div className="card">
        <p className="text-gray-600">Battle interface coming soon...</p>
      </div>
    </div>
  );
};