# TEST_READY — Nexus Academy Missions 006–010 E2E Test Suite

## Test Suite Overview
- **Runner**: Node.js automated test runner at `scripts/validate-missions.js`
- **TypeScript Type Contracts**: `tests/e2e/types.ts`
- **Invocation Command**: `node scripts/validate-missions.js`
- **TypeScript Compiler Check**: `npx tsc --noEmit`
- **Integrity Mode**: Benchmark / Opaque-Box

---

## 4-Tier Validation Hierarchy

### Tier 1: Schema, Types & Step Structure Integrity
- **JSON Syntactic Validity**: Validates file presence and clean parsing without JSON syntax errors.
- **Root Schema Alignment**: Validates `id`, `title`, `banglaTitle`, `banglaSubtitle` against `types/mission.types.ts`.
- **Cognitive Load Estimates**: Validates `readingLevel` (1–5, ≤3 for beginner), `newConceptCount` (strictly `1`), `practiceComplexity` (1–3), and `estimatedTotalMinutes` (>0).
- **Curiosity Block (Mandatory 6 Fields)**: Validates presence and non-empty Bangla content for `didYouKnow`, `realWorldApplication`, `aiApplication`, `eeeApplication`, `historicalFact`, and `nextMissionPreview`.
- **Exact 13-Step Standard**: Enforces the exact 13-step sequence: `intro` (0), `story` (1), `analogy` (2), `concept` (3), `code_example` (4), `practice` (5), `practice` (6), `practice` (7), `debug_challenge` (8), `debug_challenge` (9), `debug_challenge` (10), `reflection` (11), `mission_complete` (12).
- **Sub-Schema Contracts**: Deep validation of all step sub-properties (`learningObjectives`, `moral`, `whyCallout`, `annotations`, `hints`, `validation`, `bugLine`, `bugType`, `criticalThinkingQuestions`).

### Tier 2: Boundary & Anti-Concept Scanner
- **Token / AST-Level Isolation**: Strips strings and comments to scan raw code tokens without false positives in text.
- **Global Anti-Concepts (All 006–010)**: Strict prohibition of `def`, `class`, `import`, `try/except`, list/dictionary/set literals.
- **Mission 006 (Basic Arithmetic: `+`, `-`, `*`, `/`)**: Prohibits `//`, `%`, `**`, `input()`, conditionals (`if`/`elif`/`else`), loops (`for`/`while`), state mutation shorthand (`+=`, `-=`), `float()`, boolean comparisons (`==`, `!=`, `<`, `>`), logical operators (`and`, `or`, `not`).
- **Mission 007 (User Input: `input()`)**: Prohibits `float()`, `//`, `%`, `**`, conditionals, loops, state mutation shorthand (`+=`), logical/comparison operators.
- **Mission 008 (Division Secrets: `//` and `%`)**: Focuses on quotient/remainder behavior; prohibits `if/else` or logical operators to demonstrate even/odd; prohibits boolean conditionals, `float()`, loops, state mutation shorthand (`+=`).
- **Mission 009 (Math Rules: Precedence & `()`)**: Prohibits new operators (`**`, bitwise, comparison), conditionals, logical operators, loops, state mutation shorthand (`+=`), `float()`.
- **Mission 010 (Updating Values: Reassignment & `+=`)**: Teaches RHS evaluation first and introduces `+=` shorthand; prohibits loops, conditionals, logical operators, `float()`.
- **Target Capability Verification**: Confirms that each mission actually exercises its assigned primary concept.

### Tier 3: Cross-Mission Progression & Prerequisite Chain
- **Prerequisite Chain Linkage**: Strictly verifies `data/missions/manifest.json` prerequisite chain (`005 -> 006 -> 007 -> 008 -> 009 -> 010`).
- **Next-Mission Teaser Alignment**: Confirms Curiosity block `nextMissionPreview` in Mission $N$ correctly previews the concept introduced in Mission $N+1$.
- **Cognitive Load Monotonicity**: Verifies consistent single-concept progression and smooth complexity across missions.

### Tier 4: Solution Execution & Validation Engine Simulator
- **Real Python Code Execution**: Executes `code_example.code`, `practice.solution` (Practices 1–3), and `debug_challenge.fixedCode` (Debugs 1–3) using the native Python runtime (`PythonRunner`).
- **SmartOutputSource Evaluation**: Validates learner solution against `requiredVariables`, `requiredPatterns`, `forbiddenPatterns`, `expectedOutput`, and feedback messages.
- **Adversarial Cheating & Anti-Hardcoding Simulation**: Injects hardcoded answers without variables to verify that the validation engine detects cheating and rejects invalid submissions.
- **Critical Thinking Lab 4-Layer Verification**: Verifies 3 questions per reflection step, each with complete `question`, `expertThinking`, `realWorldEngineering`, and `beyondProgramming` layers.
- **Progressive Debugging**: Validates that buggy code exhibits expected errors and progressive hint ladders (1–3 hints) guide the learner.

---

## Running the E2E Test Suite

### Full Suite Run (Target Missions 006–010)
```bash
node scripts/validate-missions.js
```

### Run on a Single Mission
```bash
node scripts/validate-missions.js --mission 006
node scripts/validate-missions.js --mission 007
node scripts/validate-missions.js --mission 008
node scripts/validate-missions.js --mission 009
node scripts/validate-missions.js --mission 010
```

### Run on Baseline Reference (Mission 005)
```bash
node scripts/validate-missions.js --mission 005
```

### Run Specific Validation Tier
```bash
node scripts/validate-missions.js --tier 1
node scripts/validate-missions.js --tier 2
node scripts/validate-missions.js --tier 3
node scripts/validate-missions.js --tier 4
```

### JSON Output Mode (for CI & Orchestration)
```bash
node scripts/validate-missions.js --json
```

### TypeScript Compiler Verification
```bash
npx tsc --noEmit
```

---

## Baseline Verification Results

- **Mission 005 Reference**: 21/21 assertions **PASSED** (100% pass rate).
- **TypeScript Compilation**: `npx tsc --noEmit` exited with code 0 (zero errors).
- **Missions 006–010 Current State**: Successfully identified legacy unrewritten files and reported exact failing assertions (17 steps instead of 13, premature concepts, non-single concept count) ready for milestone worker implementations.

---

## Final Verdict
**E2E TEST HARNESS READY FOR MILESTONE VALIDATION**
