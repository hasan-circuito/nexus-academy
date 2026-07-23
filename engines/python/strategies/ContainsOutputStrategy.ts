// engines/python/strategies/ContainsOutputStrategy.ts
import type { IValidationStrategy, ExecutionResult, ComparisonResult, EvaluationResult } from '../python.types';
import type { ValidationConfig } from '@/types/mission.types';

export class ContainsOutputStrategy implements IValidationStrategy {
  public evaluate(
    executionResult: ExecutionResult,
    comparisonResult: ComparisonResult,
    config: ValidationConfig
  ): EvaluationResult {
    const { actualNormalized } = comparisonResult;
    const expectedValue = config.value || '';

    const baseResult: EvaluationResult = {
      passed: false,
      score: 0,
      message: '',
      stdout: executionResult.stdout,
      stderr: executionResult.stderr,
      runtimeError: !executionResult.success,
      validationType: 'contains_output',
      diffExpected: expectedValue,
      diffActual: actualNormalized,
    };

    if (!executionResult.success) {
      return { ...baseResult, message: 'Your code threw an error.' };
    }

    if (actualNormalized.includes(expectedValue)) {
      return { ...baseResult, passed: true, score: 100, message: 'আউটপুট সঠিক।' };
    }

    return {
      ...baseResult,
      message: 'তোমার আউটপুটে প্রত্যাশিত অংশটি পাওয়া যায়নি। আরেকবার চেষ্টা করো!'
    };
  }
}
