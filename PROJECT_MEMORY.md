# PROJECT_MEMORY.md

**Version**: 1.0 | **Architecture**: Frozen | **Stack**: Next.js App Router · TypeScript · Tailwind CSS · shadcn/ui

---

## Project Vision

NEXUS Academy is a personal AI-powered Python learning platform in Bangla. Its purpose is genuine understanding — not syntax memorization. Every feature must improve learning. One learner (EEE student), no backend in V1, localStorage only. Content is JSON-driven. UI language is English; lesson content is Bangla.

---

## Architecture — Four Layers (Strict Dependency Rules)

```
UI Layer → Engine API Layer → Engine Layer → Storage Layer
                                  ↕
                              Event Bus
```

| From | May Call | May NOT Call |
|---|---|---|
| UI | Engine API (hooks, server actions) | Engines, Storage |
| Engine API | Engines, Storage | UI |
| Engines | Storage, Event Bus | UI, Engine API, other Engines |
| Storage | Nothing (leaf) | Everything |
| Event Bus | Nothing (passive relay) | Everything |

**Engines never call each other.** They communicate only via the Event Bus.

---

## Folder Structure

```
nexus-academy/
├── app/                    # Next.js App Router pages
│   ├── dashboard/
│   ├── mission/[missionId]/step/[stepIndex]/
│   ├── dictionary/
│   ├── progress/
│   ├── settings/
│   └── about/
├── components/             # UI Layer
│   ├── layout/             # Sidebar, TopBar
│   ├── dashboard/          # Dashboard cards
│   ├── mission/            # Mission header, navigation
│   ├── steps/              # 13 step renderers + StepRenderer registry
│   ├── shared/             # WhyCallout, CodeBlock, ErrorBoundary, etc.
│   └── ui/                 # shadcn/ui primitives
├── engines/                # Engine Layer (NO UI imports)
│   ├── events/             # EventBus + event types (21 events)
│   ├── xp/                 # XPEngine
│   ├── understanding/      # UnderstandingEngine
│   ├── analytics/          # AnalyticsEngine
│   ├── knowledge-graph/    # KnowledgeGraphService
│   ├── adaptive/           # AdaptiveLearningService (V1 stub)
│   ├── memory/             # LearningMemoryService
│   ├── retention/          # SpacedRepetitionService (SM-2)
│   ├── curiosity/          # CuriosityEngine
│   ├── cognitive-load/     # CognitiveLoadService (V1 stub)
│   ├── progress/           # ProgressEngine
│   ├── goal/               # GoalService (V1: static, 3 steps/day)
│   └── achievements/       # AchievementService
├── hooks/                  # Engine API — client hooks
├── actions/                # Engine API — server actions
├── services/               # Storage Layer
│   ├── DataService.ts      # Interface (V2: swap to API)
│   ├── LocalStorageDataService.ts
│   ├── StorageService.ts   # Safe localStorage wrapper
│   ├── MigrationService.ts # Schema versioning
│   └── ContentService.ts   # Mission JSON loader
├── types/                  # Shared TypeScript types
├── data/missions/          # Static JSON content
└── data/                   # dictionary.json, achievements.json
```

---

## Engine Boundaries

| Engine | Owns | Does NOT Do |
|---|---|---|
| ProgressEngine | Step completion, STEP_COMPLETED events, MISSION_COMPLETING, streak updates, MissionStatus transitions | Score, XP, reviews, unlocks |
| UnderstandingEngine | Understanding Score formula, MISSION_COMPLETED (only emitter) | XP, reviews |
| XPEngine | XP awarding, level computation, LEVEL_UP | Scoring, unlocks |
| AchievementService | Achievement checks, ACHIEVEMENT_UNLOCKED | Must NOT subscribe to own events |
| KnowledgeGraphService | Mission unlock via prerequisites, MISSION_UNLOCKED | Scoring |
| SpacedRepetitionService | Review scheduling (SM-2), REVIEW_SCHEDULED | Scoring |
| LearningMemoryService | Weak topics, missed questions, memory compaction | Scoring, UI |
| GoalService | Today's goal (read-only query, no events) | State writes |
| CuriosityEngine | Format curiosity block for display (pure transformer) | State |

**Two-phase mission completion**: ProgressEngine emits `MISSION_COMPLETING` → UnderstandingEngine computes score → emits `MISSION_COMPLETED`. Max event chain depth: 3 levels.

---

## Missions — 13 Fixed Steps (Every Mission)

`intro → story → analogy → concept → visualization → code_example → eee_example → ai_example → practice → quiz → debug_challenge → reflection → mission_complete`

Content is Bangla. `CuriosityBlock` is mandatory on every mission root. Steps rendered via registry pattern (no switch statements).

---

## Scoring (SCORING_SYSTEM.md)

**Understanding Score** = `(quiz×0.40 + debug×0.25 + practice×0.20 + reflection×0.10 + hints×0.05) × 100`

- Pass: ≥ 50. Weak topic flag: < 60. Deep understanding: ≥ 90.
- Quiz attempt multiplier: 1st=1.0, 2nd=0.90, 3rd+=0.80.
- Computed by UnderstandingEngine only.

**XP**: Max 400/mission. First-completion only. Anti-exploit: no revisit XP, no failed quiz XP, one streak XP per day.

**Levels**: `XP = 50 × N × (N−1)`. 10 levels (শিক্ষার্থী → গুরু). Level 10 at 4500 XP.

**Streak**: Calendar date (YYYY-MM-DD), not datetime. Streak Shield at 7-day milestone (one forgiven day/month).

**Spaced Repetition**: SM-2 in V1. Pre-loaded intervals: [1,3,7,14,30,90] days. FSRS in V2.

---

## UI Principles (UI_UX_SYSTEM.md)

Dark theme first. Design: minimal, premium, focused. Inspiration: Linear, Notion, Vercel. The interface should disappear — learner focuses on learning.

**Fonts**: Inter (UI), Noto Sans Bengali (body/Bangla), Hind Siliguri (UI labels/Bangla), JetBrains Mono (code). Icons: Lucide.

Focus Mode: sidebar collapses on step routes. Level-up notifications: non-blocking toast, deferred if mid-step.

---

## Data Persistence

All storage through `DataService` interface. V1: localStorage (namespaced `nexus_`). `_schemaVersion` on every persisted object. `MigrationService` runs on startup. Corrupt data backed up before reset.

Key schemas: `LearnerProgress`, `LearningMemory` (separate key), `ReviewItem[]`, `StudySession`. `StepProgress.hintsUsed` is canonical for scoring (not `DebugAttempt.hintsUsedInThisAttempt`). `unlockedAchievements[]` checked before awarding.

---

## Coding Rules

- One sprint at a time. Never skip order.
- Never modify frozen architecture.
- Never hardcode lesson content.
- Business logic outside UI. Engines never import UI.
- Single responsibility. Composition over inheritance.
- Strong typing. No magic numbers. No dead code.
- Every file has clear ownership (one layer only).
- `import 'server-only'` on server-only files.

---

## Sprint Workflow

Plan → Implement → Self-Review → Test → Validate → Document → **Wait for approval** → Next sprint.

**Quality Gates**: Build passes. Zero TS errors. Zero ESLint errors. Responsive verified. Architecture compliant. Documentation compliant.

**10 Sprints**: Foundation → Dashboard → Mission Navigation → Step Rendering → Learning Engine → Scoring & Progress → Dictionary → Persistence → UI Polish → Testing & Release.

---

## Non-Negotiable Constraints

1. Architecture is frozen. No changes without explicit approval.
2. ARCHITECTURE.md is authoritative for engine names and boundaries.
3. SCORING_SYSTEM.md is authoritative for all formulas.
4. DATA_SCHEMA.md is authoritative for all data structures.
5. Understanding Score computed in one place only: UnderstandingEngine.
6. Only UnderstandingEngine may emit MISSION_COMPLETED.
7. AchievementService must NOT subscribe to ACHIEVEMENT_UNLOCKED.
8. Event chain max depth: 3 levels.
9. Reflection is binary in V1. AI Mentor.
10. Python execution uses Pyodide (WASM) lazily-loaded. Must use Monaco Editor. `PythonEngine` handles execution, `PythonErrorInterpreter` handles errors using `python-errors.json`, `OutputComparator` compares outputs. Emits `CODE_EXECUTED` domain event to support Open/Closed Principle for future AI/Analytics engines.
