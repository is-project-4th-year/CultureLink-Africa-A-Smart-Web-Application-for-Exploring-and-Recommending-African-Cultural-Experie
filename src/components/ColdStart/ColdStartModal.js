// src/components/ColdStart/ColdStartModal.js
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { saveColdStartPreferences } from '../../services/coldStartService';

const ColdStartModal = ({ user, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interests: [],
    tribes: [],
    experienceLevel: '',
    purpose: '',
    usageReason: '',
    contentStyle: ''
  });

  const totalSteps = 6; // Added "Why are you using CultureLink?" step

  const interests = [
    { id: 'food', label: 'Traditional Foods', emoji: '🍽️' },
    { id: 'music', label: 'Music & Dance', emoji: '🎵' },
    { id: 'attire', label: 'Traditional Attire', emoji: '👗' },
    { id: 'history', label: 'History & Heritage', emoji: '🏛️' },
    { id: 'languages', label: 'Languages', emoji: '🗣️' },
    { id: 'festivals', label: 'Festivals', emoji: '🎉' },
    { id: 'lifestyle', label: 'Lifestyle', emoji: '🏡' },
    { id: 'arts', label: 'Arts & Crafts', emoji: '🎨' }
  ];

  const tribes = [
    { id: 'kikuyu', label: 'Kikuyu' },
    { id: 'maasai', label: 'Maasai' },
    { id: 'luo', label: 'Luo' },
    { id: 'kalenjin', label: 'Kalenjin' },
    { id: 'luhya', label: 'Luhya' },
    { id: 'kamba', label: 'Kamba' },
    { id: 'kisii', label: 'Kisii' },
    { id: 'mijikenda', label: 'Mijikenda' },
    { id: 'turkana', label: 'Turkana' },
    { id: 'embu', label: 'Embu' }
  ];

  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', emoji: '🌱' },
    { id: 'intermediate', label: 'Intermediate', emoji: '🌿' },
    { id: 'advanced', label: 'Advanced', emoji: '🌳' }
  ];

  const purposes = [
    { id: 'tourism', label: 'Tourism & Travel', emoji: '🧳' },
    { id: 'heritage', label: 'Heritage Connection', emoji: '🏠' },
    { id: 'research', label: 'Academic Research', emoji: '📚' },
    { id: 'learning', label: 'Personal Learning', emoji: '🎓' },
    { id: 'teaching', label: 'Teaching & Education', emoji: '🏫' }
  ];

  const contentStyles = [
    { id: 'quick', label: 'Quick Facts', emoji: '⚡' },
    { id: 'detailed', label: 'Detailed Articles', emoji: '📖' },
    { id: 'mixed', label: 'Mixed Content', emoji: '🎯' }
  ];

  const usageReasons = [
    { id: 'curiosity', label: 'Curiosity' },
    { id: 'learning', label: 'Learning' },
    { id: 'research', label: 'Research' },
    { id: 'planning', label: 'Travel Planning' }
  ];

  const toggleSelection = (field, value) => {
    if (field === 'interests' || field === 'tribes') {
      const currentValues = formData[field];
      if (currentValues.includes(value)) {
        setFormData({ ...formData, [field]: currentValues.filter(v => v !== value) });
      } else {
        if (field === 'interests' && currentValues.length >= 5) return;
        if (field === 'tribes' && currentValues.length >= 3) return;
        setFormData({ ...formData, [field]: [...currentValues, value] });
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.interests.length > 0;
      case 2: return formData.tribes.length > 0;
      case 3: return formData.experienceLevel !== '';
      case 4: return formData.purpose !== '';
      case 5: return formData.usageReason !== '';
      case 6: return formData.contentStyle !== '';
      default: return false;
    }
  };

  const handleNext = () => { if (canProceed() && currentStep < totalSteps) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await saveColdStartPreferences(user.uid, formData);
      setTimeout(() => onComplete(formData), 500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const renderButtons = (items, field) =>
    items.map(item => {
      const isSelected = formData[field] === item.id || (Array.isArray(formData[field]) && formData[field].includes(item.id));
      return (
        <button
          key={item.id}
          onClick={() => toggleSelection(field, item.id)}
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: isSelected ? '2px solid #f97316' : '2px solid #d1d5db',
            backgroundColor: isSelected ? '#fff7ed' : 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            transform: isSelected ? 'scale(1.03)' : 'scale(1)',
            boxShadow: isSelected ? '0 6px 12px rgba(249, 115, 22, 0.2)' : '0 2px 6px rgba(0,0,0,0.05)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = isSelected ? 'scale(1.03)' : 'scale(1)'; e.currentTarget.style.boxShadow = isSelected ? '0 6px 12px rgba(249, 115, 22, 0.2)' : '0 2px 6px rgba(0,0,0,0.05)'; }}
        >
          <span style={{ fontSize: '24px', marginRight: '12px' }}>{item.emoji || ''}</span>
          {item.label}
          {isSelected && <Check style={{ marginLeft: 'auto', color: '#f97316' }} />}
        </button>
      );
    });


// Inside the ColdStartModal component, update renderStep:
const stepQuestions = {
  1: "What are your interests? (Select up to 5)",
  2: "Which tribes are you interested in? (Select up to 3)",
  3: "What's your experience level with Kenyan culture?",
  4: "What's your main purpose for using CultureLink?",
  5: "Why are you using CultureLink?",
  6: "What style of content do you prefer?"
};

const renderStep = () => {
  const question = stepQuestions[currentStep];
  let buttons;

  switch (currentStep) {
    case 1: buttons = renderButtons(interests, 'interests'); break;
    case 2: buttons = renderButtons(tribes, 'tribes'); break;
    case 3: buttons = renderButtons(experienceLevels, 'experienceLevel'); break;
    case 4: buttons = renderButtons(purposes, 'purpose'); break;
    case 5: buttons = renderButtons(usageReasons, 'usageReason'); break;
    case 6: buttons = renderButtons(contentStyles, 'contentStyle'); break;
    default: buttons = null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {question && <h2 style={{ color: 'black', fontSize: '18px', fontWeight: '600' }}>{question}</h2>}
      <div style={{ display: 'grid', gridGap: '12px' }}>{buttons}</div>
    </div>
  );
};


  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        width: '100%', maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Welcome to CultureLink!</h1>
          <button onClick={onSkip} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X /></button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'grid', gridGap: '12px' }}>
          {renderStep()}
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleBack} disabled={currentStep === 1} style={{ padding: '8px 16px', borderRadius: '8px', cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}>Back</button>
          {currentStep <= totalSteps ? (
            <button onClick={currentStep === totalSteps ? handleComplete : handleNext}
              disabled={!canProceed() || loading}
              style={{
                padding: '8px 24px', borderRadius: '8px',
                backgroundColor: canProceed() && !loading ? '#f97316' : '#d1d5db',
                color: 'white', cursor: canProceed() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Saving...' : currentStep === totalSteps ? 'Complete' : 'Next'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ColdStartModal;
