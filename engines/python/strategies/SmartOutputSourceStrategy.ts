// engines/python/strategies/SmartOutputSourceStrategy.ts
import type { IValidationStrategy, ExecutionResult, ComparisonResult, EvaluationResult } from '../python.types';
import type { ValidationConfig } from '@/types/mission.types';

export class SmartOutputSourceStrategy implements IValidationStrategy {
  public evaluate(
    executionResult: ExecutionResult,
    comparisonResult: ComparisonResult,
    config: ValidationConfig,
    sourceCode: string = ''
  ): EvaluationResult {
    const fb = config.feedbackMessages ?? {};

    const baseResult: EvaluationResult = {
      passed: false,
      score: 0,
      message: '',
      stdout: executionResult.stdout,
      stderr: executionResult.stderr,
      runtimeError: !executionResult.success,
      validationType: 'smart_output_source',
    };

    // 1. Check for runtime errors
    if (!executionResult.success) {
      return { ...baseResult, message: 'Your code threw an error. Please fix it first.' };
    }

    // 2. Output Check (Output-First logic)
    const outputMatchesExactly =
      comparisonResult.expectedNormalized &&
      comparisonResult.actualNormalized === comparisonResult.expectedNormalized;

    if (!outputMatchesExactly) {
      return {
        ...baseResult,
        message: fb.onOutputMismatch ?? 'আউটপুটটি প্রত্যাশিত আউটপুটের সাথে মিলছে না। আরেকবার চেষ্টা করো!',
        diffExpected: comparisonResult.expectedNormalized,
        diffActual: comparisonResult.actualNormalized,
      };
    }

    // Normalize source slightly to handle basic spacing variations for pattern matching
    let testSource = sourceCode.replace(/\s+/g, ' ').trim();
    let flags = config.ignoreCase ? 'i' : '';

    // 3. Cheating / Forbidden Pattern Check
    if (config.forbiddenPatterns && config.forbiddenPatterns.length > 0) {
      for (const pattern of config.forbiddenPatterns) {
        try {
          const regex = new RegExp(pattern, flags);
          if (regex.test(testSource)) {
            return {
              ...baseResult,
              message: fb.onHardcoded ?? 'আউটপুট ঠিক আছে! কিন্তু চালাকি ধরা পড়েছে 😄! ভেরিয়েবল ব্যবহার করো, সরাসরি সংখ্যা বা টেক্সট print করবে না।',
            };
          }
        } catch (e) {
          console.error("Invalid forbidden pattern:", pattern);
        }
      }
    }

    // 4. Required Variables Check
    if (config.requiredVariables && config.requiredVariables.length > 0) {
      for (const varName of config.requiredVariables) {
        // E.g. \bscore\s*=  (word boundary + score + optional spaces + =)
        const assignmentPattern = \\b\\\s*=;
        try {
          const regex = new RegExp(assignmentPattern, flags);
          if (!regex.test(testSource)) {
            return {
              ...baseResult,
              message: fb.onMissingVariable ?? তুমি '\' নামের ভেরিয়েবলটি তৈরি করোনি বা তাতে কোনো মান রাখোনি।,
            };
          }
        } catch (e) {
          console.error("Invalid variable check regex for:", varName);
        }
      }
    }

    // 5. Required Patterns Check
    if (config.requiredPatterns && config.requiredPatterns.length > 0) {
      for (const pattern of config.requiredPatterns) {
        try {
          const regex = new RegExp(pattern, flags);
          if (!regex.test(testSource)) {
            return {
              ...baseResult,
              message: fb.onPatternFail ?? 'তোমার কোডে কিছু প্রয়োজনীয় অংশ মিসিং আছে। ইনস্ট্রাকশন আবার পড়ো!',
            };
          }
        } catch (e) {
          console.error("Invalid required pattern:", pattern);
        }
      }
    }

    // All checks passed!
    return {
      ...baseResult,
      passed: true,
      score: 100,
      message: fb.onPass ?? 'অসাধারণ! তোমার কোড এবং লজিক একদম সঠিক।',
    };
  }
}