// src/pages/Learn/Quiz.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getVocabulary, 
  saveQuizResult,
  languages 
} from '../../services/languageService';
import { ArrowLeft, Trophy, CheckCircle, XCircle, RotateCw } from 'lucide-react';
import './Quiz.css';

const Quiz = () => {
  const { languageId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  const language = languages[languageId];
  const QUIZ_LENGTH = 10;

  useEffect(() => {
    generateQuiz();
  }, [languageId]);

  const generateQuiz = () => {
    const vocabulary = getVocabulary(languageId);
    
    // Shuffle and select random words
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(QUIZ_LENGTH, vocabulary.length));
    
    // Create questions with multiple choice
    const quizQuestions = selected.map(word => {
      // Get 3 random wrong answers
      const wrongAnswers = vocabulary
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.translation);
      
      // Mix correct answer with wrong ones
      const options = [...wrongAnswers, word.translation]
        .sort(() => Math.random() - 0.5);
      
      return {
        word: word.word,
        correctAnswer: word.translation,
        options,
        pronunciation: word.pronunciation
      };
    });
    
    setQuestions(quizQuestions);
  };

  const handleAnswer = (answer) => {
    if (answered) return;
    
    setSelectedAnswer(answer);
    setAnswered(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setShowResult(true);
    
    if (currentUser) {
      await saveQuizResult(currentUser.uid, languageId, score + 1, questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setAnswered(false);
    generateQuiz();
  };

  if (!language || questions.length === 0) {
    return (
      <div className="learn-container">
        <div className="loading-spinner">Loading quiz...</div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    
    return (
      <div className="learn-container">
        <div className="quiz-result">
          <div className="result-icon">
            {passed ? <Trophy size={64} style={{ color: '#f39c12' }} /> : <RotateCw size={64} />}
          </div>
          <h1>{passed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
          <div className="result-score">
            <span className="score-number">{score}</span>
            <span className="score-total">/ {questions.length}</span>
          </div>
          <div className="result-percentage" style={{ color: language.color }}>
            {percentage}% Correct
          </div>
          
          <div className="result-message">
            {percentage >= 90 && "Excellent! You're mastering this language!"}
            {percentage >= 70 && percentage < 90 && "Great job! Keep up the good work!"}
            {percentage >= 50 && percentage < 70 && "Good effort! Practice more to improve."}
            {percentage < 50 && "Don't give up! Review the flashcards and try again."}
          </div>
          
          <div className="result-actions">
            <button onClick={handleRestart} className="result-btn primary">
              <RotateCw size={20} />
              Try Again
            </button>
            <button 
              onClick={() => navigate(`/learn/${languageId}`)} 
              className="result-btn secondary"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="learn-container">
      <div className="quiz-content">
        {/* Header */}
        <div className="quiz-header">
          <button onClick={() => navigate(`/learn/${languageId}`)} className="back-btn">
            <ArrowLeft size={20} />
            Exit Quiz
          </button>
          <div className="quiz-progress">
            Question {currentQuestion + 1} / {questions.length}
          </div>
          <div className="quiz-score">
            Score: {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              background: language.color
            }}
          ></div>
        </div>

        {/* Question */}
        <div className="quiz-question-card">
          <h2>What does this word mean?</h2>
          <div className="quiz-word" style={{ color: language.color }}>
            {question.word}
          </div>
          <div className="quiz-pronunciation">
            {question.pronunciation}
          </div>
        </div>

        {/* Options */}
        <div className="quiz-options">
          {question.options.map((option, index) => {
            let buttonClass = 'quiz-option';
            
            if (answered) {
              if (option === question.correctAnswer) {
                buttonClass += ' correct';
              } else if (option === selectedAnswer && option !== question.correctAnswer) {
                buttonClass += ' incorrect';
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={buttonClass}
                disabled={answered}
              >
                <span className="option-text">{option}</span>
                {answered && option === question.correctAnswer && (
                  <CheckCircle size={24} />
                )}
                {answered && option === selectedAnswer && option !== question.correctAnswer && (
                  <XCircle size={24} />
                )}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        {answered && (
          <button onClick={handleNext} className="next-question-btn" style={{ backgroundColor: language.color }}>
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;