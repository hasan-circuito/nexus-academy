# Project: Nexus Academy — Engineering & Curriculum Roadmap

## Architecture
- **Repository Architecture**: Next.js 14 + TypeScript educational platform with Pyodide WebAssembly Python execution engine.
- **Content System**: Static JSON mission definitions in `data/missions/mission-XXX.json` loaded via `services/ContentService.ts` and tracked in `data/missions/manifest.json`.
- **Validation Engine**: `engines/python/ValidationEngine.ts` and automated E2E test suite in `scripts/validate-missions.js`.
- **Learner Chain**: Sequential single-concept progression (5-Phase Curriculum, 120–150+ missions).
- **Mission Step Standard**: Dynamic Step Flexibility (Rule 20, 10–25 steps depending on cognitive complexity) featuring Hidden State Debugging (Rule 21) and the B2B AI Agency narrative framework (Rule 22).

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
| 10 | M010 | String Formatting (`f-strings`, dynamic output) | Next Sprint | Ready for Design |

## Active Governance Standards
- **Rule 19 (5-Phase Architecture)**: Foundation (001–025) → Builder (026–050) → Engineer (051–075) → Data & ML (076–100) → Professional (101–150+).
- **Rule 20 (Dynamic Step Flexibility)**: Abolished rigid 13-step constraint; step count adapts to cognitive requirements (10–25 steps).
- **Rule 21 (Hidden State Bug Standard)**: Debug challenges must never spoon-feed errors; bugs must arise from dynamic logical state flow.
- **Rule 22 (B2B AI Agency Framework)**: Scenarios reflect real-world junior developer tasks at "Nexus AI" across diverse industry clients.
