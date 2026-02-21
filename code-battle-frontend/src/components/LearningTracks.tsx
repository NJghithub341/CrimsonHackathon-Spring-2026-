import React from 'react';
import { BookOpen, Code, Database, Globe, Shield, Cpu, CheckCircle, Lock, Play } from 'lucide-react';
import { ProgrammingLanguage } from '../types';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // minutes
  xpReward: number;
  isCompleted: boolean;
  isLocked: boolean;
  prerequisite?: string;
}

interface LearningTrack {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  language: ProgrammingLanguage;
  color: string;
  modules: LearningModule[];
  completedModules: number;
  totalModules: number;
  estimatedCompletion: number; // hours
}

interface LearningTracksProps {
  userTracks: LearningTrack[];
  onStartModule: (trackId: string, moduleId: string) => void;
  onSelectTrack: (trackId: string) => void;
}

export const LearningTracks: React.FC<LearningTracksProps> = ({
  userTracks,
  onStartModule,
  onSelectTrack,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageIcon = (language: ProgrammingLanguage) => {
    switch (language) {
      case 'python': return <Code className="w-5 h-5" />;
      case 'java': return <Cpu className="w-5 h-5" />;
      case 'cpp': return <Database className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const TrackCard: React.FC<{ track: LearningTrack }> = ({ track }) => {
    const progress = (track.completedModules / track.totalModules) * 100;
    const nextModule = track.modules.find(m => !m.isCompleted && !m.isLocked);

    return (
      <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectTrack(track.id)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${track.color}`}>
              {track.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{track.name}</h3>
              <p className="text-sm text-gray-600">{track.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            {getLanguageIcon(track.language)}
            <span className="capitalize">{track.language === 'cpp' ? 'C++' : track.language}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{track.completedModules}/{track.totalModules} modules</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>⏱️ {track.estimatedCompletion}h total</span>
            <span>🏆 {track.modules.reduce((sum, m) => sum + m.xpReward, 0)} XP</span>
          </div>
          {nextModule && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartModule(track.id, nextModule.id);
              }}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium"
            >
              <Play className="w-4 h-4" />
              <span>Continue</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const ModuleCard: React.FC<{ module: LearningModule; trackId: string }> = ({ module, trackId }) => (
    <div className={`card ${module.isLocked ? 'opacity-60' : 'hover:shadow-md transition-shadow'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900">{module.title}</h4>
            {module.isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : module.isLocked ? (
              <Lock className="w-5 h-5 text-gray-400" />
            ) : null}
          </div>
          <p className="text-sm text-gray-600 mb-3">{module.description}</p>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className={`px-2 py-1 rounded-full ${getDifficultyColor(module.difficulty)}`}>
              {module.difficulty}
            </span>
            <span>⏱️ {formatTime(module.estimatedTime)}</span>
            <span>🏆 {module.xpReward} XP</span>
          </div>
        </div>

        <div className="ml-4">
          {!module.isLocked && !module.isCompleted && (
            <button
              onClick={() => onStartModule(trackId, module.id)}
              className="btn-primary text-sm"
            >
              Start
            </button>
          )}
          {module.isCompleted && (
            <button className="btn-secondary text-sm">
              Review
            </button>
          )}
          {module.isLocked && (
            <div className="text-xs text-gray-400">
              {module.prerequisite && `Requires: ${module.prerequisite}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Track Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Tracks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>

      {/* Detailed Module View for Active Track */}
      {userTracks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Continue Learning: {userTracks[0].name}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {userTracks[0].modules.slice(0, 6).map((module) => (
              <ModuleCard key={module.id} module={module} trackId={userTracks[0].id} />
            ))}
          </div>
        </div>
      )}

      {/* Learning Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {userTracks.reduce((sum, track) => sum + track.completedModules, 0)}
              </div>
              <div className="text-sm text-blue-700">Modules Completed</div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-900">
                {Math.round(userTracks.reduce((sum, track) =>
                  sum + (track.completedModules / track.totalModules) * 100, 0) / userTracks.length) || 0}%
              </div>
              <div className="text-sm text-green-700">Average Progress</div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-900">
                {userTracks.length}
              </div>
              <div className="text-sm text-purple-700">Active Tracks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Next Steps */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-l-4 border-primary-500">
        <h4 className="font-semibold text-primary-900 mb-3">Recommended Next Steps</h4>
        <div className="space-y-2 text-sm text-primary-800">
          {userTracks.map((track) => {
            const nextModule = track.modules.find(m => !m.isCompleted && !m.isLocked);
            if (nextModule) {
              return (
                <div key={track.id} className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Continue with "{nextModule.title}" in {track.name}</span>
                </div>
              );
            }
            return null;
          }).filter(Boolean)}
        </div>
      </div>
    </div>
  );
};