// src/App.js - Updated with Forgot Password Route
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header/Header';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Chat from './pages/Chat';
import Events from './pages/Events';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Profile from './components/UserProfile/profile';

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
      🔄 Reload Application
    </button>
  </div>
);

// Main App Content
const AppContent = () => {
  const { loading, error } = useAuth();

  if (loading) {
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
        <Route path="/chat" element={<Chat />} />
        <Route path="/events" element={<Events />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cultural-preferences" element={<CulturalPreferences />} />
      </Routes>
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