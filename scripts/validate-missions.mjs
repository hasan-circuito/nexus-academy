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
const CURRICULUM_GRAPH_PATH = path.join(ROOT_DIR, 'data', 'curriculum', 'curriculum-graph.json');

// Parse CLI flags: supports --mission <id>, --mission=<id>, or positional <id>
const args = process.argv.slice(2);
let targetMissionId = null;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--mission' && args[i + 1]) {
    targetMissionId = args[i + 1];
    break;
  } else if (arg.startsWith('--mission=')) {
    targetMissionId = arg.split('=')[1];
    break;
  } else if (!arg.startsWith('-') && /^\d+$/.test(arg)) {
    targetMissionId = arg;
    break;
  }
}
if (targetMissionId) {
  targetMissionId = targetMissionId.replace(/[^0-9]/g, '').padStart(3, '0');
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

let curriculumGraph = null;
if (fs.existsSync(CURRICULUM_GRAPH_PATH)) {
  try {
    curriculumGraph = JSON.parse(fs.readFileSync(CURRICULUM_GRAPH_PATH, 'utf-8'));
  } catch (err) {
    console.warn(`⚠️ Warning: Could not parse curriculum graph: ${err.message}`);
  }
}

let missionsToValidate = [];
if (targetMissionId) {
  const inManifest = publishedMissions.find(m => m.id === targetMissionId);
  if (inManifest) {
    missionsToValidate = [inManifest];
  } else {
    // If not in manifest, check if mission file exists on disk (e.g. newly scaffolded or unpublished mission)
    const filePath = path.join(MISSIONS_DIR, `mission-${targetMissionId}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const graphMissions = curriculumGraph ? (Array.isArray(curriculumGraph) ? curriculumGraph : (curriculumGraph.missions || [])) : [];
        const graphEntry = graphMissions.find(m => m.id === targetMissionId);
        const candidatePrereq = graphEntry && graphEntry.prerequisite !== undefined
          ? graphEntry.prerequisite
          : (fileContent.prerequisite !== undefined ? fileContent.prerequisite : (parseInt(targetMissionId, 10) > 1 ? String(parseInt(targetMissionId, 10) - 1).padStart(3, '0') : null));
        missionsToValidate = [{
          id: targetMissionId,
          title: fileContent.title || graphEntry?.title || `Mission ${targetMissionId}`,
          banglaTitle: fileContent.banglaTitle || graphEntry?.banglaTitle || '',
          banglaSubtitle: fileContent.banglaSubtitle || graphEntry?.banglaSubtitle || '',
          prerequisite: candidatePrereq,
          status: 'draft'
        }];
      } catch (err) {
        console.error(`❌ Found mission file ${filePath} but failed to parse JSON: ${err.message}`);
        process.exit(1);
      }
    } else {
      console.error(`❌ No missions found to validate (target: ${targetMissionId} not found in manifest or at ${filePath})`);
      process.exit(1);
    }
  }
} else {
  missionsToValidate = publishedMissions;
}

if (missionsToValidate.length === 0) {
  console.error(`❌ No missions found to validate (target: ${targetMissionId || 'all published'})`);
  process.exit(1);
}

// Helper: Compile Python code snippet using local Python AST with UTF-8 support
// Also inspects code against forbiddenSyntax AST node names
function validatePythonSnippet(code, contextName, forbiddenSyntax = []) {
  if (!code || typeof code !== 'string' || !code.trim()) {
    return { valid: true, warning: 'Empty snippet' };
  }

  const payload = JSON.stringify({
    code,
    forbidden: Array.isArray(forbiddenSyntax) ? forbiddenSyntax : []
  });

  const pyScript = `
import ast, sys, json
try:
    data = json.loads(sys.stdin.buffer.read().decode('utf-8'))
    source = data.get('code', '')
    forbidden = set(data.get('forbidden', []))
    tree = ast.parse(source)
    violations = []
    for node in ast.walk(tree):
        name = type(node).__name__
        if name in forbidden:
            line = getattr(node, 'lineno', 1)
            violations.append(f"Line {line}: Forbidden syntax construct '{name}' detected")
    if violations:
        sys.stderr.write("\\n".join(violations))
        sys.exit(2)
    sys.exit(0)
except SyntaxError as e:
    line_info = f" on line {e.lineno}" if getattr(e, 'lineno', None) is not None else ""
    sys.stderr.write(f"SyntaxError{line_info}: {e.msg}")
    sys.exit(1)
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`;

  const pyProcess = spawnSync('python', ['-c', pyScript], {
    input: Buffer.from(payload, 'utf-8'),
    env: {
      ...process.env,
      PYTHONUTF8: '1',
      PYTHONIOENCODING: 'utf-8',
    },
  });

  if (pyProcess.error) {
    return {
      valid: false,
      error: `[${contextName}] Failed to execute Python process: ${pyProcess.error.message}`
    };
  }

  if (pyProcess.status === 2) {
    const errorMsg = pyProcess.stderr ? pyProcess.stderr.toString('utf-8').trim() : 'Forbidden construct detected';
    return {
      valid: false,
      isForbidden: true,
      error: `[${contextName}] Zero Untaught Syntax Barrier Violation:\n${errorMsg}\nSnippet preview:\n${code.slice(0, 120)}...`
    };
  }

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

  // Fetch curriculum contract for forbidden syntax
  let missionForbiddenSyntax = [];
  if (curriculumGraph) {
    const graphMissions = Array.isArray(curriculumGraph)
      ? curriculumGraph
      : (curriculumGraph.missions || []);
    const graphEntry = graphMissions.find(m => m.id === missionId);
    if (graphEntry && Array.isArray(graphEntry.forbiddenSyntax)) {
      missionForbiddenSyntax = graphEntry.forbiddenSyntax;
    }
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

      // Tier 3 Python Validation on Solution (AST compilation & Zero Untaught Syntax Barrier)
      const pyCheck = validatePythonSnippet(pStep.solution, `Practice ${pIdx + 1} Solution`, missionForbiddenSyntax);
      assert(pyCheck.valid, `Practice ${pIdx + 1} Solution Valid Python AST & Allowed Syntax`, missionId, pyCheck.error);
    });

    // Debug Challenges Validation
    const debugSteps = steps.filter(s => s.type === 'debug_challenge');
    assert(debugSteps.length >= 1, 'At Least One Debug Challenge Present', missionId);

    debugSteps.forEach((dStep, dIdx) => {
      assert(typeof dStep.buggyCode === 'string' && dStep.buggyCode.length > 0, `Debug ${dIdx + 1} Buggy Code Present`, missionId);
      assert(typeof dStep.fixedCode === 'string' && dStep.fixedCode.length > 0, `Debug ${dIdx + 1} Fixed Code Present`, missionId);
      assert(Array.isArray(dStep.hints) && dStep.hints.length >= 1, `Debug ${dIdx + 1} Has Hints`, missionId);

      // Tier 3 Python Validation on Fixed Code (MUST BE 100% VALID SYNTAX & FREE OF FORBIDDEN NODES)
      const pyCheck = validatePythonSnippet(dStep.fixedCode, `Debug ${dIdx + 1} Fixed Code`, missionForbiddenSyntax);
      assert(pyCheck.valid, `Debug ${dIdx + 1} Fixed Code Valid Python AST & Allowed Syntax`, missionId, pyCheck.error);

      // Tier 4 Negative Testing: Buggy Code must differ from Fixed Code
      assert(dStep.buggyCode.trim() !== dStep.fixedCode.trim(), `Debug ${dIdx + 1} Buggy Code Differs From Fixed Code`, missionId);

      // If bugType is syntax, buggyCode MUST fail syntax check
      if (dStep.bugType === 'syntax') {
        const buggyCheck = validatePythonSnippet(dStep.buggyCode, `Debug ${dIdx + 1} Buggy Code`);
        assert(!buggyCheck.valid, `Debug ${dIdx + 1} Buggy Code Has Real Syntax Error`, missionId);
      } else {
        // For non-syntax bugs, buggy code must also respect forbidden syntax barrier
        const buggyForbiddenCheck = validatePythonSnippet(dStep.buggyCode, `Debug ${dIdx + 1} Buggy Code`, missionForbiddenSyntax);
        assert(!buggyForbiddenCheck.isForbidden, `Debug ${dIdx + 1} Buggy Code Free of Forbidden Syntax`, missionId, buggyForbiddenCheck.error);
      }
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
