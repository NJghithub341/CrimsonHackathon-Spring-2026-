import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';
import { useAuth } from '../context/AuthContext';
import { Code, Zap, Trophy, Users } from 'lucide-react';

export const Home: React.FC = () => {
  const { currentUser } = useAuth();

  // Hero title animation
  const titleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px) scale(0.9)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    config: config.gentle,
    delay: 200
  });

  // Subtitle animation
  const subtitleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle,
    delay: 600
  });

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="hero-section text-center py-20">
        <animated.h1
          className="text-orbitron-xl mb-8"
          style={{
            fontSize: '3.5rem',
            color: 'var(--pixel-primary)',
            lineHeight: 1.2,
            ...titleSpring
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 0 20px var(--pixel-primary)',
                '0 0 40px var(--pixel-primary)',
                '0 0 20px var(--pixel-primary)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ⚔️ MASTER PROGRAMMING
          </motion.span>
          <br />
          <span>THROUGH </span>
          <motion.span
            style={{ color: 'var(--pixel-warning)' }}
            animate={{
              scale: [1, 1.05, 1],
              textShadow: [
                '0 0 20px var(--pixel-warning)',
                '0 0 40px var(--pixel-warning)',
                '0 0 20px var(--pixel-warning)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
          >
            EPIC BATTLES
          </motion.span>
          <span> ⚔️</span>
        </animated.h1>

        <animated.p
          className="text-minecraft-lg mb-12 max-w-4xl mx-auto"
          style={{
            color: 'var(--pixel-light)',
            ...subtitleSpring
          }}
        >
          🎮 Learn programming concepts through interactive lessons and test your skills<br />
          in real-time 1v1 coding battles. Climb the ranks and become a programming champion! 🏆
        </animated.p>

        <motion.div
          className="space-x-6"
          variants={itemVariants}
        >
          {currentUser ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/dashboard" className="btn-pixel btn-primary text-minecraft font-bold">
                  🎯 GO TO DASHBOARD
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/matchmaking" className="btn-pixel btn-secondary text-minecraft font-bold">
                  ⚔️ FIND BATTLE
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register" className="btn-pixel btn-primary text-minecraft font-bold">
                  🚀 START LEARNING
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" className="btn-pixel btn-secondary text-minecraft font-bold">
                  👤 SIGN IN
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      <motion.div className="grid-pixel py-16" variants={containerVariants}>
        {[
          {
            icon: <Code className="w-10 h-10" />,
            title: "💻 INTERACTIVE LEARNING",
            description: "Learn Python, Java, and C++ through hands-on exercises and challenges",
            color: 'var(--pixel-primary)',
            bgClass: 'bg-pixel-primary'
          },
          {
            icon: <Zap className="w-10 h-10" />,
            title: "⚡ REAL-TIME BATTLES",
            description: "Face off against opponents in fast-paced 30-second coding challenges",
            color: 'var(--pixel-success)',
            bgClass: 'bg-pixel-success'
          },
          {
            icon: <Trophy className="w-10 h-10" />,
            title: "🏆 ELO RANKING",
            description: "Climb the leaderboard with our chess-inspired ranking system",
            color: 'var(--pixel-warning)',
            bgClass: 'bg-pixel-warning'
          },
          {
            icon: <Users className="w-10 h-10" />,
            title: "🎯 SMART MATCHMAKING",
            description: "Get matched with opponents of similar skill level for fair competition",
            color: 'var(--pixel-secondary)',
            bgClass: 'bg-pixel-secondary'
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="card card-glow text-center"
            variants={itemVariants}
            whileHover={{
              y: -10,
              scale: 1.05,
              transition: { type: "spring", stiffness: 300, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`stat-icon ${feature.bgClass} mb-4 mx-auto`}
              style={{ color: feature.color }}
              whileHover={{
                rotate: [0, -10, 10, 0],
                scale: 1.1
              }}
              transition={{ duration: 0.3 }}
            >
              {feature.icon}
            </motion.div>
            <motion.h3
              className="text-minecraft-lg mb-4"
              style={{ color: feature.color }}
              whileHover={{ scale: 1.05 }}
            >
              {feature.title}
            </motion.h3>
            <p className="text-minecraft-sm" style={{ color: 'var(--pixel-light)' }}>
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="card battle-panel py-16"
        variants={itemVariants}
      >
        <motion.h2
          className="text-orbitron-xl text-center mb-16"
          style={{
            fontSize: '2.5rem',
            color: 'var(--pixel-accent)'
          }}
          animate={{
            textShadow: [
              '0 0 20px var(--pixel-accent)',
              '0 0 40px var(--pixel-accent)',
              '0 0 20px var(--pixel-accent)'
            ]
          }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          🎯 HOW IT WORKS
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-3 gap-8 text-center"
          variants={containerVariants}
        >
          {[
            {
              number: "1",
              title: "📝 SIGN UP & ASSESS",
              description: "Create your account and take our skill assessment to determine your starting ELO",
              color: 'var(--pixel-primary)',
              bgClass: 'bg-pixel-primary'
            },
            {
              number: "2",
              title: "📚 LEARN & PRACTICE",
              description: "Study programming concepts through our Duolingo-style learning modules",
              color: 'var(--pixel-success)',
              bgClass: 'bg-pixel-success'
            },
            {
              number: "3",
              title: "⚔️ BATTLE & RANK UP",
              description: "Enter matchmaking to battle other players and climb the global leaderboard",
              color: 'var(--pixel-warning)',
              bgClass: 'bg-pixel-warning'
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <motion.div
                className={`w-16 h-16 ${step.bgClass} border-pixel mx-auto mb-6 flex items-center justify-center`}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  boxShadow: `0 0 30px ${step.color}`
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-minecraft-lg font-bold text-black">{step.number}</span>
              </motion.div>
              <motion.h3
                className="text-minecraft-lg mb-4"
                style={{ color: step.color }}
                whileHover={{ scale: 1.05 }}
              >
                {step.title}
              </motion.h3>
              <p className="text-minecraft-sm" style={{ color: 'var(--pixel-light)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};