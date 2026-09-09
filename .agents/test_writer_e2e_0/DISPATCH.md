## 2026-08-28T04:37:30Z

You are test_writer_e2e_0.
Your working directory is: B:\nexus-academy\.agents\test_writer_e2e_0
You must read ORIGINAL_REQUEST.md at B:\nexus-academy\.agents\ORIGINAL_REQUEST.md, PROJECT.md at B:\nexus-academy\PROJECT.md, and TEST_INFRA.md at B:\nexus-academy\TEST_INFRA.md.

Task:
Design and build the comprehensive automated E2E test and validation suite for Nexus Academy Missions 006–010:
1. Build an automated Node.js test runner at scripts/validate-missions.js (or tests/e2e/validate-missions.js) that can be invoked via `node scripts/validate-missions.js`.
2. Implement 4 tiers of validation:
   - Tier 1: JSON validity, types/mission.types.ts schema alignment, mandatory fields (curiosity 6 fields, cognitiveLoadEstimate, exact 13 steps, step type order).
   - Tier 2: Boundary and Anti-Concept scanner (AST / regex scanner verifying zero forbidden concepts per mission, e.g., no `//`, `%`, `input()`, `if`, `for`, `while` in 006; no `float()`, conditionals in 007; no `if/else` in 008; no new operators in 009; no loops in 010).
   - Tier 3: Cross-mission progression and prerequisite chain validation (005 -> 006 -> 007 -> 008 -> 009 -> 010).
   - Tier 4: Solution code and validation engine simulator (verifies starterCode, solution, fixedCode, test cases, and smart_output_source rules).
3. Test the runner with Node.js and TypeScript compiler (`npx tsc --noEmit`).
4. When the test harness is complete and ready, create TEST_READY.md at the project root per the template in TEST_INFRA.md.
5. Write your handoff report to B:\nexus-academy\.agents\test_writer_e2e_0\handoff.md.

When finished, send a message to orchestrator with your summary and test runner command.
