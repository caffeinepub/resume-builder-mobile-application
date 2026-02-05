import { useState, useEffect, useCallback } from 'react';

const COOLDOWN_KEY = 'android-install-popup-dismissed';
const COOLDOWN_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CooldownState {
  isDismissed: boolean;
  dismiss: () => void;
  clearDismissal: () => void;
}

export function useAndroidInstallPopupCooldown(): CooldownState {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if popup was dismissed and cooldown hasn't expired
    const checkCooldown = () => {
      try {
        const dismissedAt = localStorage.getItem(COOLDOWN_KEY);
        if (dismissedAt) {
          const dismissTime = parseInt(dismissedAt, 10);
          const now = Date.now();
          const hasExpired = now - dismissTime > COOLDOWN_DURATION_MS;
          
          if (hasExpired) {
            // Cooldown expired, clear it
            localStorage.removeItem(COOLDOWN_KEY);
            setIsDismissed(false);
          } else {
            // Still in cooldown
            setIsDismissed(true);
          }
        }
      } catch (error) {
        // localStorage not available, treat as not dismissed
        console.warn('localStorage not available for cooldown check:', error);
      }
    };

    checkCooldown();
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      setIsDismissed(true);
    } catch (error) {
      console.warn('Failed to save dismissal state:', error);
    }
  }, []);

  const clearDismissal = useCallback(() => {
    try {
      localStorage.removeItem(COOLDOWN_KEY);
      setIsDismissed(false);
    } catch (error) {
      console.warn('Failed to clear dismissal state:', error);
    }
  }, []);

  return {
    isDismissed,
    dismiss,
    clearDismissal,
  };
}
