import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sword, Shield, Zap, Clock, Heart, Star } from 'lucide-react';

interface BattleQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'code-completion';
  question: string;
  code?: string;
  options?: string[];
  correctAnswer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface Player {
  userId: string;
  displayName: string;
  elo: number;
  avatar: string;
  health: number;
  score: number;
  streak: number;
  answered: boolean;
  timeTaken?: number;
}

interface BattleInterfaceProps {
  battleId: string;
  opponent: {
    userId: string;
    displayName: string;
    elo: number;
  };
  onBattleEnd: (result: any) => void;
}

export const BattleInterface: React.FC<BattleInterfaceProps> = ({
  battleId,
  opponent,
  onBattleEnd,
}) => {
  const { currentUser } = useAuth();

  // Battle state
  const [currentQuestion, setCurrentQuestion] = useState<BattleQuestion | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [battlePhase, setBattlePhase] = useState<'loading' | 'countdown' | 'question' | 'result' | 'finished'>('loading');

  // Player states
  const [player1, setPlayer1] = useState<Player>({
    userId: currentUser?.id || '',
    displayName: currentUser?.displayName || '',
    elo: currentUser?.elo || 0,
    avatar: '🧙‍♂️',
    health: 3,
    score: 0,
    streak: 0,
    answered: false,
  });

  const [player2, setPlayer2] = useState<Player>({
    userId: opponent.userId,
    displayName: opponent.displayName,
    elo: opponent.elo,
    avatar: '🧙‍♀️',
    health: 3,
    score: 0,
    streak: 0,
    answered: false,
  });

  // Sample questions - would come from backend
  const sampleQuestions: BattleQuestion[] = [
    {
      id: '1',
      type: 'multiple-choice',
      question: 'What will this Python code output?',
      code: 'numbers = [1, 2, 3]\nprint(len(numbers))',
      options: ['1', '2', '3', '4'],
      correctAnswer: 2,
      difficulty: 'easy',
      points: 100,
    },
    {
      id: '2',
      type: 'fill-blank',
      question: 'Complete the function to reverse a string:',
      code: 'def reverse_string(s):\n    return s[____]',
      correctAnswer: '::-1',
      difficulty: 'medium',
      points: 150,
    },
    {
      id: '3',
      type: 'multiple-choice',
      question: 'Which data structure uses LIFO (Last In, First Out)?',
      options: ['Queue', 'Stack', 'Array', 'Hash Table'],
      correctAnswer: 1,
      difficulty: 'medium',
      points: 150,
    },
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (battlePhase === 'question' && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswer(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [battlePhase, timeLeft, showResult]);

  // Battle initialization
  useEffect(() => {
    initializeBattle();
  }, []);

  const initializeBattle = async () => {
    setBattlePhase('countdown');

    // Countdown from 3
    let count = 3;
    const countdownInterval = setInterval(() => {
      if (count <= 0) {
        clearInterval(countdownInterval);
        startNextQuestion();
      }
      count--;
    }, 1000);
  };

  const startNextQuestion = () => {
    if (questionIndex >= sampleQuestions.length) {
      finishBattle();
      return;
    }

    const question = sampleQuestions[questionIndex];
    setCurrentQuestion(question);
    setTimeLeft(30);
    setSelectedAnswer('');
    setShowResult(false);
    setBattlePhase('question');

    // Reset player states for new question
    setPlayer1(prev => ({ ...prev, answered: false, timeTaken: undefined }));
    setPlayer2(prev => ({ ...prev, answered: false, timeTaken: undefined }));
  };

  const handleAnswer = (answer?: string | number) => {
    if (showResult || !currentQuestion) return;

    const finalAnswer = answer !== undefined ? answer : selectedAnswer;
    const timeTaken = 30 - timeLeft;
    const correct = finalAnswer === currentQuestion.correctAnswer;

    setIsCorrect(correct);
    setShowResult(true);
    setBattlePhase('result');

    // Update player stats
    setPlayer1(prev => ({
      ...prev,
      answered: true,
      timeTaken,
      score: correct ? prev.score + currentQuestion.points + (prev.streak * 50) : prev.score,
      streak: correct ? prev.streak + 1 : 0,
      health: correct ? prev.health : Math.max(0, prev.health - 1),
    }));

    // Simulate opponent answer (would come from WebSocket)
    setTimeout(() => {
      const opponentCorrect = Math.random() > 0.4; // 60% chance opponent is correct
      const opponentTime = Math.random() * 25 + 5; // 5-30 seconds

      setPlayer2(prev => ({
        ...prev,
        answered: true,
        timeTaken: opponentTime,
        score: opponentCorrect ? prev.score + currentQuestion.points + (prev.streak * 50) : prev.score,
        streak: opponentCorrect ? prev.streak + 1 : 0,
        health: opponentCorrect ? prev.health : Math.max(0, prev.health - 1),
      }));
    }, Math.random() * 3000 + 1000);

    // Move to next question after delay
    setTimeout(() => {
      setQuestionIndex(prev => prev + 1);
      startNextQuestion();
    }, 3000);
  };

  const finishBattle = () => {
    setBattlePhase('finished');
    const winner = player1.score > player2.score ? player1 : player2;
    const result = {
      winner: winner.userId === player1.userId ? 'player' : 'opponent',
      finalScore: { player1: player1.score, player2: player2.score },
      questionsAnswered: questionIndex,
    };

    setTimeout(() => {
      onBattleEnd(result);
    }, 5000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900';
      case 'medium': return 'text-yellow-400 bg-yellow-900';
      case 'hard': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getHealthBar = (health: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Heart
        key={i}
        className={`w-6 h-6 ${i < health ? 'text-red-500 fill-current' : 'text-gray-600'}`}
        style={{ imageRendering: 'pixelated' }}
      />
    ));
  };

  const renderCountdown = () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-8xl font-bold text-yellow-400 mb-8 pixel-font animate-pulse">
          {Math.max(0, 3 - Math.floor((Date.now() % 4000) / 1000))}
        </div>
        <div className="text-2xl text-white pixel-font">GET READY!</div>
      </div>
    </div>
  );

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    return (
      <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6 pixel-border">
        {/* Question header */}
        <div className="flex justify-between items-center mb-6">
          <div className={`px-4 py-2 rounded pixel-border ${getDifficultyColor(currentQuestion.difficulty)}`}>
            <span className="pixel-font font-bold">{currentQuestion.difficulty.toUpperCase()}</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-400">
            <Star className="w-5 h-5" />
            <span className="pixel-font font-bold">{currentQuestion.points} PTS</span>
          </div>
        </div>

        {/* Question text */}
        <div className="text-white text-lg pixel-font mb-6">
          {currentQuestion.question}
        </div>

        {/* Code block if present */}
        {currentQuestion.code && (
          <div className="bg-black border-2 border-green-400 p-4 rounded pixel-border mb-6 font-mono text-green-400 overflow-x-auto">
            <pre style={{ imageRendering: 'pixelated' }}>{currentQuestion.code}</pre>
          </div>
        )}

        {/* Answer options */}
        <div className="space-y-3">
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              disabled={showResult}
              className={`w-full p-4 text-left pixel-border transition-all transform hover:scale-105 ${
                selectedAnswer === index
                  ? showResult
                    ? isCorrect && selectedAnswer === index
                      ? 'bg-green-800 border-green-400 text-green-200'
                      : 'bg-red-800 border-red-400 text-red-200'
                    : 'bg-yellow-800 border-yellow-400 text-yellow-200'
                  : showResult && index === currentQuestion.correctAnswer
                  ? 'bg-green-800 border-green-400 text-green-200'
                  : 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 border-2 border-gray-500 rounded flex items-center justify-center pixel-border">
                  <span className="pixel-font font-bold">{String.fromCharCode(65 + index)}</span>
                </div>
                <span className="pixel-font">{option}</span>
              </div>
            </button>
          ))}

          {currentQuestion.type === 'fill-blank' && (
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showResult}
                placeholder="Type your answer..."
                className="flex-1 p-4 bg-gray-800 border-2 border-gray-600 text-white pixel-border pixel-font focus:border-yellow-400 focus:outline-none"
              />
              <button
                onClick={() => handleAnswer()}
                disabled={!selectedAnswer || showResult}
                className="px-6 py-4 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 border-2 border-yellow-400 text-black pixel-font font-bold pixel-border"
              >
                SUBMIT
              </button>
            </div>
          )}
        </div>

        {/* Submit button for multiple choice */}
        {currentQuestion.type === 'multiple-choice' && !showResult && (
          <div className="mt-6 text-center">
            <button
              onClick={() => handleAnswer()}
              disabled={selectedAnswer === ''}
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 border-2 border-yellow-400 text-black pixel-font font-bold pixel-border transform hover:scale-105 disabled:transform-none"
            >
              SUBMIT ANSWER
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black p-4 pixel-bg">
      {/* Battle HUD */}
      <div className="max-w-6xl mx-auto">
        {/* Top bar with players */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Player 1 */}
          <div className="bg-blue-800 border-4 border-blue-400 rounded-lg p-4 pixel-border">
            <div className="text-center">
              <div className="text-4xl mb-2" style={{ imageRendering: 'pixelated' }}>
                {player1.avatar}
              </div>
              <div className="pixel-font font-bold text-blue-200 mb-2">
                {player1.displayName}
              </div>
              <div className="flex justify-center space-x-1 mb-2">
                {getHealthBar(player1.health)}
              </div>
              <div className="text-yellow-400 pixel-font font-bold">
                {player1.score} PTS
              </div>
              {player1.streak > 1 && (
                <div className="text-orange-400 pixel-font text-sm">
                  🔥 {player1.streak}x STREAK
                </div>
              )}
            </div>
          </div>

          {/* Center - Timer and Question Counter */}
          <div className="text-center">
            <div className="bg-yellow-900 border-4 border-yellow-400 rounded-lg p-4 pixel-border mb-4">
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6 text-yellow-400" />
                <div className={`text-3xl pixel-font font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                  {timeLeft}
                </div>
              </div>
            </div>
            <div className="bg-gray-800 border-2 border-gray-600 rounded pixel-border p-2">
              <div className="pixel-font text-gray-300">
                Question {questionIndex + 1} of {sampleQuestions.length}
              </div>
            </div>
          </div>

          {/* Player 2 */}
          <div className="bg-red-800 border-4 border-red-400 rounded-lg p-4 pixel-border">
            <div className="text-center">
              <div className="text-4xl mb-2" style={{ imageRendering: 'pixelated' }}>
                {player2.avatar}
              </div>
              <div className="pixel-font font-bold text-red-200 mb-2">
                {player2.displayName}
              </div>
              <div className="flex justify-center space-x-1 mb-2">
                {getHealthBar(player2.health)}
              </div>
              <div className="text-yellow-400 pixel-font font-bold">
                {player2.score} PTS
              </div>
              {player2.streak > 1 && (
                <div className="text-orange-400 pixel-font text-sm">
                  🔥 {player2.streak}x STREAK
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Battle content */}
        {battlePhase === 'countdown' && renderCountdown()}

        {battlePhase === 'question' && (
          <div className="max-w-4xl mx-auto">
            {renderQuestion()}
          </div>
        )}

        {battlePhase === 'result' && (
          <div className="max-w-4xl mx-auto">
            {renderQuestion()}
            <div className="mt-6 bg-gray-900 border-4 border-yellow-400 rounded-lg p-6 pixel-border">
              <div className="text-center">
                <div className={`text-6xl pixel-font font-bold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'CORRECT!' : 'WRONG!'}
                </div>
                {isCorrect && (
                  <div className="text-yellow-400 pixel-font text-xl">
                    +{currentQuestion?.points} points!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {battlePhase === 'finished' && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-yellow-900 to-orange-900 border-4 border-yellow-400 rounded-lg p-8 pixel-border">
              <div className="text-6xl pixel-font font-bold text-yellow-400 mb-6">
                BATTLE COMPLETE!
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">{player1.avatar}</div>
                  <div className="pixel-font font-bold text-white">{player1.displayName}</div>
                  <div className="text-2xl pixel-font font-bold text-yellow-400">{player1.score}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">{player2.avatar}</div>
                  <div className="pixel-font font-bold text-white">{player2.displayName}</div>
                  <div className="text-2xl pixel-font font-bold text-yellow-400">{player2.score}</div>
                </div>
              </div>
              <div className="mt-6">
                <div className={`text-4xl pixel-font font-bold ${player1.score > player2.score ? 'text-green-400' : player1.score < player2.score ? 'text-red-400' : 'text-yellow-400'}`}>
                  {player1.score > player2.score ? 'VICTORY!' : player1.score < player2.score ? 'DEFEAT!' : 'DRAW!'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Answer status indicators */}
        {battlePhase === 'question' && (
          <div className="max-w-4xl mx-auto mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded pixel-border ${player1.answered ? 'bg-green-800 border-green-400' : 'bg-gray-800 border-gray-600'}`}>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">{player1.avatar}</div>
                  <div className="pixel-font text-white">
                    {player1.answered ? `Answered in ${player1.timeTaken?.toFixed(1)}s` : 'Thinking...'}
                  </div>
                </div>
              </div>
              <div className={`p-3 rounded pixel-border ${player2.answered ? 'bg-green-800 border-green-400' : 'bg-gray-800 border-gray-600'}`}>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">{player2.avatar}</div>
                  <div className="pixel-font text-white">
                    {player2.answered ? `Answered in ${player2.timeTaken?.toFixed(1)}s` : 'Thinking...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pixel art styles */}
      <style>{`
        .pixel-font {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
        }

        .pixel-border {
          border-style: solid;
          image-rendering: pixelated;
          border-radius: 0;
        }

        .pixel-bg {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0);
          background-size: 20px 20px;
          image-rendering: pixelated;
        }

        button {
          image-rendering: pixelated;
        }

        * {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  );
};