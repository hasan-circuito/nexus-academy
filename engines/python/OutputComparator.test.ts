// engines/python/OutputComparator.test.ts
import { OutputComparator } from './OutputComparator';
import * as assert from 'assert';

console.log("Running OutputComparator tests...\n");

function runTest(name: string, actual: string, expected: string, shouldMatch: boolean) {
  const result = OutputComparator.compare(actual, expected);
  try {
    assert.strictEqual(result.isMatch, shouldMatch);
    console.log(`✅ PASS: ${name}`);
  } catch (e) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   Expected isMatch: ${shouldMatch}, but got: ${result.isMatch}`);
    console.error(`   Actual Output: ${JSON.stringify(actual)}`);
    console.error(`   Expected Output: ${JSON.stringify(expected)}`);
    process.exit(1);
  }
}

// 1. Exact match
runTest("Exact match", "Hasan", "Hasan", true);

// 2. Trailing newline
runTest("Trailing newline (LF)", "Hasan\n", "Hasan", true);

// 3. Multiple trailing newlines
runTest("Multiple trailing newlines", "Hasan\n\n\n", "Hasan", true);

// 4. CRLF vs LF
runTest("CRLF vs LF", "Hasan\r\n", "Hasan", true);
runTest("CRLF vs LF with newlines", "Hasan\r\n", "Hasan\n", true);

// 5. Trailing whitespace
runTest("Trailing whitespace", "Hasan   ", "Hasan", true);
runTest("Trailing whitespace before newline", "Hasan  \n", "Hasan", true);

// 6. Semicolon equivalence (Output wise, it just produces Hasan)
// In Python `print("Hasan");` produces `Hasan\n`
runTest("Semicolon output equivalent", "Hasan\n", "Hasan", true);

// 7. Single vs Double Quotes (Output is just string content)
// `print('Hasan')` vs `print("Hasan")` both output `Hasan\n`
runTest("Quotes output equivalent", "Hasan\n", "Hasan", true);

// 8. Case mismatch
runTest("Case mismatch", "hasan\n", "Hasan", false);

// 9. Type mismatch (user printed quotes literally)
runTest("Literal single quotes printed", "'Hasan'\n", "Hasan", false);
runTest("Literal double quotes printed", "\"Hasan\"\n", "Hasan", false);

console.log("\nAll tests passed successfully!");
