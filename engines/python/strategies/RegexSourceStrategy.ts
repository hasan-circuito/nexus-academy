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

    // Fix 1: Normalize source to make it less brittle
    let testSource = sourceCode;
    if (ignoreWhitespace) {
      // Collapse spaces, optionally remove semicolons to support flexible styles
      testSource = testSource.replace(/\s+/g, ' ').replace(/;/g, '').trim();
    }

    let regexPassed = false;
    try {
      let flags = '';
      if (ignoreCase) flags += 'i';
      
      const regex = new RegExp(pattern, flags);
      regexPassed = regex.test(testSource);
    } catch (e) {
      return { ...baseResult, message: 'Invalid Regex pattern configured in mission.' };
    }
    
    // Fix 2: Smart output logic
    const outputMatchesExactly = 
      comparisonResult.expectedNormalized && 
      comparisonResult.actualNormalized === comparisonResult.expectedNormalized;

    if (regexPassed) {
      if (config.expectedOutput && !outputMatchesExactly) {
         return { ...baseResult, passed: false, message: 'তোমার কোডের কাঠামো ঠিক আছে, কিন্তু আউটপুটটি প্রত্যাশিত আউটপুটের সাথে মিলছে না।' };
      }
      return { ...baseResult, passed: true, score: 100, message: 'সঠিক হয়েছে! ভেরিয়েবলটি সফলভাবে মেমোরিতে সেভ এবং আপডেট হয়েছে।' };
    }

    // Regex failed, but output was correct? They probably hardcoded it.
    if (outputMatchesExactly) {
      return {
        ...baseResult,
        message: 'আউটপুট ঠিক আছে! কিন্তু তুমি কি আসলেই ভেরিয়েবল আপডেট করেছ? (শুধু সংখ্যাগুলো সরাসরি print করবে না, ভেরিয়েবল ব্যবহার করো!)'
      };
    }

    return {
      ...baseResult,
      message: 'কোডটি সঠিক নয়। ইনস্ট্রাকশন অনুযায়ী ভেরিয়েবলটি ঠিকমতো তৈরি করা হয়েছে কি না চেক করো!'
    };
  }
}
