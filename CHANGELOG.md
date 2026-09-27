# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.0] - 2026-09-27

### Added
- **14 Published Missions**: Authored, validated, and published Mission 013 (*Nexus Progress Report* capstone) and Mission 014 (*When Software Takes One Path* `if`-statement introduction), achieving 745/745 passing mission assertions.
- **Step Persistence & Resume Suite**: Automated test suite (`scripts/test-step-persistence.mjs`) featuring 25 tests verifying idempotent step navigation, variable-length mission progress calculation, and cross-session resume banners.
- **Curriculum Pipeline & AST Walker**: Complete CLI tooling suite (`scripts/curriculum-pipeline.mjs` and `scripts/test-curriculum-pipeline.mjs`) with 170 passing tests enforcing Rule 24 Closed-World Invariants and scaffolding compliant mission skeletons.
- **System Architecture Specification**: Created comprehensive 12-section [`ARCHITECTURE.md`](ARCHITECTURE.md) defining event bus contracts, Pyodide WASM isolation, SM-2 retention mechanics, and type transition rules.
- **Security Policy**: Added [`SECURITY.md`](SECURITY.md) outlining zero-server compute threat modeling, Web Worker sandboxing, and responsible disclosure SLAs.
- **Community Templates**: Added standardized GitHub issue templates for bug reports, mission improvements, and curriculum proposals, alongside a unified pull request checklist.

### Changed
- **Unified Test Assertion Count**: Documented 1,640+ total automated assertions (1,189 foundational + 451 engine, error diagnostics, settings safety, and curriculum pipeline assertions) passing at 100%.
- **Event Bus Nomenclature**: Clarified 23 active domain event types across `events.types.ts` and `PROJECT_MEMORY.md`.
- **License Upgrade**: Upgraded software engine license to GNU Affero General Public License v3.0 (AGPLv3) with explicit proprietary curriculum protection clauses.
- **Ethnologue Citation**: Integrated *SIL Ethnologue* (2024, 27th edition) citation establishing the 250M+ native Bengali speaker target demographic.

---

## [0.3.0] - 2026-08-15

### Added
- **Missions 010–012**: Authored and published Mission 010 (*Modern String Formatting / f-strings*), Mission 011 (*Boolean Logic & State Switches*), and Mission 012 (*Comparison Operators & Relational Evaluation*).
- **Settings & Dev Mode Safety**: Added automated test harness (`scripts/test-settings.mjs`) verifying dark/light theme synchronization with Monaco Editor, localStorage export/import, and safety resets.
- **Contextual Error Diagnostics Engine**: Introduced `scripts/test-error-diagnostics.mjs` with 44 assertions testing 15 common Bengali beginner micro-errors (e.g., quoted variable names, missing colons, indentation mismatches) with exact 1-line Bengali remediations.
- **Dictionary Problem-Solving Hub**: Expanded `data/dictionary.json` to 20 core CS concept entries validated by 628 automated assertions in `scripts/validate-dictionary.mjs`.

### Changed
- Enhanced Monaco Editor integration to support dynamic font scaling, tab-size persistence, and syntax theme synchronization.

---

## [0.2.0] - 2026-07-20

### Added
- **Missions 005–009**: Authored and published Mission 005 (*Type Conversion*), Mission 006 (*Assignment Pipeline*), Mission 007 (*Float Division & Precision*), Mission 008 (*The Listening Software / input()*), and Mission 009 (*Dynamic Math*).
- **Decoupled Two-Phase Mission Completion**: Re-architected mission completion into Phase 1 (`MISSION_COMPLETING`) and Phase 2 (`MISSION_COMPLETED`), giving `UnderstandingEngine` sole scoring authority.
- **Domain Event Bus Harness**: Built `scripts/test-event-bus.mjs` with 6 event lifecycle phases testing fan-out to XP progression, knowledge graph prerequisites, and SuperMemo SM-2 spaced repetition.
- **Interactive Stdin Emulation**: Implemented virtual input streaming for synchronous `input()` calls in Python code execution.

### Changed
- Refactored `DataService` into an abstract interface to allow seamless future transitions from `localStorage` to remote storage backends without modifying domain engines.

---

## [0.1.0] - 2026-06-01

### Added
- **Platform Foundation**: Initial open-source release of NEXUS Academy using Next.js 16 App Router, React 19, and TypeScript 5.
- **WebAssembly Python Engine**: Integrated Pyodide CPython 3.12 runtime inside dedicated Web Worker for 0ms latency, zero-server execution.
- **Foundational Missions (001–004)**: Published initial curriculum sequence covering Software Memory, Variables, Reassignment, and Data Types.
- **13-Step Pedagogical Anatomy**: Implemented standardized step sequences moving from story and physical analogy to hardware EEE and AI connections.
- **Safe LocalStorage Layer**: Built `StorageService` with `nexus_` namespacing, try/catch isolation, and initial schema migration framework (`MigrationService`).
