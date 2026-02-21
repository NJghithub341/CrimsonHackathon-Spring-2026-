import React, { useState } from 'react';
import { ProgrammingLanguage, LearningTrack } from '../types';
import { ChevronLeft, ChevronRight, Code, BookOpen, Zap, Trophy } from 'lucide-react';

interface QuestionnaireData {
  experienceLevel: LearningTrack;
  preferredLanguages: ProgrammingLanguage[];
  yearsExperience: number;
  previousProjects: number;
  comfortWithDataStructures: number;
  comfortWithAlgorithms: number;
  codingFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  favoriteTopics: string[];
  hasContributedToOpenSource: boolean;
  hasCompetitiveProgrammingExperience: boolean;
}

interface SkillQuestionnaireProps {
  onComplete: (data: QuestionnaireData) => void;
  onBack: () => void;
}

export const SkillQuestionnaire: React.FC<SkillQuestionnaireProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuestionnaireData>({
    experienceLevel: 'beginner',
    preferredLanguages: [],
    yearsExperience: 0,
    previousProjects: 0,
    comfortWithDataStructures: 1,
    comfortWithAlgorithms: 1,
    codingFrequency: 'weekly',
    favoriteTopics: [],
    hasContributedToOpenSource: false,
    hasCompetitiveProgrammingExperience: false,
  });

  const totalSteps = 6;

  const updateFormData = (updates: Partial<QuestionnaireData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleLanguageToggle = (language: ProgrammingLanguage) => {
    const currentLanguages = formData.preferredLanguages;
    if (currentLanguages.includes(language)) {
      updateFormData({
        preferredLanguages: currentLanguages.filter(l => l !== language)
      });
    } else {
      updateFormData({
        preferredLanguages: [...currentLanguages, language]
      });
    }
  };

  const handleTopicToggle = (topic: string) => {
    const currentTopics = formData.favoriteTopics;
    if (currentTopics.includes(topic)) {
      updateFormData({
        favoriteTopics: currentTopics.filter(t => t !== topic)
      });
    } else {
      updateFormData({
        favoriteTopics: [...currentTopics, topic]
      });
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Languages
        return formData.preferredLanguages.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your programming experience level?</h2>
              <p className="text-gray-600">This helps us estimate your starting ELO rating</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'Just starting out or learning basics' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Comfortable with fundamentals and some projects' },
                { value: 'advanced', label: 'Advanced', desc: 'Experienced with complex projects and patterns' },
              ].map((level) => (
                <label key={level.value} className="block">
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level.value}
                    checked={formData.experienceLevel === level.value}
                    onChange={(e) => updateFormData({ experienceLevel: e.target.value as LearningTrack })}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.experienceLevel === level.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="font-medium text-gray-900">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Code className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Which programming languages do you know?</h2>
              <p className="text-gray-600">Select all that apply (choose at least one)</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { value: 'python', label: 'Python', color: 'bg-green-100 border-green-200' },
                { value: 'java', label: 'Java', color: 'bg-red-100 border-red-200' },
                { value: 'cpp', label: 'C++', color: 'bg-blue-100 border-blue-200' },
              ].map((lang) => (
                <label key={lang.value} className="block">
                  <input
                    type="checkbox"
                    checked={formData.preferredLanguages.includes(lang.value as ProgrammingLanguage)}
                    onChange={() => handleLanguageToggle(lang.value as ProgrammingLanguage)}
                    className="sr-only"
                  />
                  <div className={`p-6 border-2 rounded-lg cursor-pointer transition-colors text-center ${
                    formData.preferredLanguages.includes(lang.value as ProgrammingLanguage)
                      ? `${lang.color} border-opacity-100`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="font-medium text-gray-900 text-lg">{lang.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience Details</h2>
              <p className="text-gray-600">Tell us about your programming journey</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of programming experience
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={formData.yearsExperience}
                  onChange={(e) => updateFormData({ yearsExperience: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center mt-2 font-medium">
                  {formData.yearsExperience === 0 ? 'Less than 1 year' : `${formData.yearsExperience} year${formData.yearsExperience > 1 ? 's' : ''}`}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of projects completed
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={formData.previousProjects}
                  onChange={(e) => updateFormData({ previousProjects: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center mt-2 font-medium">
                  {formData.previousProjects === 0 ? 'None yet' : `${formData.previousProjects} project${formData.previousProjects > 1 ? 's' : ''}`}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How often do you code?
                </label>
                <select
                  value={formData.codingFrequency}
                  onChange={(e) => updateFormData({ codingFrequency: e.target.value as any })}
                  className="input"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Several times a week</option>
                  <option value="monthly">Few times a month</option>
                  <option value="rarely">Rarely</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Skill Assessment</h2>
              <p className="text-gray-600">Rate your comfort level (1 = Beginner, 10 = Expert)</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Structures (Arrays, Lists, Trees, etc.)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.comfortWithDataStructures}
                  onChange={(e) => updateFormData({ comfortWithDataStructures: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center mt-2 font-medium">
                  Level {formData.comfortWithDataStructures}/10
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Algorithms (Sorting, Searching, etc.)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.comfortWithAlgorithms}
                  onChange={(e) => updateFormData({ comfortWithAlgorithms: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center mt-2 font-medium">
                  Level {formData.comfortWithAlgorithms}/10
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Code className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Favorite Topics</h2>
              <p className="text-gray-600">What programming topics interest you most?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Web Development',
                'Mobile Development',
                'Data Structures',
                'Algorithms',
                'Machine Learning',
                'Database Systems',
                'Operating Systems',
                'Networks',
                'Security',
                'Game Development',
                'API Development',
                'DevOps',
              ].map((topic) => (
                <label key={topic} className="block">
                  <input
                    type="checkbox"
                    checked={formData.favoriteTopics.includes(topic)}
                    onChange={() => handleTopicToggle(topic)}
                    className="sr-only"
                  />
                  <div className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.favoriteTopics.includes(topic)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-sm font-medium text-gray-900">{topic}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Questions</h2>
              <p className="text-gray-600">Just a few more details to personalize your experience</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.hasContributedToOpenSource}
                    onChange={(e) => updateFormData({ hasContributedToOpenSource: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-primary-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    I have contributed to open-source projects
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.hasCompetitiveProgrammingExperience}
                    onChange={(e) => updateFormData({ hasCompetitiveProgrammingExperience: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-primary-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    I have competitive programming experience (LeetCode, HackerRank, etc.)
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">🎯 Your Estimated Starting ELO</h3>
              <p className="text-sm text-blue-700">
                Based on your responses, we'll calculate your initial rating to match you with players of similar skill level.
                Don't worry - your rating will adjust quickly based on your actual performance!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="card min-h-[400px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="btn-secondary flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={nextStep}
          disabled={!isStepValid()}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{currentStep === totalSteps - 1 ? 'Complete Registration' : 'Next'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};