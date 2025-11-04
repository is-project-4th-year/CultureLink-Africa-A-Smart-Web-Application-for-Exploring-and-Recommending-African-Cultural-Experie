// src/services/coldStartService.js
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Save cold start preferences to Firestore
 * @param {string} userId - User's UID
 * @param {object} preferences - User's onboarding preferences
 */
export const saveColdStartPreferences = async (userId, preferences) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = doc(db, 'users', userId);

    // Prepare the preference data
    const coldStartData = {
      coldStartCompleted: true,
      coldStartCompletedAt: new Date(),
      culturalPreferences: {
        interests: preferences.interests || [],
        favoriteTribes: preferences.tribes || [],
        experienceLevel: preferences.experienceLevel || 'beginner',
        purpose: preferences.purpose || '',
        contentStyle: preferences.contentStyle || 'mixed'
      },
      updatedAt: new Date()
    };

    // Update user document
    await updateDoc(userRef, coldStartData);

    console.log('✅ Cold start preferences saved successfully');
    return { success: true, message: 'Preferences saved successfully!' };
  } catch (error) {
    console.error('❌ Error saving cold start preferences:', error);
    throw error;
  }
};

/**
 * Check if user has completed cold start onboarding
 * @param {string} userId - User's UID
 * @returns {boolean} - True if completed, false otherwise
 */
export const hasColdStartCompleted = async (userId) => {
  if (!userId) return false;

  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.coldStartCompleted === true;
    }

    return false;
  } catch (error) {
    console.error('Error checking cold start status:', error);
    return false;
  }
};

/**
 * Get user's cold start preferences
 * @param {string} userId - User's UID
 * @returns {object|null} - User preferences or null
 */
export const getColdStartPreferences = async (userId) => {
  if (!userId) return null;

  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        interests: userData.culturalPreferences?.interests || [],
        tribes: userData.culturalPreferences?.favoriteTribes || [],
        experienceLevel: userData.culturalPreferences?.experienceLevel || 'beginner',
        purpose: userData.purpose || '',
        contentStyle: userData.contentStyle || 'mixed'
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting cold start preferences:', error);
    return null;
  }
};

/**
 * Skip cold start (mark as completed but with empty preferences)
 * @param {string} userId - User's UID
 */
export const skipColdStart = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      coldStartCompleted: true,
      coldStartSkipped: true,
      coldStartCompletedAt: new Date(),
      updatedAt: new Date()
    });

    console.log('ℹ️ Cold start skipped by user');
    return { success: true, message: 'Onboarding skipped' };
  } catch (error) {
    console.error('❌ Error skipping cold start:', error);
    throw error;
  }
};