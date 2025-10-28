// src/hooks/useColdStart.js
import { useState, useEffect } from 'react';
import { hasColdStartCompleted } from '../services/coldStartService';

export const useColdStart = (user) => {
  const [showColdStartModal, setShowColdStartModal] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    console.log('useColdStart: Effect triggered', { hasUser: !!user, userId: user?.uid, emailVerified: user?.emailVerified });
    
    const checkColdStartStatus = async () => {
      if (!user) {
        console.log('useColdStart: No user, skipping check');
        setChecking(false);
        return;
      }

      // Check if email is verified
      if (!user.emailVerified) {
        console.log('useColdStart: Email not verified, skipping modal');
        setChecking(false);
        return;
      }

      console.log('useColdStart: User exists and email verified, checking Firestore...');

      try {
        const completed = await hasColdStartCompleted(user.uid);
        console.log('useColdStart: Cold start completed?', completed);
        
        if (!completed) {
          console.log('useColdStart: Will show modal in 1 second');
          setTimeout(() => {
            console.log('useColdStart: Showing modal NOW');
            setShowColdStartModal(true);
          }, 1000);
        } else {
          console.log('useColdStart: Already completed, not showing modal');
        }
      } catch (error) {
        console.error('useColdStart: Error checking status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkColdStartStatus();
  }, [user, user?.emailVerified]);

  const handleComplete = () => {
    console.log('Cold start completed, closing modal');
    setShowColdStartModal(false);
  };

  const handleSkip = () => {
    console.log('Cold start skipped, closing modal');
    setShowColdStartModal(false);
  };

  return {
    showColdStartModal,
    checking,
    handleComplete,
    handleSkip
  };
};