import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SkillQuestionnaire } from '../components/SkillQuestionnaire';

const sans = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

type RegistrationStep = 'basic' | 'questionnaire';

interface BasicInfo {
  email: string;
  password: string;
  displayName: string;
}

/* ── shared styles ── */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: sans,
  fontSize: '12px',
  fontWeight: '500',
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '7px',
  letterSpacing: '0.01em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 13px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  color: 'rgba(255,255,255,0.92)',
  fontFamily: sans,
  fontSize: '14px',
  outline: 'none',
};

const primaryBtn: React.CSSProperties = {
  width: '100%',
  padding: '11px',
  borderRadius: '8px',
  border: 'none',
  background: '#ffffff',
  color: '#0f0f23',
  fontFamily: sans,
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  letterSpacing: '-0.01em',
};

export const Register: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('basic');
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({ email: '', password: '', displayName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!basicInfo.email || !basicInfo.password || !basicInfo.displayName) {
      setError('All fields are required.');
      return;
    }
    if (basicInfo.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = async (questionnaireData: any) => {
    setLoading(true);
    setError('');
    try {
      await register(basicInfo.email, basicInfo.password, basicInfo.displayName, questionnaireData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      setCurrentStep('basic');
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div style={pageWrap}>
        <div style={card}>
          <div style={{
            width: '28px', height: '28px',
            border: '2px solid rgba(255,255,255,0.1)',
            borderTopColor: 'rgba(255,255,255,0.7)',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            margin: '0 auto 20px',
          }} />
          <h2 style={{ ...cardTitle, textAlign: 'center' }}>Creating your account</h2>
          <p style={{ ...mutedText, textAlign: 'center', marginTop: '8px' }}>
            Calculating your starting ELO and setting up your profile…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Questionnaire step ── */
  if (currentStep === 'questionnaire') {
    return (
      <div style={{ ...pageWrap, alignItems: 'flex-start', paddingTop: '48px' }}>
        {/* Step header */}
        <div style={{ width: '100%', maxWidth: '640px', marginBottom: '32px' }}>
          <p style={{ ...mutedText, marginBottom: '16px' }}>
            <button
              onClick={() => setCurrentStep('basic')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: sans, fontSize: '13px', cursor: 'pointer', padding: 0 }}
            >
              ← Back
            </button>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.25)', borderRadius: '1px' }} />
            <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '1px' }} />
          </div>
          <h1 style={pageTitle}>Skill assessment</h1>
          <p style={{ ...mutedText, marginTop: '8px' }}>
            This helps us calculate your starting ELO and personalize your experience.
          </p>
        </div>

        <div style={{ width: '100%', maxWidth: '640px' }}>
          <SkillQuestionnaire
            onComplete={handleQuestionnaireComplete}
            onBack={() => setCurrentStep('basic')}
          />
        </div>
      </div>
    );
  }

  /* ── Basic info step ── */
  return (
    <div style={pageWrap}>
      <div style={card}>
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.65)', borderRadius: '1px' }} />
          <div style={{ height: '2px', flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: '1px' }} />
        </div>

        <p style={{ ...mutedText, fontSize: '11px', letterSpacing: '1.4px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Step 1 of 2
        </p>
        <h1 style={{ ...cardTitle, marginBottom: '6px' }}>Create your account</h1>
        <p style={{ ...mutedText, marginBottom: '28px' }}>
          Already have one?{' '}
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontWeight: '500' }}>
            Sign in
          </Link>
        </p>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 13px',
            marginBottom: '20px',
            background: 'rgba(255,60,60,0.08)',
            border: '1px solid rgba(255,60,60,0.2)',
            borderRadius: '8px',
            color: 'rgba(255,120,120,0.9)',
            fontFamily: sans,
            fontSize: '13px',
            lineHeight: '1.5',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleBasicInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Display name</label>
            <input
              type="text"
              value={basicInfo.displayName}
              onChange={(e) => setBasicInfo(p => ({ ...p, displayName: e.target.value }))}
              style={inputStyle}
              placeholder="Your display name"
              required
              autoComplete="name"
            />
          </div>

          <div>
            <label style={labelStyle}>Email address</label>
            <input
              type="email"
              value={basicInfo.email}
              onChange={(e) => setBasicInfo(p => ({ ...p, email: e.target.value }))}
              style={inputStyle}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={basicInfo.password}
              onChange={(e) => setBasicInfo(p => ({ ...p, password: e.target.value }))}
              style={inputStyle}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div style={{ paddingTop: '4px' }}>
            <button type="submit" style={primaryBtn}>
              Continue to skill assessment →
            </button>
          </div>
        </form>

        {/* What's next */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>
          <p style={{ ...mutedText, fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '10px' }}>
            What happens next
          </p>
          {[
            'Short skill assessment — about 2 minutes',
            'Personalized ELO rating calculated',
            'Matched with opponents at your level',
          ].map((item) => (
            <p key={item} style={{ ...mutedText, fontSize: '13px', margin: '6px 0' }}>
              — {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── layout helpers ── */
const pageWrap: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
  fontFamily: sans,
};

const card: React.CSSProperties = {
  width: '100%',
  maxWidth: '440px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '36px',
};

const pageTitle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '-0.025em',
  color: '#ffffff',
  margin: 0,
};

const cardTitle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: '20px',
  fontWeight: '700',
  letterSpacing: '-0.02em',
  color: '#ffffff',
  margin: 0,
};

const mutedText: React.CSSProperties = {
  fontFamily: sans,
  fontSize: '14px',
  color: 'rgba(255,255,255,0.4)',
  lineHeight: '1.6',
  margin: 0,
};
