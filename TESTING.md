# Testing & Quality Assurance Specification

> **Status:** Authoritative Test Documentation  
> **Total Automated Test Assertions:** **1,640 passing at 100%**  
> **Test Breakdown:** 1,189 foundational mission & schema assertions + 451 engine, error diagnostics, settings safety, and curriculum pipeline assertions  
> **Continuous Integration:** GitHub Actions (`.github/workflows/ci.yml`)

---

## 1. Quality Assurance Philosophy

In NEXUS Academy, automated testing is not an afterthought—it is an **impenetrable pedagogical gate**. Because our platform teaches novice programmers in South Asia without human tutoring presence, any software runtime exception or unearned syntax leak causes immediate learner demoralization and abandonment.

Every line of student code, example snippet, domain event transition, and state migration is validated through automated test harnesses before release.

---

## 2. The 7 Specialized Validation Suites

The platform is guarded by **7 specialized automated test suites**:

| Suite | Script File | Target Subsystem | Assertions / Tests | Pass Rate |
|:---|:---|:---|:---:|:---:|
| **1. Mission Schema & Pedagogy** | `scripts/validate-missions.mjs` | 14 published missions (M001–M014), MES schemas, curiosity blocks, native Python 3.12 AST compilation | **745 assertions** | **100%** |
| **2. Decoupled EventBus & Lifecycle** | `scripts/test-event-bus.mjs` | 23 domain events, two-phase completion (`MISSION_COMPLETING` ➔ `MISSION_COMPLETED`), XP/SRS fan-out | **6 phases** | **100%** |
| **3. Dictionary Problem-Solving Hub** | `scripts/validate-dictionary.mjs` | 20 CS concept entries, bilingual search terms, symptom resolution, cross-references | **628 assertions** | **100%** |
| **4. Contextual Error Diagnostics** | `scripts/test-error-diagnostics.mjs` | 15 beginner micro-error patterns (e.g. quoted variables, missing colons, indentation) with exact Bengali fixes | **44 assertions** | **100%** |
| **5. Settings & Dev Mode Safety** | `scripts/test-settings.mjs` | Monaco theme synchronization, localStorage backup, export, import, and danger-zone resets | **22 tests** | **100%** |
| **6. Curriculum Pipeline & AST Walker** | `scripts/test-curriculum-pipeline.mjs` | Preflight contracts, prerequisite DAG, CLI flag flexibility, Rule 24 AST forbidden syntax walker, scaffold skeletons | **170 tests** | **100%** |
| **7. Step Persistence & Resume Safety** | `scripts/test-step-persistence.mjs` | Idempotent step saving, key normalization, variable-length mission progress, state regression prevention | **25 tests** | **100%** |
| **TOTAL** | | | **1,640 assertions** | **100%** |

---

## 3. Running the Test Suites

### 3.1 Full Test Suite (1,640 Assertions)
To run all 7 test suites sequentially:
```bash
npm test
```

### 3.2 Individual Test Suites
```bash
# 1. Mission schema, pedagogy & AST compilation
npm run test:missions

# 2. EventBus decoupling & domain event lifecycle
npm run test:events

# 3. Dictionary & symptom keyword validator
npm run test:dictionary

# 4. Contextual error diagnostics engine
npm run test:diagnostics

# 5. Settings, themes & localStorage safety
npm run test:settings

# 6. Curriculum pipeline & AST forbidden syntax walker
npm run test:pipeline

# 7. Step persistence & resume safety
npm run test:persistence
```

### 3.3 Target Mission Validation (During Authoring)
To validate a single mission without running the entire suite:
```bash
# Validating Mission 014
node scripts/validate-missions.mjs 014
# Or using flag:
node scripts/validate-missions.mjs --mission 014
```

### 3.4 Curriculum Authoring CLI Tools
```bash
# Run preflight checks on a newly authored mission
npm run mission:preflight 014

# Scaffold a new mission skeleton conforming to Rule 24
npm run mission:scaffold 015

# Validate all missions via curriculum pipeline
npm run mission:validate
```

### 3.5 Type System & Production Build
```bash
# Strict TypeScript compiler verification (0 errors required)
npx tsc --noEmit

# Next.js App Router production build
npm run build
```

---

## 4. The 4-Tier Validation Hierarchy

Our automated mission validator (`scripts/validate-missions.mjs`) operates across four distinct validation tiers:

### Tier 1: Schema & Metadata Integrity
- **JSON Validity:** Parses static JSON files cleanly with UTF-8 byte integrity.
- **Header Alignment:** Ensures `id`, `title`, `banglaTitle`, and `banglaSubtitle` align precisely with `manifest.json`.
- **Cognitive Metrics:** Enforces valid `readingLevel` (1–5), `practiceComplexity` (≥1), and non-zero `estimatedTotalMinutes`.
- **Curiosity Block (Mandatory 6 Fields):** Enforces non-empty values for:
  1. `didYouKnow`
  2. `realWorldApplication`
  3. `aiApplication`
  4. `eeeApplication`
  5. `historicalFact`
  6. `nextMissionPreview`

### Tier 2: Step Structure & Pedagogy Integrity
- **Required Sequence:** Confirms presence of foundational steps (`intro`, `concept`, `mission_complete`).
- **Quiz Integrity:** Enforces passing score bounds (50–100), questions with ≥2 options, and valid `correctOptionIndex`.
- **Practice Exercises:** Verifies instructions, initial starter code, and verified working solution.
- **Debug Challenges (Rule 21):** Validates buggy code, fixed code, and progressive 3-tier hint ladders.
- **Critical Thinking Reflection:** Validates reflection questions in Critical Thinking Lab (CTL) format.

### Tier 3: Native Python 3.12 AST Compilation
- Every Python snippet embedded in our curriculum JSON files is executed against native Python 3.12 `ast.parse`:
  - `code_example.code`
  - `practice.starterCode`
  - `practice.solution`
  - `debug_challenge.fixedCode`
- Guarantees that no learner ever receives a broken code snippet or syntax error caused by curriculum authoring mistakes.

### Tier 4: Dependency Graph & Closed-World Confinement (Rule 24)
- **DAG Integrity:** Validates that all prerequisites in `manifest.json` resolve to published, passing missions.
- **AST Forbidden Syntax Walker:** Analyzes Python AST node types to catch unearned syntax (e.g. loops before M018, functions before M027). Any unearned syntax immediately exits with code 2.

---

## 5. Continuous Integration (GitHub Actions)

Our CI workflow (`.github/workflows/ci.yml`) executes on every `push` and `pull_request` targeting `main`:
1. Checks out repository source.
2. Configures Node.js 20 environment with npm caching.
3. Sets up Python 3.12 runtime.
4. Executes clean install via `npm ci`.
5. Runs the full automated test suite via `npm test` (1,640 assertions).
6. Compiles Next.js production build (`npm run build`).

A PR cannot be merged unless all 1,640 assertions pass and Next.js builds with 0 errors.
