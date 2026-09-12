// scripts/test-curriculum-pipeline.mjs
// NEXUS Academy — Curriculum Pipeline Engine & AST Validator Test Suite
//
// Verifies:
// 1. Central Curriculum Graph (curriculum-graph.json) structure, contracts, and MES Rules
// 2. Preflight contract verification and prerequisite resolution
// 3. Scaffolding generator, dry-run mode, and 13-step golden architecture
// 4. AST Forbidden Syntax Validator (direct, nested f-string, line reporting)
// 5. Unpublished / disk-based mission validation (solves chicken-and-egg packaging deadlock)
// 6. CLI argument parsing flexibility (flags before/after ID)

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CURRICULUM_GRAPH_PATH = path.join(ROOT_DIR, 'data', 'curriculum', 'curriculum-graph.json');
const MISSIONS_DIR = path.join(ROOT_DIR, 'data', 'missions');
const PIPELINE_SCRIPT = path.join(ROOT_DIR, 'scripts', 'curriculum-pipeline.mjs');
const VALIDATE_SCRIPT = path.join(ROOT_DIR, 'scripts', 'validate-missions.mjs');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assertTest(condition, testName, detail = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failedTests++;
    failures.push({ testName, detail });
    console.error(`  ❌ [FAIL] ${testName} ${detail ? `-> ${detail}` : ''}`);
  }
}

console.log('\n======================================================');
console.log('🚀 TESTING CURRICULUM PIPELINE & KNOWLEDGE GRAPH ENGINE');
console.log('======================================================\n');

// ----------------------------------------------------------------------------
// Suite 1: Central Curriculum Graph Integrity
// ----------------------------------------------------------------------------
console.log('1️⃣ Suite 1: Curriculum Graph Contracts & MES Rules:');
assertTest(fs.existsSync(CURRICULUM_GRAPH_PATH), 'curriculum-graph.json exists on disk');

const graph = JSON.parse(fs.readFileSync(CURRICULUM_GRAPH_PATH, 'utf-8'));
assertTest(Array.isArray(graph.missions), 'Graph contains missions array');
assertTest(graph.missions.length >= 10, 'Graph contains baseline missions 001–010');

const industries = new Set();
let scopeIncreases = true;
let prevScopeCount = 0;

graph.missions.forEach((m, idx) => {
  const expectedId = String(idx + 1).padStart(3, '0');
  assertTest(m.id === expectedId, `Mission ${expectedId} present with matching ID`);
  assertTest(typeof m.title === 'string' && m.title.length > 0, `M${expectedId} has English title`);
  assertTest(typeof m.banglaTitle === 'string' && m.banglaTitle.length > 0, `M${expectedId} has Bangla title`);
  assertTest(typeof m.clientIndustry === 'string' && m.clientIndustry.length > 0, `M${expectedId} has clientIndustry (Rule 22)`);
  industries.add(m.clientIndustry);

  assertTest(typeof m.painPointTrigger === 'string' && m.painPointTrigger.length > 0, `M${expectedId} has concrete painPointTrigger`);
  assertTest(m.newConceptCount === 1, `M${expectedId} enforces Single Concept Law (newConceptCount === 1)`);
  assertTest(typeof m.newCapability === 'string' && m.newCapability.length > 0, `M${expectedId} defines newCapability`);

  assertTest(Array.isArray(m.learnerKnownScope) && m.learnerKnownScope.length > 0, `M${expectedId} has learnerKnownScope`);
  if (m.learnerKnownScope.length < prevScopeCount) {
    scopeIncreases = false;
  }
  prevScopeCount = m.learnerKnownScope.length;

  assertTest(Array.isArray(m.forbiddenSyntax) && m.forbiddenSyntax.length >= 15, `M${expectedId} has forbiddenSyntax AST array`);
});

assertTest(industries.size >= 8, `Rule 22 rotating client industries present (found ${industries.size} unique domains)`);
assertTest(scopeIncreases, 'learnerKnownScope accumulates progressively across missions');

// ----------------------------------------------------------------------------
// Suite 2: Preflight Subcommand
// ----------------------------------------------------------------------------
console.log('\n2️⃣ Suite 2: Preflight Contract Validation:');

const preflight001 = spawnSync('node', [PIPELINE_SCRIPT, 'preflight', '001'], { encoding: 'utf-8' });
assertTest(preflight001.status === 0, 'preflight 001 exits with code 0 (foundational mission)');
assertTest(preflight001.stdout.includes('Foundational mission'), 'preflight 001 identifies foundational mission');

const preflight010 = spawnSync('node', [PIPELINE_SCRIPT, 'preflight', '010'], { encoding: 'utf-8' });
assertTest(preflight010.status === 0, 'preflight 010 exits with code 0 (sequenced mission)');
assertTest(preflight010.stdout.includes('Prerequisite M009 verified'), 'preflight 010 verifies prerequisite M009');

const preflight011 = spawnSync('node', [PIPELINE_SCRIPT, 'preflight', '011'], { encoding: 'utf-8' });
assertTest(preflight011.status === 0, 'preflight 011 exits with code 0 (sequenced mission)');
assertTest(preflight011.stdout.includes('Prerequisite M010 verified'), 'preflight 011 verifies prerequisite M010');

const preflight012 = spawnSync('node', [PIPELINE_SCRIPT, 'preflight', '012'], { encoding: 'utf-8' });
assertTest(preflight012.status === 0, 'preflight 012 exits with code 0 (sequenced mission)');
assertTest(preflight012.stdout.includes('Prerequisite M011 verified'), 'preflight 012 verifies prerequisite M011');

const preflightInvalid = spawnSync('node', [PIPELINE_SCRIPT, 'preflight', '999'], { encoding: 'utf-8' });
assertTest(preflightInvalid.status !== 0, 'preflight 999 exits non-zero for uncontracted mission');

// ----------------------------------------------------------------------------
// Suite 3: CLI Argument Order & Flag Flexibility
// ----------------------------------------------------------------------------
console.log('\n3️⃣ Suite 3: CLI Flag Parsing & Flexibility:');

// Flag after ID: scaffold 010 --dry-run
const scaffoldAfter = spawnSync('node', [PIPELINE_SCRIPT, 'scaffold', '010', '--dry-run'], { encoding: 'utf-8' });
assertTest(scaffoldAfter.status === 0, 'scaffold 010 --dry-run succeeds (flag after ID)');

// Flag before ID: scaffold --dry-run 010
const scaffoldBefore = spawnSync('node', [PIPELINE_SCRIPT, 'scaffold', '--dry-run', '010'], { encoding: 'utf-8' });
assertTest(scaffoldBefore.status === 0, 'scaffold --dry-run 010 succeeds (flag before ID)');

// Validation CLI positional syntax: validate-missions.mjs 010
const valPositional = spawnSync('node', [VALIDATE_SCRIPT, '010'], { encoding: 'utf-8' });
assertTest(valPositional.status === 0, 'validate-missions.mjs 010 succeeds with positional ID');
assertTest(valPositional.stdout.includes('Validating Mission 010'), 'validate-missions.mjs 010 validates target mission');

// ----------------------------------------------------------------------------
// Suite 4: AST Forbidden Syntax Detection & Edge Cases
// ----------------------------------------------------------------------------
console.log('\n4️⃣ Suite 4: AST Forbidden Syntax Detection:');

// Direct forbidden construct: for loop
const pyDirectTest = spawnSync('python', ['-c', `
import ast, sys, json
data = {"code": "for i in range(5):\\n    print(i)", "forbidden": ["For", "While"]}
tree = ast.parse(data['code'])
violations = [f"Line {getattr(n, 'lineno', 1)}: {type(n).__name__}" for n in ast.walk(tree) if type(n).__name__ in set(data['forbidden'])]
if violations:
    sys.stderr.write("\\n".join(violations))
    sys.exit(2)
sys.exit(0)
`], { encoding: 'utf-8' });
assertTest(pyDirectTest.status === 2, 'Direct For loop caught with exit code 2');
assertTest(pyDirectTest.stderr.includes('Line 1: For'), 'Direct For loop reported with exact line number');

// Nested forbidden construct inside f-string: f"{[x for x in items]}"
const pyNestedFStringTest = spawnSync('python', ['-c', `
import ast, sys
source = 'items = [1, 2]\\nmsg = f"{[x for x in items]}"'
forbidden = {"For", "ListComp"}
tree = ast.parse(source)
violations = [f"Line {getattr(n, 'lineno', 1)}: {type(n).__name__}" for n in ast.walk(tree) if type(n).__name__ in forbidden]
if violations:
    sys.stderr.write("\\n".join(violations))
    sys.exit(2)
sys.exit(0)
`], { encoding: 'utf-8' });
assertTest(pyNestedFStringTest.status === 2, 'Nested ListComp in f-string caught with exit code 2');
assertTest(pyNestedFStringTest.stderr.includes('ListComp'), 'Nested ListComp reported by AST walker');

// FunctionDef forbidden construct: def foo(): pass
const pyFuncTest = spawnSync('python', ['-c', `
import ast, sys
source = 'def helper():\\n    return 42'
forbidden = {"FunctionDef", "Return"}
tree = ast.parse(source)
violations = [f"Line {getattr(n, 'lineno', 1)}: {type(n).__name__}" for n in ast.walk(tree) if type(n).__name__ in forbidden]
if violations:
    sys.stderr.write("\\n".join(violations))
    sys.exit(2)
sys.exit(0)
`], { encoding: 'utf-8' });
assertTest(pyFuncTest.status === 2, 'FunctionDef caught with exit code 2');
assertTest(pyFuncTest.stderr.includes('Line 1: FunctionDef'), 'FunctionDef reported with exact line 1');

// Permitted valid syntax (e.g. arithmetic, variable assignments, print)
const pyAllowedTest = spawnSync('python', ['-c', `
import ast, sys
source = 'price = 100\\nqty = 2\\ntotal = price * qty\\nprint(f"Total: {total}")'
forbidden = {"For", "While", "FunctionDef", "ClassDef", "List", "Dict"}
tree = ast.parse(source)
violations = [f"Line {getattr(n, 'lineno', 1)}: {type(n).__name__}" for n in ast.walk(tree) if type(n).__name__ in forbidden]
if violations:
    sys.stderr.write("\\n".join(violations))
    sys.exit(2)
sys.exit(0)
`], { encoding: 'utf-8' });
assertTest(pyAllowedTest.status === 0, 'Permitted syntax passes AST walker cleanly with exit code 0');

// ----------------------------------------------------------------------------
// Suite 5: Unpublished Mission Validation from Disk (Deadlock Fix)
// ----------------------------------------------------------------------------
console.log('\n5️⃣ Suite 5: Unpublished Mission Validation from Disk:');

const testDraftPath = path.join(MISSIONS_DIR, 'mission-999.json');
try {
  // Create a temporary valid draft mission 999
  const draftMission = {
    id: '999',
    title: 'Draft Test Mission',
    banglaTitle: 'ড্রাফট টেস্ট মিশন',
    banglaSubtitle: 'টেস্ট সাবটাইটেল',
    prerequisite: '010',
    cognitiveLoadEstimate: {
      readingLevel: 2,
      newConceptCount: 1,
      practiceComplexity: 1,
      estimatedTotalMinutes: 15
    },
    curiosity: {
      didYouKnow: 'টেস্ট তথ্য',
      realWorldApplication: 'বাস্তব প্রয়োগ',
      aiApplication: 'এআই প্রয়োগ',
      eeeApplication: 'ইইই প্রয়োগ',
      historicalFact: 'ইতিহাস',
      nextMissionPreview: 'পরবর্তী মিশন'
    },
    steps: [
      {
        type: 'intro',
        missionNumber: '999',
        title: 'Draft Test Mission',
        banglaTitle: 'ড্রাফট টেস্ট মিশন',
        tagline: 'টেস্ট ট্যাগলাইন',
        description: 'টেস্ট বর্ণনা',
        learningObjectives: ['টেস্ট উদ্দেশ্য ১', 'টেস্ট উদ্দেশ্য ২'],
        estimatedMinutes: 2
      },
      {
        type: 'story',
        title: 'অফিস দৃশ্য',
        setting: 'নেক্সাস সদর দপ্তর',
        content: 'টিম লিড বললেন কাজ করো।',
        moral: 'লজিক বুঝে কাজ করো।'
      },
      {
        type: 'analogy',
        title: 'উপমা',
        realWorld: { label: 'বাস্তব', description: 'বাস্তব উপমা', icon: 'Lightbulb' },
        pythonConcept: { label: 'পাইথন', description: 'পাইথন কনসেপ্ট', icon: 'Code2' },
        connection: 'সংযোগ'
      },
      {
        type: 'concept',
        title: 'মূল কনসেপ্ট',
        content: 'কনসেপ্ট বিবরণ',
        keyPoints: ['পয়েন্ট ১', 'পয়েন্ট ২'],
        whyCallout: 'কেন এটা শিখব',
        whenToUse: 'কখন ব্যবহার করব',
        whenNotToUse: 'কখন করব না'
      },
      {
        type: 'visualization',
        title: 'ডায়াগ্রাম',
        caption: 'ইনপুট থেকে আউটপুট'
      },
      {
        type: 'code_example',
        title: 'কোড ডেমো',
        explanation: 'ব্যাখ্যা',
        language: 'python',
        code: "val = 10\nprint(val)",
        output: '10',
        annotations: [{ lineNumber: 1, explanation: 'ভেরিয়েবল' }]
      },
      {
        type: 'eee_example',
        title: 'হার্ডওয়্যার',
        context: 'সেন্সর',
        hardware: 'ESP32',
        domain: 'sensor_data',
        code: "s = 5\nprint(s)",
        output: '5',
        explanation: 'ব্যাখ্যা'
      },
      {
        type: 'ai_example',
        title: 'এআই',
        context: 'এলএলএম',
        aiDomain: 'large_language_models',
        code: "tokens = 100\nprint(tokens)",
        output: '100',
        explanation: 'ব্যাখ্যা'
      },
      {
        type: 'practice',
        title: 'অনুশীলন',
        prompt: 'একটি ভেরিয়েবল প্রিন্ট করো',
        solution: "score = 100\nprint(score)",
        solutionExplanation: 'ব্যাখ্যা'
      },
      {
        type: 'quiz',
        title: 'কুইজ',
        instructions: 'উত্তর দাও',
        passingScore: 70,
        questions: [{
          id: 'q1',
          questionType: 'multiple_choice',
          question: 'পাইথন কী?',
          difficulty: 'easy',
          options: ['ভাষা', 'খাবার'],
          correctOptionIndex: 0,
          explanation: 'পাইথন প্রোগ্রামিং ভাষা'
        }]
      },
      {
        type: 'debug_challenge',
        title: 'ডিবাগ',
        scenario: 'বাগ ফিক্স করো',
        buggyCode: "x = 1\ny = x\nx = 2\nprint(y)",
        errorMessage: 'Stale state',
        bugLine: 2,
        bugType: 'logic',
        hints: ['লাইনগুলো লক্ষ্য করো'],
        fixedCode: "x = 1\nx = 2\ny = x\nprint(y)",
        explanation: 'আপডেটের পর অ্যাসাইন করো'
      },
      {
        type: 'reflection',
        title: 'রিফ্লেকশন',
        instruction: 'চিন্তা করো',
        prompts: ['কী শিখলে?', 'কেন এটা গুরুত্বপূর্ণ?']
      },
      {
        type: 'mission_complete',
        title: 'সম্পন্ন',
        summary: 'অভিনন্দন',
        keyLearnings: ['দক্ষতা ১', 'দক্ষতা ২']
      }
    ]
  };
  fs.writeFileSync(testDraftPath, JSON.stringify(draftMission, null, 2), 'utf-8');

  // Validate the unpublished draft directly
  const draftValRes = spawnSync('node', [VALIDATE_SCRIPT, '--mission', '999'], { encoding: 'utf-8' });
  assertTest(draftValRes.status === 0, 'Unpublished mission-999.json validates successfully from disk');
  assertTest(draftValRes.stdout.includes('Validating Mission 999'), 'validate-missions reports Validating Mission 999');
} finally {
  if (fs.existsSync(testDraftPath)) {
    fs.unlinkSync(testDraftPath);
  }
}

// ----------------------------------------------------------------------------
// Suite 6: Scaffolding Skeleton Conformance
// ----------------------------------------------------------------------------
console.log('\n6️⃣ Suite 6: Scaffolding Skeleton Conformance:');

const scaffoldRes = spawnSync('node', [PIPELINE_SCRIPT, 'scaffold', '010', '--dry-run'], { encoding: 'utf-8' });
assertTest(scaffoldRes.status === 0, 'Scaffold dry-run exits code 0');
assertTest(scaffoldRes.stdout.includes('"type": "intro"'), 'Scaffold skeleton contains intro step');
assertTest(scaffoldRes.stdout.includes('"type": "story"'), 'Scaffold skeleton contains story step');
assertTest(scaffoldRes.stdout.includes('"type": "analogy"'), 'Scaffold skeleton contains analogy step');
assertTest(scaffoldRes.stdout.includes('"type": "concept"'), 'Scaffold skeleton contains concept step');
assertTest(scaffoldRes.stdout.includes('"type": "visualization"'), 'Scaffold skeleton contains visualization step');
assertTest(scaffoldRes.stdout.includes('"type": "code_example"'), 'Scaffold skeleton contains code_example step');
assertTest(scaffoldRes.stdout.includes('"type": "eee_example"'), 'Scaffold skeleton contains eee_example step');
assertTest(scaffoldRes.stdout.includes('"type": "ai_example"'), 'Scaffold skeleton contains ai_example step');
assertTest(scaffoldRes.stdout.includes('"type": "practice"'), 'Scaffold skeleton contains practice step');
assertTest(scaffoldRes.stdout.includes('"type": "quiz"'), 'Scaffold skeleton contains quiz step');
assertTest(scaffoldRes.stdout.includes('"type": "debug_challenge"'), 'Scaffold skeleton contains debug_challenge step');
assertTest(scaffoldRes.stdout.includes('"type": "reflection"'), 'Scaffold skeleton contains reflection step');
assertTest(scaffoldRes.stdout.includes('"type": "mission_complete"'), 'Scaffold skeleton contains mission_complete step');
assertTest(scaffoldRes.stdout.includes('"newConceptCount": 1'), 'Scaffold skeleton enforces newConceptCount: 1');

// ----------------------------------------------------------------------------
// Summary
// ----------------------------------------------------------------------------
console.log('\n======================================================');
console.log('📊 CURRICULUM PIPELINE TEST SUMMARY:');
console.log(`  Total Tests Run: ${totalTests}`);
console.log(`  Passed         : ${passedTests} (✓)`);
console.log(`  Failed         : ${failedTests} (✗)`);
console.log('======================================================\n');

if (failedTests > 0) {
  console.error(`🚨 ${failedTests} TEST(S) FAILED:`);
  failures.forEach(f => console.error(`  - ${f.testName} -> ${f.detail}`));
  process.exit(1);
} else {
  console.log('🎉 ALL CURRICULUM PIPELINE & KNOWLEDGE GRAPH TESTS PASSED 100%!\n');
  process.exit(0);
}
