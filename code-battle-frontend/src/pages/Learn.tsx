import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LearningTracks } from '../components/LearningTracks';
import { LearningModule } from '../components/LearningModule';
import { BookOpen, Trophy, Target, Zap, Star, Code, Database, Cpu } from 'lucide-react';

export const Learn: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  // Sample learning tracks with comprehensive content
  const learningTracks = [
    {
      id: 'python-basics',
      name: 'Python Fundamentals',
      description: 'Master Python basics from variables to functions',
      icon: <Code className="w-6 h-6 text-white" />,
      language: 'python' as const,
      color: 'bg-blue-500',
      completedModules: 2,
      totalModules: 8,
      estimatedCompletion: 15,
      modules: [
        {
          id: 'python-variables',
          title: 'Variables and Data Types',
          description: 'Learn about Python variables, strings, numbers, and booleans',
          difficulty: 'easy' as const,
          estimatedTime: 30,
          xpReward: 50,
          isCompleted: true,
          isLocked: false,
        },
        {
          id: 'python-operators',
          title: 'Operators and Expressions',
          description: 'Understand arithmetic, comparison, and logical operators',
          difficulty: 'easy' as const,
          estimatedTime: 25,
          xpReward: 50,
          isCompleted: true,
          isLocked: false,
        },
        {
          id: 'python-control',
          title: 'Control Flow',
          description: 'Master if statements, loops, and conditional logic',
          difficulty: 'medium' as const,
          estimatedTime: 45,
          xpReward: 75,
          isCompleted: false,
          isLocked: false,
        },
        {
          id: 'python-functions',
          title: 'Functions and Scope',
          description: 'Create reusable code with functions and understand scope',
          difficulty: 'medium' as const,
          estimatedTime: 60,
          xpReward: 100,
          isCompleted: false,
          isLocked: true,
          prerequisite: 'Control Flow',
        },
      ],
    },
    {
      id: 'java-oop',
      name: 'Java Object-Oriented Programming',
      description: 'Learn OOP concepts with Java',
      icon: <Cpu className="w-6 h-6 text-white" />,
      language: 'java' as const,
      color: 'bg-orange-500',
      completedModules: 0,
      totalModules: 6,
      estimatedCompletion: 20,
      modules: [
        {
          id: 'java-classes',
          title: 'Classes and Objects',
          description: 'Understand the fundamentals of object-oriented programming',
          difficulty: 'medium' as const,
          estimatedTime: 45,
          xpReward: 75,
          isCompleted: false,
          isLocked: false,
        },
        {
          id: 'java-inheritance',
          title: 'Inheritance and Polymorphism',
          description: 'Master advanced OOP concepts',
          difficulty: 'hard' as const,
          estimatedTime: 75,
          xpReward: 125,
          isCompleted: false,
          isLocked: true,
          prerequisite: 'Classes and Objects',
        },
      ],
    },
    {
      id: 'cpp-algorithms',
      name: 'C++ Algorithms and Data Structures',
      description: 'Efficient algorithms and data structures in C++',
      icon: <Database className="w-6 h-6 text-white" />,
      language: 'cpp' as const,
      color: 'bg-purple-500',
      completedModules: 0,
      totalModules: 10,
      estimatedCompletion: 25,
      modules: [
        {
          id: 'cpp-arrays',
          title: 'Arrays and Vectors',
          description: 'Working with arrays and dynamic vectors in C++',
          difficulty: 'medium' as const,
          estimatedTime: 50,
          xpReward: 75,
          isCompleted: false,
          isLocked: false,
        },
      ],
    },
  ];

  // Sample questions for the active module
  const getModuleQuestions = (moduleId: string) => {
    const questionSets: Record<string, any[]> = {
      'python-control': [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'Which keyword is used to start a conditional statement in Python?',
          options: ['when', 'if', 'condition', 'check'],
          correctAnswer: 1,
          explanation: 'The "if" keyword is used to start conditional statements in Python. It evaluates a condition and executes code if the condition is True.',
          difficulty: 'easy',
          xpReward: 25,
        },
        {
          id: '2',
          type: 'fill-blank',
          question: 'Complete the code to check if a number is positive:',
          code: 'number = 5\n___ number > 0:\n    print("Positive")',
          correctAnswer: 'if',
          explanation: 'The "if" statement checks if the condition "number > 0" is True. If it is, the indented code block will execute.',
          difficulty: 'easy',
          xpReward: 30,
        },
        {
          id: '3',
          type: 'multiple-choice',
          question: 'What will this code print?',
          code: 'x = 10\nif x > 5:\n    print("A")\nelse:\n    print("B")',
          options: ['A', 'B', 'AB', 'Nothing'],
          correctAnswer: 0,
          explanation: 'Since x = 10 and 10 > 5 is True, the code executes the first print statement, outputting "A".',
          difficulty: 'medium',
          xpReward: 35,
        },
        {
          id: '4',
          type: 'multiple-choice',
          question: 'Which loop is best for iterating over a list in Python?',
          options: ['while loop', 'for loop', 'do-while loop', 'repeat loop'],
          correctAnswer: 1,
          explanation: 'The "for" loop is the most Pythonic way to iterate over sequences like lists, strings, and ranges.',
          difficulty: 'medium',
          xpReward: 40,
        },
        {
          id: '5',
          type: 'fill-blank',
          question: 'Complete the loop to print numbers 0 to 4:',
          code: '___ i in range(5):\n    print(i)',
          correctAnswer: 'for',
          explanation: 'The "for" loop with range(5) iterates through numbers 0, 1, 2, 3, 4.',
          difficulty: 'easy',
          xpReward: 30,
        },
      ],
      'python-variables': [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'Which of these is a valid variable name in Python?',
          options: ['2name', 'my_name', 'class', 'my-name'],
          correctAnswer: 1,
          explanation: 'Variable names can contain letters, numbers, and underscores, but cannot start with a number or be a reserved keyword.',
          difficulty: 'easy',
          xpReward: 25,
        },
      ],
      'java-classes': [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'What keyword is used to create a class in Java?',
          options: ['class', 'Class', 'new', 'object'],
          correctAnswer: 0,
          explanation: 'The "class" keyword (lowercase) is used to define a new class in Java.',
          difficulty: 'easy',
          xpReward: 25,
        },
      ],
      'cpp-arrays': [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'How do you declare an array of 10 integers in C++?',
          options: ['int array[10];', 'int[10] array;', 'array int[10];', 'int array(10);'],
          correctAnswer: 0,
          explanation: 'In C++, arrays are declared as: type arrayName[size];',
          difficulty: 'easy',
          xpReward: 25,
        },
      ],
    };

    return questionSets[moduleId] || [];
  };

  const handleStartModule = (trackId: string, moduleId: string) => {
    setCurrentTrack(trackId);
    setActiveModule(moduleId);
  };

  const handleSelectTrack = (trackId: string) => {
    console.log(`Selected track: ${trackId}`);
    // TODO: Navigate to track detail view
  };

  const handleModuleComplete = (score: number, totalXP: number) => {
    console.log(`Module completed! Score: ${score}, XP: ${totalXP}`);
    // TODO: Update user progress, award XP, unlock next modules
    setActiveModule(null);
    setCurrentTrack(null);

    // Show success notification
    alert(`Great job! You earned ${totalXP} XP with a score of ${score}!`);
  };

  const handleModuleExit = () => {
    setActiveModule(null);
    setCurrentTrack(null);
  };

  // If a module is active, show the learning module interface
  if (activeModule) {
    const track = learningTracks.find(t => t.id === currentTrack);
    const module = track?.modules.find(m => m.id === activeModule);
    const questions = getModuleQuestions(activeModule);

    if (!module || questions.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Not Ready</h2>
            <p className="text-gray-600 mb-6">This learning module is still being prepared. Please try another module!</p>
            <button onClick={handleModuleExit} className="btn-primary">
              Back to Learning
            </button>
          </div>
        </div>
      );
    }

    return (
      <LearningModule
        moduleId={activeModule}
        title={module.title}
        description={module.description}
        questions={questions}
        onComplete={handleModuleComplete}
        onExit={handleModuleExit}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Learn Programming</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master programming languages through interactive lessons, practice problems, and hands-on exercises.
          Earn XP, unlock achievements, and build your coding skills step by step.
        </p>
      </div>

      {/* User Progress Overview */}
      {currentUser && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {learningTracks.reduce((sum, track) => sum + track.completedModules, 0)}
                </div>
                <div className="text-sm text-blue-700">Modules Completed</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-900">{currentUser.experience}</div>
                <div className="text-sm text-yellow-700">Total XP</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900">{currentUser.level}</div>
                <div className="text-sm text-green-700">Current Level</div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900">{learningTracks.length}</div>
                <div className="text-sm text-purple-700">Active Tracks</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Tracks */}
      <LearningTracks
        userTracks={learningTracks}
        onStartModule={handleStartModule}
        onSelectTrack={handleSelectTrack}
      />

      {/* Daily Challenge Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-l-4 border-primary-500">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-primary-900 mb-2 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Daily Challenge
            </h3>
            <p className="text-primary-800 mb-4">
              Complete today's challenge to earn bonus XP and maintain your learning streak!
            </p>
            <div className="text-sm text-primary-700">
              🔥 Current streak: 3 days • 🏆 Bonus XP: 100
            </div>
          </div>
          <button className="btn-primary">
            Take Challenge
          </button>
        </div>
      </div>

      {/* Learning Tips */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Learning Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Practice consistently, even if just for 15 minutes a day</li>
            <li>• Don't skip the fundamentals - they're crucial for advanced topics</li>
            <li>• Try to solve problems without looking at solutions first</li>
            <li>• Join the community to discuss problems and get help</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Progress Tracking</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Weekly Goal</span>
              <span className="text-sm font-medium">4/5 modules</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <div className="text-xs text-gray-500">Keep it up! 1 more module to reach your weekly goal.</div>
          </div>
        </div>
      </div>
    </div>
  );
};