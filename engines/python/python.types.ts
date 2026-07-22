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

export interface ComparisonResult {
  isMatch: boolean;
  mismatchType?: 'whitespace_only' | 'case_mismatch' | 'wrong_value' | 'type_error';
  feedback?: string; // Optional Bangla hint if mismatch is recognized
  expectedNormalized?: string;
  actualNormalized?: string;
}
