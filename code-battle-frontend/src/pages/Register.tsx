import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProgrammingLanguage, LearningTrack } from '../types';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    preferredLanguages: [] as ProgrammingLanguage[],
    learningTrack: 'beginner' as LearningTrack,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.displayName);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language: ProgrammingLanguage) => {
    setFormData(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(language)
        ? prev.preferredLanguages.filter(l => l !== language)
        : [...prev.preferredLanguages, language]
    }));
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Create Account
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={formData.displayName}
            onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="input"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Languages (select at least one)
          </label>
          <div className="space-y-2">
            {(['python', 'java', 'cpp'] as ProgrammingLanguage[]).map((language) => (
              <label key={language} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferredLanguages.includes(language)}
                  onChange={() => handleLanguageChange(language)}
                  className="mr-2"
                />
                <span className="capitalize">{language === 'cpp' ? 'C++' : language}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="learningTrack" className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            id="learningTrack"
            value={formData.learningTrack}
            onChange={(e) => setFormData(prev => ({ ...prev, learningTrack: e.target.value as LearningTrack }))}
            className="input"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || formData.preferredLanguages.length === 0}
          className="w-full btn-primary"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};