# NEXUS Academy — System Architecture & Technical Specification

> **Version:** 1.0.0 (Production Reference)  
> **Target Audience:** Anthropic Claude for Open Source Review Team, System Architects, Core Maintainers, Pedagogical Engineers  
> **License:** GNU Affero General Public License v3.0 (AGPLv3)

---

## Table of Contents
1. [Section 1 — Architectural Principles](#section-1--architectural-principles)
2. [Section 2 — System Overview & High-Level Architecture](#section-2--system-overview--high-level-architecture)
3. [Section 3 — Pyodide WASM Execution Harness](#section-3--pyodide-wasm-execution-harness)
4. [Section 4 — EventBus & Domain Event Catalog (23 Events)](#section-4--eventbus--domain-event-catalog-23-events)
   - [Section 4a: EventBus Design Rules](#section-4a-eventbus-design-rules)
   - [Section 4b: Two-Phase Mission Completion Flow](#section-4b-two-phase-mission-completion-flow)
   - [Section 4c: Complete 23 Domain Event Catalog](#section-4c-complete-23-domain-event-catalog)
5. [Section 5 — Storage Architecture, DataService & Safe Persistence](#section-5--storage-architecture-dataservice--safe-persistence)
6. [Section 6 — Closed-World Invariant & AST Confinement (Rule 24)](#section-6--closed-world-invariant--ast-confinement-rule-24)
7. [Section 7 — Understanding Engine & XP Progression](#section-7--understanding-engine--xp-progression)
8. [Section 8 — Spaced Repetition Engine (SuperMemo SM-2)](#section-8--spaced-repetition-engine-supermemo-sm-2)
9. [Section 9 — Mission Data Anatomy, Dynamic Steps & Corruption Recovery](#section-9--mission-data-anatomy-dynamic-steps--corruption-recovery)
10. [Section 10 — 4-Layer Dependency Rules & Architectural Invariants](#section-10--4-layer-dependency-rules--architectural-invariants)
11. [Section 11 — Type System, Mission State Machine & Schema Migration](#section-11--type-system-mission-state-machine--schema-migration)
12. [Section 12 — Test Architecture & Quality Gates](#section-12--test-architecture--quality-gates)

---

<a id="section-1--architectural-principles"></a>

## Section 1 — Architectural Principles

NEXUS Academy is engineered as a client-side computer science learning laboratory for 250+ million Bengali speakers (*SIL Ethnologue*, 2024). The architecture satisfies eight foundational non-negotiable principles:

1. **Zero Server Compute ($0 Infrastructure Cost):** Python execution, AST analysis, scoring, and spaced repetition run entirely inside the learner's browser. No cloud execution containers, no server GPUs, and zero per-learner operating costs.
2. **Privacy-First & Zero Telemetry:** Student code submissions, quiz responses, diagnostic logs, and learning schedules remain strictly in client-side storage. No tracking pixels, external database sync, or learner data exposure.
3. **Strict Separation of Concerns (4-Layer Model):** Presentation, hooks/actions API, domain engines, and storage services maintain impenetrable boundaries. Domain engines never import UI components.
4. **Decoupled Asynchronous Event Bus:** All inter-engine communication occurs through typed domain events. Engines never call each other directly; maximum event chain depth is capped at 3 levels.
5. **Closed-World Scope Invariant (Rule 24):** No unearned syntax is ever presented to a learner. Starter code and practice exercises are compiled against an AST visitor that rejects unintroduced Python features at build and test time.
6. **Domain-Appropriate Fault Hunting (Rule 21):** Debugging challenges replicate authentic runtime errors from real software engineering rather than artificial syntax puzzles.
7. **B2B AI Agency Context (Rule 22):** Software concepts are taught through junior engineer tasks at *Nexus AI*, building real solutions across rotating client industries (FinTech, HealthTech, AgriTech, GovTech, Smart Grid).
8. **Defensive Local Persistence:** Storage writes are isolated, namespaced, schema-versioned, and guarded against private browsing quota errors with automatic corrupt-state recovery.

---

<a id="section-2--system-overview--high-level-architecture"></a>

## Section 2 — System Overview & High-Level Architecture

The platform runs as a Single Page Application (Next.js 16 App Router) where the browser serves as the complete runtime environment:

```
+-----------------------------------------------------------------------------------------+
|                                    BROWSER RUNTIME                                      |
+-----------------------------------------------------------------------------------------+
| [Layer 1: Presentation Layer] (React 19, Tailwind CSS v4, shadcn/ui)                   |
|   ├── Monaco Code Editor (VS Code core running in-browser)                              |
|   ├── StepRenderer Registry (13 pedagogical step components)                           |
|   └── Dashboard, Concept Drawer, Dictionary & SRS Review HUD                           |
+-----------------------------------------------------------------------------------------+
                                        │ invokes
                                        ▼
+-----------------------------------------------------------------------------------------+
| [Layer 2: API Adapter Layer] (React Hooks & Server Actions)                             |
|   ├── useMissionProgress, usePyodide, useDictionarySearch, useSettings                  |
|   └── Actions dispatching user intent to Domain Engines                                 |
+-----------------------------------------------------------------------------------------+
                                        │ dispatches / reads
                                        ▼
+-----------------------------------------------------------------------------------------+
| [Layer 3: Domain Engine Layer] (Pure TypeScript — Zero UI Dependencies)                 |
|   ├── EventBus (Synchronous typed pub/sub; async microtask upgrade path)               |
|   ├── UnderstandingEngine (Dynamic multi-factor score calculator)                       |
|   ├── XPEngine (Level progression & reward logic)                                       |
|   ├── SpacedRepetitionService (SuperMemo SM-2 interval scheduler)                       |
|   ├── KnowledgeGraphService (DAG prerequisite resolver & unlock engine)                 |
|   └── PythonEngine (Pyodide worker proxy & stdin/stdout stream coordinator)             |
+-----------------------------------------------------------------------------------------+
                    │ publishes/subscribes                │ persists state
                    ▼                                     ▼
+------------------------------------+  +------------------------------------------------+
| Web Worker Thread (CPython 3.12)   |  | [Layer 4: Storage Layer] (DataService Abstr.)  |
|   ├── Pyodide WebAssembly Engine   |  |   ├── LocalStorageDataService (V1 Client)      |
|   ├── Python 3.12 AST Compiler     |  |   ├── StorageService (Namespaced safe wrapper) |
|   └── Virtual IO Streams           |  |   └── MigrationService (Schema version upgrades|
+------------------------------------+  +------------------------------------------------+
```

---

<a id="section-3--pyodide-wasm-execution-harness"></a>

## Section 3 — Pyodide WASM Execution Harness

### 3.1 Off-Main-Thread Web Worker Isolation
Code execution runs inside a dedicated Web Worker executing CPython 3.12 compiled to WebAssembly via Pyodide. Isolating Python execution off the main UI thread guarantees:
- Smooth 60 FPS UI rendering during computation.
- Protection against CPU-intensive learner loops freezing the browser tab.
- Sandboxed runtime environment with zero access to browser cookies, DOM, or local session tokens.

### 3.2 Virtual I/O & Interactive Input Emulation
The worker exposes custom virtual I/O stream bindings:
- **Standard Output (`stdout`)**: Captured via a custom stream writer and flushed to the terminal UI with ANSI code styling.
- **Standard Error (`stderr`)**: Intercepted and routed through the Contextual Error Diagnostics Engine for localized Bengali diagnosis.
- **Interactive Input (`stdin`)**: Synchronous `input()` calls in Python are managed via atomic synchronization primitives or message-passing queues, allowing learners to submit values interactively.

### 3.3 Execution Timeout & Sandbox Memory Guard
Every execution cycle is wrapped in a configurable timeout guard (default: 10,000ms). If code execution exceeds the boundary, the worker terminates gracefully and restarts without state contamination.

---

<a id="section-4--eventbus--domain-event-catalog-23-events"></a>

## Section 4 — EventBus & Domain Event Catalog (23 Events)

### Section 4a: EventBus Design Rules
*Source of Truth: `engines/events/EventBus.ts` and `engines/events/events.types.ts`*

The `EventBus` is the central nervous system of NEXUS Academy. It decouples business engines and enforces the following architectural rules:
1. **Zero Business Logic:** The `EventBus` is a pure pub/sub dispatcher. It never modifies payloads, inspects business state, or performs side effects.
2. **Maximum Event Chain Depth = 3 Levels (Rule 6):** An event may trigger a handler that emits a secondary event, which may emit a tertiary event. Event chains exceeding 3 levels are prohibited to prevent cascading feedback cycles and debugging opacity.
3. **No Self-Referential Subscription Loops:** `AchievementService` must **not** subscribe to `ACHIEVEMENT_UNLOCKED`. Engines must never listen to events they emit if that emission could trigger another cycle.
4. **Single Emitter Authority for Mission Completion:** **Only `UnderstandingEngine` may emit `MISSION_COMPLETED`**. No other engine, UI component, or hook may emit this event.
5. **Singleton Lifecycle:** The EventBus operates as a module-level singleton surviving React re-renders. Every call to `subscribe()` returns an explicit `unsubscribe()` function that must be invoked during component teardown (`useEffect` cleanup).
6. **Async Upgrade Path (V2):** In V1, dispatch is synchronous for deterministic debugging and testing. In V2, the dispatch loop can be switched to `queueMicrotask()` without changing any subscriber interface.

---

### Section 4b: Two-Phase Mission Completion Flow
*Source of Truth: `engines/understanding/UnderstandingEngine.ts` and `engines/events/events.types.ts:155`*

To prevent race conditions between progress tracking, score calculation, XP awards, and prerequisite unlocking, mission completion is split into two deterministic phases:

```
[Learner finishes final step]
         │
         ▼
[ProgressEngine]
   Emits: MISSION_COMPLETING (Phase 1)
         │
         ├─────────────────────────────────────────────┐
         ▼                                             ▼
[UnderstandingEngine] (ONLY subscriber to Phase 1)   [Other engines IGNORE Phase 1]
   1. Reads step evidence from DataService
   2. Normalizes component weights:
      - Quiz: 40%
      - Debug Challenge: 25%
      - Practice: 20%
      - Reflection: 10%
      - Hint Economy: 5%
   3. Computes Understanding Score (0–100)
   4. Emits: MISSION_COMPLETED (Phase 2)
         │
         ├───────────────────────┬───────────────────────┬───────────────────────┐
         ▼                       ▼                       ▼                       ▼
    [XPEngine]       [KnowledgeGraphService]   [SpacedRepetition]     [AchievementService]
  Awards Base XP       Evaluates DAG &          Schedules SM-2          Checks Milestone
   + Score Bonus      Unlocks Next Mission       Review Card              Achievements
```

- **Phase 1 (`MISSION_COMPLETING`)**: Emitted exclusively by `ProgressEngine`. Only `UnderstandingEngine` listens to this event.
- **Phase 2 (`MISSION_COMPLETED`)**: Emitted exclusively by `UnderstandingEngine`. All downstream engines (`XPEngine`, `KnowledgeGraphService`, `SpacedRepetitionService`, `AchievementService`, UI notifiers) subscribe to this event.

---

### Section 4c: Complete 23 Domain Event Catalog
*Source of Truth: `engines/events/events.types.ts`*

| # | Event Type | Emitted By | Primary Payload Contract | Subscribing Engines / Consumers |
|:---|:---|:---|:---|:---|
| 1 | `STEP_COMPLETED` | `ProgressEngine` | `{ missionId, stepIndex, stepType, timeSpentMs, timestamp }` | `ProgressEngine`, `AnalyticsEngine`, `AchievementService` |
| 2 | `QUIZ_PASSED` | `QuizStepRenderer` / Hook | `{ missionId, score, attemptNumber, totalQuestions, correctAnswers, timestamp }` | `UnderstandingEngine`, `XPEngine`, `LearningMemoryService` |
| 3 | `QUIZ_FAILED` | `QuizStepRenderer` / Hook | `{ missionId, score, attemptNumber, totalQuestions, correctAnswers, timestamp }` | `LearningMemoryService`, `AnalyticsEngine` |
| 4 | `QUIZ_ATTEMPTED` | `QuizStepRenderer` / Hook | `{ missionId, questionIndex, selectedOptionIndex, isCorrect, timestamp }` | `LearningMemoryService`, `AnalyticsEngine` |
| 5 | `PRACTICE_COMPLETED` | `PracticeStepRenderer` | `{ missionId, attempts, timeSpentMs, codeLength, timestamp }` | `UnderstandingEngine`, `XPEngine` |
| 6 | `PRACTICE_SKIPPED` | `PracticeStepRenderer` | `{ missionId, reason, timestamp }` | `AnalyticsEngine` |
| 7 | `DEBUG_SOLVED` | `DebugStepRenderer` | `{ missionId, attempts, hintsUsed, timeSpentMs, bugType, timestamp }` | `UnderstandingEngine`, `XPEngine`, `AchievementService` |
| 8 | `DEBUG_ATTEMPTED` | `DebugStepRenderer` | `{ missionId, attemptNumber, errorCode, userCode, timestamp }` | `LearningMemoryService`, `AnalyticsEngine` |
| 9 | `HINT_USED` | `HintDrawer` / Hook | `{ missionId, stepIndex, hintIndex, totalHintsAvailable, timestamp }` | `UnderstandingEngine`, `AnalyticsEngine` |
| 10 | `REFLECTION_COMPLETED`| `ReflectionRenderer` | `{ missionId, responseLength, rating, timestamp }` | `UnderstandingEngine`, `XPEngine` |
| 11 | `MISSION_COMPLETING` | `ProgressEngine` | `{ missionId, hasQuiz, hasPractice, hasDebug, hasReflection, timestamp }` | `UnderstandingEngine` (Exclusive) |
| 12 | `MISSION_COMPLETED` | `UnderstandingEngine` | `{ missionId, score, breakdown, totalTimeSpentMs, timestamp }` | `XPEngine`, `KnowledgeGraphService`, `SpacedRepetitionService`, `AchievementService`, UI |
| 13 | `MISSION_UNLOCKED` | `KnowledgeGraphService`| `{ missionId, unlockedByMissionId, timestamp }` | `NotificationService`, Dashboard UI |
| 14 | `LEVEL_UP` | `XPEngine` | `{ previousLevel, newLevel, newLevelName, totalXP, timestamp }` | TopNavbar, SoundService, Notification Modal |
| 15 | `ACHIEVEMENT_UNLOCKED`| `AchievementService` | `{ achievementId, title, xpReward, timestamp }` | `XPEngine`, Toast Notification UI |
| 16 | `REVIEW_SCHEDULED` | `SpacedRepetition` | `{ missionId, intervalDays, scheduledFor, timestamp }` | LocalStorage, Spaced Repetition HUD |
| 17 | `REVIEW_COMPLETED` | `SpacedRepetition` | `{ missionId, performanceRating, nextIntervalDays, scheduledFor, timestamp }` | `SpacedRepetitionService`, `XPEngine` |
| 18 | `STREAK_UPDATED` | `ProgressEngine` | `{ currentStreak, longestStreak, lastActiveDate, timestamp }` | TopNavbar, Dashboard, `AchievementService` |
| 19 | `STREAK_BROKEN` | `ProgressEngine` | `{ previousStreak, brokenOnDate, timestamp }` | Notification Modal, `AnalyticsEngine` |
| 20 | `DICTIONARY_TERM_VIEWED`| `DictionaryViewer` | `{ termId, query, timestamp }` | `LearningMemoryService`, `AnalyticsEngine` |
| 21 | `SESSION_STARTED` | `AppInitializer` | `{ sessionId, date, timestamp }` | `ProgressEngine`, `AnalyticsEngine` |
| 22 | `SESSION_ENDED` | `WindowEventListener` | `{ sessionId, totalTimeSpentMs, missionsWorkedOn, timestamp }` | `ProgressEngine`, LocalStorage |
| 23 | `CODE_EXECUTED` | `PythonEngine` | `{ code, executionTimeMs, success, errorType, timestamp }` | `AnalyticsEngine`, `LearningMemoryService` |

---

<a id="section-5--storage-architecture-dataservice--safe-persistence"></a>

## Section 5 — Storage Architecture, DataService & Safe Persistence

*Source of Truth: `services/DataService.ts`, `services/StorageService.ts`, and `services/MigrationService.ts`*

### 5.1 Storage Abstraction Interface (`DataService`)
No UI component or domain engine may touch `localStorage` directly. All data access is mediated by the `DataService` interface:
```typescript
export interface DataService {
  getProgress(): LearnerProgress | null;
  saveProgress(progress: LearnerProgress): void;
  getActiveStep?(missionId: string): number;
  saveActiveStep?(missionId: string, stepIndex: number): void;
  getMemory(): LearningMemory;
  saveMemory(memory: LearningMemory): void;
  getReviewSchedule(): ReviewItem[];
  saveReviewSchedule(schedule: ReviewItem[]): void;
  getCurrentSession(): StudySession | null;
  saveSession(session: StudySession): void;
  clearCurrentSession(): void;
  getDictionaryEntries(): DictionaryEntry[];
  getDictionaryProgress(): LearnerDictionaryProgress;
  saveDictionaryProgress(progress: LearnerDictionaryProgress): void;
}
```
- **V1 Implementation**: `LocalStorageDataService` saves data to browser `localStorage`.
- **V2 Upgrade Path**: Can be swapped to `ApiDataService` or `SupabaseDataService` without altering any domain engines or UI components.

### 5.2 Namespaced Storage Wrapper (`StorageService`)
Keys are prefixed with `nexus_` to avoid conflicts:
- `nexus_progress`: Learner mission completion, step status, total XP, current streak.
- `nexus_memory`: Misconceptions, repeated error patterns, vocabulary lookups.
- `nexus_review_schedule`: SM-2 spaced repetition items.
- `nexus_current_session`: Active session metadata.
- `nexus_settings`: Theme preference, editor layout, dev options.

All read and write operations are wrapped in `try/catch` to handle iOS Safari private mode quota restrictions and disabled storage.

### 5.3 LocalStorage Corruption Recovery Standard
*Source of Truth: `services/StorageService.ts:67`*
If stored JSON cannot be parsed or exhibits corruption:
1. `storageBackupAndClear(key)` copies the corrupted string to a timestamped key: `${key}_backup_${Date.now()}`.
2. The corrupt primary key is purged from active storage.
3. Fresh default state (`createDefaultProgress()`) is initialized.
4. User progress is never silently lost; backup keys can be extracted via the Settings panel for forensic data recovery.

---

<a id="section-6--closed-world-invariant--ast-confinement-rule-24"></a>

## Section 6 — Closed-World Invariant & AST Confinement (Rule 24)

### 6.1 The Single Concept Law
Every mission introduces exactly **one** computational primitive (`newConceptCount: 1`). Pedagogical progression strictly adheres to the Closed-World Invariant:
$$\text{Scope}(M_N) = \left( \bigcup_{i=1}^{N-1} \text{Concepts}(M_i) \right) \cup \{ \text{Concept}(M_N) \}$$
Learners are never subjected to unearned syntax. For example:
- Missions 001–013 prohibit conditional branching (`if`, `else`, `elif`).
- Missions 001–017 prohibit loop statements (`for`, `while`).
- Missions 001–026 prohibit function definitions (`def`).
- Missions 001–031 prohibit dictionaries and mappings.

### 6.2 Python 3.12 AST Node Visitor Pipeline
During automated test runs (`scripts/validate-missions.mjs` and `scripts/test-curriculum-pipeline.mjs`), all starter code, solutions, and debugging fixed code snippets are parsed into Python AST trees (`ast.parse`) using native Python 3.12. An AST Node Visitor recursively inspects nodes:
```python
class ClosedWorldScopeVisitor(ast.NodeVisitor):
    def __init__(self, forbidden_syntax):
        self.forbidden_syntax = set(forbidden_syntax)
        self.violations = []

    def visit_For(self, node):
        if "for" in self.forbidden_syntax:
            self.violations.append((node.lineno, "For loop untaught"))
        self.generic_visit(node)

    def visit_FunctionDef(self, node):
        if "def" in self.forbidden_syntax:
            self.violations.append((node.lineno, "Function definition untaught"))
        self.generic_visit(node)
```
Any violation halts test execution with exit code 2, preventing unearned concepts from slipping into production curriculum releases.

---

<a id="section-7--understanding-engine--xp-progression"></a>

## Section 7 — Understanding Engine & XP Progression

### 7.1 Understanding Score Formula
The Understanding Score ($U \in [0, 100]$) is an objective, multi-factor evaluation of genuine cognitive comprehension rather than simple completion. When all steps are present, weights are distributed as:
$$U = w_{\text{quiz}} \cdot S_{\text{quiz}} + w_{\text{debug}} \cdot S_{\text{debug}} + w_{\text{practice}} \cdot S_{\text{practice}} + w_{\text{reflection}} \cdot S_{\text{reflection}} + w_{\text{hints}} \cdot S_{\text{hints}}$$

Baseline Weights:
- **Quiz Score ($w_{\text{quiz}} = 0.40$)**: First-attempt quiz score percentage.
- **Debug Challenge ($w_{\text{debug}} = 0.25$)**: Fault detection without revealing solutions.
- **Practice Challenge ($w_{\text{practice}} = 0.20$)**: Accurate code implementation passing all assertions.
- **Critical Thinking Reflection ($w_{\text{reflection}} = 0.10$)**: Evaluated response depth.
- **Hint Economy ($w_{\text{hints}} = 0.05$)**: Full score when no hints are consumed ($100 - 25 \times \text{hintsUsed}$).

*Dynamic Normalization:* If a mission omits specific steps (e.g. Capstone missions omitting standard quizzes), weights dynamically normalize so the sum of active weights equals $1.0$.

### 7.2 XP Progression
- **Base Mission Completion:** 100 XP
- **Understanding Multiplier:** $\text{Score} \times 1.5$ XP
- **First-Try Debug Bonus:** 50 XP
- **Streak Bonus:** $+10\%$ per consecutive day (capped at $+50\%$)
- **Level Calculation:** Levels follow quadratic scaling:
  $$\text{Level} = \left\lfloor \sqrt{\frac{\text{Total XP}}{100}} \right\rfloor + 1$$

---

<a id="section-8--spaced-repetition-engine-supermemo-sm-2"></a>

## Section 8 — Spaced Repetition Engine (SuperMemo SM-2)

NEXUS Academy embeds an active retention schedule using the SuperMemo SM-2 algorithm:

```
                  [Review Completed with Quality q in 0..5]
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
                 q >= 3                           q < 3
             (Successful)                       (Failed)
                     │                               │
       ┌─────────────┴─────────────┐                 │
       ▼                           ▼                 ▼
 Repetition n = 1            Repetition n > 1     Repetition n = 0
  Interval I_1 = 1 day        I_n = I_{n-1} * EF    Interval I = 1 day
 (Repetition n = 2: 6 days)   Update EF             EF unchanged
```

1. **Easiness Factor Update:**
   $$EF' = EF + (0.1 - (5 - q) \cdot (0.08 + (5 - q) \cdot 0.02))$$
   *Constraint:* $EF' \ge 1.30$.
2. **Interval Calculation:**
   $$I(n) = \begin{cases} 1 & \text{if } n = 1 \\ 6 & \text{if } n = 2 \\ I(n-1) \cdot EF & \text{if } n > 2 \end{cases}$$
3. **Failure Reset:** When quality $q < 3$, repetition count $n$ resets to 0 and the next review interval defaults to 1 day.

---

<a id="section-9--mission-data-anatomy-dynamic-steps--corruption-recovery"></a>

## Section 9 — Mission Data Anatomy, Dynamic Steps & Corruption Recovery

### 9.1 The 13-Step Pedagogical Anatomy
Each standard mission follows an intentional progression curve moving from concrete intuition to formal engineering:
1. `intro`: Real-world pain point and clear capability statement.
2. `story`: Junior software engineer narrative at *Nexus AI* (Rule 22).
3. `analogy`: Physical, culturally resonant metaphor for South Asian learners.
4. `concept`: First-principles theory explained in clear, natural Bangla.
5. `visualization`: Memory box, stack trace, or state transition diagram.
6. `code_example`: Minimal, runnable Python 3.12 demonstration.
7. `eee_example`: Electrical engineering, microchip, or hardware sensor linkage.
8. `ai_example`: Connection to neural networks, LLMs, or autonomous AI agents.
9. `practice`: In-browser Monaco editor code exercise with test evaluation.
10. `quiz`: Multi-question conceptual verification.
11. `debug_challenge`: Realistic faulty code snippet to diagnose and fix (Rule 21).
12. `reflection`: Critical Thinking Lab (CTL) prompt analyzing architectural trade-offs.
13. `mission_complete`: Final score summary, XP reward, and next mission bridge.

### 9.2 Rule 20: Dynamic Step Flexibility
While the 13-step sequence represents the standard foundation, Rule 20 permits missions to adapt step counts between **10 and 25 steps** based on cognitive load requirements. Capstone integration missions expand practice and debug steps while compressing introductory analogies.

### 9.3 Storage Corruption & Session Recovery Standard
*Source of Truth: `services/StorageService.ts:67` and [Section 5.3](#section-5--storage-architecture-dataservice--safe-persistence)*

When learner progress, mission step state, or session markers loaded from `localStorage` fail JSON schema validation or exhibit byte-level corruption:
1. **Zero Data Loss:** `storageBackupAndClear(key)` copies the corrupted string to a timestamped backup key (`${key}_backup_${Date.now()}`) before any state modification occurs.
2. **Safe Fallback:** The active key is cleared and re-initialized with standard default state (`createDefaultProgress()`).
3. **Session Preservation:** Active mission step pointers fall back to the highest completed valid step (`step_X`) or step 0, preventing runtime white screens.
4. **Forensics:** Corrupt backup keys are preserved in client storage and can be inspected or exported via the Settings panel for developer diagnosis.

---

<a id="section-10--4-layer-dependency-rules--architectural-invariants"></a>

## Section 10 — 4-Layer Dependency Rules & Architectural Invariants

To guarantee modularity, testability, and clean separation, the codebase enforces strict one-way dependency rules:

```
[Layer 1: Presentation Layer] (app/, components/)
               │ depends on
               ▼
[Layer 2: Hooks & Actions API] (hooks/, actions/)
               │ depends on
               ▼
[Layer 3: Domain Engine Layer] (engines/)
               │ depends on
               ▼
[Layer 4: Storage & Data Services] (services/, types/)
```

### Inviolable Invariants:
1. **Engines NEVER import from UI:** Code in `engines/` must never import from `components/` or `app/`.
2. **Storage Services NEVER import from Engines:** Code in `services/` must never import from `engines/`.
3. **No Circular Dependencies:** A module in Layer $N$ may only import from Layer $N$ or Layer $>N$.
4. **All Cross-Engine Communication via Events:** An engine in `engines/xp` must never call a function in `engines/understanding`. It must publish or subscribe to typed events via `EventBus`.

---

<a id="section-11--type-system-mission-state-machine--schema-migration"></a>

## Section 11 — Type System, Mission State Machine & Schema Migration

*Source of Truth: `types/common.types.ts:22` and `services/MigrationService.ts`*

### 11.1 The One-Directional Mission State Machine
Missions transition through a strict, irreversible lifecycle:
$$\mathbf{locked} \longrightarrow \mathbf{unlocked} \longrightarrow \mathbf{in\_progress} \longrightarrow \mathbf{complete}$$

```
                Prerequisites Passed in DAG
   [locked] ──────────────────────────────────> [unlocked]
                                                    │
                                                    │ Learner opens step 0/1
                                                    ▼
   [complete] <─────────────────────────────── [in_progress]
               UnderstandingEngine emits
                   MISSION_COMPLETED
```

#### State Transition Rules:
1. **`locked` ➔ `unlocked`:** Triggered when all prerequisite missions defined in `manifest.json` have reached `status: 'complete'`.
2. **`unlocked` ➔ `in_progress`:** Triggered immediately when the learner starts any step in an unlocked mission.
3. **`in_progress` ➔ `complete`:** Triggered **only** when `UnderstandingEngine` emits `MISSION_COMPLETED`.
4. **No Reverse Transitions Permitted:**
   - Once marked `complete`, reviewing earlier steps or re-running code **must never** regress the mission back to `in_progress`.
   - Once marked `unlocked`, a mission cannot revert to `locked`.
   - Regression prevention is verified by automated test assertions in `scripts/test-step-persistence.mjs`.

### 11.2 Schema Versioning & Sequential Migrations
All persisted objects contain an internal `_schemaVersion` integer tag:
- **Current Version:** `CURRENT_PROGRESS_SCHEMA_VERSION = 1`.
- When `MigrationService.migrateProgress(raw)` detects `_schemaVersion < 1`, it executes `migrateV0ToV1()`, ensuring all required arrays (`unlockedAchievements`, `recentSessions`) and metadata fields exist.
- Migrations are append-only. Past migration steps are permanently preserved to ensure legacy learner states are never corrupted.

---

<a id="section-12--test-architecture--quality-gates"></a>

## Section 12 — Test Architecture & Quality Gates

The test architecture ensures zero runtime failures, zero untaught syntax leaks, and zero state regression:

### 12.1 4-Tier Validation Hierarchy
1. **Tier 1 (Schema & Metadata Integrity):** Validates JSON syntax, schema types, estimated cognitive loads, and mandatory curiosity fields across all missions.
2. **Tier 2 (Pedagogy & Step Structure):** Validates the presence of required step sequences, quiz option counts, debug hint ladders, and reflection prompts.
3. **Tier 3 (Python AST Compilation):** Executes Python 3.12 native `ast.parse` over every code example, starter template, solution, and debug fix snippet to guarantee syntax validity.
4. **Tier 4 (Dependency Graph & Scope Containment):** Evaluates the prerequisite DAG and executes the Rule 24 Closed-World AST walker to trap unearned syntax leaks.

### 12.2 Automated Continuous Integration Gate
The complete test suite runs via `npm test` and GitHub Actions CI:
- **7 Test Suites:** 1,640+ automated assertions passing at 100%.
- **Compiler Check:** Strict TypeScript compilation with 0 errors (`npx tsc --noEmit`).
- **Production Build:** Static and dynamic route generation via Next.js 16 App Router compiler.
