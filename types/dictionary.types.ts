// types/dictionary.types.ts
// NEXUS Academy — Dictionary and Achievement Types
// Source of truth: DATA_SCHEMA.md Sections 8–9 & Problem-Solving Hub Architecture

import type { DictionaryCategory, AchievementConditionType } from './common.types';

// ============================================================
// 8. Dictionary Schema — data/dictionary.json
// ============================================================

export interface MentalModel {
  analogy: string;        // Intuitive software/real-world analogy (No EEE/hardware tangents)
  explanation: string;    // Deep concept breakdown
  keyInsight: string;     // One-liner takeaway rule
}

export interface AntiPattern {
  code: string;           // Buggy / anti-pattern Python code snippet
  explanation: string;    // Why it's wrong / what happens
}

export interface FixPattern {
  code: string;           // Corrected Python code snippet
  explanation: string;    // Why this works
}

export interface DictionaryTroubleshooting {
  symptoms: string[];         // Observable symptoms (e.g. "numbers joining instead of adding")
  associatedErrors: string[]; // Error types like "TypeError", "SyntaxError"
  antiPattern: AntiPattern;
  fixPattern: FixPattern;
}

export interface DictionarySandbox {
  starterCode: string;
  experimentPrompts: string[];
}

export interface DictionaryCurriculum {
  introducedInMissionId: string;
  relatedMissionIds?: string[];
  relatedTermIds: string[];
  tags: string[];
}

export interface DictionaryEntry {
  id: string;                        // e.g. "variable", "string", "type_error"
  term: string;                      // English term: "Variable"
  banglaTerm: string;                // Bangla transliteration: "ভেরিয়েবল"
  summary: string;                   // Concise one-line summary
  banglaDefinition: string;          // Clear Bangla definition
  englishDefinition: string;         // Simple English definition
  category: DictionaryCategory;
  mentalModel: MentalModel;
  troubleshooting: DictionaryTroubleshooting;
  sandbox: DictionarySandbox;
  curriculum: DictionaryCurriculum;
  // Convenience / backward-compatibility fields:
  exampleCode?: string;              // Short Python example
  relatedTermIds: string[];          // Mirrors curriculum.relatedTermIds
  introducedInMissionId: string;     // Mirrors curriculum.introducedInMissionId
  tags: string[];                    // Mirrors curriculum.tags
}

export interface LearnerDictionaryProgress {
  viewedTermIds: string[];
  bookmarks: string[];
  lastAccessedTermId?: string;
  updatedAt: string;
}

export function createDefaultDictionaryProgress(): LearnerDictionaryProgress {
  return {
    viewedTermIds: [],
    bookmarks: [],
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================
// 9. Achievement Schema — data/achievements.json
// ============================================================

export interface Achievement {
  id: string;                        // e.g. "first_mission", "perfect_quiz"
  title: string;                     // English title
  banglaTitle: string;               // Bangla title
  description: string;               // Bangla description
  icon: string;                      // Lucide icon name
  xpBonus: number;
  condition: AchievementCondition;
}

export interface AchievementCondition {
  type: AchievementConditionType;
  threshold?: number;                // For numeric conditions
  missionId?: string;                // For mission-specific achievements
}
