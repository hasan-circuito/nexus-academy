// hooks/usePracticeCode.ts
// NEXUS Academy — Hook for persisting practice code

import { useState, useEffect } from 'react';

export function usePracticeCode(missionId: string, stepId: string, defaultCode: string = '') {
  const key = `nexus_practiceCode_${missionId}_${stepId}`;
  const [code, setCode] = useState<string>(defaultCode);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setCode(stored);
      } else {
        setCode(defaultCode);
      }
    } catch (e) {
      console.error('Failed to load practice code', e);
      setCode(defaultCode);
    }
    setIsLoaded(true);
  }, [key, defaultCode]);

  const updateCode = (newCode: string) => {
    setCode(newCode);
    try {
      localStorage.setItem(key, newCode);
    } catch (e) {
      console.error('Failed to save practice code', e);
    }
  };

  const resetCode = () => {
    updateCode(defaultCode);
  };

  return {
    code,
    updateCode,
    resetCode,
    isLoaded
  };
}
