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
    const ignoreWhitespace = config.ignoreWhitespace ?? false;
    const ignoreCase = config.ignoreCase ?? false;
    const fb = config.feedbackMessages ?? {};

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

    // Normalize source to tolerate whitespace/semicolon style variations
    let testSource = sourceCode;
    if (ignoreWhitespace) {
      testSource = testSource.replace(/\s+/g, ' ').replace(/;/g, '').trim();
    }

    let regexPassed = false;
    try {
      const flags = ignoreCase ? 'i' : '';
      const regex = new RegExp(pattern, flags);
      regexPassed = regex.test(testSource);
    } catch (e) {
      return { ...baseResult, message: 'Invalid Regex pattern configured in mission.' };
    }

    // Smart output check: did the actual output match expected?
    const outputMatchesExactly =
      comparisonResult.expectedNormalized &&
      comparisonResult.actualNormalized === comparisonResult.expectedNormalized;

    if (regexPassed) {
      // Structure is correct — but if we have an expected output, also verify it
      if (config.expectedOutput && !outputMatchesExactly) {
        return {
          ...baseResult,
          passed: false,
          message: fb.onOutputMismatch ?? 'তোমার কোডের কাঠামো ঠিক আছে, কিন্তু আউটপুটটি প্রত্যাশিত আউটপুটের সাথে মিলছে না।',
        };
      }
      return {
        ...baseResult,
        passed: true,
        score: 100,
        message: fb.onPass ?? 'সঠিক হয়েছে! ভেরিয়েবলটি সফলভাবে মেমোরিতে সেভ এবং আপডেট হয়েছে।',
      };
    }

    // Regex failed — but output was correct → likely hardcoded
    if (outputMatchesExactly) {
      return {
        ...baseResult,
        message: fb.onHardcoded ?? 'আউটপুট ঠিক আছে! কিন্তু তুমি কি আসলেই ভেরিয়েবল ব্যবহার করেছ? (শুধু সংখ্যা বা টেক্সট সরাসরি print করবে না!)',
      };
    }

    // Regex failed, output also wrong → pattern/concept mistake
    return {
      ...baseResult,
      message: fb.onPatternFail ?? 'কোডটি সঠিক নয়। ইনস্ট্রাকশন অনুযায়ী ভেরিয়েবলটি ঠিকমতো তৈরি করা হয়েছে কি না চেক করো!',
    };
  }
}
