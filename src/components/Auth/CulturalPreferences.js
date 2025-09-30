// src/components/Auth/CulturalPreferences.js - With Popup Form and Luhya
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserPreferences } from '../../services/authService';

const CulturalPreferences = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [preferences, setPreferences] = useState({
    favoriteTribes: [],
    interests: [],
    experienceLevel: 'beginner'
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Show popup automatically after page loads
  useEffect(() => {
    console.log('🔍 CULTURAL PREFS: Component mounted');
    console.log('🔍 CULTURAL PREFS: Current user:', currentUser);
    
    const timer = setTimeout(() => {
      setPageLoading(false);
      // Show popup after page loads
      setTimeout(() => {
        setShowPopup(true);
      }, 500);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentUser]);

  // Enhanced Kenyan tribes including Luhya
  const kenyanTribes = [
    { 
      id: 'kikuyu', 
      name: 'Kikuyu', 
      description: 'Agricultural traditions and Mount Kenya heritage',
      emoji: '🏔️'
    },
    { 
      id: 'luhya', 
      name: 'Luhya', 
      description: 'Western Kenya farming community with rich cultural festivals',
      emoji: '🌾'
    },
    { 
      id: 'maasai', 
      name: 'Maasai', 
      description: 'Warrior culture and pastoralism',
      emoji: '🛡️'
    },
    { 
      id: 'luo', 
      name: 'Luo', 
      description: 'Lake Victoria fishing and musical traditions',
      emoji: '🎣'
    },
    { 
      id: 'kalenjin', 
      name: 'Kalenjin', 
      description: 'Running champions and highland culture',
      emoji: '🏃'
    },
    { 
      id: 'kamba', 
      name: 'Kamba', 
      description: 'Wood carving and trading heritage',
      emoji: '🪵'
    }
  ];

  const culturalInterests = [
    { id: 'food', name: 'Traditional Foods', icon: '🍽️' },
    { id: 'music', name: 'Music & Dance', icon: '🎵' },
    { id: 'arts', name: 'Arts & Crafts', icon: '🎨' },
    { id: 'ceremonies', name: 'Ceremonies & Rituals', icon: '🎭' },
    { id: 'languages', name: 'Languages', icon: '🗣️' },
    { id: 'history', name: 'History & Stories', icon: '📚' },
    { id: 'clothing', name: 'Traditional Clothing', icon: '👘' },
    { id: 'tourism', name: 'Cultural Tourism', icon: '🗺️' },
    { id: 'festivals', name: 'Festivals & Celebrations', icon: '🎉' },
    { id: 'agriculture', name: 'Traditional Farming', icon: '🌱' }
  ];

  const experienceLevels = [
    { 
      value: 'beginner', 
      label: 'Beginner', 
      description: 'New to Kenyan culture',
      emoji: '🌱'
    },
    { 
      value: 'intermediate', 
      label: 'Intermediate', 
      description: 'Some knowledge and experience',
      emoji: '🌿'
    },
    { 
      value: 'advanced', 
      label: 'Advanced', 
      description: 'Deep understanding and experience',
      emoji: '🌳'
    }
  ];

  const handleTribeToggle = (tribeId) => {
    setPreferences(prev => ({
      ...prev,
      favoriteTribes: prev.favoriteTribes.includes(tribeId)
        ? prev.favoriteTribes.filter(id => id !== tribeId)
        : [...prev.favoriteTribes, tribeId]
    }));
  };

  const handleInterestToggle = (interestId) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleExperienceLevelChange = (level) => {
    setPreferences(prev => ({
      ...prev,
      experienceLevel: level
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (preferences.favoriteTribes.length === 0) {
      alert('Please select at least one Kenyan community that interests you.');
      return;
    }

    if (preferences.interests.length === 0) {
      alert('Please select at least one cultural interest.');
      return;
    }

    setLoading(true);
    console.log('🔍 CULTURAL PREFS: Saving preferences...');

    if (currentUser) {
      try {
        const { error } = await updateUserPreferences(currentUser.uid, preferences);
        
        if (error) {
          console.error('🔍 CULTURAL PREFS: Error saving:', error);
          alert('Error saving preferences: ' + error);
        } else {
          console.log('🔍 CULTURAL PREFS: Preferences saved successfully');
          setShowPopup(false);
          // Small delay then redirect to home
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      } catch (error) {
        console.error('🔍 CULTURAL PREFS: Exception occurred:', error);
        alert('Error saving preferences: ' + error.message);
      }
    }

    // Add this debug logging to your Cultural Preferences handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('🔍 PREFS DEBUG: Submit clicked');
  console.log('🔍 PREFS DEBUG: Current user:', currentUser);
  console.log('🔍 PREFS DEBUG: User UID:', currentUser?.uid);
  console.log('🔍 PREFS DEBUG: User email:', currentUser?.email);
  console.log('🔍 PREFS DEBUG: Preferences to save:', preferences);
  
  if (preferences.favoriteTribes.length === 0) {
    alert('Please select at least one Kenyan community that interests you.');
    return;
  }

  if (preferences.interests.length === 0) {
    alert('Please select at least one cultural interest.');
    return;
  }

  setLoading(true);
  console.log('🔍 PREFS DEBUG: About to save preferences...');

  if (currentUser) {
    try {
      console.log('🔍 PREFS DEBUG: Calling updateUserPreferences...');
      console.log('🔍 PREFS DEBUG: UID:', currentUser.uid);
      console.log('🔍 PREFS DEBUG: Preferences:', preferences);
      
      const { error } = await updateUserPreferences(currentUser.uid, preferences);
      
      console.log('🔍 PREFS DEBUG: updateUserPreferences returned');
      console.log('🔍 PREFS DEBUG: Error:', error);
      
      if (error) {
        console.error('❌ PREFS DEBUG: Error saving preferences:', error);
        alert('Error saving preferences: ' + error);
      } else {
        console.log('✅ PREFS DEBUG: Preferences saved successfully!');
        setShowPopup(false);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      console.error('💥 PREFS DEBUG: Exception during save:', error);
      alert('Error saving preferences: ' + error.message);
    }
  } else {
    console.error('❌ PREFS DEBUG: No current user found!');
    alert('Error: User not found. Please try logging in again.');
    navigate('/login');
  }

  setLoading(false);
};

    setLoading(false);
  };

  const handleSkip = () => {
    setShowPopup(false);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  // Loading screen
  if (pageLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
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
        <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Setting up your cultural journey...</h2>
        <p style={{ color: '#666' }}>Almost there! 🇰🇪</p>
        
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Background Page Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', opacity: showPopup ? 0.3 : 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🇰🇪</div>
          <h1 style={{ color: '#2c3e50', marginTop: '1rem', fontSize: '2.5rem' }}>
            Welcome to CultureLink Kenya!
          </h1>
          <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Your gateway to authentic Kenyan culture and traditions.
          </p>
        </div>

        {/* Background content - tribal showcase */}
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
            Kenya's Rich Cultural Heritage
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {kenyanTribes.map(tribe => (
              <div key={tribe.id} style={{
                padding: '1.5rem',
                border: '2px solid #ddd',
                borderRadius: '1rem',
                textAlign: 'center',
                backgroundColor: 'white'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                  {tribe.emoji}
                </div>
                <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                  {tribe.name} People
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {tribe.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            width: '100%',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {/* Popup Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
              <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                Personalize Your Cultural Journey
              </h2>
              <p style={{ color: '#666', fontSize: '1rem' }}>
                Tell us what interests you most about Kenyan culture
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Kenyan Communities */}
              <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  Which communities interest you? (Select multiple)
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '0.75rem' 
                }}>
                  {kenyanTribes.map(tribe => (
                    <div
                      key={tribe.id}
                      onClick={() => handleTribeToggle(tribe.id)}
                      style={{
                        padding: '1rem',
                        border: preferences.favoriteTribes.includes(tribe.id) 
                          ? '2px solid #e67e22' 
                          : '1px solid #ddd',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: preferences.favoriteTribes.includes(tribe.id) 
                          ? '#fff5f0' 
                          : 'white',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                        {tribe.emoji}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2c3e50' }}>
                        {tribe.name}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cultural Interests */}
              <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  What aspects of culture interest you? (Select multiple)
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '0.75rem' 
                }}>
                  {culturalInterests.map(interest => (
                    <div
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      style={{
                        padding: '0.75rem',
                        border: preferences.interests.includes(interest.id) 
                          ? '2px solid #3498db' 
                          : '1px solid #ddd',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: preferences.interests.includes(interest.id) 
                          ? '#f0f8ff' 
                          : 'white',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                        {interest.icon}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#2c3e50' }}>
                        {interest.name}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Experience Level */}
              <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  Your experience with Kenyan culture?
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '0.75rem' 
                }}>
                  {experienceLevels.map(level => (
                    <div
                      key={level.value}
                      onClick={() => handleExperienceLevelChange(level.value)}
                      style={{
                        padding: '1rem',
                        border: preferences.experienceLevel === level.value 
                          ? '2px solid #27ae60' 
                          : '1px solid #ddd',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: preferences.experienceLevel === level.value 
                          ? '#f0fff4' 
                          : 'white',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                        {level.emoji}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '0.25rem' }}>
                        {level.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        {level.description}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Submit Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Skip for Now
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: loading ? '#bdc3c7' : '#e67e22',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? '🔄 Saving...' : '🚀 Start My Cultural Journey!'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalPreferences;