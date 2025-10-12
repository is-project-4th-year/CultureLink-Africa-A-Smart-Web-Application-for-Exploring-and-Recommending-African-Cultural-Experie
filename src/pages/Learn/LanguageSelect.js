// src/pages/Learn/LanguageSelect.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getLanguages } from '../../services/languageService';
import { Book, ArrowRight } from 'lucide-react';
import './Learn.css';

const LanguageSelect = () => {
  const navigate = useNavigate();
  const languages = getLanguages();

  const handleLanguageSelect = (languageId) => {
    navigate(`/learn/${languageId}`);
  };

  return (
    <div className="learn-container">
      <div className="learn-content">
        {/* Header */}
        <div className="learn-hero">
          <Book size={48} />
          <h1>Learn Kenyan Languages</h1>
          <p>Discover the beauty of Kenya's diverse languages and cultures</p>
        </div>

        {/* Language Grid */}
        <div className="languages-grid">
          {languages.map(language => (
            <div 
              key={language.id}
              className="language-card"
              style={{ 
                backgroundImage: language.backgroundImage 
                  ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${language.backgroundImage})`
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderLeftColor: language.color
              }}
              onClick={() => handleLanguageSelect(language.id)}
            >
              <div className="language-icon">{language.flag}</div>
              <div className="language-info">
                <h3>{language.name}</h3>
                <p className="language-tribe">{language.tribe}</p>
                <p className="language-words">{language.vocabulary.length} words</p>
              </div>
              <ArrowRight size={24} className="language-arrow" />
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="learn-info">
          <h2>Why Learn Kenyan Languages?</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🗣️</div>
              <h3>Connect with Communities</h3>
              <p>Build deeper connections with Kenya's diverse communities</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🌍</div>
              <h3>Cultural Understanding</h3>
              <p>Gain insights into rich cultural traditions and heritage</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <h3>Interactive Learning</h3>
              <p>Practice with flashcards, audio, and quizzes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;