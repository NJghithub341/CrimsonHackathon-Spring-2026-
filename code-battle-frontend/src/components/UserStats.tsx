import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';
import { Trophy, Target, Clock, Zap, Award, TrendingUp, Star, Code } from 'lucide-react';

interface UserStatsData {
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;
  winRate: number;
  averageResponseTime: number;
  questionsCorrect: number;
  totalQuestions: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  favoriteLanguage: string;
  practiceSessionsCompleted: number;
}

interface UserStatsProps {
  stats: UserStatsData;
}

export const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number | React.ReactNode;
    color: string;
    subtitle?: string;
    glowColor?: string;
    index: number;
  }> = ({ icon, label, value, color, subtitle, glowColor, index }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    // Animated counter for numbers
    const animatedValue = useSpring({
      number: typeof value === 'number' ? value : 0,
      from: { number: 0 },
      config: config.slow,
      delay: index * 100
    });

    // Icon bounce animation
    const iconSpring = useSpring({
      transform: isHovered ? 'scale(1.1) rotateZ(5deg)' : 'scale(1) rotateZ(0deg)',
      config: config.wobbly
    });

    return (
      <motion.div
        variants={cardVariants}
        className="card card-glow"
        whileHover={{
          y: -5,
          scale: 1.02,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-4">
          <animated.div
            className={`stat-icon ${color}`}
            style={{
              color: glowColor,
              ...iconSpring
            }}
          >
            {icon}
          </animated.div>
          <div className="flex-1">
            <div className="text-minecraft-xl" style={{ color: glowColor }}>
              {typeof value === 'number' ? (
                <animated.span>
                  {animatedValue.number.to(n => Math.floor(n).toLocaleString())}
                </animated.span>
              ) : (
                value
              )}
            </div>
            <div className="text-minecraft-sm text-gray-300">{label}</div>
            {subtitle && (
              <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(0)}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getWinRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      className="space-y-8 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Battle Statistics */}
      <motion.div variants={cardVariants}>
        <motion.h3
          className="text-minecraft-lg mb-6 flex items-center"
          style={{ color: 'var(--pixel-warning)' }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Trophy className="w-6 h-6 mr-3" />
          </motion.div>
          ⚔️ BATTLE STATISTICS
        </motion.h3>
        <motion.div className="grid-pixel" variants={containerVariants}>
          <StatCard
            icon={<Trophy className="w-8 h-8" />}
            label="🏆 Battles Won"
            value={stats.battlesWon}
            color="bg-pixel-warning"
            glowColor="var(--pixel-warning)"
            subtitle={`${stats.totalBattles} total battles`}
            index={0}
          />
          <StatCard
            icon={<Target className="w-8 h-8" />}
            label="🎯 Win Rate"
            value={`${stats.winRate.toFixed(1)}%`}
            color="bg-pixel-primary"
            glowColor="var(--pixel-primary)"
            subtitle={`${stats.battlesLost} losses`}
            index={1}
          />
          <StatCard
            icon={<Clock className="w-8 h-8" />}
            label="⚡ Response Time"
            value={formatTime(stats.averageResponseTime)}
            color="bg-pixel-purple"
            glowColor="var(--pixel-purple)"
            index={2}
          />
          <StatCard
            icon={<Zap className="w-8 h-8" />}
            label="🔥 Current Streak"
            value={stats.currentStreak}
            color="bg-pixel-success"
            glowColor="var(--pixel-success)"
            subtitle={`${stats.longestStreak} longest`}
            index={3}
          />
        </motion.div>
      </motion.div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-pixel-lg mb-6 flex items-center pulse-glow" style={{ color: 'var(--pixel-accent)' }}>
          <Target className="w-6 h-6 mr-3" />
          📊 PERFORMANCE METRICS
        </h3>
        <div className="grid-pixel">
          <StatCard
            icon={<Award className="w-8 h-8" />}
            label="✅ Questions Correct"
            value={stats.questionsCorrect}
            color="bg-pixel-success"
            glowColor="var(--pixel-success)"
            subtitle={`${stats.totalQuestions} total answered`}
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="📈 Accuracy Rate"
            value={`${stats.accuracy.toFixed(1)}%`}
            color="bg-pixel-accent"
            glowColor="var(--pixel-accent)"
          />
          <StatCard
            icon={<Code className="w-8 h-8" />}
            label="💻 Favorite Language"
            value={stats.favoriteLanguage === 'cpp' ? 'C++' : stats.favoriteLanguage.toUpperCase()}
            color="bg-pixel-secondary"
            glowColor="var(--pixel-secondary)"
          />
        </div>
      </div>

      {/* Learning Progress */}
      <div>
        <h3 className="text-pixel-lg mb-6 flex items-center pulse-glow" style={{ color: 'var(--pixel-primary)' }}>
          <Star className="w-6 h-6 mr-3" />
          🎓 LEARNING PROGRESS
        </h3>
        <div className="grid-pixel">
          <StatCard
            icon={<Star className="w-8 h-8" />}
            label="⭐ Total XP"
            value={stats.totalXP.toLocaleString()}
            color="bg-pixel-primary"
            glowColor="var(--pixel-primary)"
          />
          <StatCard
            icon={<Award className="w-8 h-8" />}
            label="🏅 Current Level"
            value={`LV.${stats.level}`}
            color="bg-pixel-warning"
            glowColor="var(--pixel-warning)"
            subtitle={`${stats.totalXP % 1000}/1000 to next`}
          />
          <StatCard
            icon={<Target className="w-8 h-8" />}
            label="🎯 Practice Sessions"
            value={stats.practiceSessionsCompleted}
            color="bg-pixel-success"
            glowColor="var(--pixel-success)"
            subtitle="Completed"
          />
        </div>
      </div>

      {/* Detailed Performance Breakdown */}
      <div className="card battle-panel">
        <h4 className="text-pixel-lg mb-6" style={{ color: 'var(--pixel-accent)' }}>⚡ PERFORMANCE BREAKDOWN</h4>
        <div className="space-y-6">
          {/* Win Rate Progress Bar */}
          <div>
            <div className="flex justify-between text-pixel mb-2">
              <span>🏆 Win Rate</span>
              <span style={{ color: 'var(--pixel-primary)' }}>
                {stats.winRate.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
          </div>

          {/* Accuracy Progress Bar */}
          <div>
            <div className="flex justify-between text-pixel mb-2">
              <span>🎯 Answer Accuracy</span>
              <span style={{ color: 'var(--pixel-success)' }}>
                {stats.accuracy.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stats.accuracy}%`, background: 'linear-gradient(90deg, var(--pixel-success), var(--pixel-primary))' }}
              />
            </div>
          </div>

          {/* Level Progress Bar */}
          <div>
            <div className="flex justify-between text-pixel mb-2">
              <span>🏅 Level {stats.level} Progress</span>
              <span style={{ color: 'var(--pixel-warning)' }}>{stats.totalXP % 1000}/1000 XP</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(stats.totalXP % 1000) / 10}%`,
                  background: 'linear-gradient(90deg, var(--pixel-warning), var(--pixel-orange))'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-pixel-primary border-pixel hover-glow" style={{ borderColor: 'var(--pixel-primary)' }}>
          <h4 className="text-pixel-lg mb-4" style={{ color: 'var(--pixel-primary)' }}>⚔️ BATTLE SUMMARY</h4>
          <div className="text-pixel space-y-2 text-gray-300">
            <div>🏆 {stats.battlesWon} victories out of {stats.totalBattles} battles</div>
            <div>🔥 {stats.currentStreak} game win streak</div>
            <div>⚡ Average {formatTime(stats.averageResponseTime)} response time</div>
          </div>
        </div>

        <div className="card bg-pixel-success border-pixel hover-glow" style={{ borderColor: 'var(--pixel-success)' }}>
          <h4 className="text-pixel-lg mb-4" style={{ color: 'var(--pixel-success)' }}>🎓 LEARNING SUMMARY</h4>
          <div className="text-pixel space-y-2 text-gray-300">
            <div>🏅 Level {stats.level} with {stats.totalXP.toLocaleString()} XP</div>
            <div>📈 {stats.accuracy.toFixed(1)}% accuracy rate</div>
            <div>🎯 {stats.practiceSessionsCompleted} practice sessions completed</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};