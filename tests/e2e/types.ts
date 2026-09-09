// tests/e2e/types.ts
// E2E Test Suite Types & Contracts

import type { MissionData, PracticeStep, DebugChallengeStep, ReflectionStep } from '@/types/mission.types';

export interface TestAssertionResult {
  tier: 1 | 2 | 3 | 4;
  missionId: string;
  testName: string;
  passed: boolean;
  error?: string | null;
  warnings?: string[];
  details?: Record<string, unknown> | null;
  timestamp: string;
}

export interface ValidationSummary {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  durationSeconds: number;
}

export interface MissionValidationContext {
  missionId: string;
  data: MissionData;
  practiceSteps: PracticeStep[];
  debugSteps: DebugChallengeStep[];
  reflectionStep?: ReflectionStep;
}
