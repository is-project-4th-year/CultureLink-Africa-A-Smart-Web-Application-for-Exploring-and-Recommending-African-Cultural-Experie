// src/pages/Learn/LessonView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getVocabulary, 
  getCategories, 
  speakWord, 
  markWordLearned,
  getUserProgress,
  languages
} from '../../services/languageService';
import { ArrowLeft, Volume2, CheckCircle, RotateCw, Trophy } from 'lucide-react';
import './LessonView.css';

const LessonView = () => {
  const { languageId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [vocabulary, setVocabulary] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnedWords, setLearnedWords] = useState([]);
  const [progress, setProgress] = useState({});

  const language = languages[languageId];

  useEffect(() => {
    loadVocabulary();
    if (currentUser) {
      loadProgress();
    }
  }, [languageId, currentUser]);

  const loadVocabulary = () => {
    const vocab = getVocabulary(languageId);
    setVocabulary(vocab);
    
    const cats = getCategories(languageId);
    setCategories(['All', ...cats]);
  };

  const loadProgress = async () => {
    const userProgress = await getUserProgress(currentUser.uid);
    const langProgress = userProgress[languageId] || {};
    setLearnedWords(langProgress.learnedWords || []);
    setProgress(langProgress);
  };

  const filteredVocab = selectedCategory === 'All' 
    ? vocabulary 
    : vocabulary.filter(word => word.category === selectedCategory);

  const currentWord = filteredVocab[currentIndex];

  const handleNext = () => {
    setFlipped(false);
    if (currentIndex < filteredVocab.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    setFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredVocab.length - 1);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleSpeak = () => {
    if (currentWord) {
      speakWord(currentWord.word, languageId);
    }
  };

  const handleMarkLearned = async () => {
    if (!currentUser || !currentWord) return;
    
    await markWordLearned(currentUser.uid, languageId, currentWord.id);
    setLearnedWords([...learnedWords, currentWord.id]);
  };

  const isWordLearned = currentWord && learnedWords.includes(currentWord.id);
  const completionPercentage = Math.round((learnedWords.length / vocabulary.length) * 100) || 0;

  if (!language) {
    return (
      <div className="learn-container">
        <div className="error-container">
          <h2>Language not found</h2>
          <button onClick={() => navigate('/learn')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Languages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="learn-container">
      <div className="learn-content">
        {/* Header */}
        <div className="lesson-header">
          <button onClick={() => navigate('/learn')} className="back-btn">
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="lesson-title">
            <span className="language-flag">{language.flag}</span>
            <h1>{language.name}</h1>
          </div>
          <div className="lesson-stats">
            <Trophy size={20} style={{ color: '#f39c12' }} />
            <span>{learnedWords.length}/{vocabulary.length} learned</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%`, background: language.color }}
            ></div>
          </div>
          <span className="progress-text">{completionPercentage}% Complete</span>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentIndex(0);
                setFlipped(false);
              }}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              style={selectedCategory === category ? { backgroundColor: language.color } : {}}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Flashcard */}
        {currentWord && (
          <div className="flashcard-container">
            <div 
              className={`flashcard ${flipped ? 'flipped' : ''}`}
              onClick={handleFlip}
            >
              <div className="flashcard-front" style={{ borderColor: language.color }}>
                <div className="word-category">{currentWord.category}</div>
                <div className="word-main">{currentWord.word}</div>
                <div className="word-pronunciation">{currentWord.pronunciation}</div>
                <div className="flip-hint">Click to see translation</div>
              </div>
              <div className="flashcard-back" style={{ backgroundColor: language.color }}>
                <div className="word-translation">{currentWord.translation}</div>
                <div className="word-original">{currentWord.word}</div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flashcard-actions">
              <button onClick={handleSpeak} className="action-btn speak-btn">
                <Volume2 size={24} />
                Listen
              </button>
              {currentUser && !isWordLearned && (
                <button onClick={handleMarkLearned} className="action-btn learned-btn">
                  <CheckCircle size={24} />
                  Mark as Learned
                </button>
              )}
              {isWordLearned && (
                <div className="learned-badge">
                  <CheckCircle size={20} />
                  Learned!
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flashcard-nav">
              <button onClick={handlePrevious} className="nav-btn">
                ← Previous
              </button>
              <span className="card-counter">
                {currentIndex + 1} / {filteredVocab.length}
              </span>
              <button onClick={handleNext} className="nav-btn">
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Quiz Button */}
        <div className="quiz-section">
          <button 
            onClick={() => navigate(`/learn/${languageId}/quiz`)}
            className="quiz-btn"
            style={{ backgroundColor: language.color }}
          >
            <Trophy size={20} />
            Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonView;