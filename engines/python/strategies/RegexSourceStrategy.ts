// engines/python/strategies/RegexSourceStrategy.ts
import type { IValidationStrategy, ExecutionResult, ComparisonResult, EvaluationResult } from '../python.types';
import type { ValidationConfig } from '@/types/mission.types';

export class RegexSourceStrategy implements IValidationStrategy {
  public evaluate(
    executionResult: ExecutionResult,
    comparisonResult: ComparisonResult,
    config: ValidationConfig,
    sourceCode: string = ''
  ): EvaluationResult {
    const pattern = config.value || '.*';

    const baseResult: EvaluationResult = {
      passed: false,
      score: 0,
      message: '',
      stdout: executionResult.stdout,
      stderr: executionResult.stderr,
      runtimeError: !executionResult.success,
      validationType: 'regex_source',
    };

    if (!executionResult.success) {
      return { ...baseResult, message: 'Your code threw an error. Please fix it first.' };
    }

    try {
      const regex = new RegExp(pattern);
      if (regex.test(sourceCode)) {
        return { ...baseResult, passed: true, score: 100, message: 'সঠিক হয়েছে! ভেরিয়েবলটি সফলভাবে মেমোরিতে সেভ হয়েছে।' };
      }
    } catch (e) {
      return { ...baseResult, message: 'Invalid Regex pattern configured in mission.' };
    }

    return {
      ...baseResult,
      message: 'কোডটি সঠিক নয়। ইনস্ট্রাকশন অনুযায়ী ভেরিয়েবলটি ঠিকমতো তৈরি করা হয়েছে কি না চেক করো!'
    };
  }
}
