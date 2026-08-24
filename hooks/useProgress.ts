'use client';
import { useState, useEffect } from 'react';
import { storage } from '@/services/LocalStorageDataService';
import { createDefaultProgress, createDefaultMissionProgress, type LearnerProgress } from '@/types/progress.types';
import { XPEngine } from '@/engines/xp/XPEngine';

export function saveStepEvidence(
  missionId: string, 
  stepType: string, 
  evidence: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  const progress = storage.getProgress();
  if (!progress.missions[missionId]) {
    progress.missions[missionId] = createDefaultMissionProgress(missionId);
  }
  progress.missions[missionId].steps[stepType] = {
    completed: true,
    completedAt: new Date().toISOString(),
    timeSpentMs: 0,
    hintsUsed: 0,
    ...evidence
  };
  storage.saveProgress(progress);
}

export function useProgress() {
  const [progress, setProgress] = useState<LearnerProgress>(createDefaultProgress());
  const [xpState, setXpState] = useState(new XPEngine(storage).computeXPState(0));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setIsClient(true));
    const load = () => {
      const p = storage.getProgress();
      setProgress(p);
      setXpState(new XPEngine(storage).computeXPState(p.xp));
    };
    
    load();
    window.addEventListener('nexus_storage_update', load);
    return () => window.removeEventListener('nexus_storage_update', load);
  }, []);

  return { progress, xpState, isClient };
}
