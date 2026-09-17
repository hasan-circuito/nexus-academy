// types/progress.types.ts
// NEXUS Academy — Learner Progress State Types
// Source of truth: DATA_SCHEMA.md Sections 5–7, 10

import type { ISODate, ISODateTime, MissionStatus, ReviewStatus } from './common.types';

// ============================================================
// 5. Learner Progress — persisted via DataService (localStorage in V1)
// ============================================================


export interface ActivityRecord {
  id: string;
  type: 'mission_completed' | 'xp_earned' | 'level_up' | 'mission_unlocked';
  message: string;
  timestamp: string; // ISODateTime
  points?: number;
}

export interface LearnerProgress {
  _schemaVersion: 1;                  // Increment on breaking schema changes
  createdAt: ISODateTime;
  lastActiveAt: ISODateTime;

  // Gamification
  xp: number;                         // Total XP earned (never decrements)
  level: number;                      // Current level (1–10)
  streak: StreakData;

  // Achievements — AchievementService checks this before awarding to prevent double-awarding
  unlockedAchievements: UnlockedAchievement[];

  // Mission Progress — keyed by missionId ("001", "002" etc.)
  missions: Record<string, MissionProgress>;

  // Analytics
  totalStudyTimeMs: number;
  sessionCount: number;

  // Session History — last 30 sessions in full.
  // Older sessions compacted into LearningMemory.improvementTrend by LearningMemoryService.
  recentSessions: StudySession[];
  activityHistory: ActivityRecord[];
}

export interface StreakData {
  current: number;                    // Days in current streak
  longest: number;                    // Best streak ever
  lastStudyDate: ISODate;            // YYYY-MM-DD — date-only prevents timezone breaks
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: ISODateTime;
  xpAwarded: number;
}

// ============================================================
// Mission Progress
// ============================================================

export interface MissionProgress {
  status: MissionStatus;
  unlockedAt?: ISODateTime;
  startedAt?: ISODateTime;            // When Step 1 was first accessed
  completedAt?: ISODateTime;          // When Step 13 was completed
  understandingScore: number;         // 0–100 — computed by UnderstandingEngine ONLY
  xpEarned: number;
  currentStepIndex?: number;          // 0-indexed active / last visited step index for this mission

  // Per-step progress — keyed by stepIndex as string ("0" through "12")
  steps: Record<string, StepProgress>;

  // Quiz data (step index 9)
  quizAttempts: QuizAttempt[];

  // Debug challenge data (step index 10)
  debugAttempts: DebugAttempt[];

  // Reflection data (step index 11)
  reflection: ReflectionRecord;
}

export interface StepProgress {
  completed: boolean;
  completedAt?: ISODateTime;
  timeSpentMs: number;
  hintsUsed: number;                  // CANONICAL hint count. Used by UnderstandingEngine.
                                      // For practice: total hints revealed.
                                      // For debug: total hints revealed across all attempts.
}

export interface QuizAttempt {
  attemptNumber: number;              // 1-indexed
  score: number;                      // 0–100
  passed: boolean;
  answers: Record<string, number>;    // questionId → selectedOptionIndex
  completedAt: ISODateTime;
}

export interface DebugAttempt {
  attemptNumber: number;
  correct: boolean;
  hintsUsedInThisAttempt: number;     // Per-attempt only. NOT canonical total.
                                      // Use StepProgress.hintsUsed for scoring.
  completedAt: ISODateTime;
}

export interface ReflectionRecord {
  completed: boolean;                 // V1: binary only
  completedAt?: ISODateTime;
  // V2 addition: reflectionText?: Record<number, string>; // promptIndex → answer
}

// ============================================================
// 6. Learning Memory — separate localStorage key
// ============================================================

export interface LearningMemory {
  _schemaVersion: 1;
  weakTopics: WeakTopic[];            // Understanding Score < 60
  strongTopics: string[];             // topicSlugs with score >= 90
  frequentlyMissedQuestions: MissedQuestion[];
  repeatDebugMistakes: DebugMistake[];
  reviewHistory: ReviewHistoryEntry[];
  improvementTrend: ImprovementEntry[];  // Weekly snapshots
}

export interface WeakTopic {
  topicSlug: string;
  missionId: string;
  understandingScore: number;
  lastAttemptAt: ISODateTime;
  reviewCount: number;
}

export interface MissedQuestion {
  missionId: string;
  questionId: string;
  missCount: number;
  lastMissedAt: ISODateTime;
}

export interface DebugMistake {
  missionId: string;
  bugType: string;                    // BugType value
  missCount: number;
  lastMissedAt: ISODateTime;
}

export interface ReviewHistoryEntry {
  missionId: string;
  intervalDays: number;
  score: number;
  completedAt: ISODateTime;
}

export interface ImprovementEntry {
  weekOf: ISODate;                    // Monday of the week
  averageUnderstandingScore: number;
  missionsCompleted: number;
  totalXP: number;
}

// ============================================================
// 7. Spaced Repetition Schedule
// ============================================================

export interface ReviewItem {
  missionId: string;
  topicSlug: string;
  scheduledFor: ISODate;
  intervalDays: number;
  reviewNumber: number;               // 1 = first review after completion
  status: ReviewStatus;

  // SM-2 algorithm state — required for adaptive rescheduling (V2)
  repetitions: number;               // SM-2: n (successful review count)
  easinessFactor: number;            // SM-2: EF (default 2.5, min 1.3)
}

// V1 pre-loaded interval sequence (days): [1, 3, 7, 14, 30, 90]
export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 90] as const;
export const SM2_DEFAULT_EF = 2.5;
export const SM2_MIN_EF = 1.3;

// ============================================================
// 10. Study Session
// ============================================================

export interface StudySession {
  sessionId: string;                  // UUID v4
  startedAt: ISODateTime;
  endedAt?: ISODateTime;             // Null while session is active
  durationMs: number;
  stepsCompleted: number;            // New steps completed in this session
  missionsAccessed: string[];        // missionIds touched
  xpEarned: number;
  newStepCompleted: boolean;         // Whether this session counts toward streak
}

export const MAX_RECENT_SESSIONS = 30;

// ============================================================
// Factory helpers — create default empty state
// ============================================================

export function createDefaultProgress(): LearnerProgress {
  return {
    _schemaVersion: 1,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    xp: 0,
    level: 1,
    streak: {
      current: 0,
      longest: 0,
      lastStudyDate: '',
    },
    unlockedAchievements: [],
    missions: {},
    totalStudyTimeMs: 0,
    sessionCount: 0,
    recentSessions: [],
    activityHistory: [],
  };
}

export function createDefaultMissionProgress(missionId: string): MissionProgress {
  void missionId; // missionId available for future use
  return {
    status: 'locked',
    understandingScore: 0,
    xpEarned: 0,
    currentStepIndex: 0,
    steps: {},
    quizAttempts: [],
    debugAttempts: [],
    reflection: { completed: false },
  };
}

export function createDefaultStepProgress(): StepProgress {
  return {
    completed: false,
    timeSpentMs: 0,
    hintsUsed: 0,
  };
}

export function createDefaultLearningMemory(): LearningMemory {
  return {
    _schemaVersion: 1,
    weakTopics: [],
    strongTopics: [],
    frequentlyMissedQuestions: [],
    repeatDebugMistakes: [],
    reviewHistory: [],
    improvementTrend: [],
  };
}
