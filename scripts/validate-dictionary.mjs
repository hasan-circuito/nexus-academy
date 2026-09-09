// scripts/validate-dictionary.mjs
// NEXUS Academy — Automated Dictionary & Problem-Solving Hub Validation Suite
//
// Validates:
// 1. Schema integrity & mandatory fields (mentalModel, troubleshooting, sandbox, curriculum)
// 2. Real Python AST compilation for starterCode, fixPattern, and antiPattern
// 3. User constraint: Zero EEE hardware analogies in mental models
// 4. Curriculum cross-reference integrity with manifest.json and internal terms

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DICTIONARY_PATH = path.join(ROOT_DIR, 'data', 'dictionary.json');
const MANIFEST_PATH = path.join(ROOT_DIR, 'data', 'missions', 'manifest.json');

console.log('\n======================================================');
console.log('📖 NEXUS ACADEMY — DICTIONARY & PROBLEM-SOLVING HUB VALIDATOR');
console.log('======================================================\n');

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
  } else {
    failedAssertions++;
    console.error(`  ❌ FAILED: ${message}`);
  }
}

// 1. Check dictionary file exists
assert(fs.existsSync(DICTIONARY_PATH), `dictionary.json exists at ${DICTIONARY_PATH}`);
if (!fs.existsSync(DICTIONARY_PATH)) {
  process.exit(1);
}

const entries = JSON.parse(fs.readFileSync(DICTIONARY_PATH, 'utf-8'));
assert(Array.isArray(entries) && entries.length >= 20, `dictionary.json contains at least 20 entries (Found: ${entries?.length})`);

// 2. Load manifest for mission references
let publishedMissionIds = new Set();
if (fs.existsSync(MANIFEST_PATH)) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  publishedMissionIds = new Set((manifest.missions || []).map((m) => m.id));
}

// Helper: Compile Python code snippet using local Python AST with UTF-8 support
function validatePythonSnippet(code, contextName) {
  if (!code || typeof code !== 'string' || !code.trim()) {
    return { valid: false, error: 'Empty code snippet' };
  }

  const pyScript = `
import ast, sys
try:
    source = sys.stdin.buffer.read().decode('utf-8')
    ast.parse(source)
    sys.exit(0)
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`;

  const pyProcess = spawnSync('python', ['-c', pyScript], {
    input: Buffer.from(code, 'utf-8'),
    env: {
      ...process.env,
      PYTHONUTF8: '1',
      PYTHONIOENCODING: 'utf-8',
    },
  });

  if (pyProcess.status !== 0) {
    const errorMsg = pyProcess.stderr ? pyProcess.stderr.toString('utf-8').trim() : 'SyntaxError in code';
    return {
      valid: false,
      error: `[${contextName}] Python AST compilation failed: ${errorMsg}\nCode:\n${code.slice(0, 100)}...`,
    };
  }

  return { valid: true };
}

const allTermIds = new Set(entries.map((e) => e.id));

// Forbidden EEE / hardware detour terms in mental models per user constraint
const EEE_FORBIDDEN_KEYWORDS = [
  'arduino',
  'esp32',
  'microcontroller',
  'resistor',
  'capacitor',
  'transistor',
  'breadboard',
  'voltage',
  'circuit',
  'কারেন্ট',
  'ভোল্টেজ',
  'সার্কিট',
];

console.log(`🔍 Validating ${entries.length} dictionary entries...`);

for (const entry of entries) {
  const ctx = `Term: ${entry.id} ("${entry.term}")`;

  // Mandatory fields
  assert(Boolean(entry.id), `${ctx} has valid id`);
  assert(Boolean(entry.term), `${ctx} has English term`);
  assert(Boolean(entry.banglaTerm), `${ctx} has Bangla transliterated term`);
  assert(Boolean(entry.summary), `${ctx} has summary`);
  assert(Boolean(entry.banglaDefinition), `${ctx} has banglaDefinition`);
  assert(Boolean(entry.englishDefinition), `${ctx} has englishDefinition`);
  assert(Boolean(entry.category), `${ctx} has category`);

  // Mental model
  assert(Boolean(entry.mentalModel), `${ctx} has mentalModel`);
  if (entry.mentalModel) {
    assert(Boolean(entry.mentalModel.analogy), `${ctx} mentalModel has analogy`);
    assert(Boolean(entry.mentalModel.explanation), `${ctx} mentalModel has explanation`);
    assert(Boolean(entry.mentalModel.keyInsight), `${ctx} mentalModel has keyInsight`);

    // Enforce NO EEE hardware detours constraint
    const analogyLower = (entry.mentalModel.analogy || '').toLowerCase();
    const hasEeeHardware = EEE_FORBIDDEN_KEYWORDS.some((kw) => analogyLower.includes(kw));
    assert(!hasEeeHardware, `${ctx} mental model analogy is free from EEE/hardware detours`);
  }

  // Troubleshooting
  assert(Boolean(entry.troubleshooting), `${ctx} has troubleshooting block`);
  if (entry.troubleshooting) {
    assert(Array.isArray(entry.troubleshooting.symptoms), `${ctx} has symptoms array`);
    assert(Array.isArray(entry.troubleshooting.associatedErrors), `${ctx} has associatedErrors array`);
    assert(Boolean(entry.troubleshooting.antiPattern?.code), `${ctx} has antiPattern code`);
    assert(Boolean(entry.troubleshooting.antiPattern?.explanation), `${ctx} has antiPattern explanation`);
    assert(Boolean(entry.troubleshooting.fixPattern?.code), `${ctx} has fixPattern code`);
    assert(Boolean(entry.troubleshooting.fixPattern?.explanation), `${ctx} has fixPattern explanation`);

    // Python AST validation for fixPattern
    const fixVal = validatePythonSnippet(entry.troubleshooting.fixPattern.code, `${ctx} fixPattern`);
    assert(fixVal.valid, fixVal.error || `${ctx} fixPattern compiles cleanly`);

    // Python AST validation for antiPattern
    const antiVal = validatePythonSnippet(entry.troubleshooting.antiPattern.code, `${ctx} antiPattern`);
    assert(antiVal.valid, antiVal.error || `${ctx} antiPattern is syntactically valid Python code`);
  }

  // Sandbox
  assert(Boolean(entry.sandbox), `${ctx} has sandbox block`);
  if (entry.sandbox) {
    assert(Boolean(entry.sandbox.starterCode), `${ctx} has sandbox starterCode`);
    assert(Array.isArray(entry.sandbox.experimentPrompts), `${ctx} has experimentPrompts`);

    // Python AST validation for starterCode
    const starterVal = validatePythonSnippet(entry.sandbox.starterCode, `${ctx} starterCode`);
    assert(starterVal.valid, starterVal.error || `${ctx} sandbox starterCode compiles cleanly`);
  }

  // Curriculum & Cross-references
  assert(Boolean(entry.curriculum), `${ctx} has curriculum block`);
  if (entry.curriculum) {
    const introMission = entry.curriculum.introducedInMissionId;
    assert(
      publishedMissionIds.has(introMission) || publishedMissionIds.has(introMission.padStart(3, '0')),
      `${ctx} introducedInMissionId '${introMission}' exists in manifest.json`
    );

    for (const relId of entry.curriculum.relatedTermIds || []) {
      assert(allTermIds.has(relId), `${ctx} cross-reference relatedTermId '${relId}' exists in dictionary.json`);
    }
  }
}

console.log('\n======================================================');
console.log('📊 DICTIONARY VALIDATION SUMMARY:');
console.log(`  Total Assertions Tested : ${totalAssertions}`);
console.log(`  Passed                  : ${passedAssertions} (✓)`);
console.log(`  Failed                  : ${failedAssertions} (✗)`);
console.log('======================================================\n');

if (failedAssertions > 0) {
  console.error(`❌ DICTIONARY VALIDATION FAILED with ${failedAssertions} errors.`);
  process.exit(1);
} else {
  console.log('🎉 ALL DICTIONARY ENTRIES PASSED SCHEMA, MENTAL MODEL, & PYTHON AST VALIDATION 100%!\n');
  process.exit(0);
}
