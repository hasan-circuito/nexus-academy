'use client';
import { useState, useEffect } from 'react';
import { storage } from '@/services/LocalStorageDataService';
import { createDefaultProgress, createDefaultMissionProgress, type LearnerProgress } from '@/types/progress.types';
import { XPEngine } from '@/engines/xp/XPEngine';
import { initEngines } from '@/engines/init';

export function saveStepEvidence(
  missionId: string, 
  stepType: string, 
  evidence: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  const cleanId = missionId.replace(/^mission-/, '');
  const progress = storage.getProgress();
  if (!progress.missions[cleanId]) {
    progress.missions[cleanId] = createDefaultMissionProgress(cleanId);
  }
  progress.missions[cleanId].steps[stepType] = {
    completed: true,
    completedAt: new Date().toISOString(),
    timeSpentMs: 0,
    hintsUsed: 0,
    ...evidence
  };
  const stepMatch = stepType.match(/^step_(\d+)$/);
  if (stepMatch) {
    const idx = parseInt(stepMatch[1], 10);
    if (!isNaN(idx) && (progress.missions[cleanId].currentStepIndex ?? 0) < idx) {
      progress.missions[cleanId].currentStepIndex = idx;
    }
  }
  storage.saveProgress(progress);
}

export function saveActiveStep(missionId: string, stepIndex: number): void {
  storage.saveActiveStep(missionId, stepIndex);
}

export function getActiveStep(missionId: string): number {
  return storage.getActiveStep(missionId);
}

export function useProgress() {
  const [progress, setProgress] = useState<LearnerProgress>(createDefaultProgress());
  const [xpState, setXpState] = useState(new XPEngine(storage).computeXPState(0));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    initEngines();
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
