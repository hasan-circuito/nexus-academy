// engines/python/OutputComparator.ts
// NEXUS Academy — Output Normalization Engine

import { ComparisonResult } from './python.types';
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
   */
  public static compare(actual: string, expected?: string): ComparisonResult {
    return {
      actualNormalized: OutputComparator.normalize(actual),
      expectedNormalized: OutputComparator.normalize(expected),
    };
  }

  /**
   * Compare outputs with beginner-friendly input prompt tolerance.
   * If code uses input(), different prompt strings (or no prompt) shouldn't fail
   * as long as the inputs are consumed and the program's actual logic output matches.
   */
  public static compareWithInputs(actual: string, expected: string, inputs: string[] = []): {
    matched: boolean;
    actualNormalized: string;
    expectedNormalized: string;
  } {
    const directComp = OutputComparator.compare(actual, expected);
    if (directComp.actualNormalized === directComp.expectedNormalized) {
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
