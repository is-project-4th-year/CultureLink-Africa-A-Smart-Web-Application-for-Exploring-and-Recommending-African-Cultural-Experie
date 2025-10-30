// src/App.js - Updated with Cold Start Modal
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header/Header';
import TribesMap from './components/TribesMap';
import TribesMapPage from './pages/TribesMapPage/TribesMapPage';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Chat from './pages/Chat';
import Contact from './pages/Contact/Contact';
import Profile from './components/UserProfile/profile';
import Blog from './pages/Blog/Blog';
import CreatePost from './pages/Blog/CreatePost';
import ViewPost from './pages/Blog/ViewPost';
import EditPost from './pages/Blog/EditPost';
import LanguageSelect from './pages/Learn/LanguageSelect';
import LessonView from './pages/Learn/LessonView';
import Quiz from './pages/Learn/Quiz';
import ChatInterface from './pages/Chat/ChatInterface';

// Cold Start Components
import ColdStartModal from './components/ColdStart/ColdStartModal';
import { useColdStart } from './hooks/useColdStart';
import { skipColdStart } from './services/coldStartService';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import CulturalPreferences from './components/Auth/CulturalPreferences';

// Styles
import './App.css';

// Loading Component
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #e67e22',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem'
    }}></div>
    <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>CultureLink Kenya</h2>
    <p style={{ color: '#666' }}>Loading your cultural journey...</p>
    
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Error Component
const ErrorScreen = ({ error }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '2rem'
  }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
    <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Something went wrong</h2>
    <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>
      {error || 'An unexpected error occurred while loading the application.'}
    </p>
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: '1rem 2rem',
        backgroundColor: '#e67e22',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '1rem'
      }}
    >
       Reload Application
    </button>
  </div>
);

// Main App Content
const AppContent = () => {
  const { user, loading, error } = useAuth();

  // DEBUG LOGS
  console.log('========================================');
  console.log('App.js Debug:');
  console.log('  user exists?', !!user);
  console.log('  user UID:', user?.uid);
  console.log('  loading?', loading);
  console.log('  error?', error);
  console.log('========================================');

  const { 
    showColdStartModal, 
    checking, 
    handleComplete, 
    handleSkip 
  } = useColdStart(user);

  // MORE DEBUG LOGS
  console.log('Cold Start Hook Results:');
  console.log('  showColdStartModal?', showColdStartModal);
  console.log('  checking?', checking);
  console.log('  Should render modal?', user && showColdStartModal);
  console.log('========================================');

 

  // 🎯 COLD START COMPLETION HANDLER
  const handleColdStartComplete = (preferences) => {
    console.log('✅ Cold start preferences saved:', preferences);
    handleComplete();
    
    // Optional: Show success toast/notification
    // Optional: Redirect to explore page
    // Example: navigate('/explore');
  };

  // 🎯 COLD START SKIP HANDLER
  const handleColdStartSkip = async () => {
    try {
      if (user) {
        await skipColdStart(user.uid);
        console.log('User skipped cold start onboarding');
      }
      handleSkip();
    } catch (error) {
      console.error('Error skipping cold start:', error);
      handleSkip();
    }
  };

  

  // Show loading while checking auth or cold start status
  if (loading || checking) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/create" element={<CreatePost />} />
        <Route path="/blog/:postId" element={<ViewPost />} />
        <Route path="/blog/edit/:postId" element={<EditPost />} />
        <Route path="/learn" element={<LanguageSelect />} />
        <Route path="/learn/:languageId" element={<LessonView />} />
        <Route path="/learn/:languageId/quiz" element={<Quiz />} />
        <Route path="/map" element={<TribesMapPage />} />
                
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cultural-preferences" element={<CulturalPreferences />} />
      </Routes>

      {/* 🎯 COLD START MODAL - Shows on first login */}
      {console.log('Rendering modal check:', { hasUser: !!user, showModal: showColdStartModal })}
      
       {user && showColdStartModal && (        <>
          {console.log('MODAL IS RENDERING NOW')}
          <ColdStartModal
            user={user}
            onComplete={handleColdStartComplete}
            onSkip={handleColdStartSkip}
          />
        </>
      )}
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;