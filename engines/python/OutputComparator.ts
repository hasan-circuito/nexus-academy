// engines/python/OutputComparator.ts
// NEXUS Academy — Output Normalization Engine

import { ComparisonResult } from './python.types';

export class OutputComparator {
  /**
   * Normalizes the actual output and expected output.
   */
  public static compare(actual: string, expected?: string): ComparisonResult {
    const normalize = (str: string) => {
      if (!str) return '';
      return str
        .replace(/\r\n/g, '\n') // Normalize CRLF to LF
        .split('\n')
        .map(line => line.trimEnd()) // Ignore trailing whitespace per line
        .join('\n')
        .trim(); // Ignore leading and trailing newlines/spaces entirely
    };

    return {
      actualNormalized: normalize(actual),
      expectedNormalized: normalize(expected || ''),
    };
  }
}
