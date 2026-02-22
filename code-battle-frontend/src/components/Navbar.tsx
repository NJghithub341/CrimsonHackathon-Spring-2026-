import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sword } from 'lucide-react';

const sans = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLeave = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav style={{
      fontFamily: sans,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(15, 15, 35, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Left — wordmark + nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            textDecoration: 'none',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
          }}>
            <Sword size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            CodeBattle
          </Link>

          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link to="/matchmaking" style={navLink}>Battle</Link>
              <Link to="/dashboard" style={navLink}>Dashboard</Link>
              <Link to="/learn" style={navLink}>Learn</Link>
            </div>
          )}
        </div>

        {/* Right — player info + leave */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {currentUser ? (
            <>
              <span style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.4)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {currentUser.displayName}
                <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: '8px' }}>
                  {currentUser.elo} ELO
                </span>
              </span>

              <button
                onClick={handleLeave}
                title="Leave and return to home"
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: sans,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Leave
              </button>
            </>
          ) : (
            <Link to="/" style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
            }}>
              Play →
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

const navLink: React.CSSProperties = {
  textDecoration: 'none',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '13px',
  letterSpacing: '-0.01em',
};
