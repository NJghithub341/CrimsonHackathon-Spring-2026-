import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Sword, BookOpen, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Logo animation
  const logoSpring = useSpring({
    from: { opacity: 0, transform: 'translateX(-50px) scale(0.8)' },
    to: { opacity: 1, transform: 'translateX(0px) scale(1)' },
    delay: 100
  });

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.nav
      className="border-pixel p-4"
      style={{
        borderColor: 'var(--pixel-primary)',
        borderBottomWidth: '3px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)'
      }}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <animated.div style={logoSpring}>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  textShadow: '0 0 20px var(--pixel-primary)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="flex items-center space-x-3 text-minecraft-lg font-bold"
                  style={{ color: 'var(--pixel-primary)' }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Sword className="w-8 h-8" />
                  </motion.div>
                  <span>⚔️ CODEBATTLE</span>
                </Link>
              </motion.div>
            </animated.div>

            {currentUser && (
              <motion.div
                className="hidden md:flex items-center space-x-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      delayChildren: 0.3,
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <motion.div variants={navItemVariants}>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 text-minecraft transition-all"
                      style={{ color: 'var(--pixel-light)' }}
                    >
                      <Home className="w-5 h-5" />
                      <span>🏠 DASHBOARD</span>
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div variants={navItemVariants}>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/learn"
                      className="flex items-center space-x-2 text-minecraft transition-all"
                      style={{ color: 'var(--pixel-light)' }}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>📚 LEARN</span>
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div variants={navItemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        '0 0 20px var(--pixel-danger)',
                        '0 0 40px var(--pixel-danger)',
                        '0 0 20px var(--pixel-danger)'
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Link
                      to="/matchmaking"
                      className="btn-pixel btn-danger text-minecraft font-bold"
                    >
                      ⚔️ FIND BATTLE
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </div>

          <motion.div
            className="flex items-center space-x-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  delayChildren: 0.4,
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {currentUser ? (
              <>
                <motion.div
                  className="hidden md:flex items-center space-x-3"
                  variants={navItemVariants}
                >
                  <motion.div
                    className="bg-pixel-warning border-pixel px-3 py-1"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 20px var(--pixel-warning)'
                    }}
                  >
                    <span className="text-minecraft-sm font-bold text-black">🏆 ELO: {currentUser.elo}</span>
                  </motion.div>
                  <motion.span
                    className="text-minecraft-sm"
                    style={{ color: 'var(--pixel-accent)' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    ⭐ Level {currentUser.level}
                  </motion.span>
                </motion.div>

                <motion.div
                  className="flex items-center space-x-3"
                  variants={navItemVariants}
                >
                  <motion.div
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 text-minecraft transition-all"
                      style={{ color: 'var(--pixel-success)' }}
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden md:inline">👤 {currentUser.displayName}</span>
                    </Link>
                  </motion.div>

                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-minecraft transition-all p-2"
                    style={{ color: 'var(--pixel-danger)' }}
                    title="Logout"
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                      textShadow: '0 0 10px var(--pixel-danger)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline">🚪 LOGOUT</span>
                  </motion.button>
                </motion.div>
              </>
            ) : (
              <motion.div
                className="flex items-center space-x-4"
                variants={navItemVariants}
              >
                <motion.div
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="text-minecraft transition-all"
                    style={{ color: 'var(--pixel-accent)' }}
                  >
                    👤 SIGN IN
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="btn-pixel btn-primary text-minecraft font-bold"
                  >
                    🚀 GET STARTED
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};