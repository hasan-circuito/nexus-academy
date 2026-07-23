// engines/python/OutputComparator.test.ts
import { ValidationEngine } from './ValidationEngine';
import { OutputComparator } from './OutputComparator';
import type { ExecutionResult } from './python.types';
import type { ValidationConfig } from '@/types/mission.types';
import * as assert from 'assert';

console.log("Running ValidationEngine tests...\n");

function mockExecResult(stdout: string, success = true): ExecutionResult {
  return { stdout, stderr: '', success, executionTimeMs: 10 };
}

function runTest(name: string, stdout: string, config: ValidationConfig, shouldPass: boolean) {
  const exec = mockExecResult(stdout);
  const comp = OutputComparator.compare(stdout, config.value);
  const result = ValidationEngine.evaluate(exec, comp, config);
  
  try {
    assert.strictEqual(result.passed, shouldPass);
    console.log(`✅ PASS: ${name}`);
  } catch (e) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   Expected passed: ${shouldPass}, but got: ${result.passed}`);
    console.error(`   Actual Output: ${JSON.stringify(stdout)}`);
    process.exit(1);
  }
}

// 1. exact_output
runTest("exact_output match", "Hasan\n", { type: 'exact_output', value: 'Hasan' }, true);
runTest("exact_output mismatch", "hasan\n", { type: 'exact_output', value: 'Hasan' }, false);

// 2. contains_output
runTest("contains_output match", "Hello Hasan how are you\n", { type: 'contains_output', value: 'Hasan' }, true);
runTest("contains_output mismatch", "Hello Rahim\n", { type: 'contains_output', value: 'Hasan' }, false);

// 3. regex_output
runTest("regex_output match", "ID: 12345\n", { type: 'regex_output', value: '^ID: \\d+$' }, true);
runTest("regex_output mismatch", "ID: abc\n", { type: 'regex_output', value: '^ID: \\d+$' }, false);

// 4. any_non_empty_output
runTest("any_non_empty_output match", "Anything\n", { type: 'any_non_empty_output' }, true);
runTest("any_non_empty_output match spaces", " \n", { type: 'any_non_empty_output' }, false); // Normalizer trims spaces, so it becomes empty!
runTest("any_non_empty_output mismatch empty", "", { type: 'any_non_empty_output' }, false);

console.log("\nAll tests passed successfully!");

