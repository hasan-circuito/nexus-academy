// scripts/validate-missions.mjs
// NEXUS Academy — Real Mission Validation & Python Code Integrity Test Suite
//
// Validates:
// Tier 1: Schema & Mandatory Fields (Curiosity 6-block, cognitive load, root metadata)
// Tier 2: Pedagogy & Step Integrity (Quiz options & score, Practice, Debug challenges, Reflection)
// Tier 3: Real Python Code Compilation via Python AST (Zero broken code shipped to learners)
// Tier 4: Manifest & Prerequisite Dependency Graph Integrity

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MISSIONS_DIR = path.join(ROOT_DIR, 'data', 'missions');
const MANIFEST_PATH = path.join(MISSIONS_DIR, 'manifest.json');

// Parse CLI flags
const args = process.argv.slice(2);
let targetMissionId = null;
const missionArgIdx = args.indexOf('--mission');
if (missionArgIdx !== -1 && args[missionArgIdx + 1]) {
  targetMissionId = args[missionArgIdx + 1].padStart(3, '0');
}

console.log('\n======================================================');
console.log('🧪 NEXUS ACADEMY — AUTOMATED MISSION VALIDATION SUITE');
console.log('======================================================\n');

// 1. Check manifest exists
if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`❌ Manifest not found at: ${MANIFEST_PATH}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
const publishedMissions = manifest.missions || [];

const missionsToValidate = targetMissionId
  ? publishedMissions.filter(m => m.id === targetMissionId)
  : publishedMissions;

if (missionsToValidate.length === 0) {
  console.error(`❌ No missions found to validate (target: ${targetMissionId || 'all published'})`);
  process.exit(1);
}

// Helper: Compile Python code snippet using local Python AST with UTF-8 support
function validatePythonSnippet(code, contextName) {
  if (!code || typeof code !== 'string' || !code.trim()) {
    return { valid: true, warning: 'Empty snippet' };
  }

  // Pass code to Python AST parser with explicit UTF-8 decoding
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
      error: `[${contextName}] Python compilation failed: ${errorMsg}\nSnippet preview:\n${code.slice(0, 120)}...`
    };
  }

  return { valid: true };
}

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const failures = [];

function assert(condition, testName, missionId, detail = '') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
  } else {
    failedAssertions++;
    failures.push({ missionId, testName, detail });
    console.error(`  ❌ [FAIL] M${missionId} — ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

// Loop through each mission
for (const entry of missionsToValidate) {
  const missionId = entry.id;
  const filePath = path.join(MISSIONS_DIR, `mission-${missionId}.json`);

  console.log(`🔍 Validating Mission ${missionId}: "${entry.title}"...`);

  if (!fs.existsSync(filePath)) {
    assert(false, 'File Exists', missionId, `Missing file: ${filePath}`);
    continue;
  }

  let mission;
  try {
    mission = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    assert(true, 'JSON Syntactic Validity', missionId);
  } catch (err) {
    assert(false, 'JSON Syntactic Validity', missionId, err.message);
    continue;
  }

  // Tier 1: Schema & Core Metadata
  assert(mission.id === missionId, 'ID Matches Filename', missionId, `Found id "${mission.id}"`);
  assert(typeof mission.title === 'string' && mission.title.length > 0, 'Title Present', missionId);
  assert(typeof mission.banglaTitle === 'string' && mission.banglaTitle.length > 0, 'Bangla Title Present', missionId);
  assert(typeof mission.banglaSubtitle === 'string', 'Bangla Subtitle String', missionId);

  // Cognitive load
  const cog = mission.cognitiveLoadEstimate;
  assert(cog && typeof cog === 'object', 'Cognitive Load Object Present', missionId);
  if (cog) {
    assert(typeof cog.readingLevel === 'number' && cog.readingLevel >= 1 && cog.readingLevel <= 5, 'Reading Level Valid', missionId);
    assert(typeof cog.practiceComplexity === 'number' && cog.practiceComplexity >= 1, 'Practice Complexity Valid', missionId);
    assert(typeof cog.estimatedTotalMinutes === 'number' && cog.estimatedTotalMinutes > 0, 'Estimated Minutes Positive', missionId);
  }

  // Curiosity Block (Mandatory 6 Fields per LEARNING_ENGINE.md)
  const curiosity = mission.curiosity;
  assert(curiosity && typeof curiosity === 'object', 'Curiosity Block Present', missionId);
  if (curiosity) {
    const requiredCuriosityFields = [
      'didYouKnow',
      'realWorldApplication',
      'aiApplication',
      'eeeApplication',
      'historicalFact',
      'nextMissionPreview'
    ];
    for (const field of requiredCuriosityFields) {
      const val = curiosity[field];
      assert(typeof val === 'string' && val.trim().length > 0, `Curiosity.${field} Non-Empty`, missionId);
    }
  }

  // Tier 2: Step Structure & Pedagogy Integrity
  const steps = mission.steps;
  assert(Array.isArray(steps) && steps.length >= 8, 'Step Count Reasonable (>= 8)', missionId, `Found ${steps ? steps.length : 0} steps`);

  if (Array.isArray(steps)) {
    const stepTypes = steps.map(s => s.type);

    // Verify introductory & closing steps
    assert(stepTypes.includes('intro'), 'Intro Step Present', missionId);
    assert(stepTypes.includes('concept'), 'Concept Step Present', missionId);
    assert(stepTypes.includes('mission_complete'), 'Mission Complete Step Present', missionId);

    // Quiz Step Validation
    const quizSteps = steps.filter(s => s.type === 'quiz');
    assert(quizSteps.length >= 1, 'Quiz Step Present (Rule: 40% Understanding Score)', missionId);

    quizSteps.forEach((qStep, qIdx) => {
      assert(typeof qStep.passingScore === 'number' && qStep.passingScore >= 50 && qStep.passingScore <= 100, `Quiz ${qIdx + 1} Passing Score Valid (50-100)`, missionId);
      assert(Array.isArray(qStep.questions) && qStep.questions.length >= 1, `Quiz ${qIdx + 1} Has Questions`, missionId);

      if (Array.isArray(qStep.questions)) {
        qStep.questions.forEach((q, idx) => {
          assert(typeof q.question === 'string' && q.question.length > 0, `Quiz ${qIdx + 1} Q${idx + 1} Text Present`, missionId);
          assert(Array.isArray(q.options) && q.options.length >= 2, `Quiz ${qIdx + 1} Q${idx + 1} Has >= 2 Options`, missionId);
          assert(typeof q.correctOptionIndex === 'number' && q.correctOptionIndex >= 0 && q.correctOptionIndex < (q.options?.length || 0), `Quiz ${qIdx + 1} Q${idx + 1} Correct Option In Bounds`, missionId);
        });
      }
    });

    // Practice Steps Validation
    const practiceSteps = steps.filter(s => s.type === 'practice');
    assert(practiceSteps.length >= 1, 'At Least One Practice Step Present', missionId);

    practiceSteps.forEach((pStep, pIdx) => {
      assert(typeof pStep.prompt === 'string' && pStep.prompt.length > 0, `Practice ${pIdx + 1} Prompt Present`, missionId);
      assert(typeof pStep.solution === 'string' && pStep.solution.trim().length > 0, `Practice ${pIdx + 1} Solution Present`, missionId);

      // Tier 3 Python Validation on Solution
      const pyCheck = validatePythonSnippet(pStep.solution, `Practice ${pIdx + 1} Solution`);
      assert(pyCheck.valid, `Practice ${pIdx + 1} Solution Valid Python AST`, missionId, pyCheck.error);
    });

    // Debug Challenges Validation
    const debugSteps = steps.filter(s => s.type === 'debug_challenge');
    assert(debugSteps.length >= 1, 'At Least One Debug Challenge Present', missionId);

    debugSteps.forEach((dStep, dIdx) => {
      assert(typeof dStep.buggyCode === 'string' && dStep.buggyCode.length > 0, `Debug ${dIdx + 1} Buggy Code Present`, missionId);
      assert(typeof dStep.fixedCode === 'string' && dStep.fixedCode.length > 0, `Debug ${dIdx + 1} Fixed Code Present`, missionId);
      assert(Array.isArray(dStep.hints) && dStep.hints.length >= 1, `Debug ${dIdx + 1} Has Hints`, missionId);

      // Tier 3 Python Validation on Fixed Code (MUST BE 100% VALID SYNTAX)
      const pyCheck = validatePythonSnippet(dStep.fixedCode, `Debug ${dIdx + 1} Fixed Code`);
      assert(pyCheck.valid, `Debug ${dIdx + 1} Fixed Code Valid Python AST`, missionId, pyCheck.error);
    });

    // Code Examples Validation
    const codeExampleSteps = steps.filter(s => s.type === 'code_example');
    codeExampleSteps.forEach((cStep, cIdx) => {
      if (cStep.code) {
        const pyCheck = validatePythonSnippet(cStep.code, `Code Example ${cIdx + 1}`);
        assert(pyCheck.valid, `Code Example ${cIdx + 1} Valid Python AST`, missionId, pyCheck.error);
      }
    });

    // Reflection Validation (Supports both CTL mode with criticalThinkingQuestions and legacy prompts mode)
    const reflectionSteps = steps.filter(s => s.type === 'reflection');
    if (reflectionSteps.length > 0) {
      reflectionSteps.forEach((rStep, rIdx) => {
        const hasQuestions = (Array.isArray(rStep.criticalThinkingQuestions) && rStep.criticalThinkingQuestions.length > 0) ||
                             (Array.isArray(rStep.prompts) && rStep.prompts.length > 0);
        assert(hasQuestions, `Reflection ${rIdx + 1} Questions/Prompts Present`, missionId);
      });
    }
  }

  // Tier 4: Prerequisite validation
  if (entry.prerequisite) {
    const prereqExists = publishedMissions.some(m => m.id === entry.prerequisite);
    assert(prereqExists, `Prerequisite M${entry.prerequisite} Exists In Manifest`, missionId);
  }

  console.log(`  ✓ Mission ${missionId} assertions evaluated.`);
}

console.log('\n======================================================');
console.log(`📊 VALIDATION SUMMARY:`);
console.log(`  Total Assertions Tested : ${totalAssertions}`);
console.log(`  Passed                  : ${passedAssertions} (✓)`);
console.log(`  Failed                  : ${failedAssertions} (✗)`);
console.log('======================================================\n');

if (failedAssertions > 0) {
  console.error(`🚨 VALIDATION FAILED WITH ${failedAssertions} ERRORS:\n`);
  failures.forEach(f => {
    console.error(`  - Mission ${f.missionId}: ${f.testName} ${f.detail ? `-> ${f.detail}` : ''}`);
  });
  process.exit(1);
} else {
  console.log('🎉 ALL MISSIONS PASSED SCHEMA, PEDAGOGY & PYTHON AST COMPILATION 100%!\n');
  process.exit(0);
}
