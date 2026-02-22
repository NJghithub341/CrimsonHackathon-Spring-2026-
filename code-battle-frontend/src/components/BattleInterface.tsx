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
      case 'easy': return 'bg-pixel-success border-pixel';
      case 'medium': return 'bg-pixel-warning border-pixel';
      case 'hard': return 'bg-pixel-danger border-pixel';
      default: return 'bg-gray-800 border-2 border-gray-600';
    }
  };

  const getHealthBar = (health: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Heart
        key={i}
        className={`w-8 h-8 transition-all hover-glow ${i < health ? 'fill-current hover-bounce' : 'text-gray-600'}`}
        style={{
          color: i < health ? 'var(--pixel-danger)' : '#374151',
          filter: i < health ? 'drop-shadow(0 0 10px var(--pixel-danger))' : 'none'
        }}
      />
    ));
  };

  const renderCountdown = () => (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="text-center battle-panel p-12">
        <div className="text-pixel-xl mb-8 pulse-glow" style={{
          fontSize: '8rem',
          color: 'var(--pixel-warning)',
          textShadow: '0 0 30px var(--pixel-warning)'
        }}>
          {Math.max(0, 3 - Math.floor((Date.now() % 4000) / 1000))}
        </div>
        <div className="text-pixel-lg" style={{ color: 'var(--pixel-primary)' }}>
          ⚔️ GET READY TO BATTLE! ⚔️
        </div>
      </div>
    </div>
  );

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    return (
      <div className="card battle-panel">
        {/* Question header */}
        <div className="flex justify-between items-center mb-6">
          <div className={`px-6 py-3 ${getDifficultyColor(currentQuestion.difficulty)} hover-glow`}>
            <span className="text-pixel font-bold text-black">{currentQuestion.difficulty.toUpperCase()}</span>
          </div>
          <div className="flex items-center space-x-3 text-pixel hover-glow" style={{ color: 'var(--pixel-warning)' }}>
            <Star className="w-6 h-6" />
            <span className="font-bold">⭐ {currentQuestion.points} PTS</span>
          </div>
        </div>

        {/* Question text */}
        <div className="text-pixel-lg mb-6" style={{ color: 'var(--pixel-light)' }}>
          💡 {currentQuestion.question}
        </div>

        {/* Code block if present */}
        {currentQuestion.code && (
          <div className="bg-black border-pixel p-6 mb-6 font-mono overflow-x-auto hover-glow" style={{
            borderColor: 'var(--pixel-primary)',
            color: 'var(--pixel-primary)',
            boxShadow: 'inset 0 0 20px rgba(0, 255, 136, 0.1)'
          }}>
            <div className="text-pixel mb-2" style={{ color: 'var(--pixel-accent)' }}>💻 CODE:</div>
            <pre className="text-pixel">{currentQuestion.code}</pre>
          </div>
        )}

        {/* Answer options */}
        <div className="space-y-3">
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              disabled={showResult}
              className={`w-full p-4 text-left border-pixel transition-all hover-bounce ${
                selectedAnswer === index
                  ? showResult
                    ? isCorrect && selectedAnswer === index
                      ? 'bg-pixel-success'
                      : 'bg-pixel-danger'
                    : 'bg-pixel-warning'
                  : showResult && index === currentQuestion.correctAnswer
                  ? 'bg-pixel-success'
                  : 'bg-gray-800 hover:bg-gray-700 hover-glow'
              }`}
              style={{
                borderColor: selectedAnswer === index
                  ? showResult
                    ? isCorrect && selectedAnswer === index
                      ? 'var(--pixel-success)'
                      : 'var(--pixel-danger)'
                    : 'var(--pixel-warning)'
                  : showResult && index === currentQuestion.correctAnswer
                  ? 'var(--pixel-success)'
                  : 'var(--pixel-accent)',
                color: selectedAnswer === index || (showResult && index === currentQuestion.correctAnswer)
                  ? 'var(--pixel-dark)'
                  : 'var(--pixel-light)'
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-black border-2 flex items-center justify-center font-bold" style={{
                  borderColor: 'currentColor',
                  color: 'var(--pixel-accent)'
                }}>
                  <span className="text-pixel">{String.fromCharCode(65 + index)}</span>
                </div>
                <span className="text-pixel">{option}</span>
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
                placeholder="💭 Type your answer..."
                className="flex-1 p-4 bg-black border-pixel text-pixel font-mono focus:outline-none hover-glow"
                style={{
                  borderColor: 'var(--pixel-accent)',
                  color: 'var(--pixel-primary)',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)'
                }}
              />
              <button
                onClick={() => handleAnswer()}
                disabled={!selectedAnswer || showResult}
                className="btn-pixel btn-primary text-pixel font-bold hover-bounce"
              >
                🚀 SUBMIT
              </button>
            </div>
          )}
        </div>

        {/* Submit button for multiple choice */}
        {currentQuestion.type === 'multiple-choice' && !showResult && (
          <div className="mt-8 text-center">
            <button
              onClick={() => handleAnswer()}
              disabled={selectedAnswer === ''}
              className="btn-pixel btn-success text-pixel font-bold hover-bounce pulse-glow"
            >
              ⚔️ SUBMIT ANSWER ⚔️
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      {/* Battle HUD */}
      <div className="max-w-6xl mx-auto">
        {/* Top bar with players */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Player 1 */}
          <div className="card battle-panel bg-pixel-primary border-pixel hover-glow" style={{ borderColor: 'var(--pixel-primary)' }}>
            <div className="text-center">
              <div className="text-6xl mb-3 hover-bounce">
                {player1.avatar}
              </div>
              <div className="text-pixel-lg font-bold mb-3" style={{ color: 'var(--pixel-primary)' }}>
                {player1.displayName}
              </div>
              <div className="flex justify-center space-x-2 mb-3">
                {getHealthBar(player1.health)}
              </div>
              <div className="text-pixel font-bold mb-2" style={{ color: 'var(--pixel-warning)' }}>
                💰 {player1.score} PTS
              </div>
              {player1.streak > 1 && (
                <div className="text-pixel pulse-glow" style={{ color: 'var(--pixel-orange)' }}>
                  🔥 {player1.streak}x STREAK
                </div>
              )}
            </div>
          </div>

          {/* Center - Timer and Question Counter */}
          <div className="text-center">
            <div className="card bg-pixel-warning border-pixel mb-4 hover-glow pulse-glow" style={{ borderColor: 'var(--pixel-warning)' }}>
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-8 h-8" style={{ color: 'var(--pixel-dark)' }} />
                <div className={`text-pixel-xl font-bold ${timeLeft <= 5 ? 'pulse-glow' : ''}`} style={{
                  fontSize: '3rem',
                  color: timeLeft <= 5 ? 'var(--pixel-danger)' : 'var(--pixel-dark)'
                }}>
                  ⏰ {timeLeft}
                </div>
              </div>
            </div>
            <div className="card bg-gray-800 border-pixel" style={{ borderColor: 'var(--pixel-accent)' }}>
              <div className="text-pixel" style={{ color: 'var(--pixel-accent)' }}>
                📊 Question {questionIndex + 1} of {sampleQuestions.length}
              </div>
            </div>
          </div>

          {/* Player 2 */}
          <div className="card battle-panel bg-pixel-danger border-pixel hover-glow" style={{ borderColor: 'var(--pixel-danger)' }}>
            <div className="text-center">
              <div className="text-6xl mb-3 hover-bounce">
                {player2.avatar}
              </div>
              <div className="text-pixel-lg font-bold mb-3" style={{ color: 'var(--pixel-danger)' }}>
                {player2.displayName}
              </div>
              <div className="flex justify-center space-x-2 mb-3">
                {getHealthBar(player2.health)}
              </div>
              <div className="text-pixel font-bold mb-2" style={{ color: 'var(--pixel-warning)' }}>
                💰 {player2.score} PTS
              </div>
              {player2.streak > 1 && (
                <div className="text-pixel pulse-glow" style={{ color: 'var(--pixel-orange)' }}>
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
            <div className="mt-8 card battle-panel text-center">
              <div className={`text-pixel-xl font-bold mb-6 pulse-glow`} style={{
                fontSize: '4rem',
                color: isCorrect ? 'var(--pixel-success)' : 'var(--pixel-danger)'
              }}>
                {isCorrect ? '✅ CORRECT!' : '❌ WRONG!'}
              </div>
              {isCorrect && (
                <div className="text-pixel-lg hover-bounce" style={{ color: 'var(--pixel-warning)' }}>
                  💰 +{currentQuestion?.points} points!
                </div>
              )}
            </div>
          </div>
        )}

        {battlePhase === 'finished' && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="card battle-panel bg-pixel-warning" style={{ borderColor: 'var(--pixel-warning)' }}>
              <div className="text-pixel-xl font-bold mb-8 pulse-glow" style={{
                fontSize: '4rem',
                color: 'var(--pixel-dark)'
              }}>
                🏆 BATTLE COMPLETE! 🏆
              </div>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center hover-bounce">
                  <div className="text-6xl mb-4">{player1.avatar}</div>
                  <div className="text-pixel-lg font-bold mb-2" style={{ color: 'var(--pixel-primary)' }}>
                    {player1.displayName}
                  </div>
                  <div className="text-pixel-xl font-bold" style={{ color: 'var(--pixel-dark)' }}>
                    💰 {player1.score}
                  </div>
                </div>
                <div className="text-center hover-bounce">
                  <div className="text-6xl mb-4">{player2.avatar}</div>
                  <div className="text-pixel-lg font-bold mb-2" style={{ color: 'var(--pixel-danger)' }}>
                    {player2.displayName}
                  </div>
                  <div className="text-pixel-xl font-bold" style={{ color: 'var(--pixel-dark)' }}>
                    💰 {player2.score}
                  </div>
                </div>
              </div>
              <div>
                <div className={`text-pixel-xl font-bold pulse-glow`} style={{
                  fontSize: '3rem',
                  color: player1.score > player2.score
                    ? 'var(--pixel-success)'
                    : player1.score < player2.score
                      ? 'var(--pixel-danger)'
                      : 'var(--pixel-accent)'
                }}>
                  {player1.score > player2.score ? '🎉 VICTORY!' : player1.score < player2.score ? '💀 DEFEAT!' : '🤝 DRAW!'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Answer status indicators */}
        {battlePhase === 'question' && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="grid grid-cols-2 gap-6">
              <div className={`card border-pixel hover-glow ${
                player1.answered ? 'bg-pixel-success' : 'bg-gray-800'
              }`} style={{
                borderColor: player1.answered ? 'var(--pixel-success)' : 'var(--pixel-accent)'
              }}>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl hover-bounce">{player1.avatar}</div>
                  <div className="text-pixel" style={{
                    color: player1.answered ? 'var(--pixel-dark)' : 'var(--pixel-light)'
                  }}>
                    {player1.answered
                      ? `⚡ Answered in ${player1.timeTaken?.toFixed(1)}s`
                      : '🤔 Thinking...'}
                  </div>
                </div>
              </div>
              <div className={`card border-pixel hover-glow ${
                player2.answered ? 'bg-pixel-success' : 'bg-gray-800'
              }`} style={{
                borderColor: player2.answered ? 'var(--pixel-success)' : 'var(--pixel-accent)'
              }}>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl hover-bounce">{player2.avatar}</div>
                  <div className="text-pixel" style={{
                    color: player2.answered ? 'var(--pixel-dark)' : 'var(--pixel-light)'
                  }}>
                    {player2.answered
                      ? `⚡ Answered in ${player2.timeTaken?.toFixed(1)}s`
                      : '🤔 Thinking...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};