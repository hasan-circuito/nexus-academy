# E2E Test Infra: Nexus Academy Missions 006–010

## Test Philosophy
- Opaque-box, requirement-driven validation derived strictly from `ORIGINAL_REQUEST.md`, `MISSION_ENGINEERING_SPEC.md`, and `types/mission.types.ts`.
- Methodology: 4-Tier verification hierarchy (Tier 1: Feature & Schema Coverage, Tier 2: Boundary & Corner Cases, Tier 3: Cross-Mission Progression & Dependency Consistency, Tier 4: Real-World Learner Simulation & Pyodide Code Execution).

## Feature Inventory & Test Mapping
| # | Feature | Requirement Source | Tier 1 (Schema & Format) | Tier 2 (Boundary & Anti-Concepts) | Tier 3 (Progression Chain) | Tier 4 (Interactive Learner Run) |
|---|---------|-------------------|:------------------------:|:---------------------------------:|:--------------------------:|:--------------------------------:|
| 1 | Mission 006 (Arithmetic) | ORIGINAL_REQUEST §29-32 | 5 test checks | 5 boundary checks | ✓ | ✓ |
| 2 | Mission 007 (User Input) | ORIGINAL_REQUEST §33-37 | 5 test checks | 5 boundary checks | ✓ | ✓ |
| 3 | Mission 008 (Division Secrets) | ORIGINAL_REQUEST §38-42 | 5 test checks | 5 boundary checks | ✓ | ✓ |
| 4 | Mission 009 (Math Rules) | ORIGINAL_REQUEST §43-46 | 5 test checks | 5 boundary checks | ✓ | ✓ |
| 5 | Mission 010 (Updating Values) | ORIGINAL_REQUEST §47-53 | 5 test checks | 5 boundary checks | ✓ | ✓ |

## Test Architecture
- **Runner**: Node.js automated test runner & verification script.
- **Verification Dimensions**:
  1. JSON Syntactic Validity (`JSON.parse` across all files).
  2. TypeScript Schema Compliance (`types/mission.types.ts` via `tsc --noEmit` and runtime property check).
  3. Step Structure & Integrity (exactly 13 steps in valid order).
  4. Forbidden Concepts & Anti-Pattern AST/Regex Scanner.
  5. Cognitive Load & Readability Checks.
  6. Code Validation & Solution Execution (executing Python solutions and verifying against expected outputs / validation rules).
  7. Progressive Debugging & Hint Ladder Completeness.
  8. Critical Thinking Lab Structure (3 questions, 4 layers each).

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full Learner Journey 005 → 010 | All 5 missions in sequential progression | High |
| 2 | Python Execution in Pyodide | Starter code, solutions, and fixed code run without runtime syntax crash | High |
| 3 | Validation Engine Stress Test | `smart_output_source` correctly detects hardcoding and missing variables | Medium |
| 4 | Bengali Linguistic Quality & Typographic Integrity | Natural phrasing, clean punctuation, no encoding corruption | High |
| 5 | Progressive Debugging Experience | Learner solves bug levels 1, 2, 3 with informative error feedback | High |

## Coverage Thresholds
- Tier 1: ≥5 checks per mission (25 total)
- Tier 2: ≥5 boundary/anti-concept checks per mission (25 total)
- Tier 3: Pairwise cross-mission dependency checks (5 major transitions)
- Tier 4: ≥5 end-to-end execution scenarios
- **Total Minimum Target: ~60 test assertions**
