# Curriculum Authoring & Pedagogy Standards (Steel Guardrails)

Version: 1.0  
Status: Active Workspace Rule  
Applies To: All Nexus Academy mission authoring, editing, code generation, and pedagogical review.

---

## The Non-Negotiable Invariants

### 1. Invariant 1: The Single Concept Law (`newConceptCount: 1`)
- Every mission must introduce **strictly ONE** new capability or language concept (`cognitiveLoadEstimate.newConceptCount: 1`).
- Never stack multiple concepts (e.g. introducing loops and lists in the same mission, or conditionals and logical operators simultaneously).
- Core Principle:
  - *One Lesson → One Concept*
  - *One Exercise → One Reinforcement*
  - *One Debug Task → One Mistake*
- If a lesson attempts to introduce both a concept and a secondary abstraction, it must be split into two sequential missions.

---

### 2. Invariant 2: Zero Untaught Syntax Barrier (Hard AST Enforcement)
- In interactive student exercises (`practice` and `debug_challenge`), **NEVER** use any keyword, function, method, or syntactic construct that has not been explicitly taught in missions 1 through $N-1$.
- Authors and AI agents **MUST** consult [`data/curriculum/curriculum-graph.json`](file:///B:/nexus-academy/data/curriculum/curriculum-graph.json) to retrieve the target mission's `learnerKnownScope` and `forbiddenSyntax`.
- The CI quality gate (`scripts/validate-missions.mjs`) automatically traverses the Python AST with `ast.walk` and **hard-rejects** any interactive step using prohibited AST nodes (e.g. `For`, `While`, `FunctionDef`, `ClassDef`, `ListComp`, `Dict`, `List` before their dedicated missions).

---

### 3. Invariant 3: Scoring Constitution Preservation (40% Quiz + 25% Debug)
- Every mission must contain:
  1. At least one **Quiz step** (`type: 'quiz'`) with valid questions, options, correct answer indices, and an explicit `passingScore` (between 50 and 100).
  2. At least one **Debug challenge** (`type: 'debug_challenge'`) with `buggyCode`, `fixedCode`, `errorMessage`, and progressive `hints`.
- This ensures the integrity of the Nexus Academy Understanding Score calculation engine:
  - **40%** Quiz Score
  - **25%** Debugging Challenge Completion
  - **20%** Practice Exercise Completion
  - **15%** Critical Thinking & Reflection Completion

---

## Pedagogical Narrative & Debugging Standards

### 4. Rule 21: The Hidden State Debug Standard
- Professional developers rarely debug hardcoded, spoon-fed syntax typos (e.g. `files = 0`). Real bugs emerge from dynamic system states and ordering of operations.
- **Rule:** Debug challenges must avoid spoon-feeding the error in the description.
- **Implementation:** The bug must arise from a logical interaction or state life-cycle defect:
  - Stale variable reference before mutation.
  - Evaluation of dynamic text or expressions before state initialization.
  - Unexpected data types arising from dynamic inputs (e.g. `str` from `input()` causing string multiplication instead of arithmetic).
- **Goal:** The learner must trace the execution order and state flow to discover *why* the bug occurred rather than just fixing a typo.

---

### 5. Rule 22: B2B AI Agency Narrative Framework
- **Learner Persona:** Junior Software Engineer at **"Nexus AI"**, a high-velocity B2B artificial intelligence and software solutions agency.
- **Task Framing:** Missions are assigned as professional agency tickets or client sprint deliverables by the Senior Developer / Tech Lead (e.g. "Apurba Bhai").
- **Rotating Client Domains:** Every mission features a rotating real-world B2B client industry to build versatile domain problem-solving:
  - HealthTech (Patient monitoring, vitals processing)
  - FinTech (Account balances, ledger audits, currency conversions)
  - Logistics (Fleet telemetry, parcel dispatch tracking)
  - EdTech (Grade processing, attendance metrics)
  - GovTech (Citizen identity verification, tax bracket pipelines)
  - Smart Grid / GreenTech (Energy consumption telemetry, smart metering)
  - AgriTech (Soil sensors, automated irrigation)
  - E-Commerce / RetailTech (Invoicing engines, order dispatch, shopping carts)
- **Tone:** Professional, encouraging, and engineering-centric. No fantasy tropes (dragons, magic spells).

---

### 6. Rule 24: Real-World Architecture Trace & English Technical Terminology Standards

#### A. Mandatory English Technical Nouns & Keywords
- **Principle:** All programming terms, data types, keywords, system components, error names, and technical nouns **MUST** remain in standard English across all missions (never invent archaic or awkward Bengali transliterations).
- **Mandatory English Terms:**
  - **Data Types & Keywords:** `Boolean`, `True`, `False`, `Variable`, `String`, `Integer`, `Float`, `print`, `input`, `f-string`, `int()`, `str()`, `if`, `else`, `elif`.
  - **Architecture & System:** `Backend`, `Frontend`, `API`, `Database`, `Dashboard`, `Button`, `Server`, `SMS Gateway`, `Service`, `State`, `Live State`, `Stale State`, `Execution Flow`, `Memory`.
  - **Errors & Diagnostics:** `SyntaxError`, `NameError`, `TypeError`, `ValueError`, `ZeroDivisionError`, `Bug`, `Runtime`, `Syntax`, `Console`.
- **Language Composition:** Explanations, mentorship dialogue (Apurba Bhai), analogies, and emotional context must be in rich, natural conversational Bengali, while all technical nouns and keywords stand in crisp English.

#### B. Real-World Architecture Trace in Debug Scenarios
- **Principle:** Never present a debug challenge as an isolated 5-line script running in a vacuum. The learner must understand *how* and *why* this Python script is triggered in a live software product.
- **Mandatory Scenario Structure:**
  1. 📱 **User/Admin Action:** What triggered the process? (e.g. Support Officer clicks `[Unblock Account]` on `Dashboard`, or Customer taps `[Add to Cart]` in mobile app).
  2. ⚙️ **Backend Service Execution:** How Python executes (e.g. `Backend API` triggers this Python script to update state and generate confirmation `SMS` or response).
  3. 🐛 **The Defect:** Why the bug breaks reality (e.g. `status_msg` captures a `Stale State` before the update action occurs).
  4. 🎯 **Learner Task:** What to fix (e.g. Re-order the `Execution Flow` so the `Live State` is formatted into the response).

---

## 7. Mission Pipeline Commands

All mission creation must pass through the automated curriculum pipeline:

```bash
# 1. Preflight Contract Check (Validates prerequisite and displays known scope + forbidden AST nodes)
npm run mission:preflight -- <id>

# 2. Golden Architecture Scaffolding (Generates 13-step skeleton)
npm run mission:scaffold -- <id>

# 3. 4-Tier Automated Quality Gate & AST Forbidden Syntax Check
npm run mission:validate -- <id>

# 4. Packaging, Manifest/Index Registration, and Build Verification
npm run mission:package -- <id>
```
