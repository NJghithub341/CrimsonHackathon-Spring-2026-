import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code, Zap, Trophy, Users } from 'lucide-react';

const sans = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const features = [
  {
    icon: <Code size={20} />,
    title: 'Interactive Learning',
    description: 'Structured lessons in Python, Java, and C++ with hands-on exercises at every step.',
  },
  {
    icon: <Zap size={20} />,
    title: 'Real-Time Battles',
    description: 'Compete in timed 1v1 coding challenges against opponents matched to your skill level.',
  },
  {
    icon: <Trophy size={20} />,
    title: 'ELO Ranking',
    description: 'A chess-inspired rating system that accurately reflects your skill and tracks your growth.',
  },
  {
    icon: <Users size={20} />,
    title: 'Smart Matchmaking',
    description: 'Fair pairing ensures every match is competitive — no stomps, no walkovers.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Sign Up & Assess',
    description: 'Create an account and complete a short skill assessment to set your starting ELO.',
  },
  {
    number: '02',
    title: 'Learn & Practice',
    description: 'Work through language-specific modules and strengthen weak areas before you battle.',
  },
  {
    number: '03',
    title: 'Battle & Rank Up',
    description: 'Enter matchmaking, win rounds, and climb the global leaderboard.',
  },
];

export const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div style={{ fontFamily: sans, color: 'rgba(255,255,255,0.9)' }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '76vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 64px',
        maxWidth: '760px',
        margin: '0 auto',
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '1.6px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.38)',
          marginBottom: '28px',
        }}>
          Competitive Coding Platform
        </p>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 4rem)',
          fontWeight: '700',
          lineHeight: '1.12',
          letterSpacing: '-0.03em',
          color: '#ffffff',
          margin: '0 0 24px',
        }}>
          Master programming<br />through competition.
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          lineHeight: '1.65',
          color: 'rgba(255,255,255,0.52)',
          maxWidth: '520px',
          margin: '0 0 44px',
        }}>
          Build real skills, earn your rank, and battle opponents matched to your exact level.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {currentUser ? (
            <>
              <Link to="/dashboard" style={primaryBtnStyle}>Go to Dashboard</Link>
              <Link to="/matchmaking" style={secondaryBtnStyle}>Find a Battle</Link>
            </>
          ) : (
            <>
              <Link to="/register" style={primaryBtnStyle}>Get Started</Link>
              <Link to="/login" style={secondaryBtnStyle}>Sign In</Link>
            </>
          )}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '1100px', margin: '0 auto' }} />

      {/* ── Features ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
          fontWeight: '600',
          letterSpacing: '-0.02em',
          color: '#ffffff',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          Everything you need to level up.
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.45)',
          fontSize: '15px',
          marginBottom: '52px',
        }}>
          One platform for learning, practice, and competition.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
        }}>
          {features.map((f) => (
            <div key={f.title} style={featureCardStyle}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '16px',
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '8px',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: '13.5px',
                lineHeight: '1.65',
                color: 'rgba(255,255,255,0.45)',
                margin: 0,
              }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '1100px', margin: '0 auto' }} />

      {/* ── How It Works ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
          fontWeight: '600',
          letterSpacing: '-0.02em',
          color: '#ffffff',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          How it works.
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.45)',
          fontSize: '15px',
          marginBottom: '52px',
        }}>
          From zero to ranked in three steps.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0',
        }}>
          {steps.map((s, i) => (
            <div key={s.number} style={{
              padding: '32px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : undefined,
            }}>
              <p style={{
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '1.4px',
                color: 'rgba(255,255,255,0.25)',
                marginBottom: '20px',
              }}>
                {s.number}
              </p>
              <h3 style={{
                fontSize: '17px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '10px',
              }}>
                {s.title}
              </h3>
              <p style={{
                fontSize: '13.5px',
                lineHeight: '1.65',
                color: 'rgba(255,255,255,0.45)',
                margin: 0,
              }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: '1100px', margin: '0 auto' }} />

      {/* ── Bottom CTA ── */}
      <section style={{
        textAlign: 'center',
        padding: '80px 24px 96px',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: '700',
          letterSpacing: '-0.025em',
          color: '#ffffff',
          marginBottom: '16px',
        }}>
          Start competing today.
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.45)',
          marginBottom: '36px',
          lineHeight: '1.65',
        }}>
          Join developers who are sharpening their skills through real competition.
        </p>
        {currentUser ? (
          <Link to="/matchmaking" style={primaryBtnStyle}>Find a Battle</Link>
        ) : (
          <Link to="/register" style={primaryBtnStyle}>Create Free Account</Link>
        )}
      </section>

    </div>
  );
};

const primaryBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 26px',
  borderRadius: '8px',
  background: '#ffffff',
  color: '#0f0f23',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: sans,
  textDecoration: 'none',
  letterSpacing: '-0.01em',
  transition: 'opacity 0.15s ease',
};

const secondaryBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 26px',
  borderRadius: '8px',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'rgba(255,255,255,0.8)',
  fontSize: '14px',
  fontWeight: '500',
  fontFamily: sans,
  textDecoration: 'none',
  letterSpacing: '-0.01em',
};

const featureCardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '28px',
};
