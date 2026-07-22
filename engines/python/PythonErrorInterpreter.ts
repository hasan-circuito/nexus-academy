// engines/python/PythonErrorInterpreter.ts
// NEXUS Academy — Python Error Interpreter Engine

import { ErrorInterpretation } from './python.types';
import errorKnowledgeBase from '@/data/python-errors.json';

export class PythonErrorInterpreter {
  /**
   * Translates a raw Python error into a beginner-friendly Bangla explanation.
   */
  public static interpret(stderr: string, errorType?: string): ErrorInterpretation | null {
    if (!stderr) return null;

    // Handle Timeouts specifically
    if (errorType === 'TimeoutError' || stderr.includes('Execution timed out')) {
      return {
        errorType: 'TimeoutError',
        originalError: 'Execution timed out',
        banglaTitle: 'টাইমআউট এরর (Timeout Error)',
        explanation: 'তোমার কোডটি চলতে অনেক বেশি সময় নিচ্ছে, তাই এটি বন্ধ করে দেওয়া হয়েছে।',
        whyItHappened: 'সাধারণত ইনফিনিট লুপ (যেমেন while True) থাকলে বা কোডটি খুব জটিল হলে এমন হয়।',
        howToFix: 'লুপগুলো চেক করো, দেখো লুপ শেষ হওয়ার কোনো শর্ত দেওয়া আছে কিনা।',
        correctedExample: 'ভুল: while True:\n    pass\n\nসঠিক: while x < 10:\n    x += 1'
      };
    }

    // Attempt to extract error type if not provided
    let extractedType = errorType;
    if (!extractedType) {
      const match = stderr.match(/([a-zA-Z0-9]+Error):/);
      if (match) {
        extractedType = match[1];
      }
    }

    if (!extractedType) return null;

    // Look up in knowledge base
    const knownError = (errorKnowledgeBase as ErrorInterpretation[]).find(
      (e) => e.errorType === extractedType
    );

    if (knownError) {
      return {
        ...knownError,
        originalError: stderr,
      };
    }

    // Fallback for unknown errors
    return {
      errorType: extractedType,
      originalError: stderr,
      banglaTitle: 'অজানা এরর (Unknown Error)',
      explanation: 'তোমার কোডে একটি সমস্যা হয়েছে যা আমি সঠিকভাবে বুঝতে পারছি না।',
      whyItHappened: 'এটি পাইথনের একটি সাধারণ ত্রুটি হতে পারে।',
      howToFix: 'নিচের মূল এরর মেসেজটি ভালোভাবে পড়ো এবং কোডটি চেক করো।',
      correctedExample: ''
    };
  }
}
