// engines/events/events.types.ts
// NEXUS Academy — Domain Event Type Definitions
// Source of truth: ARCHITECTURE.md Section 4
//
// All 20 domain event types. Every engine communicates exclusively via these events.
// Engines never call each other directly — only through the EventBus.
//
// RULE: Maximum event chain depth = 3 levels.
// See ARCHITECTURE.md Section 4 Design Principles Rule 6.

import type { StepType } from '@/types/common.types';

// ============================================================
// Domain Event Union
// ============================================================

export type DomainEvent =
  | StepCompletedEvent
  | QuizPassedEvent
  | QuizFailedEvent
  | QuizAttemptedEvent
  | PracticeCompletedEvent
  | PracticeSkippedEvent
  | DebugSolvedEvent
  | DebugAttemptedEvent
  | HintUsedEvent
  | ReflectionCompletedEvent
  | MissionCompletingEvent
  | MissionCompletedEvent
  | MissionUnlockedEvent
  | LevelUpEvent
  | AchievementUnlockedEvent
  | ReviewScheduledEvent
  | ReviewCompletedEvent
  | StreakUpdatedEvent
  | StreakBrokenEvent
  | DictionaryTermViewedEvent
  | SessionStartedEvent
  | SessionEndedEvent
  | CodeExecutedEvent;

export type EventType = DomainEvent['type'];

// ============================================================
// Event Interfaces — complete payloads (no follow-up fetching needed)
// ============================================================

export interface StepCompletedEvent {
  type: 'STEP_COMPLETED';
  payload: {
    missionId: string;
    stepIndex: number;
    stepType: StepType;
    timeSpentMs: number;
    timestamp: string;
  };
}

export interface QuizPassedEvent {
  type: 'QUIZ_PASSED';
  payload: {
    missionId: string;
    score: number;          // 0–100
    attemptNumber: number;  // 1 = first attempt
    totalQuestions: number;
    correctAnswers: number;
    timestamp: string;
  };
}

export interface QuizFailedEvent {
  type: 'QUIZ_FAILED';
  payload: {
    missionId: string;
    score: number;
    attemptNumber: number;
    timestamp: string;
  };
}

export interface QuizAttemptedEvent {
  type: 'QUIZ_ATTEMPTED';
  payload: {
    missionId: string;
    questionId: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    attemptNumber: number;
    timestamp: string;
  };
}

export interface PracticeCompletedEvent {
  type: 'PRACTICE_COMPLETED';
  payload: {
    missionId: string;
    selfReported: boolean;
    timestamp: string;
  };
}

export interface PracticeSkippedEvent {
  type: 'PRACTICE_SKIPPED';
  payload: {
    missionId: string;
    timestamp: string;
  };
}

export interface DebugSolvedEvent {
  type: 'DEBUG_SOLVED';
  payload: {
    missionId: string;
    hintsUsed: number;
    attemptNumber: number;
    timestamp: string;
  };
}

export interface DebugAttemptedEvent {
  type: 'DEBUG_ATTEMPTED';
  payload: {
    missionId: string;
    correct: boolean;
    attemptNumber: number;
    timestamp: string;
  };
}

export interface HintUsedEvent {
  type: 'HINT_USED';
  payload: {
    missionId: string;
    stepType: 'practice' | 'debug_challenge';
    hintIndex: number;
    timestamp: string;
  };
}

export interface ReflectionCompletedEvent {
  type: 'REFLECTION_COMPLETED';
  payload: {
    missionId: string;
    promptsAnswered: number;
    totalPrompts: number;
    // Note: Reflection text is NOT in the event.
    // It is stored directly by the UI via DataService.
    // Quality measurement deferred to AI Mentor (V2+).
    timestamp: string;
  };
}

/**
 * MISSION_COMPLETING — Phase 1 of the two-phase mission completion pattern.
 * Emitted by ProgressEngine. UnderstandingEngine ONLY subscribes to this.
 * UnderstandingEngine computes the final score and then emits MISSION_COMPLETED.
 * See ARCHITECTURE.md Section 4b.
 */
export interface MissionCompletingEvent {
  type: 'MISSION_COMPLETING';
  payload: {
    missionId: string;
    timestamp: string;
  };
}

/**
 * MISSION_COMPLETED — Phase 2 of the two-phase mission completion pattern.
 * Emitted ONLY by UnderstandingEngine after computing the final score.
 * All other engines subscribe to this, never to MISSION_COMPLETING.
 * The understandingScore in the payload is always final and persisted.
 */
export interface MissionCompletedEvent {
  type: 'MISSION_COMPLETED';
  payload: {
    missionId: string;
    understandingScore: number;  // Final computed score 0–100
    xpEarned: number;
    totalTimeMs: number;
    timestamp: string;
  };
}

export interface MissionUnlockedEvent {
  type: 'MISSION_UNLOCKED';
  payload: {
    missionId: string;             // The newly unlocked mission
    unlockedByMissionId: string;   // The mission whose completion triggered unlock
    timestamp: string;
  };
}

export interface LevelUpEvent {
  type: 'LEVEL_UP';
  payload: {
    previousLevel: number;
    newLevel: number;
    newLevelName: string;
    totalXP: number;
    timestamp: string;
  };
}

export interface AchievementUnlockedEvent {
  type: 'ACHIEVEMENT_UNLOCKED';
  payload: {
    achievementId: string;
    achievementTitle: string;
    xpBonus: number;               // XPEngine reads this to award bonus XP
    timestamp: string;
  };
}

export interface ReviewScheduledEvent {
  type: 'REVIEW_SCHEDULED';
  payload: {
    missionId: string;
    intervalDays: number;
    scheduledFor: string;          // ISO date
    timestamp: string;
  };
}

export interface ReviewCompletedEvent {
  type: 'REVIEW_COMPLETED';
  payload: {
    missionId: string;
    reviewScore: number;           // 0–100
    intervalDays: number;
    nextReviewDays: number;
    timestamp: string;
  };
}

export interface StreakUpdatedEvent {
  type: 'STREAK_UPDATED';
  payload: {
    currentStreak: number;
    longestStreak: number;
    bonusXP: number;
    timestamp: string;
  };
}

export interface StreakBrokenEvent {
  type: 'STREAK_BROKEN';
  payload: {
    previousStreak: number;
    timestamp: string;
  };
}

export interface DictionaryTermViewedEvent {
  type: 'DICTIONARY_TERM_VIEWED';
  payload: {
    termId: string;
    missionContext?: string;
    timestamp: string;
  };
}

export interface SessionStartedEvent {
  type: 'SESSION_STARTED';
  payload: { timestamp: string };
}

export interface SessionEndedEvent {
  type: 'SESSION_ENDED';
  payload: {
    durationMs: number;
    stepsCompleted: number;
    timestamp: string;
  };
}

export interface CodeExecutedEvent {
  type: 'CODE_EXECUTED';
  payload: {
    code: string;
    stdout: string;
    stderr: string;
    executionTimeMs: number;
    success: boolean;
  };
}
