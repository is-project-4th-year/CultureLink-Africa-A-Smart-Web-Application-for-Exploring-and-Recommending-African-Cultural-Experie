// src/services/recommendationService.js

import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Get user's cultural preferences from Firestore
 */
export const getUserPreferences = async (userId) => {
  try {
    const prefsDoc = await getDoc(doc(db, 'users', userId, 'culturalPreferences', 'preferences'));
    
    if (prefsDoc.exists()) {
      return prefsDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
};

/**
 * Generate tribe recommendations based on user preferences
 */
export const getRecommendedTribes = (userPreferences, allTribes) => {
  if (!userPreferences) return [];

  const { tribes = [], interests = [], experienceLevel = 'beginner' } = userPreferences;

  // Score each tribe based on user preferences
  const scoredTribes = allTribes.map(tribe => {
    let score = 0;

    // Direct tribe match (highest priority)
    if (tribes.includes(tribe.name)) {
      score += 100;
    }

    // Interest category match
    const matchingInterests = tribe.categories.filter(cat => interests.includes(cat));
    score += matchingInterests.length * 20;

    // Experience level bonus (beginner gets more popular tribes)
    if (experienceLevel === 'beginner' && ['Kikuyu', 'Maasai', 'Luo'].includes(tribe.name)) {
      score += 10;
    }

    return { ...tribe, score };
  });

  // Sort by score and return top recommendations
  return scoredTribes
    .sort((a, b) => b.score - a.score)
    .filter(tribe => tribe.score > 0)
    .slice(0, 6); // Top 6 recommendations
};

/**
 * Get recommended cultural categories based on user interests
 */
export const getRecommendedCategories = (userPreferences, allCategories) => {
  if (!userPreferences || !userPreferences.interests) return [];

  const { interests } = userPreferences;

  // Filter categories that match user interests
  return allCategories.filter(category => 
    interests.some(interest => 
      category.id === interest || category.name.toLowerCase().includes(interest)
    )
  );
};

/**
 * Generate content recommendations based on user preferences
 */
export const getRecommendedContent = (userPreferences) => {
  if (!userPreferences) return [];

  const { tribes = [], interests = [], purpose = [] } = userPreferences;

  const recommendations = [];

  // Generate recommendations based on tribes
  tribes.forEach(tribe => {
    recommendations.push({
      type: 'tribe',
      title: `Explore ${tribe} Culture`,
      description: `Discover the rich traditions and customs of the ${tribe} people`,
      tribe: tribe,
      reason: `You selected ${tribe} as an area of interest`
    });
  });

  // Generate recommendations based on interests
  interests.forEach(interest => {
    const interestNames = {
      'food': 'Traditional Foods',
      'ceremonies': 'Ceremonies & Rituals',
      'arts': 'Arts & Crafts',
      'music': 'Music & Dance',
      'languages': 'Languages',
      'clothing': 'Traditional Clothing'
    };

    recommendations.push({
      type: 'category',
      title: `Discover ${interestNames[interest] || interest}`,
      description: `Explore ${interestNames[interest] || interest} across different Kenyan tribes`,
      category: interest,
      reason: `Based on your interest in ${interestNames[interest] || interest}`
    });
  });

  return recommendations.slice(0, 8); // Return top 8 recommendations
};

/**
 * Calculate similarity score between user preferences and tribe
 */
export const calculateTribeSimilarity = (userPreferences, tribe) => {
  if (!userPreferences) return 0;

  let similarity = 0;
  const { tribes = [], interests = [] } = userPreferences;

  // Direct tribe match
  if (tribes.includes(tribe.name)) {
    similarity += 0.5;
  }

  // Interest overlap
  const commonInterests = tribe.categories.filter(cat => interests.includes(cat));
  similarity += (commonInterests.length / Math.max(interests.length, 1)) * 0.5;

  return similarity;
};