// services/DataService.ts
// NEXUS Academy — Storage Abstraction Interface
// Source of truth: ARCHITECTURE.md Section 5
//
// RULE: No engine or component touches localStorage directly.
// All reads and writes go through this interface.
//
// V1: LocalStorageDataService implements this.
// V2: ApiDataService or SupabaseDataService implements this.
// No engine changes required when switching implementations.

import type {
  LearnerProgress,
  LearningMemory,
  ReviewItem,
  StudySession,
} from '@/types/progress.types';
import type {
  DictionaryEntry,
  LearnerDictionaryProgress,
} from '@/types/dictionary.types';

export interface DataService {
  // --------------------------------------------------------
  // Progress — main learner state
  // --------------------------------------------------------
  getProgress(): LearnerProgress | null;
  saveProgress(progress: LearnerProgress): void;

  // --------------------------------------------------------
  // Learning Memory — separate key, independently compactable
  // --------------------------------------------------------
  getMemory(): LearningMemory;
  saveMemory(memory: LearningMemory): void;

  // --------------------------------------------------------
  // Review Schedule — spaced repetition data
  // --------------------------------------------------------
  getReviewSchedule(): ReviewItem[];
  saveReviewSchedule(schedule: ReviewItem[]): void;

  // --------------------------------------------------------
  // Session — current active session
  // --------------------------------------------------------
  getCurrentSession(): StudySession | null;
  saveSession(session: StudySession): void;
  clearCurrentSession(): void;

  // --------------------------------------------------------
  // Dictionary — entries and learner dictionary progress
  // --------------------------------------------------------
  getDictionaryEntries(): DictionaryEntry[];
  getDictionaryProgress(): LearnerDictionaryProgress;
  saveDictionaryProgress(progress: LearnerDictionaryProgress): void;
}
