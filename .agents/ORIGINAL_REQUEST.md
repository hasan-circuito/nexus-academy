# Original User Request

## 2026-08-28T04:29:15Z

# Nexus Academy — Generate Missions 006–010

Working directory:
B:\nexus-academy

Integrity mode:
benchmark

Generate and implement the already-verified Mission 006–010 progression.

## Required Reading

Before modifying anything, read and understand:

1. docs/engineering/MISSION_ENGINEERING_SPEC.md
2. PROJECT_MEMORY.md
3. types/mission.types.ts
4. data/missions/manifest.json
5. data/missions/mission-001.json through mission-005.json

Do not assume the previously proposed curriculum is correct without checking these sources.

## Verified Progression

006 — Basic Arithmetic
New capability: +, -, *, /
No //, %, input(), conditionals, loops, or reassignment as new concepts.

007 — User Input
New capability: input()
Reuse previously established arithmetic and int() where necessary.
No float(), complex parsing, validation, conditionals, or loops.

008 — Division Secrets
New capability: // and %
Focus on quotient/remainder behavior and practical use.
Do not introduce if/else or logical operators merely to demonstrate even/odd.

009 — Math Rules
New capability: operator precedence and parentheses ()
No new operators, functions, conditionals, logical operators, or loops.

010 — Updating Values
New capability: variable reassignment/state mutation.
Teach:
right side evaluates first → new value is produced → value is assigned to the variable.
Introduce += only as shorthand after the underlying concept is understood.
No loops or conditionals.

## Core Pedagogy

Follow MISSION_ENGINEERING_SPEC.md and the existing Nexus mission architecture.

For every mission:

Existing capability
→ real limitation/problem
→ need
→ exactly one new conceptual capability
→ guided practice
→ independent practice
→ progressive debugging
→ learner understanding

Previously mastered concepts may be reused.

However, no previously unintroduced concept may become a hidden requirement.

Do not begin with:
"Today we will learn X."

The problem must come before the concept.

Use Mission 004 and 005 as structural references only. Do not copy their topic-specific content.

All learner-facing content must be natural, high-quality Bengali.
Python syntax must remain exact.

## Files

Create/rewrite ONLY:

data/missions/mission-006.json
data/missions/mission-007.json
data/missions/mission-008.json
data/missions/mission-009.json
data/missions/mission-010.json

Do not modify unrelated files.

Do not invent schema fields.
types/mission.types.ts is the absolute schema authority.

## Validation

After implementation:

1. Validate all five JSON files with Node.js.
2. Verify every file against types/mission.types.ts.
3. Audit every practice and debug challenge for hidden dependencies.
4. Audit each mission for premature future concepts.
5. Check cognitive load and mission boundaries.
6. Review the full learner chain:

005 → 006 → 007 → 008 → 009 → 010

If any mission violates the dependency or boundary rules, fix it before reporting success.

## Final Report

Return:

- files created/rewritten
- JSON validation result
- schema validation result
- dependency audit result
- boundary/cognitive-load audit result
- warnings, if any
- final verdict:

SAFE FOR HUMAN LEARNER TESTING

If anything fails, do NOT claim success.
