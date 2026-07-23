// engines/python/strategies/RegexOutputStrategy.ts
import type { IValidationStrategy, ExecutionResult, ComparisonResult, EvaluationResult } from '../python.types';
import type { ValidationConfig } from '@/types/mission.types';

export class RegexOutputStrategy implements IValidationStrategy {
  public evaluate(
    executionResult: ExecutionResult,
    comparisonResult: ComparisonResult,
    config: ValidationConfig
  ): EvaluationResult {
    const { actualNormalized } = comparisonResult;
    const pattern = config.value || '.*';

    const baseResult: EvaluationResult = {
      passed: false,
      score: 0,
      message: '',
      stdout: executionResult.stdout,
      stderr: executionResult.stderr,
      runtimeError: !executionResult.success,
      validationType: 'regex_output',
      diffExpected: `RegEx: ${pattern}`,
      diffActual: actualNormalized,
    };

    if (!executionResult.success) {
      return { ...baseResult, message: 'Your code threw an error.' };
    }

    try {
      const regex = new RegExp(pattern);
      if (regex.test(actualNormalized)) {
        return { ...baseResult, passed: true, score: 100, message: 'আউটপুট সঠিক।' };
      }
    } catch (e) {
      return { ...baseResult, message: 'Invalid Regex pattern configured in mission.' };
    }

    return {
      ...baseResult,
      message: 'আউটপুটটি প্রত্যাশিত প্যাটার্নের সাথে মিলছে না। আরেকবার চেষ্টা করো!'
    };
  }
}
