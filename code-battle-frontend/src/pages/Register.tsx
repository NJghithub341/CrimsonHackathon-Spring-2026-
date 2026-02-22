import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SkillQuestionnaire } from '../components/SkillQuestionnaire';
import { Mail, Lock, User } from 'lucide-react';

type RegistrationStep = 'basic' | 'questionnaire';

interface BasicInfo {
  email: string;
  password: string;
  displayName: string;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '11px',
  fontWeight: '600',
  color: 'rgba(255,255,255,0.55)',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
};

export const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('basic');
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    email: '',
    password: '',
    displayName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!basicInfo.email || !basicInfo.password || !basicInfo.displayName) {
      setError('All fields are required');
      return;
    }

    if (basicInfo.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = async (questionnaireData: any) => {
    setLoading(true);
    setError('');

    try {
      await register(
        basicInfo.email,
        basicInfo.password,
        basicInfo.displayName,
        questionnaireData
      );
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setCurrentStep('basic');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToBasicInfo = () => {
    setCurrentStep('basic');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <div style={{
            width: '52px',
            height: '52px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--pixel-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }} />
          <h2 style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '20px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 10px',
          }}>
            Creating Your Account
          </h2>
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
            lineHeight: '1.6',
          }}>
            Calculating your starting ELO and setting up your profile...
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 'questionnaire') {
    return (
      <div style={{ padding: '32px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.25)',
            borderRadius: '50px',
            padding: '6px 16px',
            marginBottom: '16px',
          }}>
            <span style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '12px',
              color: 'var(--pixel-primary)',
              fontWeight: '600',
            }}>
              Step 2 of 2
            </span>
          </div>
          <h1 style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '28px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 10px',
            letterSpacing: '-0.4px',
          }}>
            Almost There!
          </h1>
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '15px',
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
          }}>
            Help us personalize your CodeBattle experience
          </p>
        </div>
        <SkillQuestionnaire
          onComplete={handleQuestionnaireComplete}
          onBack={handleBackToBasicInfo}
        />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Step indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '32px',
              height: '4px',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, var(--pixel-primary), var(--pixel-accent))',
            }} />
            <div style={{
              width: '32px',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.15)',
            }} />
          </div>

          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, var(--pixel-primary), var(--pixel-accent))',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '26px',
          }}>
            🎮
          </div>
          <h1 style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '26px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 8px',
            letterSpacing: '-0.4px',
          }}>
            Join CodeBattle
          </h1>
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
          }}>
            Create your account to start competing
          </p>
        </div>

        {/* Error */}
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
        <form onSubmit={handleBasicInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Display Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                width: '16px', height: '16px', color: 'rgba(255,255,255,0.35)',
              }} />
              <input
                type="text"
                value={basicInfo.displayName}
                onChange={(e) => setBasicInfo(prev => ({ ...prev, displayName: e.target.value }))}
                className="input-glass"
                style={{ paddingLeft: '42px' }}
                placeholder="Your display name"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                width: '16px', height: '16px', color: 'rgba(255,255,255,0.35)',
              }} />
              <input
                type="email"
                value={basicInfo.email}
                onChange={(e) => setBasicInfo(prev => ({ ...prev, email: e.target.value }))}
                className="input-glass"
                style={{ paddingLeft: '42px' }}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                width: '16px', height: '16px', color: 'rgba(255,255,255,0.35)',
              }} />
              <input
                type="password"
                value={basicInfo.password}
                onChange={(e) => setBasicInfo(prev => ({ ...prev, password: e.target.value }))}
                className="input-glass"
                style={{ paddingLeft: '42px' }}
                placeholder="At least 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <p style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              marginTop: '6px',
              marginBottom: 0,
            }}>
              Minimum 6 characters
            </p>
          </div>

          <button
            type="submit"
            className="btn-glass-primary"
            style={{ width: '100%', marginTop: '8px', fontSize: '15px', padding: '14px 32px' }}
          >
            Continue to Skill Assessment →
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.45)',
            margin: '0 0 16px',
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: 'var(--pixel-primary)', textDecoration: 'none', fontWeight: '600' }}
            >
              Sign in
            </Link>
          </p>

          {/* What's next hint */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '14px 16px',
            textAlign: 'left',
          }}>
            <p style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              margin: '0 0 8px',
            }}>
              What's next
            </p>
            {['Quick skill assessment (2 min)', 'Personalized ELO calculation', 'Customized learning path'].map((item) => (
              <p key={item} style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.45)',
                margin: '4px 0',
              }}>
                ✦ {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
