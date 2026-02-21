import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Heart, Zap, Clock, Trophy, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'code-completion' | 'debug';
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

interface LearningModuleProps {
  moduleId: string;
  title: string;
  description: string;
  questions: Question[];
  onComplete: (score: number, totalXP: number) => void;
  onExit: () => void;
}

export const LearningModule: React.FC<LearningModuleProps> = ({
  moduleId,
  title,
  description,
  questions,
  onComplete,
  onExit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [earnedXP, setEarnedXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmit(true); // Auto-submit when time runs out
    }
  }, [timeLeft, isTimerActive, showResult]);

  // Reset timer for new question
  useEffect(() => {
    setTimeLeft(30);
    setSelectedAnswer('');
    setShowResult(false);
    setShowExplanation(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer: string | number) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = (timeExpired = false) => {
    if (showResult) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    setIsTimerActive(false);

    if (correct) {
      setScore(score + 1);
      setEarnedXP(earnedXP + currentQuestion.xpReward + (streak * 10)); // Streak bonus
      setStreak(streak + 1);
    } else {
      setHearts(hearts - 1);
      setStreak(0);
      if (hearts <= 1) {
        // Module failed
        setTimeout(() => {
          onComplete(score, earnedXP);
        }, 2000);
        return;
      }
    }

    // Show explanation if available
    if (currentQuestion.explanation) {
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsTimerActive(true);
    } else {
      // Module completed
      onComplete(score, earnedXP);
    }
  };

  const handleRetry = () => {
    // Reset to beginning with reduced hearts
    setCurrentQuestionIndex(0);
    setScore(0);
    setEarnedXP(0);
    setStreak(0);
    setIsTimerActive(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 mb-6">
              {currentQuestion.question}
            </div>
            {currentQuestion.code && (
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
                <pre>{currentQuestion.code}</pre>
              </div>
            )}
            <div className="grid gap-3">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? showResult
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-primary-500 bg-primary-50'
                      : showResult && index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {index === currentQuestion.correctAnswer && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                        {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 mb-6">
              {currentQuestion.question}
            </div>
            {currentQuestion.code && (
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-6">
                <pre>{currentQuestion.code}</pre>
              </div>
            )}
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              disabled={showResult}
              placeholder="Type your answer..."
              className={`w-full p-4 border-2 rounded-lg font-mono ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200 focus:border-primary-500'
              }`}
            />
            {showResult && !isCorrect && (
              <div className="text-sm text-gray-600">
                Correct answer: <code className="bg-gray-100 px-2 py-1 rounded">{currentQuestion.correctAnswer}</code>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (hearts <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Out of Hearts!</h2>
            <p className="text-gray-600">
              Don't worry, learning takes practice. Review the material and try again!
            </p>
          </div>

          <div className="space-y-3">
            <button onClick={handleRetry} className="w-full btn-primary flex items-center justify-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              <span>Retry Module</span>
            </button>
            <button onClick={onExit} className="w-full btn-secondary">
              Back to Track
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Exit</span>
          </button>

          <div className="flex items-center space-x-6">
            {/* Hearts */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 ${
                    i < hearts ? 'text-red-500 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Streak */}
            {streak > 0 && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <Zap className="w-5 h-5" />
                <span className="font-bold">{streak}</span>
              </div>
            )}

            {/* Timer */}
            <div className={`flex items-center space-x-1 ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
              <Clock className="w-5 h-5" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{title}</span>
            <span>{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </span>
            <div className="flex items-center space-x-1 text-yellow-600">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">+{currentQuestion.xpReward} XP</span>
            </div>
          </div>

          {renderQuestion()}
        </div>

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Explanation</h4>
            <p className="text-blue-800">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Score: <span className="font-bold">{score}/{questions.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              XP: <span className="font-bold text-yellow-600">{earnedXP}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            {!showResult ? (
              <button
                onClick={() => handleSubmit()}
                disabled={!selectedAnswer}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  selectedAnswer
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all flex items-center space-x-2"
              >
                <span>{currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Module'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};