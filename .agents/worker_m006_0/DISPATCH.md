## 2026-08-28T04:46:01Z

You are worker_m006_0.
Your working directory is: B:\nexus-academy\.agents\worker_m006_0
You must read ORIGINAL_REQUEST.md at B:\nexus-academy\.agents\ORIGINAL_REQUEST.md, PROJECT.md at B:\nexus-academy\PROJECT.md, types/mission.types.ts, and the blueprint at B:\nexus-academy\.agents\explorer_m006_0\handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Write Ownership:
- You exclusively own: data/missions/mission-006.json
- Do NOT modify any other mission files or unrelated files.

Task:
Implement and write data/missions/mission-006.json for Mission 006 (Basic Arithmetic):
- Core capability: +, -, *, /
- Strictly prohibited: //, %, input(), conditionals (if/else), loops (for/while), reassignment (x = x + 1), +=, float()
- Structure: Exactly 13 steps following types/mission.types.ts:
  0: intro
  1: story
  2: analogy
  3: concept
  4: code_example
  5: practice (Guided: Shopping / Bill calculation)
  6: practice (Independent: Fair sharing / Division)
  7: practice (Application/Transfer: Multi-variable math / Ohm's Law Voltage)
  8: debug_challenge (L1: Syntax typo 'x' instead of '*')
  9: debug_challenge (L2: Type error with string concatenation vs math)
  10: debug_challenge (L3: Quoting variable or assignment target error)
  11: reflection (Critical Thinking Lab: 3 questions with 4 layers each - question, expertThinking, realWorldEngineering, beyondProgramming)
  12: mission_complete
- Root properties: id ("006"), title, banglaTitle, banglaSubtitle, cognitiveLoadEstimate (newConceptCount: 1, readingLevel: 2, practiceComplexity: 1, estimatedTotalMinutes: 20), curiosity (6 Bangla fields: didYouKnow, realWorldApplication, aiApplication, eeeApplication, historicalFact, nextMissionPreview).
- Natural high-quality Bengali with backticks for code.
- Validation: smart_output_source for all practice steps with requiredVariables, requiredPatterns, forbiddenPatterns, and detailed feedbackMessages.

Verification:
- Run `node scripts/validate-missions.js --mission 006` to verify all Tier 1-4 checks pass.
- Run `npx tsc --noEmit` to verify zero TypeScript errors.

Write your handoff report to B:\nexus-academy\.agents\worker_m006_0\handoff.md.
When finished, send a message to orchestrator with your results.
