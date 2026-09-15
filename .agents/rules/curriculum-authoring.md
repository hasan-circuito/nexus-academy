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

### 5. Rule 22: Organic Need-Based Progression & Authentic Engineering Context
- **The Core Law of Progression:** Every single mission $N$ must be born directly out of the explicit technical pain point, friction, or limitation left unresolved at the end of Mission $N-1$.
  - "Need comes first. Concept comes second. Syntax comes last."
  - "Concepts introduced before pain become memorized. Concepts introduced after pain become understood."
  - A concept must NEVER appear because "it is next in the syllabus" or as an arbitrary corporate assignment.
- **Learner Persona:** The learner is an aspiring software engineer building real software systems from the inside out. They experience the limitation personally in their code.
- **Authentic Engineering Context (No Fictional Agency Roleplay):**
  - Strictly avoid artificial agency theater ("Team Lead Apurba Bhai called an emergency meeting", "Nexus AI Agency client ticket").
  - Rotating engineering domains (E-Commerce, FinTech, HealthTech, IoT, Security, Logistics) serve as *concrete technical systems and mental models*, NOT fictional corporate client tickets.
  - The story must illustrate the authentic failure or friction of doing things the "old way" ($N-1$) and why the new concept is urgently required.
- **The Unbroken Pedagogical Chain:**
  - `intro`: Directly connects to the friction, awkwardness, or limitation of Mission $N-1$.
  - `story`: Dramatizes the authentic system failure or engineering breakdown when software lacks this capability.
  - `analogy`: Provides a physical/real-world mental model.
  - `nextMissionPreview`: Plants the seed of curiosity and pain that will birth Mission $N+1$.
- **Tone:** Technical, encouraging, and deeply pedagogical. No fantasy tropes (dragons, magic spells), and no corporate bureaucracy.

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

### 7. Rule 25: The Engineering Frontier & Psychological Curiosity Hook

The final step of every mission (`mission_complete`) contains an **Engineering Frontier** (`currentLimitation` and `nextMissionBridge`). This is not a passive footnote—it is the psychological engine that makes continuing to the next mission feel inevitable.

#### A. The Entity Invariant: The Code is Limited, NOT the Platform
- ❌ **STRICTLY FORBIDDEN:** Attributing limitations to the platform (e.g., `"Nexus এখনও result অনুযায়ী আলাদা action নিতে পারে না"`). Nexus is the learning academy platform—Nexus is not the entity lacking logic!
- ✅ **MANDATORY:** The subject must ALWAYS be the learner's own script, program, or software (`"তোমার কোড"`, `"তোমার প্রোগ্রাম"`, `"তোমার সফটওয়্যার"`).

#### B. The Empathetic Mentor Persona (Warm, Observant, First-Principles)
- Never output dry, robotic textbook jargon (e.g., `"Technical limitation: Absence of conditional branching logic"`).
- Speak directly to the learner like an observant, inspiring senior software architect sitting right beside them:
  - *Hook opening:* `"তুমি কি গভীরভাবে খেয়াল করেছ? তোমার কোড চমৎকারভাবে হিসাব করে স্ক্রিনে প্রিন্ট করল..."`
  - *The friction/awkwardness:* `"কিন্তু আফসোস! মিথ্যা দেখেও সে কোনো সতর্কবার্তা দিতে পারল না, আবার সত্য হলেও কোনো অভিনন্দন জানাল না..."`
  - *The realization:* `"কম্পিউটার শুধু অন্ধের মতো ওপর থেকে নিচে এক লাইনের পর এক লাইন প্রিন্ট করে গেল—ফলাফল দেখে নিজের গতিপথ বদলানোর কোনো ক্ষমতা তার এখনও নেই।"`

#### C. The Psychological Urge (The Pain of Being Powerless)
- A learner must never move to the next mission because "it's the next chapter in the syllabus."
- They must feel the **emotional friction of helplessness in their current software**:
  - *"My program just evaluated a boolean status, but it is completely powerless to react to it!"*
  - *"The software is blind. It can see the data, but it cannot make a choice."*
- This psychological curiosity gap turns learning syntax into unlocking a much-needed superpower.

#### D. The Next Mission as a Superpower Bridge (`nextMissionBridge`)
- Frame the next mission as giving the program a new sensory organ or cognitive ability:
  - ❌ *"পরবর্তী মিশন: If/Else স্টেটমেন্টের সিনট্যাক্স শেখা"*
  - ✅ *"পরবর্তী মিশন: সফটওয়্যারকে সিদ্ধান্ত নেওয়ার চোখ ও মস্তিষ্ক দেওয়া (If / Else)"*
- The description must challenge the learner with momentum:
  - *"পরের মিশনে আমরা প্রোগ্রামকে অন্ধ অবস্থা থেকে মুক্তি দেব! কোড নিজেই ফলাফল বিচার করবে—শর্ত True হলে এক পথ বেছে নেবে, আর False হলে সম্পূর্ণ ভিন্ন পথে দৌড়াবে। তুমি কি প্রস্তুত?"*

---

## 8. Mission Pipeline Commands

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
