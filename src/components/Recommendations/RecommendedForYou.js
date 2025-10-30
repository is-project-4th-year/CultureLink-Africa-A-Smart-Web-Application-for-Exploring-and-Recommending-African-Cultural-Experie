// src/components/Recommendations/RecommendedForYou.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserPreferences, getRecommendedTribes, getRecommendedContent } from '../../services/recommendationService';
import './RecommendedForYou.css';

const RecommendedForYou = ({ allTribes }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedTribes, setRecommendedTribes] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user preferences
        const prefs = await getUserPreferences(currentUser.uid);
        setUserPreferences(prefs);

        if (prefs) {
          // Generate tribe recommendations
          const tribes = getRecommendedTribes(prefs, allTribes);
          setRecommendedTribes(tribes);

          // Generate content recommendations
          const content = getRecommendedContent(prefs);
          setRecommendations(content);
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [currentUser, allTribes]);

  if (!currentUser || loading) {
    return null;
  }

  if (!userPreferences || (recommendedTribes.length === 0 && recommendations.length === 0)) {
    return null;
  }

  return (
    <section className="recommended-section">
      <div className="recommended-container">
        <div className="recommended-header">
          <h2>Recommended For You</h2>
          <p>Based on your cultural preferences and interests</p>
        </div>

        {/* Recommended Tribes */}
        {recommendedTribes.length > 0 && (
          <div className="recommended-tribes">
            <h3>Tribes You Might Like</h3>
            <div className="tribes-grid">
              {recommendedTribes.slice(0, 3).map((tribe) => (
                <div 
                  key={tribe.name} 
                  className="recommendation-card"
                  onClick={() => navigate(`/explore?tribe=${tribe.name.toLowerCase()}`)}
                >
                  <div className="recommendation-badge">
                    {tribe.score >= 100 ? 'Your Selection' : `${Math.round(tribe.score)}% Match`}
                  </div>
                  <h4>{tribe.name} People</h4>
                  <p className="tribe-region">{tribe.region}</p>
                  <p className="tribe-description">{tribe.description.substring(0, 120)}...</p>
                  <div className="matching-interests">
                    <strong>Matching Interests:</strong>
                    <div className="interest-tags">
                      {tribe.categories
                        .filter(cat => userPreferences.interests?.includes(cat))
                        .slice(0, 3)
                        .map(cat => (
                          <span key={cat} className="interest-tag">{cat}</span>
                        ))
                      }
                    </div>
                  </div>
                  <button className="explore-btn">Explore Culture</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Content */}
        {recommendations.length > 0 && (
          <div className="recommended-content">
            <h3>Explore More</h3>
            <div className="content-grid">
              {recommendations.slice(0, 4).map((rec, index) => (
                <div 
                  key={index} 
                  className="content-card"
                  onClick={() => {
                    if (rec.type === 'tribe') {
                      navigate(`/explore?tribe=${rec.tribe.toLowerCase()}`);
                    } else if (rec.type === 'category') {
                      navigate(`/explore?category=${rec.category}`);
                    }
                  }}
                >
                  <div className="content-card-icon">
                    {rec.type === 'tribe' ? '🏛️' : '🎨'}
                  </div>
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                  <span className="recommendation-reason">{rec.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why These Recommendations */}
        <div className="recommendation-explanation">
          <h4>Why am I seeing these?</h4>
          <p>
            These recommendations are based on your preferences: 
            {userPreferences.tribes && userPreferences.tribes.length > 0 && (
              <span> Interest in <strong>{userPreferences.tribes.join(', ')}</strong> culture</span>
            )}
            {userPreferences.interests && userPreferences.interests.length > 0 && (
              <span>, focus on <strong>{userPreferences.interests.join(', ')}</strong></span>
            )}
            {userPreferences.purpose && userPreferences.purpose.length > 0 && (
              <span>, and purpose: <strong>{userPreferences.purpose.join(', ')}</strong></span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default RecommendedForYou;