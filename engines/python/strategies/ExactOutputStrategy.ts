// engines/python/strategies/ExactOutputStrategy.ts
import type { IValidationStrategy, ExecutionResult, ComparisonResult, EvaluationResult } from '../python.types';
import type { ValidationConfig } from '@/types/mission.types';

export class ExactOutputStrategy implements IValidationStrategy {
  public evaluate(
    executionResult: ExecutionResult,
    comparisonResult: ComparisonResult,
    config: ValidationConfig
  ): EvaluationResult {
    const { actualNormalized, expectedNormalized } = comparisonResult;

    const baseResult: EvaluationResult = {
      passed: false,
      score: 0,
      message: '',
      stdout: executionResult.stdout,
      stderr: executionResult.stderr,
      runtimeError: !executionResult.success,
      validationType: 'exact_output',
      diffExpected: expectedNormalized,
      diffActual: actualNormalized,
    };

    if (!executionResult.success) {
      return { ...baseResult, message: 'Your code threw an error.' };
    }

    if (actualNormalized === expectedNormalized) {
      return { ...baseResult, passed: true, score: 100, message: 'আউটপুট সঠিক।' };
    }

    if (actualNormalized.toLowerCase() === expectedNormalized.toLowerCase()) {
      return {
        ...baseResult,
        message: 'আউটপুট মিলেছে, কিন্তু ছোট/বড় হাতের অক্ষরে (Case) ভুল আছে।'
      };
    }
    
    if (actualNormalized === `'${expectedNormalized}'` || actualNormalized === `"${expectedNormalized}"`) {
       return {
        ...baseResult,
        message: 'তুমি হয়তো ভ্যালুর চারপাশে কোটেশন মার্ক দিয়েছো, কিন্তু এখানে শুধু ভ্যালুটি প্রিন্ট করতে হবে।'
      };
    }

    return {
      ...baseResult,
      message: 'আউটপুটটি প্রত্যাশিত আউটপুটের সাথে মিলছে না। আরেকবার চেষ্টা করো!'
    };
  }
}
