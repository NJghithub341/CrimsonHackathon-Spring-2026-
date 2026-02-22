import React, { useState } from 'react';
import { ProgrammingLanguage, LearningTrack } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const sansFont = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const stepTitle: React.CSSProperties = {
  fontFamily: sansFont,
  fontSize: '20px',
  fontWeight: '700',
  color: 'white',
  margin: '0 0 8px',
  letterSpacing: '-0.3px',
};

const stepSubtitle: React.CSSProperties = {
  fontFamily: sansFont,
  fontSize: '14px',
  color: 'rgba(255,255,255,0.5)',
  margin: '0 0 28px',
};

const fieldLabel: React.CSSProperties = {
  fontFamily: sansFont,
  fontSize: '12px',
  fontWeight: '600',
  color: 'rgba(255,255,255,0.55)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '12px',
  display: 'block',
};

const sliderValue: React.CSSProperties = {
  fontFamily: sansFont,
  fontSize: '13px',
  fontWeight: '600',
  color: 'var(--pixel-primary)',
  textAlign: 'center',
  marginTop: '8px',
};

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

  const updateFormData = (updates: Partial<QuestionnaireData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleLanguageToggle = (language: ProgrammingLanguage) => {
    const current = formData.preferredLanguages;
    if (current.includes(language)) {
      updateFormData({ preferredLanguages: current.filter(l => l !== language) });
    } else {
      updateFormData({ preferredLanguages: [...current, language] });
    }
  };

  const handleTopicToggle = (topic: string) => {
    const current = formData.favoriteTopics;
    if (current.includes(topic)) {
      updateFormData({ favoriteTopics: current.filter(t => t !== topic) });
    } else {
      updateFormData({ favoriteTopics: [...current, topic] });
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.preferredLanguages.length > 0;
    return true;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 style={stepTitle}>What's your experience level?</h2>
            <p style={stepSubtitle}>This helps us estimate your starting ELO rating</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { value: 'beginner', label: 'Beginner', emoji: '🌱', desc: 'Just starting out or learning the basics' },
                { value: 'intermediate', label: 'Intermediate', emoji: '⚡', desc: 'Comfortable with fundamentals and some projects' },
                { value: 'advanced', label: 'Advanced', emoji: '🔥', desc: 'Experienced with complex systems and patterns' },
              ].map((level) => (
                <div
                  key={level.value}
                  onClick={() => updateFormData({ experienceLevel: level.value as LearningTrack })}
                  className={`bubble-option-card ${formData.experienceLevel === level.value ? 'selected' : ''}`}
                  style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{level.emoji}</span>
                  <div>
                    <div style={{
                      fontFamily: sansFont,
                      fontSize: '15px',
                      fontWeight: '600',
                      color: formData.experienceLevel === level.value ? '#00ff88' : 'white',
                      marginBottom: '2px',
                    }}>{level.label}</div>
                    <div style={{
                      fontFamily: sansFont,
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)',
                    }}>{level.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <h2 style={stepTitle}>Which languages do you know?</h2>
            <p style={stepSubtitle}>Select all that apply — choose at least one</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { value: 'python', label: 'Python', emoji: '🐍' },
                { value: 'java', label: 'Java', emoji: '☕' },
                { value: 'cpp', label: 'C++', emoji: '⚡' },
              ].map((lang) => {
                const selected = formData.preferredLanguages.includes(lang.value as ProgrammingLanguage);
                return (
                  <div
                    key={lang.value}
                    onClick={() => handleLanguageToggle(lang.value as ProgrammingLanguage)}
                    className={`bubble-option-card ${selected ? 'selected' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{lang.emoji}</div>
                    <div style={{
                      fontFamily: sansFont,
                      fontSize: '14px',
                      fontWeight: '600',
                      color: selected ? '#00ff88' : 'white',
                    }}>{lang.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 style={stepTitle}>Experience Details</h2>
            <p style={stepSubtitle}>Tell us about your programming journey</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={fieldLabel}>Years of experience</label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={formData.yearsExperience}
                  onChange={(e) => updateFormData({ yearsExperience: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--pixel-primary)' }}
                />
                <div style={sliderValue}>
                  {formData.yearsExperience === 0 ? 'Less than 1 year' : `${formData.yearsExperience} year${formData.yearsExperience > 1 ? 's' : ''}`}
                </div>
              </div>

              <div>
                <label style={fieldLabel}>Projects completed</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={formData.previousProjects}
                  onChange={(e) => updateFormData({ previousProjects: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--pixel-primary)' }}
                />
                <div style={sliderValue}>
                  {formData.previousProjects === 0 ? 'None yet' : `${formData.previousProjects} project${formData.previousProjects > 1 ? 's' : ''}`}
                </div>
              </div>

              <div>
                <label style={fieldLabel}>How often do you code?</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'rarely', label: 'Rarely' },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => updateFormData({ codingFrequency: opt.value as any })}
                      className={`bubble-option ${formData.codingFrequency === opt.value ? 'selected' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 style={stepTitle}>Skill Self-Assessment</h2>
            <p style={stepSubtitle}>Rate your comfort level from 1 (beginner) to 10 (expert)</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <label style={fieldLabel}>Data Structures (Arrays, Trees, etc.)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.comfortWithDataStructures}
                  onChange={(e) => updateFormData({ comfortWithDataStructures: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--pixel-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontFamily: sansFont, fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Beginner</span>
                  <span style={sliderValue}>Level {formData.comfortWithDataStructures}/10</span>
                  <span style={{ fontFamily: sansFont, fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Expert</span>
                </div>
              </div>

              <div>
                <label style={fieldLabel}>Algorithms (Sorting, Searching, etc.)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.comfortWithAlgorithms}
                  onChange={(e) => updateFormData({ comfortWithAlgorithms: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--pixel-primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontFamily: sansFont, fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Beginner</span>
                  <span style={sliderValue}>Level {formData.comfortWithAlgorithms}/10</span>
                  <span style={{ fontFamily: sansFont, fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Expert</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 style={stepTitle}>Favorite Topics</h2>
            <p style={stepSubtitle}>What programming areas interest you most?</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'Web Development', 'Mobile Development', 'Data Structures', 'Algorithms',
                'Machine Learning', 'Database Systems', 'Operating Systems', 'Networks',
                'Security', 'Game Development', 'API Development', 'DevOps',
              ].map((topic) => (
                <div
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={`bubble-option ${formData.favoriteTopics.includes(topic) ? 'selected' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 style={stepTitle}>Final Questions</h2>
            <p style={stepSubtitle}>A few more details to personalize your experience</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {[
                {
                  key: 'hasContributedToOpenSource',
                  label: 'I have contributed to open-source projects',
                  emoji: '🌐',
                  checked: formData.hasContributedToOpenSource,
                  onChange: (v: boolean) => updateFormData({ hasContributedToOpenSource: v }),
                },
                {
                  key: 'hasCompetitiveProgrammingExperience',
                  label: 'I have competitive programming experience (LeetCode, HackerRank, etc.)',
                  emoji: '🏆',
                  checked: formData.hasCompetitiveProgrammingExperience,
                  onChange: (v: boolean) => updateFormData({ hasCompetitiveProgrammingExperience: v }),
                },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => item.onChange(!item.checked)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    background: item.checked ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${item.checked ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.emoji}</span>
                  <span style={{
                    fontFamily: sansFont,
                    fontSize: '13px',
                    color: item.checked ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)',
                    flex: 1,
                    lineHeight: '1.5',
                  }}>{item.label}</span>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: `2px solid ${item.checked ? 'var(--pixel-primary)' : 'rgba(255,255,255,0.25)'}`,
                    background: item.checked ? 'var(--pixel-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}>
                    {item.checked && (
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4L4 7L10 1" stroke="#0f0f23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ELO preview card */}
            <div style={{
              background: 'rgba(0, 212, 255, 0.08)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              borderRadius: '14px',
              padding: '16px',
            }}>
              <div style={{
                fontFamily: sansFont,
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--pixel-accent)',
                marginBottom: '6px',
              }}>
                🎯 Your Estimated Starting ELO
              </div>
              <p style={{
                fontFamily: sansFont,
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                margin: 0,
                lineHeight: '1.6',
              }}>
                Based on your responses, we'll calculate your initial rating to match you with players of similar skill. It adjusts quickly based on your actual performance!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepLabels = ['Experience', 'Languages', 'Details', 'Skills', 'Topics', 'Final'];
  const progressPct = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontFamily: sansFont, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            Step {currentStep + 1} of {totalSteps} — {stepLabels[currentStep]}
          </span>
          <span style={{ fontFamily: sansFont, fontSize: '12px', color: 'var(--pixel-primary)', fontWeight: '600' }}>
            {Math.round(progressPct)}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '3px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, var(--pixel-primary), var(--pixel-accent))',
            borderRadius: '2px',
            transition: 'width 0.35s ease',
          }} />
        </div>
      </div>

      {/* Step content */}
      <div className="glass-card" style={{ minHeight: '360px' }}>
        {renderStep()}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '12px' }}>
        <button
          onClick={prevStep}
          className="btn-glass-secondary"
          style={{ padding: '12px 24px' }}
        >
          <ChevronLeft style={{ width: '16px', height: '16px' }} />
          Back
        </button>

        <button
          onClick={nextStep}
          disabled={!isStepValid()}
          className="btn-glass-primary"
          style={{ padding: '12px 28px', flex: 1, maxWidth: '260px' }}
        >
          {currentStep === totalSteps - 1 ? 'Complete Registration' : 'Next'}
          {currentStep < totalSteps - 1 && <ChevronRight style={{ width: '16px', height: '16px' }} />}
        </button>
      </div>
    </div>
  );
};
