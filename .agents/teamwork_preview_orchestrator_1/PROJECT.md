# Project: Curriculum Dependency & Mission Boundary Audit

## Architecture
Analysis-only audit framework evaluating Nexus Academy's Python curriculum progression:
- Verified Baseline State: Missions 001 - 005
- Boundary & Dependency Evaluation: Proposed Missions 006 - 010
- Pedagogical Framework: `docs/engineering/MISSION_ENGINEERING_SPEC.md` (The Core Law, Rules 9–18) & `PROJECT_MEMORY.md`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Survey & Mining | Analyze Reference Specs, Memory, Types, Manifest, and Missions 001-005 JSONs | none | IN_PROGRESS |
| M2 | Synthesis & Report | Answer 7 core analysis questions, evaluate M006-M010 with structured metrics, flag design problems | M1 | PLANNED |
| M3 | Verification & Audit | Multi-agent verification (Reviewers, Challenger, Auditor) | M2 | PLANNED |

## Feature / Question Inventory
| # | Item | Focus | Status |
|---|------|-------|--------|
| Q1 | Core Law & Pedagogical Principles | Rules 9-18, the Core Law, concept emergence | M1 -> M2 |
| Q2 | Verified Baseline (M001-M005) | Introduced, practiced, mastered vs unestablished concepts | M1 -> M2 |
| Q3 | Hidden Dependencies in M006 | What dangerous dependencies exist before M006 | M1 -> M2 |
| Q4 | Mission Boundary Sizing (M006-M010) | Where boundaries are too broad or too narrow | M1 -> M2 |
| Q5 | Cognitive Overload & Leaks Analysis | Detailed leak and overload audit per mission | M1 -> M2 |
| Q6 | Proposed Mission Evaluations | Full 7-part evaluation per M006-M010 (Starting cap, New cap, Prereqs, Leaks, Overload, Boundary, Verdict) | M1 -> M2 |
| Q7 | Curriculum Redesign Recommendations | Concrete restructuring plan for M006-M010 | M1 -> M2 |
