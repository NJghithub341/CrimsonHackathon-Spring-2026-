import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const sans = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const Home: React.FC = () => {
  const { currentUser, joinAsGuest } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlay = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setError('');
    setLoading(true);
    try {
      await joinAsGuest(trimmed);
      navigate('/matchmaking');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: sans,
    }}>

      {/* Existing session */}
      {currentUser ? (
        <div style={{ textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '20px',
          }}>
            Welcome back
          </p>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: '0 0 8px',
          }}>
            {currentUser.displayName}
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.4)',
            margin: '0 0 36px',
          }}>
            ELO {currentUser.elo} · Level {currentUser.level}
          </p>

          <button
            onClick={() => navigate('/matchmaking')}
            style={primaryBtn}
          >
            Play Now →
          </button>
        </div>

      ) : (

        /* New session — name entry */
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '16px',
            }}>
              CodeBattle
            </p>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: '0 0 12px',
              lineHeight: 1.15,
            }}>
              1v1 coding battles, no signup required.
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: '1.6',
              margin: 0,
            }}>
              Enter your name and get matched with another player instantly.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              marginBottom: '16px',
              background: 'rgba(255,60,60,0.08)',
              border: '1px solid rgba(255,60,60,0.2)',
              borderRadius: '8px',
              color: 'rgba(255,120,120,0.9)',
              fontSize: '13px',
              lineHeight: '1.5',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handlePlay} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={24}
              required
              autoFocus
              autoComplete="off"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.92)',
                fontFamily: sans,
                fontSize: '15px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !name.trim()}
              style={{
                ...primaryBtn,
                opacity: loading || !name.trim() ? 0.45 : 1,
                cursor: loading || !name.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Joining...' : 'Play Now →'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.25)',
            lineHeight: '1.6',
          }}>
            Python · Java · C++ — 10 questions · 30 seconds each
          </p>
        </div>
      )}

    </div>
  );
};

const primaryBtn: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  background: '#ffffff',
  color: '#0f0f23',
  fontFamily: sans,
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  letterSpacing: '-0.01em',
};
