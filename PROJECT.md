# Project: Nexus Academy — Engineering & Curriculum Roadmap

## Architecture
- **Repository Architecture**: Next.js 16 + TypeScript educational platform with Pyodide WebAssembly Python execution engine.
- **Content System**: Static JSON mission definitions in `data/missions/mission-XXX.json` loaded via `services/ContentService.ts` and tracked in `data/missions/manifest.json`.
- **Validation Engine**: `engines/python/ValidationEngine.ts` and automated E2E curriculum pipeline test suite in `scripts/validate-missions.mjs` and `scripts/test-curriculum-pipeline.mjs`.
- **Learner Chain**: Sequential single-concept progression (5-Phase Curriculum, 120–150+ missions).
- **Mission Step Standard**: Dynamic Step Flexibility (Rule 20, 10–25 steps depending on cognitive complexity) featuring Domain-Appropriate & Hidden State Debugging (Rule 21), B2B AI Agency narrative framework (Rule 22), and Closed-World Scope Boundaries (Rule 24).

## Current Milestone Status (Phase 1: Foundation)
| # | Mission | Title & Concept | Status | Verification |
|---|---------|-----------------|--------|--------------|
| 1 | M001 | Software Memory and Variables (`print`, variables) | Published | Passed |
| 2 | M002 | Using Software Memory (variable reading & display) | Published | Passed |
| 3 | M003 | When Memory Changes (variable reassignment) | Published | Passed |
| 4 | M004 | When Information Has a Type (String vs Integer) | Published | Passed |
| 5 | M005 | When Information Must Change Form (`int()`, `str()`) | Published | Passed |
| 6 | M006 | The Assignment Pipeline (`=`, `+`, `-`, `*`) | Published | Passed |
| 7 | M007 | When Numbers Have Decimals (`/`, `float`, `ZeroDivisionError`) | Published | Passed |
| 8 | M008 | The Listening Software (`input()`, string capture) | Published | Passed |
| 9 | M009 | Dynamic Math (`int(input())`, `ValueError`, `TypeError`) | Published | Passed |
| 10 | M010 | The Sentence Slot / বাক্যের শূন্যস্থান (`f-strings`, dynamic output) | Published | Passed |
| 11 | M011 | The Software Switch / সফটওয়্যারের সুইচ (`bool`, `True`/`False` literals) | Published | Passed |
| 12 | M012 | The Scales of Memory / মেমোরির দাঁড়িপাল্লা (`==`, `!=`, `<`, `>`, `<=`, `>=`) | Published | Passed |
| 13 | M013 | The Decision Tree (`if` statements, branching logic) | Next Sprint | Ready for Design |

## Active Governance Standards
- **Rule 19 (5-Phase Architecture)**: Foundation (001–025) → Builder (026–050) → Engineer (051–075) → Data & ML (076–100) → Professional (101–150+).
- **Rule 20 (Dynamic Step Flexibility)**: Abolished rigid 13-step constraint; step count adapts to cognitive requirements (10–25 steps).
- **Rule 21 (Domain-Appropriate Debugging & Hidden State Bug Standard)**: Debug challenges must never spoon-feed errors. State mutations apply to state missions; non-state missions debug domain-appropriate bugs directly tied to primary capability.
- **Rule 22 (B2B AI Agency Framework)**: Scenarios reflect real-world junior developer tasks at "Nexus AI" across diverse rotating industry clients.
- **Rule 24 (The Closed-World Invariant & Scope Boundary)**: Strict single evaluated capability (`newConceptCount: 1`). Mission $N$ can only evaluate concepts taught in missions 1 to $N-1$ and the current capability. 3-step concept dependency filter prevents cognitive overload and rejects unearned internal CS/runtime abstractions.

## Documentation Authority Map
No single document is the authority for every task. When documents disagree, consult the canonical authority for the domain:
- **Project State & Frozen Architecture**: `PROJECT_MEMORY.md` and current code implementation.
- **Mission Design & Pedagogy**: `docs/engineering/MISSION_ENGINEERING_SPEC.md`.
- **Critical Thinking Content**: `docs/engineering/Critical Thinking Lab .md`.
- **AI Decision & Escalation Behavior**: `docs/engineering/Nexus AI Decision & Collaboration Framework (NADF).md`.
- **Data Shapes & Schema**: `types/`, mission JSON files, and `scripts/validate-missions.mjs`.
- **Planned Curriculum Direction**: `docs/curriculum/CURRICULUM_ROADMAP.md` (aspirational planning reference).
