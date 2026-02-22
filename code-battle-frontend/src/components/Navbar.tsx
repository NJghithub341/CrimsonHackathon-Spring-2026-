import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Sword } from 'lucide-react';

const sans = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

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
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Left — wordmark + nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: '700',
            letterSpacing: '-0.02em',
          }}>
            <Sword size={18} style={{ color: 'rgba(255,255,255,0.7)' }} />
            CodeBattle
          </Link>

          {currentUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
              <Link to="/learn" style={navLinkStyle}>Learn</Link>
              <Link to="/matchmaking" style={navLinkStyle}>Battle</Link>
            </div>
          )}
        </div>

        {/* Right — auth controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {currentUser ? (
            <>
              {/* ELO + Level */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingRight: '16px',
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>
                  ELO {currentUser.elo}
                </span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                  Lv {currentUser.level}
                </span>
              </div>

              {/* Profile link */}
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                color: 'rgba(255,255,255,0.65)',
                fontSize: '13px',
                fontWeight: '500',
              }}>
                <User size={15} />
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.displayName}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Sign out"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.38)',
                  fontSize: '13px',
                  fontFamily: sans,
                  padding: '4px',
                }}
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>Sign In</Link>
              <Link to="/register" style={{
                display: 'inline-block',
                padding: '7px 16px',
                borderRadius: '6px',
                background: '#ffffff',
                color: '#0f0f23',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

const navLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: 'rgba(255,255,255,0.55)',
  fontSize: '14px',
  fontWeight: '400',
  letterSpacing: '-0.01em',
};
