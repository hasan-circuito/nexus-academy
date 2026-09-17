import type { DataService } from './DataService';
import { 
  createDefaultProgress, 
  createDefaultMissionProgress,
  createDefaultLearningMemory,
  type LearnerProgress, 
  type LearningMemory, 
  type ReviewItem, 
  type StudySession 
} from '@/types/progress.types';
import {
  createDefaultDictionaryProgress,
  type DictionaryEntry,
  type LearnerDictionaryProgress,
} from '@/types/dictionary.types';
import dictionaryData from '@/data/dictionary.json';

export class LocalStorageDataService implements DataService {
  private get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom event so hooks can re-render
      window.dispatchEvent(new Event('nexus_storage_update'));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  getProgress(): LearnerProgress {
    const defaultProgress = createDefaultProgress();
    if (typeof window === 'undefined') return defaultProgress;
    try {
      const item = localStorage.getItem('nexus_progress');
      if (!item) return defaultProgress;
      const parsed = JSON.parse(item);
      const finalProgress = {
        ...defaultProgress,
        ...parsed,
        streak: { ...defaultProgress.streak, ...(parsed.streak || {}) },
        missions: parsed.missions || defaultProgress.missions,
        activityHistory: parsed.activityHistory || defaultProgress.activityHistory,
      };

      // Patch for older data where activity was not logged
      if (finalProgress.missions['001']?.status === 'complete' && finalProgress.activityHistory.length === 0) {
        finalProgress.activityHistory.push({
          id: 'legacy-completion',
          type: 'mission_completed',
          message: 'Completed Locked Mission 1',
          timestamp: finalProgress.missions['001'].completedAt || new Date().toISOString()
        });
        finalProgress.activityHistory.push({
          id: 'legacy-unlock',
          type: 'mission_unlocked',
          message: 'Unlocked Mission 2',
          timestamp: finalProgress.missions['001'].completedAt || new Date().toISOString()
        });
      }

      return finalProgress;
    } catch {
      return defaultProgress;
    }
  }

  saveProgress(progress: LearnerProgress): void {
    this.set('nexus_progress', progress);
  }

  getActiveStep(missionId: string): number {
    const cleanId = missionId.replace(/^mission-/, '');
    const progress = this.getProgress();
    const mp = progress.missions[cleanId] || progress.missions[missionId];
    if (!mp) return 0;
    if (typeof mp.currentStepIndex === 'number' && !isNaN(mp.currentStepIndex) && mp.currentStepIndex >= 0) {
      return Math.floor(mp.currentStepIndex);
    }
    // Completed missions without explicit currentStepIndex review from step 0
    if (mp.status === 'complete') {
      return 0;
    }
    let maxStep = 0;
    if (mp.steps) {
      for (const key of Object.keys(mp.steps)) {
        if (key.startsWith('step_')) {
          const idx = parseInt(key.replace('step_', ''), 10);
          if (!isNaN(idx) && idx > maxStep) {
            maxStep = idx;
          }
        } else if (/^\d+$/.test(key)) {
          const idx = parseInt(key, 10);
          if (!isNaN(idx) && idx > maxStep) {
            maxStep = idx;
          }
        }
      }
    }
    return maxStep;
  }

  saveActiveStep(missionId: string, stepIndex: number): void {
    if (typeof window === 'undefined') return;
    if (typeof stepIndex !== 'number' || isNaN(stepIndex) || stepIndex < 0) return;

    const intStepIndex = Math.floor(stepIndex);
    const cleanId = missionId.replace(/^mission-/, '');
    const progress = this.getProgress();

    if (!progress.missions[cleanId]) {
      if (progress.missions[missionId]) {
        progress.missions[cleanId] = progress.missions[missionId];
        delete progress.missions[missionId];
      } else {
        progress.missions[cleanId] = createDefaultMissionProgress(cleanId);
      }
    }

    const mp = progress.missions[cleanId];
    // Only transition unlocked missions (or foundational mission 001) to in_progress.
    // Locked missions must stay locked (e.g. when previewing or in dev mode).
    const isFoundational = cleanId === '001';
    const shouldSetInProgress = mp.status === 'unlocked' || (isFoundational && mp.status === 'locked');

    if (mp.currentStepIndex === intStepIndex && !shouldSetInProgress) {
      return;
    }

    mp.currentStepIndex = intStepIndex;

    if (shouldSetInProgress) {
      mp.status = 'in_progress';
      if (!mp.startedAt) {
        mp.startedAt = new Date().toISOString();
      }
    }

    progress.lastActiveAt = new Date().toISOString();
    this.saveProgress(progress);
  }

  getMemory(): LearningMemory {
    return this.get<LearningMemory>('nexus_memory', createDefaultLearningMemory());
  }

  saveMemory(memory: LearningMemory): void {
    this.set('nexus_memory', memory);
  }

  getReviewSchedule(): ReviewItem[] {
    return this.get<ReviewItem[]>('nexus_schedule', []);
  }

  saveReviewSchedule(schedule: ReviewItem[]): void {
    this.set('nexus_schedule', schedule);
  }

  getCurrentSession(): StudySession | null {
    return this.get<StudySession | null>('nexus_session', null);
  }

  saveSession(session: StudySession): void {
    this.set('nexus_session', session);
  }

  clearCurrentSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexus_session');
    }
  }

  getDictionaryEntries(): DictionaryEntry[] {
    return dictionaryData as unknown as DictionaryEntry[];
  }

  getDictionaryProgress(): LearnerDictionaryProgress {
    return this.get<LearnerDictionaryProgress>('nexus_dict_progress', createDefaultDictionaryProgress());
  }

  saveDictionaryProgress(progress: LearnerDictionaryProgress): void {
    this.set('nexus_dict_progress', progress);
  }
}

export const storage = new LocalStorageDataService();
