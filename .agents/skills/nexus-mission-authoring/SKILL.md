---
name: nexus-mission-authoring
description: >-
  Author, scaffold, and validate Nexus Academy missions using the 3-Stage Assembly Line Pipeline
  and Steel Guardrails. Use whenever creating or updating missions in data/missions/.
---

# Nexus Mission Authoring Skill

This skill provides step-by-step authoring procedures, golden templates, and quality verification gates for creating Nexus Academy missions conforming to the **Mission Engineering Specification (MES Rules 21, 22, 23)** and **Steel Guardrails**.

---

## The 3-Stage Assembly Line Workflow

Every mission is authored across 3 disciplined stages to prevent cognitive overload, token amnesia, and untaught syntax leaks.

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: Story & Pain-Point Architect                      │
│ - Run preflight contract check                              │
│ - Frame B2B AI Agency scenario (Rule 22)                    │
│ - Establish the concrete limitation of Mission N-1          │
│ - Scaffold 13-step JSON skeleton                            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: Code & Challenge Crafter                           │
│ - Single Concept implementation (Invariant 1)               │
│ - Zero Untaught Syntax verification (Invariant 2)           │
│ - Hidden State Debug challenge design (Rule 21)             │
│ - 40% Quiz & 25% Debug preservation (Invariant 3)           │
│ - Critical Thinking Lab reflection drafting                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: Python AST & Test Auditor                          │
│ - Run automated validation suite                            │
│ - Python AST syntax compilation check                       │
│ - Prohibited AST node traversal with ast.walk               │
│ - Packaging into manifest.json & index.json                 │
│ - Full project TypeScript & test verification               │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Execution Guide

### Stage 1: Story & Pain-Point Architect

1. **Run Contract Preflight**:
   ```bash
   npm run mission:preflight -- <id>
   ```
   Examine the output:
   - **Prerequisite ID**: Verify prerequisite is published.
   - **B2B Client Domain**: HealthTech, FinTech, Logistics, EdTech, E-Commerce, etc.
   - **Pain-Point Trigger**: Concrete limitation of mission $N-1$ driving this mission.
   - **Single Capability**: Exactly 1 concept (`newConceptCount: 1`).
   - **Learner Known Scope**: All concepts and tokens mastered so far.
   - **Forbidden Syntax**: Prohibited AST nodes (e.g. `For`, `While`, `FunctionDef`, `ClassDef`).

2. **Scaffold Golden Skeleton**:
   ```bash
   npm run mission:scaffold -- <id>
   ```
   This generates `data/missions/mission-<id>.json` populated with the 13-step golden architecture conforming to `types/mission.types.ts`.

---

### Stage 2: Code & Challenge Crafter

Open `data/missions/mission-<id>.json` and author each component adhering strictly to the pedagogical rules:

#### A. The Narrative Hook (Steps 1–3)
- **Step 1 (`intro`)**: Frame the mission as an urgent ticket assigned by Senior Dev / Tech Lead at "Nexus AI".
- **Step 2 (`story`)**: A realistic workplace scenario where the client's system hits the limitation of mission $N-1$.
- **Step 3 (`analogy`)**: Bridge a familiar real-world physical concept to the Python mechanism with Lucide icons (`realWorld`, `pythonConcept`, `connection`, `deeperInsight`).

#### B. Concept & Multi-Perspective Demos (Steps 4–8)
- **Step 4 (`concept`)**: Concise core explanation (max 250 words), 3–5 key points, `whyCallout` answering why this exists, `whenToUse`, `whenNotToUse`, and `commonMisconception`.
- **Step 5 (`visualization`)**: Dynamic visual model (`execution_flow`, `memory_diagram`, `icon_grid`, etc.).
- **Step 6 (`code_example`)**: Clean reference Python code with 1-indexed annotations.
- **Step 7 (`eee_example`)**: Hardware/IoT perspective (ESP32, Arduino, sensors, microcontrollers).
- **Step 8 (`ai_example`)**: AI/ML perspective (prompts, embeddings, tokens, dataset pre-processing).

#### C. Hands-on Challenges & Verification (Steps 9–11)
- **Step 9 (`practice`)**:
  - Hands-on exercise using **only** syntax within `learnerKnownScope`.
  - Include progressive `hints`, `displayHint`, and robust `validation` config (`smart_output_source` or `regex_source`).
  - Provide complete, correct `solution` code.
- **Step 10 (`quiz`)**:
  - 1–3 high-quality multiple choice questions.
  - Set `passingScore: 70` or `100`.
  - Provide clear `explanation` for each answer.
- **Step 11 (`debug_challenge`)**:
  - **Rule 21 Hidden State Debug Standard**: Avoid trivial syntax typos. The bug must arise from dynamic state flow, execution order, or unexpected types.
  - Include `buggyCode`, `fixedCode`, `errorMessage`, `bugLine`, `bugType`, and 1–3 progressive `hints`.
  - `fixedCode` MUST compile cleanly and contain ZERO forbidden AST nodes.

#### D. Critical Thinking & Wrap-Up (Steps 12–13)
- **Step 12 (`reflection`)**:
  - 2–3 in-depth `criticalThinkingQuestions` each providing:
    - `question`
    - `expertThinking` (2–4 paragraphs of senior architectural reasoning)
    - `realWorldEngineering` (concrete production engineering failure or design pattern)
    - `beyondProgramming` (how this mental model applies in real life or science)
- **Step 13 (`mission_complete`)**:
  - Mission summary and 3 key transferable takeaways.

---

### Stage 3: Python AST & Test Auditor

1. **Run Target Mission Validation**:
   ```bash
   npm run mission:validate -- <id>
   ```
   The engine validates:
   - **Tier 1**: JSON syntax, mandatory fields, curiosity 6-pack.
   - **Tier 2**: Quiz options/passing score, practice hints, debug difference.
   - **Tier 3 (AST Engine)**: Native Python compilation via `ast.parse` and forbidden construct traversal via `ast.walk`.
   - **Tier 4**: Prerequisite integrity.

2. **Package & Publish Mission**:
   ```bash
   npm run mission:package -- <id>
   ```
   This automatically:
   - Re-runs validation on the mission.
   - Registers/updates `data/missions/manifest.json`.
   - Registers/updates `data/missions/index.json` and updates prerequisite `enablesIds`.
   - Updates `data/curriculum/curriculum-graph.json` status to `"published"`.
   - Runs `npx tsc --noEmit` and `npm test` to guarantee 100% build readiness.

---

## Authoring Checklist

Before pushing any mission, verify:
- [ ] Contract exists in `data/curriculum/curriculum-graph.json`.
- [ ] Exactly 1 new capability introduced (`cognitiveLoadEstimate.newConceptCount: 1`).
- [ ] Zero forbidden AST nodes in `practice.solution` and `debug_challenge.fixedCode`.
- [ ] Debug challenge follows Rule 21 (Hidden State Bug).
- [ ] Narrative follows Rule 22 (B2B AI Agency, Nexus AI).
- [ ] Scoring Constitution preserved: at least 1 Quiz and 1 Debug step.
- [ ] All 6 curiosity fields populated in Bengali.
- [ ] `npm run mission:validate -- <id>` reports 100% pass.
- [ ] `npm test` and `npx tsc --noEmit` exit 0.
