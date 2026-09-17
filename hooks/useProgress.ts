'use client';
import { useState, useEffect } from 'react';
import { storage } from '@/services/LocalStorageDataService';
import { createDefaultProgress, createDefaultMissionProgress, type LearnerProgress } from '@/types/progress.types';
import { XPEngine } from '@/engines/xp/XPEngine';
import { initEngines } from '@/engines/init';
import manifest from '@/data/missions/manifest.json';
import { getMissionStepCount } from '@/services/ContentService';

export interface ActiveMissionSummary {
  missionId: string;
  stepIndex: number;
  title: string;
  banglaTitle: string;
  totalSteps: number;
  url: string;
}

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

  // Resolve active mission for quick-resume UI
  let lastActiveMission: ActiveMissionSummary | null = null;
  if (isClient) {
    const candidateId = progress.lastActiveMissionId || 
      Object.keys(progress.missions).reverse().find(id => {
        const mp = progress.missions[id];
        return mp && mp.status !== 'complete' && (mp.status === 'in_progress' || (mp.currentStepIndex ?? 0) > 0);
      });

    if (candidateId) {
      const entry = manifest.missions.find(m => m.id === candidateId);
      const mp = progress.missions[candidateId];
      if (entry && mp && mp.status !== 'complete') {
        const totalSteps = getMissionStepCount(candidateId);
        const stepIndex = typeof mp.currentStepIndex === 'number'
          ? Math.min(Math.max(0, mp.currentStepIndex), Math.max(0, totalSteps - 1))
          : 0;
        lastActiveMission = {
          missionId: candidateId,
          stepIndex,
          title: entry.title,
          banglaTitle: entry.banglaTitle,
          totalSteps,
          url: `/mission/mission-${candidateId}/step/${stepIndex}`,
        };
      }
    }
  }

  return { progress, xpState, isClient, lastActiveMission };
}

