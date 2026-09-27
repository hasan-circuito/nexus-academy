# TEST_READY — NEXUS Academy Automated Test & CI Harness

## Test Suite Overview
- **Standard Command**: `npm test` (executes all 7 specialized test suites)
- **Continuous Integration**: GitHub Actions CI workflow at `.github/workflows/ci.yml` (Node.js 20 + Python 3.12)
- **TypeScript Compiler Check**: `npx tsc --noEmit` (Strict TypeScript 5, 0 errors)
- **Next.js Production Build**: `npm run build` (Next.js 16 App Router)

### The 7 Specialized Validation Suites:
1. **Mission Schema & Pedagogy Validator** (`scripts/validate-missions.mjs` / `npm run test:missions`)
   - 745 assertions validating 14 published missions (M001–M014)
   - Real native Python 3.12 AST compilation (`ast.parse`) on all code snippets
2. **Decoupled EventBus & Domain Lifecycle** (`scripts/test-event-bus.mjs` / `npm run test:events`)
   - 6 event flow phases validating 23 domain events, two-phase mission completion, and scoring fan-out
3. **Dictionary & Mental Model Problem-Solving Hub** (`scripts/validate-dictionary.mjs` / `npm run test:dictionary`)
   - 628 assertions validating 20 computer science entries, dual-language search, and symptom keywords
4. **Contextual Error Diagnostics Engine** (`scripts/test-error-diagnostics.mjs` / `npm run test:diagnostics`)
   - 44 assertions validating 15 learner micro-error patterns, Bengali explanations, and exact fixes
5. **Settings, Dev Mode & State Safety** (`scripts/test-settings.mjs` / `npm run test:settings`)
   - 22 tests validating theme toggling, Monaco sync, localStorage backup, export, import, and reset
6. **Curriculum Pipeline & AST Forbidden Syntax Walker** (`scripts/test-curriculum-pipeline.mjs` / `npm run test:pipeline`)
   - 170 tests validating preflight contracts, prerequisite DAG, CLI flags, Rule 24 AST walker, and scaffolding
7. **Step Persistence & Resume Safety** (`scripts/test-step-persistence.mjs` / `npm run test:persistence`)
   - 25 tests validating idempotent step navigation, variable-length mission progress, and zero state loss

---

## 4-Tier Validation Hierarchy

### Tier 1: Schema & Core Metadata Integrity
- **JSON Syntactic Validity**: Validates clean parsing without JSON syntax errors.
- **Root Metadata Alignment**: Validates `id`, `title`, `banglaTitle`, `banglaSubtitle` against manifest and type contracts.
- **Cognitive Load Estimates**: Validates `readingLevel` (1–5), `practiceComplexity` (≥1), and `estimatedTotalMinutes` (>0).
- **Curiosity Block (Mandatory 6 Fields)**: Validates presence and non-empty content for `didYouKnow`, `realWorldApplication`, `aiApplication`, `eeeApplication`, `historicalFact`, and `nextMissionPreview`.

### Tier 2: Step Structure & Pedagogy Integrity
- **Core Steps Presence**: Confirms `intro`, `concept`, and `mission_complete` steps exist.
- **Quiz Step Integrity**: Enforces at least 1 Quiz step per mission with `passingScore` (50–100), questions with ≥2 options, and valid `correctOptionIndex`.
- **Practice Step Integrity**: Verifies practice steps have prompts and solutions.
- **Debug Challenge Integrity**: Verifies debug steps have `buggyCode`, `fixedCode`, and progressive hint ladders.
- **Critical Thinking Reflection**: Validates reflection questions in both Critical Thinking Lab (CTL) mode and prompts mode.

### Tier 3: Real Python Code Compilation via Python AST
- **Zero Broken Code Guarantee**: Compiles all Python code snippets using native Python 3.12 `ast.parse` with UTF-8 byte stream decoding.
- **Snippets Validated**:
  - `code_example.code`
  - `practice.starterCode`
  - `practice.solution`
  - `debug_challenge.fixedCode` (guarantees fixed code has zero syntax errors)

### Tier 4: Prerequisite Dependency Graph Integrity
- **Manifest Prerequisite Linkage**: Validates that all prerequisites declared in `manifest.json` resolve to existing, valid missions.
- **Closed-World Scope Boundaries (Rule 24)**: AST visitors reject unearned language constructs not yet introduced in the learner's completed mission graph.

---

## Running the Automated Test Suite

### Full Test Suite (All 7 Suites — 1,640 Assertions)
```bash
npm test
```

### Validate All Missions
```bash
npm run test:missions
```

### Validate a Single Mission (During Authoring)
```bash
node scripts/validate-missions.mjs 014
# or with flag:
node scripts/validate-missions.mjs --mission 014
```

### Validate EventBus & Domain Engine Decoupling
```bash
npm run test:events
```

### Preflight Contract Verification
```bash
npm run mission:preflight 014
```

### Scaffold a New Mission Skeleton
```bash
npm run mission:scaffold 015
```

---

## Current Verification Results

- **Total Automated Assertions**: **1,640/1,640 assertions PASSED (100%)**
  - **14 Published Missions (001–014)**: **745/745 assertions PASSED (100%)**
  - **Domain Event Loop**: **6/6 event flow phases PASSED (100%)**
  - **Dictionary Concept Index**: **628/628 assertions PASSED (100%)**
  - **Contextual Error Diagnostics**: **44/44 assertions PASSED (100%)**
  - **Settings, Dev Mode & State Safety**: **22/22 tests PASSED (100%)**
  - **Curriculum Pipeline & AST Walker**: **170/170 tests PASSED (100%)**
  - **Step Persistence & Resume**: **25/25 tests PASSED (100%)**
- **TypeScript Strict Compilation**: **0 errors (`npx tsc --noEmit`)**
- **Next.js Production Build**: **Static and dynamic routes compiled with 0 errors**
