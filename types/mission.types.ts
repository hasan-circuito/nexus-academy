// types/mission.types.ts
// NEXUS Academy — Mission Data Types
// Source of truth: DATA_SCHEMA.md Sections 1–4

import type {
  StepType,
  MissionStatus,
  MissionDifficulty,
  BugType,
  QuestionType,
  EEEDomain,
  AIDomain,
  VisualizationType,
} from './common.types';

// ============================================================
// 1. Mission Index — data/missions/index.json
// ============================================================

export interface MissionIndexEntry {
  id: string;                          // e.g. "001", "002"
  title: string;                       // English title: "Python Introduction"
  banglaTitle: string;                 // Bangla title: "পাইথন পরিচিতি"
  banglaSubtitle: string;              // Bangla subtitle: "প্রোগ্রামিং শুরুর গল্প"
  description: string;                 // Short English description for accessibility
  status: MissionStatus;              // Default status (overridden by LearnerProgress)
  estimatedMinutes: number;
  difficulty: MissionDifficulty;
  knowledgeGraph: MissionKnowledgeGraphMeta;
  tags: string[];
  searchTerms?: string[];             // Author-curated concept list for future search
}

export interface MissionKnowledgeGraphMeta {
  prerequisiteIds: string[];          // Mission IDs that must be complete first
  enablesIds: string[];               // Mission IDs this mission unlocks
  relatedIds: string[];               // Thematically related (non-sequential)
  topicSlug: string;                  // e.g. "python_introduction"
}

// ============================================================
// 2. Mission Full Data — data/missions/mission_NNN.json
// ============================================================

export interface MissionData {
  id: string;
  title: string;
  banglaTitle: string;
  banglaSubtitle: string;
  cognitiveLoadEstimate: CognitiveLoadEstimate;
  curiosity: CuriosityBlock;           // Required — never optional
  steps: MissionStep[];               // Exactly 13 steps in fixed order
}

export interface CognitiveLoadEstimate {
  readingLevel: 1 | 2 | 3 | 4 | 5;  // 1=very easy, 5=very hard
  newConceptCount: number;
  practiceComplexity: 1 | 2 | 3;     // 1=trivial, 2=moderate, 3=complex
  estimatedTotalMinutes: number;
}

export interface CuriosityBlock {
  didYouKnow: string;                 // Bangla text
  realWorldApplication: string;       // Bangla text
  aiApplication: string;              // Bangla text
  eeeApplication: string;             // Bangla text
  historicalFact: string;             // Bangla text
  nextMissionPreview: string;         // Bangla text — teaser for next mission
}

// ============================================================
// 3. Step Types — All 13 Schemas (DATA_SCHEMA.md Section 3)
// ============================================================

// Step 1 — intro
export interface IntroStep {
  type: 'intro';
  missionNumber: string;
  title: string;
  banglaTitle: string;
  tagline: string;                    // Bangla — curiosity hook
  description: string;               // Bangla
  learningObjectives: string[];      // Bangla — 3–5 bullet points
  estimatedMinutes: number;
}

// Step 2 — story
export interface StoryStep {
  type: 'story';
  title: string;                     // Bangla
  setting: string;                   // e.g. "Amsterdam, 1989"
  content: string;                   // Bangla — max 300 words
  moral: string;                     // Bangla — one-sentence takeaway
  characterName?: string;
}

// Step 3 — analogy
export interface AnalogyStep {
  type: 'analogy';
  title: string;                     // Bangla
  realWorld: AnalogyItem;
  pythonConcept: AnalogyItem;
  connection: string;                // Bangla — explicit bridge
  deeperInsight?: string;            // Bangla — optional "but here's where it differs"
}

export interface AnalogyItem {
  label: string;                     // Bangla label
  description: string;               // Bangla explanation
  icon: string;                      // Lucide icon name
}

// Step 4 — concept
export interface ConceptStep {
  type: 'concept';
  title: string;                     // Bangla
  content: string;                   // Bangla — core explanation, max 250 words
  keyPoints: string[];               // Bangla — 3–5 bullet points
  whyCallout: string;               // Bangla — "Why this exists" (WhyCallout component)
  whenToUse: string;                 // Bangla
  whenNotToUse: string;              // Bangla
  commonMisconception?: string;      // Bangla — optional gotcha
}

// Step 5 — visualization
export interface VisualizationStep {
  type: 'visualization';
  title: string;                     // Bangla
  description: string;               // Bangla — what the visualization shows
  visualizationType: VisualizationType;
  data: VisualizationData;
  caption: string;                   // Bangla
}

// Flexible shape — each visualizationType defines its own contract in VisualizationStep.tsx
export type VisualizationData = Record<string, unknown>;

// Step 6 — code_example
export interface CodeExampleStep {
  type: 'code_example';
  title: string;                     // Bangla
  explanation: string;               // Bangla — before the code block
  language: 'python';
  code: string;                      // Raw Python code (not escaped)
  output: string;                    // Expected console output
  annotations: CodeAnnotation[];
  postExplanation?: string;          // Bangla — "notice how..."
}

export interface CodeAnnotation {
  lineNumber: number;               // 1-indexed
  explanation: string;              // Bangla
}

// Step 7 — eee_example
export interface EEEExampleStep {
  type: 'eee_example';
  title: string;                    // Bangla
  context: string;                  // Bangla — EEE scenario setup
  hardware: string;                 // e.g. "Arduino Uno"
  domain: EEEDomain;
  code: string;                     // Python or MicroPython
  output: string;
  explanation: string;              // Bangla
  realDeviceNote?: string;          // Bangla
}

// Step 8 — ai_example
export interface AIExampleStep {
  type: 'ai_example';
  title: string;                    // Bangla
  context: string;                  // Bangla — AI scenario setup
  aiDomain: AIDomain;
  code: string;
  output: string;
  explanation: string;              // Bangla
  realWorldModel?: string;          // e.g. "GPT-4 uses this principle when..."
}

// Step 9 — practice
export type ValidationStrategy = 'exact_output' | 'contains_output' | 'regex_output' | 'any_non_empty_output';

export interface ValidationConfig {
  type: ValidationStrategy;
  value?: string;
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
  ignoreTrailingNewline?: boolean;
  strictMode?: boolean;
}

export interface PracticeStep {
  type: 'practice';
  title: string;                    // Bangla
  prompt: string;                   // Bangla — what to write/attempt
  hints: string[];                  // Bangla — ordered hints (reveal one at a time)
  displayHint?: string;             // UI visual expected hint
  expectedOutput?: string;          // Legacy UI fallback for older missions
  validation?: ValidationConfig;    // Engine rules
  solution: string;                 // Full correct solution code
  solutionExplanation: string;      // Bangla
}

// Step 10 — quiz
export interface QuizStep {
  type: 'quiz';
  title: string;                    // Bangla
  instructions: string;             // Bangla
  passingScore: number;             // 0–100, default 70
  questions: QuizQuestion[];        // 3–5 questions
}

export interface QuizQuestion {
  id: string;                       // Unique within mission: "q1", "q2"
  questionType: QuestionType;
  question: string;                 // Bangla
  difficulty: 'easy' | 'medium' | 'hard';
  options?: string[];               // Bangla options (4 for MCQ, 2 for true_false)
  correctOptionIndex?: number;      // 0-indexed
  blankAnswer?: string;             // For fill_blank (V1: shown as MCQ)
  explanation: string;              // Bangla — shown after answering
  relatedConceptStep?: number;      // Step index to link back to for review
}

// Step 11 — debug_challenge
export interface DebugChallengeStep {
  type: 'debug_challenge';
  title: string;                    // Bangla
  scenario: string;                 // Bangla — "তোমার বন্ধু এই কোড লিখেছে..."
  buggyCode: string;
  errorMessage: string;
  bugLine: number;                  // 1-indexed
  bugType: BugType;
  hints: string[];                  // Bangla — 1–3 ordered hints (min 1, max 3)
                                    // hints[0]=mild nudge, hints[1]=stronger, hints[2]=near-answer
  fixedCode: string;
  explanation: string;              // Bangla
}

// Step 12 — reflection
export interface ReflectionStep {
  type: 'reflection';
  title: string;                    // Bangla
  instruction: string;              // Bangla — "নিচের প্রশ্নগুলো নিয়ে ভাবো"
  prompts: string[];                // Bangla — exactly 3 reflection questions
  // V1: binary (completed/not). V2: AI Mentor reads text and provides quality score.
}

// Step 13 — mission_complete
export interface MissionCompleteStep {
  type: 'mission_complete';
  title: string;                    // Bangla — "অভিনন্দন!"
  summary: string;                  // Bangla — 2–3 sentence mission recap
  keyLearnings: string[];           // Bangla — 3–5 bullet points
  // CuriosityBlock is read from mission root (MissionData.curiosity), not duplicated here.
}

// ============================================================
// 4. Complete Mission Type Union
// ============================================================

export type MissionStep =
  | IntroStep
  | StoryStep
  | AnalogyStep
  | ConceptStep
  | VisualizationStep
  | CodeExampleStep
  | EEEExampleStep
  | AIExampleStep
  | PracticeStep
  | QuizStep
  | DebugChallengeStep
  | ReflectionStep
  | MissionCompleteStep;

// Type guard helpers
export function isStepType<T extends MissionStep>(
  step: MissionStep,
  type: T['type']
): step is T {
  return step.type === type;
}

// Re-export StepType for convenience (it lives in common.types.ts)
export type { StepType };
