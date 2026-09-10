// types/common.types.ts
// NEXUS Academy — Common Shared Types
// Source of truth: DATA_SCHEMA.md

export type Locale = 'bn' | 'en';

/**
 * All date-only strings use YYYY-MM-DD format.
 * All datetime strings use ISO 8601 format.
 * Never mix the two — streak tracking depends on date-only comparison.
 */
export type ISODate = string;      // YYYY-MM-DD
export type ISODateTime = string;  // ISO 8601

/**
 * Mission difficulty levels
 */
export type MissionDifficulty = 'beginner' | 'elementary' | 'intermediate' | 'advanced';

/**
 * Mission status — follows a strict one-directional state machine.
 * See ARCHITECTURE.md Section 11 for transition rules.
 *
 * locked → unlocked → in_progress → complete
 * No reverse transitions are valid.
 */
export type MissionStatus = 'locked' | 'unlocked' | 'in_progress' | 'complete';

/**
 * Bug types that appear in debug challenge steps.
 * See DATA_SCHEMA.md DebugChallengeStep for usage.
 */
export type BugType = 'syntax' | 'logic' | 'logical' | 'runtime' | 'type_error' | 'indentation' | 'naming';

/**
 * Question types for quiz steps.
 * fill_blank is rendered as MCQ in V1 — free text in V2.
 */
export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank';

/**
 * Step type discriminant — 13 fixed step types in fixed order.
 * See DATA_SCHEMA.md Section 3 for full schemas.
 */
export type StepType =
  | 'intro'
  | 'story'
  | 'analogy'
  | 'concept'
  | 'visualization'
  | 'code_example'
  | 'eee_example'
  | 'ai_example'
  | 'practice'
  | 'quiz'
  | 'debug_challenge'
  | 'reflection'
  | 'mission_complete';

/**
 * The fixed step order. The index (0-based) corresponds to the step order.
 * Step 9 (0-indexed) = quiz, Step 10 = debug_challenge, etc.
 */
export const STEP_ORDER: StepType[] = [
  'intro',           // 0
  'story',           // 1
  'analogy',         // 2
  'concept',         // 3
  'visualization',   // 4
  'code_example',    // 5
  'eee_example',     // 6
  'ai_example',      // 7
  'practice',        // 8
  'quiz',            // 9
  'debug_challenge', // 10
  'reflection',      // 11
  'mission_complete', // 12
] as const;

export const TOTAL_STEPS = 13;
export const QUIZ_STEP_INDEX = 9;
export const DEBUG_STEP_INDEX = 10;
export const REFLECTION_STEP_INDEX = 11;
export const MISSION_COMPLETE_STEP_INDEX = 12;

/**
 * EEE (Electrical and Electronic Engineering) domains
 */
export type EEEDomain =
  | 'arduino'
  | 'raspberry_pi'
  | 'esp32'
  | 'iot'
  | 'signal_processing'
  | 'control_systems'
  | 'power_systems'
  | 'sensor_data'
  | 'automation'
  | 'embedded';

/**
 * AI/ML domains for AI example steps
 */
export type AIDomain =
  | 'machine_learning'
  | 'deep_learning'
  | 'nlp'
  | 'computer_vision'
  | 'data_science'
  | 'automation'
  | 'large_language_models'
  | 'neural_networks';

/**
 * Visualization types for the visualization step
 */
export type VisualizationType =
  | 'execution_flow'
  | 'flow_diagram'
  | 'memory_diagram'
  | 'comparison'
  | 'hierarchy'
  | 'timeline'
  | 'relationship';

/**
 * Dictionary categories
 */
export type DictionaryCategory =
  | 'python_core'
  | 'data_types'
  | 'control_flow'
  | 'functions'
  | 'oop'
  | 'modules'
  | 'eee'
  | 'ai_ml'
  | 'tools';

/**
 * Achievement condition types
 */
export type AchievementConditionType =
  | 'first_mission_complete'
  | 'missions_complete_count'
  | 'perfect_quiz_score'
  | 'no_hints_used'
  | 'streak_days'
  | 'understanding_score_threshold'
  | 'review_completed'
  | 'total_xp_earned';

/**
 * Review item status
 */
export type ReviewStatus = 'pending' | 'completed' | 'overdue';
