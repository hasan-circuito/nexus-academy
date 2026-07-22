// engines/python/OutputComparator.ts
// NEXUS Academy — Output Validation Engine

import { ComparisonResult } from './python.types';

export class OutputComparator {
  /**
   * Compares the actual output with the expected output.
   * Normalizes line endings and trailing whitespaces.
   */
  public static compare(actual: string, expected: string): ComparisonResult {
    const normalize = (str: string) => {
      if (!str) return '';
      return str
        .replace(/\r\n/g, '\n') // Normalize CRLF to LF
        .split('\n')
        .map(line => line.trimEnd()) // Ignore trailing whitespace per line
        .join('\n')
        .trim(); // Ignore leading and trailing newlines/spaces entirely
    };

    const normActual = normalize(actual);
    const normExpected = normalize(expected);

    const baseResult = {
      expectedNormalized: normExpected,
      actualNormalized: normActual,
    };

    if (normActual === normExpected) {
      return { ...baseResult, isMatch: true };
    }

    // Common mismatch patterns detection
    if (normActual.toLowerCase() === normExpected.toLowerCase()) {
      return {
        ...baseResult,
        isMatch: false,
        mismatchType: 'case_mismatch',
        feedback: 'আউটপুট মিলেছে, কিন্তু ছোট/বড় হাতের অক্ষরে (Case) ভুল আছে।'
      };
    }
    
    // Type mismatch checking (e.g. integer vs string representation)
    if (normActual === `'${normExpected}'` || normActual === `"${normExpected}"`) {
       return {
        ...baseResult,
        isMatch: false,
        mismatchType: 'type_error',
        feedback: 'তুমি হয়তো ভ্যালুর চারপাশে কোটেশন মার্ক দিয়েছো, কিন্তু এখানে শুধু ভ্যালুটি প্রিন্ট করতে হবে।'
      };
    }

    return {
      ...baseResult,
      isMatch: false,
      mismatchType: 'wrong_value',
      feedback: 'আউটপুটটি প্রত্যাশিত আউটপুটের সাথে মিলছে না। আরেকবার চেষ্টা করো!'
    };
  }
}
