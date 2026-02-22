import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo / Icon */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, var(--pixel-primary), var(--pixel-accent))',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '28px',
          }}>
            ⚔️
          </div>
          <h1 style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '26px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 8px',
            letterSpacing: '-0.4px',
          }}>
            Welcome back
          </h1>
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
          }}>
            Sign in to CodeBattle
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(255, 42, 109, 0.12)',
            border: '1px solid rgba(255, 42, 109, 0.35)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#ff6b9d',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            lineHeight: '1.5',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: 'rgba(255,255,255,0.35)',
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
                style={{ paddingLeft: '42px' }}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                color: 'rgba(255,255,255,0.35)',
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass"
                style={{ paddingLeft: '42px' }}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-glass-primary"
            style={{ width: '100%', marginTop: '8px', fontSize: '15px', padding: '14px 32px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.45)',
            margin: 0,
          }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--pixel-primary)', textDecoration: 'none', fontWeight: '600' }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
