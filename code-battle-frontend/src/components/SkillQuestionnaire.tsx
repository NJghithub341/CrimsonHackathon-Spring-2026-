import React, { useState } from 'react';
import { ProgrammingLanguage, LearningTrack } from '../types';

const sans = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/* ── Types ── */
interface QuestionnaireData {
  experienceLevel: LearningTrack;
  preferredLanguages: ProgrammingLanguage[];
  yearsExperience: number;
  previousProjects: number;
  comfortWithDataStructures: number;
  comfortWithAlgorithms: number;
  codingFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  favoriteTopics: string[];
  hasContributedToOpenSource: boolean;
  hasCompetitiveProgrammingExperience: boolean;
}

interface SkillQuestionnaireProps {
  onComplete: (data: QuestionnaireData) => void;
  onBack: () => void;
}

/* ── Shared styles ── */
const fieldLabel: React.CSSProperties = {
  fontFamily: sans,
  fontSize: '12px',
  fontWeight: '500',
  color: 'rgba(255,255,255,0.4)',
  letterSpacing: '0.01em',
  marginBottom: '10px',
  display: 'block',
};

const sectionTitle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: '17px',
  fontWeight: '600',
  letterSpacing: '-0.02em',
  color: '#ffffff',
  margin: '0 0 6px',
};

const sectionSub: React.CSSProperties = {
  fontFamily: sans,
  fontSize: '13px',
  color: 'rgba(255,255,255,0.4)',
  lineHeight: '1.5',
  margin: '0 0 24px',
};

const optionCard = (selected: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px',
  padding: '14px 16px',
  background: selected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
  border: `1px solid ${selected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, background 0.15s ease',
  fontFamily: sans,
});

const chipStyle = (selected: boolean): React.CSSProperties => ({
  display: 'inline-block',
  padding: '7px 14px',
  borderRadius: '6px',
  border: `1px solid ${selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
  background: selected ? 'rgba(255,255,255,0.09)' : 'transparent',
  color: selected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
  fontFamily: sans,
  fontSize: '13px',
  fontWeight: selected ? '500' : '400',
  cursor: 'pointer',
});

const navBtn = (primary: boolean): React.CSSProperties => ({
  padding: '10px 22px',
  borderRadius: '8px',
  border: primary ? 'none' : '1px solid rgba(255,255,255,0.12)',
  background: primary ? '#ffffff' : 'transparent',
  color: primary ? '#0f0f23' : 'rgba(255,255,255,0.55)',
  fontFamily: sans,
  fontSize: '13px',
  fontWeight: primary ? '600' : '400',
  cursor: 'pointer',
  letterSpacing: '-0.01em',
});

/* ── Component ── */
export const SkillQuestionnaire: React.FC<SkillQuestionnaireProps> = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuestionnaireData>({
    experienceLevel: 'beginner',
    preferredLanguages: [],
    yearsExperience: 0,
    previousProjects: 0,
    comfortWithDataStructures: 1,
    comfortWithAlgorithms: 1,
    codingFrequency: 'weekly',
    favoriteTopics: [],
    hasContributedToOpenSource: false,
    hasCompetitiveProgrammingExperience: false,
  });

  const totalSteps = 6;

  const update = (patch: Partial<QuestionnaireData>) =>
    setFormData(prev => ({ ...prev, ...patch }));

  const toggleLanguage = (lang: ProgrammingLanguage) => {
    const cur = formData.preferredLanguages;
    update({ preferredLanguages: cur.includes(lang) ? cur.filter(l => l !== lang) : [...cur, lang] });
  };

  const toggleTopic = (topic: string) => {
    const cur = formData.favoriteTopics;
    update({ favoriteTopics: cur.includes(topic) ? cur.filter(t => t !== topic) : [...cur, topic] });
  };

  const next = () => currentStep < totalSteps - 1 ? setCurrentStep(s => s + 1) : onComplete(formData);
  const prev = () => currentStep > 0 ? setCurrentStep(s => s - 1) : onBack();

  const isValid = () => currentStep === 1 ? formData.preferredLanguages.length > 0 : true;

  /* ── Steps ── */
  const renderStep = () => {
    switch (currentStep) {

      case 0: return (
        <div>
          <h2 style={sectionTitle}>What's your experience level?</h2>
          <p style={sectionSub}>This sets your starting ELO rating.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { value: 'beginner',     label: 'Beginner',     desc: 'Learning the basics' },
              { value: 'intermediate', label: 'Intermediate', desc: 'Comfortable with fundamentals and some projects' },
              { value: 'advanced',     label: 'Advanced',     desc: 'Experienced with complex systems' },
            ].map(opt => {
              const sel = formData.experienceLevel === opt.value;
              return (
                <div key={opt.value} style={optionCard(sel)}
                  onClick={() => update({ experienceLevel: opt.value as LearningTrack })}>
                  <div style={{
                    width: '16px', height: '16px', marginTop: '1px',
                    borderRadius: '50%', flexShrink: 0,
                    border: `1px solid ${sel ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)'}`,
                    background: sel ? '#ffffff' : 'transparent',
                  }} />
                  <div>
                    <div style={{ fontFamily: sans, fontSize: '14px', fontWeight: '500', color: sel ? '#ffffff' : 'rgba(255,255,255,0.75)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: sans, fontSize: '12px', color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}>
                      {opt.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

      case 1: return (
        <div>
          <h2 style={sectionTitle}>Which languages do you know?</h2>
          <p style={sectionSub}>Select at least one.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { value: 'python', label: 'Python' },
              { value: 'java',   label: 'Java' },
              { value: 'cpp',    label: 'C++' },
            ].map(lang => {
              const sel = formData.preferredLanguages.includes(lang.value as ProgrammingLanguage);
              return (
                <div key={lang.value}
                  style={{
                    padding: '20px 12px',
                    textAlign: 'center',
                    background: sel ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${sel ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: sans,
                    fontSize: '14px',
                    fontWeight: '500',
                    color: sel ? '#ffffff' : 'rgba(255,255,255,0.55)',
                  }}
                  onClick={() => toggleLanguage(lang.value as ProgrammingLanguage)}>
                  {lang.label}
                </div>
              );
            })}
          </div>
        </div>
      );

      case 2: return (
        <div>
          <h2 style={sectionTitle}>Experience details</h2>
          <p style={sectionSub}>Tell us a bit more about your background.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={fieldLabel}>Years of experience</label>
              <input type="range" min="0" max="20" value={formData.yearsExperience}
                onChange={e => update({ yearsExperience: +e.target.value })}
                style={{ width: '100%', accentColor: '#ffffff' }} />
              <div style={{ fontFamily: sans, fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
                {formData.yearsExperience === 0 ? 'Less than 1 year' : `${formData.yearsExperience} year${formData.yearsExperience > 1 ? 's' : ''}`}
              </div>
            </div>

            <div>
              <label style={fieldLabel}>Projects completed</label>
              <input type="range" min="0" max="50" value={formData.previousProjects}
                onChange={e => update({ previousProjects: +e.target.value })}
                style={{ width: '100%', accentColor: '#ffffff' }} />
              <div style={{ fontFamily: sans, fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
                {formData.previousProjects === 0 ? 'None yet' : `${formData.previousProjects} project${formData.previousProjects > 1 ? 's' : ''}`}
              </div>
            </div>

            <div>
              <label style={fieldLabel}>Coding frequency</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['daily', 'weekly', 'monthly', 'rarely'] as const).map(f => (
                  <div key={f} style={chipStyle(formData.codingFrequency === f)}
                    onClick={() => update({ codingFrequency: f })}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

      case 3: return (
        <div>
          <h2 style={sectionTitle}>Self-assessment</h2>
          <p style={sectionSub}>Rate your comfort from 1 (beginner) to 10 (expert).</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {[
              { label: 'Data Structures', key: 'comfortWithDataStructures' as const, val: formData.comfortWithDataStructures },
              { label: 'Algorithms',      key: 'comfortWithAlgorithms'      as const, val: formData.comfortWithAlgorithms },
            ].map(item => (
              <div key={item.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={fieldLabel}>{item.label}</label>
                  <span style={{ fontFamily: sans, fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>
                    {item.val} / 10
                  </span>
                </div>
                <input type="range" min="1" max="10" value={item.val}
                  onChange={e => update({ [item.key]: +e.target.value } as any)}
                  style={{ width: '100%', accentColor: '#ffffff' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontFamily: sans, fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>Beginner</span>
                  <span style={{ fontFamily: sans, fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>Expert</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 4: return (
        <div>
          <h2 style={sectionTitle}>Favorite topics</h2>
          <p style={sectionSub}>Select any areas that interest you.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              'Web Development', 'Mobile Development', 'Data Structures', 'Algorithms',
              'Machine Learning', 'Database Systems', 'Operating Systems', 'Networks',
              'Security', 'Game Development', 'API Development', 'DevOps',
            ].map(topic => (
              <div key={topic} style={chipStyle(formData.favoriteTopics.includes(topic))}
                onClick={() => toggleTopic(topic)}>
                {topic}
              </div>
            ))}
          </div>
        </div>
      );

      case 5: return (
        <div>
          <h2 style={sectionTitle}>A few final questions</h2>
          <p style={sectionSub}>These help fine-tune your initial rating.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {[
              {
                key: 'hasContributedToOpenSource' as const,
                label: 'I have contributed to open-source projects',
                val: formData.hasContributedToOpenSource,
                set: (v: boolean) => update({ hasContributedToOpenSource: v }),
              },
              {
                key: 'hasCompetitiveProgrammingExperience' as const,
                label: 'I have competitive programming experience (LeetCode, HackerRank, etc.)',
                val: formData.hasCompetitiveProgrammingExperience,
                set: (v: boolean) => update({ hasCompetitiveProgrammingExperience: v }),
              },
            ].map(item => (
              <div key={item.key}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                  background: item.val ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${item.val ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '8px', cursor: 'pointer',
                }}
                onClick={() => item.set(!item.val)}>
                <div style={{
                  width: '16px', height: '16px', marginTop: '1px', flexShrink: 0,
                  borderRadius: '4px',
                  border: `1px solid ${item.val ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}`,
                  background: item.val ? '#ffffff' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.val && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#0f0f23" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontFamily: sans, fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.5' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '8px',
          }}>
            <p style={{ fontFamily: sans, fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
              Your estimated starting ELO
            </p>
            <p style={{ fontFamily: sans, fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.6', margin: 0 }}>
              We'll calculate your initial rating based on your responses. It adjusts quickly after your first few battles.
            </p>
          </div>
        </div>
      );

      default: return null;
    }
  };

  const stepLabels = ['Experience', 'Languages', 'Details', 'Skills', 'Topics', 'Final'];
  const pct = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div style={{ fontFamily: sans }}>
      {/* Progress */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            {stepLabels[currentStep]}
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: 'rgba(255,255,255,0.55)',
            borderRadius: '1px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Step content */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '10px',
        padding: '28px',
        minHeight: '320px',
        marginBottom: '20px',
      }}>
        {renderStep()}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <button onClick={prev} style={navBtn(false)}>
          Back
        </button>
        <button onClick={next} disabled={!isValid()} style={{
          ...navBtn(true),
          opacity: isValid() ? 1 : 0.4,
          cursor: isValid() ? 'pointer' : 'not-allowed',
        }}>
          {currentStep === totalSteps - 1 ? 'Complete registration' : 'Continue →'}
        </button>
      </div>
    </div>
  );
};
