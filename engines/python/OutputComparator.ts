// engines/python/OutputComparator.ts
// NEXUS Academy — Output Normalization Engine

import { ComparisonResult } from './python.types';
import { extractInputs } from './inputExtractor';

export class OutputComparator {
  /**
   * Normalizes output string by:
   * - Standardizing CRLF to LF
   * - Trimming leading/trailing whitespace per line
   * - Normalizing spaces around colons (e.g. "name:foo" -> "name: foo")
   * - Collapsing multiple internal spaces/tabs to single space
   * - Trimming blank lines from ends
   */
  public static normalize(str?: string): string {
    if (!str) return '';
    return str
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(line => {
        return line
          .trim()
          .replace(/:\s*/g, ': ')
          .replace(/[ \t]+/g, ' ');
      })
      .join('\n')
      .trim();
  }

  /**
   * Normalizes the actual output and expected output.
   * Supports dynamic input projection: when learner provides their own custom inputs,
   * the reference expected output is projected to match the learner's inputs.
   */
  public static compare(
    actual: string, 
    expected?: string,
    dynamicContext?: { code?: string; userInputs?: string[] }
  ): ComparisonResult {
    let targetExpected = expected || '';

    if (expected && dynamicContext?.code && dynamicContext?.userInputs && dynamicContext.userInputs.length > 0) {
      const sampleInputs = extractInputs(dynamicContext.code, expected);
      if (sampleInputs.length > 0) {
        let projected = expected;
        sampleInputs.forEach((sample, idx) => {
          const userVal = dynamicContext.userInputs![idx];
          if (sample && userVal && sample !== userVal) {
            projected = projected.split(sample).join(userVal);
          }
        });
        targetExpected = projected;
      }
    }

    const actualNormalized = OutputComparator.normalize(actual);
    const expectedNormalized = OutputComparator.normalize(targetExpected);
    const outputMatched = actualNormalized === expectedNormalized;

    return {
      actualNormalized,
      expectedNormalized,
      outputMatched,
    };
  }

  /**
   * Compare outputs with beginner-friendly input prompt tolerance.
   * If code uses input(), different prompt strings (or no prompt) shouldn't fail
   * as long as the inputs are consumed and the program's actual logic output matches.
   */
  public static compareWithInputs(
    actual: string, 
    expected: string, 
    inputs: string[] = [],
    code?: string
  ): {
    matched: boolean;
    actualNormalized: string;
    expectedNormalized: string;
  } {
    const directComp = OutputComparator.compare(actual, expected, { code, userInputs: inputs });
    if (directComp.outputMatched) {
      return { matched: true, ...directComp };
    }

    if (!inputs || inputs.length === 0) {
      return { matched: false, ...directComp };
    }

    // Normalize prompt lines that end with the input value
    const normalizePrompts = (text: string) => {
      let lines = text
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(line => line.trim().replace(/:\s*/g, ': ').replace(/[ \t]+/g, ' '))
        .filter(l => l.length > 0);

      for (const inp of inputs) {
        if (!inp) continue;
        lines = lines.map(line => {
          if (line === inp || line.endsWith(': ' + inp) || line.endsWith(':' + inp) || line.endsWith(' ' + inp)) {
            return `>>INPUT: ${inp}`;
          }
          return line;
        });
      }
      return lines.join('\n').trim();
    };

    const actualPromptNorm = normalizePrompts(actual);
    const expectedPromptNorm = normalizePrompts(expected);

    return {
      matched: actualPromptNorm === expectedPromptNorm,
      actualNormalized: directComp.actualNormalized,
      expectedNormalized: directComp.expectedNormalized,
    };
  }
}
