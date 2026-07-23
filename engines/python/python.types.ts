// engines/python/python.types.ts
// NEXUS Academy — Interactive Python Coding Engine Types

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  success: boolean;
  executionTimeMs: number;
  outputMatched?: boolean;
  errorType?: string;
}

export interface ExecutionConfig {
  timeoutMs?: number;
  maxOutputChars?: number;
}

export const DEFAULT_TIMEOUT_MS = 5000;
export const MAX_OUTPUT_CHARS = 2000;

export interface ErrorInterpretation {
  errorType: string;
  originalError: string;
  banglaTitle: string;
  explanation: string;
  whyItHappened: string;
  howToFix: string;
  correctedExample: string;
}

import type { ValidationConfig, ValidationStrategy } from '@/types/mission.types';

export interface ComparisonResult {
  actualNormalized: string;
  expectedNormalized: string;
}

export interface EvaluationResult {
  passed: boolean;
  score: number;
  message: string;
  stdout: string;
  stderr: string;
  runtimeError: boolean;
  validationType: ValidationStrategy;
  diffExpected?: string;
  diffActual?: string;
}

export interface IValidationStrategy {
  evaluate(
    executionResult: ExecutionResult,
    comparisonResult: ComparisonResult,
    config: ValidationConfig
  ): EvaluationResult;
}
