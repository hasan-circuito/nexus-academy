// engines/python/strategies/AnyNonEmptyOutputStrategy.ts
import type { IValidationStrategy, ExecutionResult, ComparisonResult, EvaluationResult } from '../python.types';
import type { ValidationConfig } from '@/types/mission.types';

export class AnyNonEmptyOutputStrategy implements IValidationStrategy {
  public evaluate(
    executionResult: ExecutionResult,
    comparisonResult: ComparisonResult,
    config: ValidationConfig
  ): EvaluationResult {
    const { actualNormalized } = comparisonResult;

    const baseResult: EvaluationResult = {
      passed: false,
      score: 0,
      message: '',
      stdout: executionResult.stdout,
      stderr: executionResult.stderr,
      runtimeError: !executionResult.success,
      validationType: 'any_non_empty_output',
      diffExpected: '(Any text)',
      diffActual: actualNormalized,
    };

    if (!executionResult.success) {
      return { ...baseResult, message: 'Your code threw an error.' };
    }

    if (actualNormalized.length > 0) {
      return { ...baseResult, passed: true, score: 100, message: 'আউটপুট সঠিক।' };
    }

    return {
      ...baseResult,
      message: 'তোমার প্রোগ্রাম থেকে কোনো আউটপুট পাওয়া যায়নি। প্রিন্ট ব্যবহার করেছো কি?'
    };
  }
}
