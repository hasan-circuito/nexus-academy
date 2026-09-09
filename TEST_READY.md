# TEST_READY — NEXUS Academy Automated Test & CI Harness

## Test Suite Overview
- **Runner**: Node.js automated test runner at `scripts/validate-missions.mjs` & `scripts/test-event-bus.mjs`
- **Standard Command**: `npm test`
- **Missions Validation**: `npm run test:missions` (or `node scripts/validate-missions.mjs`)
- **EventBus & Engine Validation**: `npm run test:events` (or `node scripts/test-event-bus.mjs`)
- **Continuous Integration**: GitHub Actions CI workflow at `.github/workflows/ci.yml`
- **TypeScript Compiler Check**: `npm run build` / `npx tsc --noEmit`

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

---

## Running the Automated Test Suite

### Full Test Suite (Missions + EventBus)
```bash
npm test
```

### Validate All Missions
```bash
npm run test:missions
```

### Validate a Single Mission (During Authoring)
```bash
node scripts/validate-missions.mjs --mission 001
node scripts/validate-missions.mjs --mission 010
```

### Validate EventBus & Domain Engine Decoupling
```bash
npm run test:events
```

---

## Current Verification Results

- **Published Missions (001–009)**: **423/423 assertions PASSED (100%)**
- **Domain Event Loop**: **5/5 event flow phases PASSED (100%)**
- **Next.js Production Build**: **9/9 static & dynamic routes compiled with 0 errors**
