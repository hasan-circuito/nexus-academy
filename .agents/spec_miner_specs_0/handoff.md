# Specification Mining Report — Nexus Academy Mission System

**Agent**: `spec_miner_specs_0`  
**Working Directory**: `B:\nexus-academy\.agents\spec_miner_specs_0`  
**Date**: 2026-08-28T10:35:00Z  

---

## Executive Summary

This report documents the structural, schema, architectural, pedagogical, and validation specifications of the Nexus Academy mission system. The findings are extracted directly from authoritative codebase sources: `types/mission.types.ts`, `types/common.types.ts`, `types/progress.types.ts`, `docs/engineering/MISSION_ENGINEERING_SPEC.md`, `docs/engineering/13-mission-authoring-playbook.md`, `docs/engineering/Critical Thinking Lab .md`, `PROJECT_MEMORY.md`, `data/missions/manifest.json`, `services/ContentService.ts`, and `engines/python/ValidationEngine.ts`.

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Data Schema | `MissionData` Root Object | Top-level schema defining a mission file | `id`, `title`, `banglaTitle`, `banglaSubtitle`, `cognitiveLoadEstimate`, `curiosity`, `steps` | Structured mission JSON | Schema validation error if required fields or steps are missing | `types/mission.types.ts:45-53` |
| 2 | Data Schema | `CognitiveLoadEstimate` | Metadata measuring pedagogical weight | `readingLevel` (1-5), `newConceptCount`, `practiceComplexity` (1-3), `estimatedTotalMinutes` | Object in `MissionData` | Type mismatch if out of numeric union bounds | `types/mission.types.ts:55-60` |
| 3 | Data Schema | `CuriosityBlock` | Mandatory 6-field hook block on mission root | `didYouKnow`, `realWorldApplication`, `aiApplication`, `eeeApplication`, `historicalFact`, `nextMissionPreview` (all Bangla strings) | Rendered in Mission Complete and curiosity engine | Required on root — cannot be omitted | `types/mission.types.ts:62-69` |
| 4 | Step Schema | `IntroStep` (type: 'intro') | First step introducing mission problem & goals | `missionNumber`, `title`, `banglaTitle`, `tagline`, `description`, `learningObjectives` (3-5 strings), `estimatedMinutes` | Header, objectives, tagline | Render fallback if fields missing | `types/mission.types.ts:76-85` |
| 5 | Step Schema | `StoryStep` (type: 'story') | Real-world narrative framing limitation | `title`, `setting`, `content` (<=300 words Bangla), `moral` (1-sentence takeaway), optional `characterName` | Story card component | None | `types/mission.types.ts:88-95` |
| 6 | Step Schema | `AnalogyStep` (type: 'analogy') | Real-world vs Python mental model bridge | `title`, `realWorld` (`label`, `description`, `icon`), `pythonConcept` (`label`, `description`, `icon`), `connection`, optional `deeperInsight` | Dual-box comparison with Lucide icons | Renders default icon if unrecognized | `types/mission.types.ts:98-106`, `AnalogyStep.tsx` |
| 7 | Step Schema | `ConceptStep` (type: 'concept') | Core technical explanation | `title`, `content` (<=250 words Bangla), `keyPoints` (3-5 items), `whyCallout` (WhyCallout box), `whenToUse`, `whenNotToUse`, optional `commonMisconception` | Explanatory text & structured callouts | None | `types/mission.types.ts:114-124` |
| 8 | Step Schema | `VisualizationStep` (type: 'visualization') | Diagrammatic concept visualization | `title`, `description`, `visualizationType` (enum), `data` (`steps`, `pairs`, or `items`), `caption` | Interactive/diagrammatic UI (flow, KV, icon grid) | Falls back to generic key-value renderer | `types/mission.types.ts:126-136`, `VisualizationStep.tsx` |
| 9 | Step Schema | `CodeExampleStep` (type: 'code_example') | Read-only annotated Python code | `title`, `explanation`, `language: 'python'`, `code`, `output`, `annotations` (`lineNumber`, `explanation`), optional `postExplanation` | Syntax-highlighted code with line annotations | None | `types/mission.types.ts:139-154` |
| 10 | Step Schema | `EEEExampleStep` (type: 'eee_example') | Hardware/circuits perspective | `title`, `context`, `hardware`, `domain` (`EEEDomain`), `code`, `output`, `explanation`, optional `realDeviceNote` | EEE card with MicroPython/Arduino sample | None | `types/mission.types.ts:156-167` |
| 11 | Step Schema | `AIExampleStep` (type: 'ai_example') | AI/ML application perspective | `title`, `context`, `aiDomain` (`AIDomain`), `code`, `output`, `explanation`, optional `realWorldModel` | AI card with ML context | None | `types/mission.types.ts:169-179` |
| 12 | Step Schema | `PracticeStep` (type: 'practice') | Interactive code writing exercise | `title`, `prompt`, optional `starterCode`, `hints` (string[]), optional `displayHint`, optional `expectedOutput`, optional `validation` (`ValidationConfig`), `solution`, `solutionExplanation` | Monaco editor + Pyodide execution + automated feedback | Runtime error message or regex mismatch feedback | `types/mission.types.ts:205-216`, `PracticeStep.tsx` |
| 13 | Validation Engine | `ValidationConfig` & Strategies | Automated source & output code validation | `type`: `exact_output`, `contains_output`, `regex_output`, `any_non_empty_output`, `regex_source`, `smart_output_source`; `requiredVariables`, `requiredPatterns`, `forbiddenPatterns`, `feedbackMessages` | `EvaluationResult` (`passed`, `score`, `message`, `diffExpected`, `diffActual`) | Catches hardcoded values, missing variables, pattern failures | `types/mission.types.ts:181-203`, `ValidationEngine.ts` |
| 14 | Step Schema | `QuizStep` (type: 'quiz') | Formative MCQ / True-False assessment | `title`, `instructions`, `passingScore` (0-100), `questions` (`id`, `questionType`, `question`, `difficulty`, `options`, `correctOptionIndex`, `explanation`) | Step-by-step interactive quiz UI | Red error indicator on wrong answer, retries supported | `types/mission.types.ts:219-238`, `QuizStep.tsx` |
| 15 | Step Schema | `DebugChallengeStep` (type: 'debug_challenge') | Interactive bug fixing exercise | `title`, `scenario`, `buggyCode`, `errorMessage`, `bugLine` (1-indexed), `bugType` (`syntax`, `logic`, `runtime`, `indentation`, `naming`), `hints` (1-3 items), `fixedCode`, `explanation` | Monaco editor with error banner & line highlight | Error output until bug is resolved | `types/mission.types.ts:240-253`, `DebugChallengeStep.tsx` |
| 16 | Step Schema | `ReflectionStep` (type: 'reflection') | Critical Thinking Lab / Socratic reflection | `title`, `instruction`, optional `prompts` (3 strings), optional `criticalThinkingQuestions` (Q1-Q3/Q4 items with `expertThinking`, `realWorldEngineering`, `beyondProgramming`), optional `endScreen` | Accordion interactive lab with 3-layer revelation | "I have thought" gate required before revealing answers | `types/mission.types.ts:254-276`, `ReflectionStep.tsx` |
| 17 | Step Schema | `MissionCompleteStep` (type: 'mission_complete') | Final mission wrap-up & recap | `title`, `summary`, `keyLearnings` (3-5 strings) | Celebration screen + XP award trigger | None | `types/mission.types.ts:279-285`, `MissionCompleteStep.tsx` |
| 18 | Storage & Loading | `ContentService` | Static module-based JSON mission loader | `missionId` (e.g. "006" or "mission-006") | Returns typed `MissionData` or throws | Throws `Failed to load mission ${missionId}` if missing | `services/ContentService.ts:13-48` |
| 19 | Index Manifest | `MissionIndexEntry` / `manifest.json` | Catalog of all curriculum missions | `id`, `title`, `banglaTitle`, `banglaSubtitle`, `status`, `prerequisite`, `primaryConcept`, `estimatedMinutes`, `difficulty` | Dashboard mission cards, graph traversal | None | `data/missions/manifest.json`, `index.json` |
| 20 | Engine Layer | `UnderstandingEngine` & Scoring | Computes composite comprehension score | `quiz` (0.40), `debug` (0.25), `practice` (0.20), `reflection` (0.10), `hints` (0.05) | 0-100 Understanding Score | Weak topic if <60, Mastery if >=90 | `PROJECT_MEMORY.md:117-122`, `UnderstandingEngine.ts` |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | `ValidationEngine` (`smart_output_source`) | Learner prints hardcoded number instead of using variable | Checks `forbiddenPatterns` and `requiredVariables`; triggers `onHardcoded` feedback: *"আউটপুট ঠিক আছে! কিন্তু চালাকি ধরা পড়েছে 😄! ভেরিয়েবল ব্যবহার করো..."* |
| 2 | `ValidationEngine` (`regex_source`) | Learner writes code with variable whitespace / indentation | Normalizes source code via `replace(/\s+/g, ' ')` when `ignoreWhitespace: true`, tolerating formatting variations. |
| 3 | `PracticeStep` | Mission has multiple `practice` steps | Step uses `step.title` as local storage key for code persistence to prevent cross-step overwrite. |
| 4 | `DebugChallengeStep` | Learner submits code with runtime errors remaining | `result.success` is false or `result.stderr` is present; editor shows error output, prevents `DEBUG_SOLVED` event emit. |
| 5 | `DebugChallengeStep` hints | Learner clicks reveal hint multiple times | `hintIndex` increments from 0 up to `step.hints.length` (max 3), penalizing the `hintsUsed` score component. |
| 6 | `ReflectionStep` (Critical Thinking Lab) | Learner attempts to finish without thinking | "Complete Lab" button remains hidden until every question's "আমি চিন্তা করেছি, উত্তর দেখাও!" button has been clicked (`completedThoughts.size === questions.length`). |
| 7 | `ContentService` getMissionData | String ID passed as `"mission-006"` or `"006"` | Normalizes ID via `missionId.replace('mission-', '')`, checks `missions` dictionary, unwraps `.default` if ES module wrapped. |
| 8 | Step count in dynamic routes | Mission has 13 steps vs legacy 17 steps | `app/mission/[missionId]/step/[stepIndex]/page.tsx` guards with `index >= missionData.steps.length` returning 404, dynamically supporting step array length. |
| 9 | Quiz scoring | Learner scores below `passingScore` (e.g. < 70%) | Displays warning banner with "Needs Review" status and retry encouragement. |
| 10 | Type casting in Python | `int("50")` vs `int("score")` | Generates `ValueError: invalid literal for int() with base 10` in Python execution; debug challenges specifically isolate this error type. |

---

## Detailed Specification Findings

### 1. TypeScript Contracts & Schema Architecture (`types/mission.types.ts`, `common.types.ts`)

#### Top-level `MissionData` Interface
```typescript
export interface MissionData {
  id: string;                          // e.g. "006" (3-digit zero-padded string)
  title: string;                       // English title (e.g. "Basic Arithmetic")
  banglaTitle: string;                 // Bangla title (e.g. "কম্পিউটারকে দিয়ে গণিত করানো")
  banglaSubtitle: string;              // Bangla subtitle
  cognitiveLoadEstimate: CognitiveLoadEstimate;
  curiosity: CuriosityBlock;           // Required on root
  steps: MissionStep[];               // Exactly 13 steps
}
```

#### Cognitive Load & Curiosity Contracts
- `CognitiveLoadEstimate`:
  - `readingLevel`: `1 | 2 | 3 | 4 | 5` (1 = very easy, 5 = very hard)
  - `newConceptCount`: `number` (Strictly 1 for single-concept missions)
  - `practiceComplexity`: `1 | 2 | 3` (1 = trivial, 2 = moderate, 3 = complex)
  - `estimatedTotalMinutes`: `number` (typically 18–30 mins)
- `CuriosityBlock` (All 6 fields mandatory, natural Bangla):
  - `didYouKnow`: string
  - `realWorldApplication`: string
  - `aiApplication`: string
  - `eeeApplication`: string
  - `historicalFact`: string
  - `nextMissionPreview`: string

#### Step Schemas & Discriminants
The step system supports 13 step types discriminated by `step.type`:
1. `intro`: `missionNumber`, `title`, `banglaTitle`, `tagline`, `description`, `learningObjectives` (3-5 strings), `estimatedMinutes`.
2. `story`: `title`, `setting`, `content` (<=300 words), `moral`, optional `characterName`.
3. `analogy`: `title`, `realWorld` (`AnalogyItem`), `pythonConcept` (`AnalogyItem`), `connection`, optional `deeperInsight`.
4. `concept`: `title`, `content` (<=250 words), `keyPoints` (3-5 strings), `whyCallout`, `whenToUse`, `whenNotToUse`, optional `commonMisconception`.
5. `visualization`: `title`, `description`, `visualizationType` (`execution_flow` | `flow_diagram` | `memory_diagram` | `comparison` | `hierarchy` | `timeline` | `relationship`), `data`, `caption`.
6. `code_example`: `title`, `explanation`, `language: 'python'`, `code`, `output`, `annotations` (`CodeAnnotation[]`), optional `postExplanation`.
7. `eee_example`: `title`, `context`, `hardware`, `domain` (`EEEDomain`), `code`, `output`, `explanation`, optional `realDeviceNote`.
8. `ai_example`: `title`, `context`, `aiDomain` (`AIDomain`), `code`, `output`, `explanation`, optional `realWorldModel`.
9. `practice`: `title`, `prompt`, optional `starterCode`, `hints` (string[]), optional `displayHint`, optional `expectedOutput`, optional `validation` (`ValidationConfig`), `solution`, `solutionExplanation`.
10. `quiz`: `title`, `instructions`, `passingScore` (0-100), `questions` (`QuizQuestion[]`).
11. `debug_challenge`: `title`, `scenario`, `buggyCode`, `errorMessage`, `bugLine` (1-indexed), `bugType` (`syntax` | `logic` | `runtime` | `indentation` | `naming`), `hints` (1-3 strings), `fixedCode`, `explanation`.
12. `reflection`: `title`, `instruction`, optional `prompts` (3 strings), optional `criticalThinkingQuestions` (`CriticalThinkingQuestion[]`), optional `endScreen`.
13. `mission_complete`: `title`, `summary`, `keyLearnings` (3-5 strings).

---

### 2. Scaffolded Mission Layout (Gold Standard Reference from Missions 004 & 005)

Analysis of `data/missions/mission-004.json` and `mission-005.json` reveals the **Scaffolded 13-Step Structure**:
- **Step 0**: `intro`
- **Step 1**: `story`
- **Step 2**: `analogy`
- **Step 3**: `concept`
- **Step 4**: `code_example`
- **Step 5**: `practice` (1st Practice: Guided / Recognition)
- **Step 6**: `practice` (2nd Practice: Independent / Application)
- **Step 7**: `practice` or `quiz` (3rd Practice: Edge-case / Two-way or Quiz)
- **Step 8**: `quiz` or `debug_challenge` (Quiz or 1st Bug: Simple syntax/typo)
- **Step 9**: `debug_challenge` (2nd Bug: Logical / Missing element / Tricky)
- **Step 10**: `debug_challenge` (3rd Bug: Complex / Misconception / Trapping quote)
- **Step 11**: `reflection` (Critical Thinking Lab with 3 deep engineering questions: Q1 Why it exists, Q2 Domain spotlight, Q3 Failure mode)
- **Step 12**: `mission_complete` (Recap & Key Learnings)
- **Total Step Count**: Exactly 13 steps.

---

### 3. Engineering & Pedagogical Principles (`MISSION_ENGINEERING_SPEC.md`, `13-mission-authoring-playbook.md`)

1. **Problem Before Concept**: Never start with "Today we will learn X". The learner must first experience a genuine problem/limitation before the syntax or concept is introduced.
2. **One Major Concept Per Mission**: Strictly one new mental model. No introducing multiple independent concepts.
3. **No Hidden Dependencies**: A mission must only depend on concepts mastered in previous missions.
4. **Scaffolded Practice**: Practice must follow: Guided → Independent → Edge Case / Challenge.
5. **Progressive Debugging Ladder**:
   - Bug 1: Simple syntax/function name mistake.
   - Bug 2: Intermediate logic/type error.
   - Bug 3: Subtle misconception or edge-case error.
6. **Critical Thinking Lab (Reflection)**:
   - Q1 (Why): Connects to the human/engineering problem.
   - Q2 (Where): Domain spotlight (EEE, AI, Web, Systems).
   - Q3 (Failure): Real engineering failure/disaster mode.
   - Each question includes: `question`, `expertThinking` (deep 2-4 paragraph reasoning), `realWorldEngineering` (concrete industrial example), `beyondProgramming` (transferable life/engineering principle).
7. **Bengali Language Standards**:
   - Natural, conversational, high-quality Bengali.
   - English technical terms kept intact or transliterated clearly (e.g. `String`, `Integer`, `input()`, `int()`, `str()`).
   - Pure Python code syntax without character corruption.

---

### 4. Verified Progression for Missions 006–010 (`ORIGINAL_REQUEST.md`)

| Mission | English Title | Bengali Title | Core Capability | Forbidden Concepts (Do NOT use) |
|---|---|---|---|---|
| **006** | Basic Arithmetic | কম্পিউটারকে দিয়ে গণিত করানো | `+`, `-`, `*`, `/` | No `//`, `%`, `input()`, conditionals, loops, or reassignment |
| **007** | User Input | কম্পিউটারকে শুনতে শেখানো | `input()` (with previously mastered `int()` and arithmetic) | No `float()`, complex parsing, conditionals, loops |
| **008** | Division Secrets | ভাগের আসল রহস্য | `//` (floor division) and `%` (modulus) | No `if/else`, logical operators, or loops |
| **009** | Math Rules | হিসাবের নিয়ম ও বন্ধনী | Operator precedence (BODMAS/PEMDAS) and parentheses `()` | No new operators, conditionals, logical operators, loops |
| **010** | Updating Values | মেমোরির মান আপডেট করা | Variable reassignment, state mutation (evaluates right side first, assigns to left), `+=` shorthand | No loops or conditionals |

---

### 5. Validation Tooling & Verification Mechanisms

1. **Node.js JSON Parsing**: Validate all mission JSON files for valid JSON syntax and UTF-8 encoding.
2. **TypeScript Schema Check**: `tsc --noEmit` verifies interface conformance against `types/mission.types.ts`.
3. **Validation Strategy Execution**:
   - `smart_output_source`: Checks `requiredVariables`, `requiredPatterns`, `forbiddenPatterns`, and `feedbackMessages`.
   - `regex_source`: Checks source code structure via regex with whitespace normalization.
   - `exact_output`: Compares normalized output strings.
4. **Step Page Routing Guard**: `app/mission/[missionId]/step/[stepIndex]/page.tsx` loads via `ContentService.getMissionData` and dynamically renders all steps using `StepRegistry`.

---

## 5-Component Handoff Report

### 1. Observation
- `types/mission.types.ts` defines `MissionData` (lines 45–53) with mandatory `id`, `title`, `banglaTitle`, `banglaSubtitle`, `cognitiveLoadEstimate`, `curiosity`, and `steps`.
- `MissionData.steps` is a union of 13 step types (`IntroStep`, `StoryStep`, `AnalogyStep`, `ConceptStep`, `VisualizationStep`, `CodeExampleStep`, `EEEExampleStep`, `AIExampleStep`, `PracticeStep`, `QuizStep`, `DebugChallengeStep`, `ReflectionStep`, `MissionCompleteStep`).
- `mission-004.json` and `mission-005.json` establish the production-verified 13-step scaffolded format featuring 2–3 `practice` steps, 3 `debug_challenge` steps, and a 3-question `CriticalThinkingQuestion` array inside `reflection`.
- `data/missions/manifest.json` and `package.json` exist; `ContentService.ts` statically imports `mission-001.json` through `mission-010.json`.
- Running `npx tsc --noEmit` executed cleanly with exit code 0.

### 2. Logic Chain
1. The curriculum requires Missions 006–010 to follow the exact Verified Progression: 006 (Basic Arithmetic), 007 (User Input), 008 (Division Secrets), 009 (Math Rules), 010 (Updating Values).
2. Existing placeholder files (`mission-006.json` through `mission-010.json`) had 17 steps and followed an obsolete unverified progression.
3. Conforming to `types/mission.types.ts` and following the structural pattern of `mission-004.json` and `mission-005.json` guarantees strict schema compliance, 13-step consistency, zero TypeScript errors, and zero runtime crashes.
4. Implementing `smart_output_source` validation configurations with `requiredVariables`, `requiredPatterns`, and `feedbackMessages` ensures robust automated code grading in Monaco Editor/Pyodide.

### 3. Caveats
- No new schema fields should be added outside `types/mission.types.ts`.
- `displayHint` or `expectedOutput` should be strings, not objects.
- `hints` arrays in `debug_challenge` must have 1 to 3 items.
- All learner-facing strings must be in natural, accurate Bengali.

### 4. Conclusion
All schema, structural, engineering, and pedagogical specifications have been extracted and documented. The authoring constraints for Missions 006–010 are clearly defined, fully verified against repository types and runtime engines, and ready for clean generation.

### 5. Verification Method
1. Run Node.js JSON validation script across `data/missions/mission-006.json` to `mission-010.json`.
2. Run `npx tsc --noEmit` from repository root to confirm 0 TypeScript compiler errors.
3. Validate each mission step count (`steps.length === 13`) and confirm presence of all required fields (`curiosity`, `cognitiveLoadEstimate`, `reflection.criticalThinkingQuestions`).
