import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SkillQuestionnaire } from '../components/SkillQuestionnaire';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

type RegistrationStep = 'basic' | 'questionnaire';

interface BasicInfo {
  email: string;
  password: string;
  displayName: string;
}

export const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('basic');
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    email: '',
    password: '',
    displayName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!basicInfo.email || !basicInfo.password || !basicInfo.displayName) {
      setError('All fields are required');
      return;
    }

    if (basicInfo.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = async (questionnaireData: any) => {
    setLoading(true);
    setError('');

    try {
      // Combine basic info with questionnaire data
      const registrationData = {
        ...basicInfo,
        questionnaire: questionnaireData,
      };

      await register(
        registrationData.email,
        registrationData.password,
        registrationData.displayName,
        registrationData.questionnaire
      );

      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to create account. Please try again.');
      setCurrentStep('basic'); // Go back to basic info on error
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBasicInfo = () => {
    setCurrentStep('basic');
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto card text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Account</h2>
        <p className="text-gray-600">
          We're calculating your starting ELO and setting up your profile...
        </p>
      </div>
    );
  }

  if (currentStep === 'questionnaire') {
    return (
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Almost There!</h1>
          <p className="text-gray-600">
            Help us personalize your CodeBattle experience with a quick skill assessment
          </p>
        </div>
        <SkillQuestionnaire
          onComplete={handleQuestionnaireComplete}
          onBack={handleBackToBasicInfo}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto card">
      <div className="text-center mb-6">
        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Join CodeBattle
        </h2>
        <p className="text-gray-600">
          Create your account to start competing and learning
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="displayName"
              value={basicInfo.displayName}
              onChange={(e) => setBasicInfo(prev => ({ ...prev, displayName: e.target.value }))}
              className="input pl-10"
              placeholder="Your display name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              value={basicInfo.email}
              onChange={(e) => setBasicInfo(prev => ({ ...prev, email: e.target.value }))}
              className="input pl-10"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              id="password"
              value={basicInfo.password}
              onChange={(e) => setBasicInfo(prev => ({ ...prev, password: e.target.value }))}
              className="input pl-10"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>

        <button
          type="submit"
          className="w-full btn-primary"
        >
          Continue to Skill Assessment
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">What's Next?</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Quick skill assessment (2-3 minutes)</li>
          <li>• Personalized ELO calculation</li>
          <li>• Customized learning path</li>
          <li>• Ready to battle!</li>
        </ul>
      </div>
    </div>
  );
};