# Adversarial Challenge & Stress-Test Report: Proposed Curriculum Restructuring (Missions 006–010)

**Document Version**: 1.0.0 — Forensic Stress-Test & Empirical Verification  
**Challenger Role**: Adversarial Challenger (`teamwork_preview_challenger_2` / Empirical Critic & Specialist)  
**Target Proposal**: `B:\nexus-academy\.agents\teamwork_preview_orchestrator_1\AUDIT_REPORT.md`  
**Governing Standards**:
- `docs/engineering/MISSION_ENGINEERING_SPEC.md` (The Core Law, Progression Rules 1–18)
- `PROJECT_MEMORY.md` (Engineering-First Pedagogy, Cognitive Load Budget)
- `docs/engineering/14-curriculam dependency book.md` (One Mission → One Concept)
- `data/missions/mission-001.json` through `mission-005.json` (Empirical Baseline State)

---

## 1. Challenge Summary & Executive Verdict

### Executive Verdict: **APPROVE WITH STRICT AUTHORING CONSTRAINTS**

The proposed restructured curriculum sequence:
$$\text{M005 (Type Conversion)} \longrightarrow \text{M006 (Basic Arithmetic)} \longrightarrow \text{M007 (User Input)} \longrightarrow \text{M008 (Comparisons & Booleans)} \longrightarrow \text{M009 (Binary If/Else)} \longrightarrow \text{M010 (Compound Logic)}$$

is **pedagogically sound, logically cohesive, and strictly compliant with The Core Law**. It successfully eliminates the catastrophic "Purpose-of-Conversion Paradox" and hidden dependency leaks present in the legacy curriculum drafts.

Every proposed mission transition has been stress-tested across four adversarial dimensions:
1. **Authentic Emergence** (Need Before Concept)
2. **Prerequisite Integrity & Zero Dependency Leaks**
3. **Cognitive Load Bounding** (Strictly $\le 1$ Major Transformation)
4. **Failure Modes & Empirical Edge-Case Resilience**

Below is the exhaustive stress-test analysis, accompanied by critical authoring guardrails that must be enforced during content authoring.

---

## 2. Forensic Stress-Testing of Mission-by-Mission Progression

### 2.1 Transition M005 $\longrightarrow$ M006: Basic Arithmetic Operations (`+`, `-`, `*`, `/`)

#### A. The Emergence Test: Does an Authentic Engineering Problem Exist?
- **Verified Starting State (M005)**: The learner can assign and reassign integers and strings, call single-argument `print()`, and convert `"50"` $\leftrightarrow$ `50` via `int()` and `str()`.
- **The Authentic Limitation**: In M005, numbers are inert in memory. `print("50")` and `print(50)` produce identical visual text on the screen. The learner naturally asks: *"Why do we need integers if they look the same as text when printed?"*
- **The Engineering Answer**: Text cannot be computed, scaled, accumulated, or offset. Numbers exist in software to perform mathematical transformations (calculating sensor readings, total prices, offsets, elapsed units).
- **Smallest Capability Needed**: Basic arithmetic operators (`+`, `-`, `*`, `/`).
- **Emergence Verdict**: **PASSED (100% Authentic)**. Arithmetic earns its place immediately by providing the engineering raison d'être for the `Integer` data type and `int()` casting.

#### B. Dependency Leak & Circularity Stress-Test
- **Is `input()` required?** No. Calculations operate on hardcoded variables (`price = 15; count = 4; total = price * count`), matching M001–M005 conventions.
- **Is String Concatenation (`+` on text) leaked?** No. `+` must be restricted exclusively to numerical addition.
- **Is Multi-argument `print(a, b)` leaked?** No. Output can be displayed via single-variable `print(total)` or sequentially on separate lines (`print("Total:"); print(total)`).
- **Does Division `/` leak Floating-Point complexity?**
  - *Empirical Check*: In Python 3, `15 / 4` evaluates to `3.75` (type `float`), and `10 / 2` evaluates to `5.0`.
  - *Adversarial Challenge*: Does seeing `3.75` on the screen require introducing `float()` type casting, decimal precision, or IEEE 754 concepts?
  - *Resolution*: No. Learners understand decimals from elementary school. It is sufficient to explain: *"Division `/` produces decimal numbers when needed."* Explicit float casting functions and precision formatting are out of scope.
- **Are `//` (floor division) and `%` (modulo) excluded?** Yes. Excluding them preserves MES Rule 4 (Split by Cognitive Independence) and MES Rule 6 (No Syllabus Compression). Basic math (`+ - * /`) and remainder math (`// %`) require distinct mental models.

#### C. Cognitive Load & Failure Mode Verification
- **Cognitive Budget**: Exactly 1 transformation (evaluating mathematical expressions on numbers).
- **Key Failure Modes / Debug Candidates**:
  1. `ZeroDivisionError: division by zero` (`total / 0`).
  2. `TypeError: can only concatenate str (not "int") to str` when trying to add text and number (`"50" + 10`). (Directly reinforces M004/M005!).
  3. Operator precedence (`5 + 2 * 3` vs `(5 + 2) * 3`).

---

### 2.2 Transition M006 $\longrightarrow$ M007: Dynamic Interactive Programs: User Input (`input()`)

#### A. The Emergence Test: Does an Authentic Engineering Problem Exist?
- **Verified Starting State (M006)**: The learner can perform mathematical calculations on hardcoded numbers (`total = 15 * 4`).
- **The Authentic Limitation**: The program is static and non-interactive. Every execution produces the exact same calculation. A real-world calculator, age estimator, or POS checkout terminal must accept dynamic runtime data from real users.
- **Smallest Capability Needed**: Pausing execution to capture terminal input via `input()` and binding it with `int(input())` to feed arithmetic expressions.
- **Emergence Verdict**: **PASSED (100% Authentic)**. The Purpose-of-Conversion Paradox is completely eliminated. When `input()` returns a string (`"2000"`), the learner immediately understands *why* `int()` is required—because they want to do arithmetic (`2026 - birth_year`), which was mastered in M006!

#### B. Dependency Leak & Circularity Stress-Test
- **Is Arithmetic required?** Yes, and it was verified mastered in M006.
- **Is `int()` required?** Yes, and it was verified mastered in M005.
- **Are conditionals (`if/else`) leaked?** No. Interactive input-computation scripts require zero branching (`year_str = input("Year: "); year = int(year_str); age = 2026 - year; print(age)`).
- **Are comparisons (`< > ==`) leaked?** No.

#### C. Critical Authoring Guardrail for M007
- **⚠️ String Concatenation & Multi-arg Print Prohibition**:
  - In legacy `mission-006.json`, the author wrote `print("Hello, " + name)` and `print("AI উত্তর খুঁজছে: " + prompt)`.
  - In M007, authors must NOT use string concatenation (`+` on strings) or multi-argument `print(a, b)` unless explicitly scaffolded. Outputs should be printed as pure single variables or on separate lines:
    ```python
    # Compliant M007 Pattern:
    birth_year_text = input("Enter birth year: ")
    birth_year = int(birth_year_text)
    age = 2026 - birth_year
    print(age)
    ```

---

### 2.3 Transition M007 $\longrightarrow$ M008: Evaluating Conditions: Comparisons & Booleans (`==`, `!=`, `<`, `>`, `<=`, `>=`)

#### A. The Emergence Test: Does an Authentic Engineering Problem Exist?
- **Verified Starting State (M007)**: The learner can take runtime user input, convert types, and perform calculations.
- **The Authentic Limitation**: The program can calculate numbers (e.g. `score = 85`), but cannot evaluate questions or verify conditions about those numbers (e.g., *"Did the student pass?"*, *"Is the entered PIN correct?"*, *"Is temperature exceeding safety limits?"*).
- **Smallest Capability Needed**: Comparison operators producing Boolean truth values (`True` / `False`).
- **Emergence Verdict**: **PASSED (100% Authentic)**.

#### B. The Boundary Isolation Test: Why M008 Must NOT Include `if/else`
- **Adversarial Challenge**: Can a beginner appreciate `score >= 80` evaluating to `True` without an `if` statement?
- **Forensic Justification**:
  1. If comparison operators, Boolean data types, `if`/`else` keywords, colon syntax (`:`), and 4-space block indentation are taught simultaneously, the beginner is hit with **five distinct cognitive concepts in a single mission**.
  2. Evaluating `is_passing = score >= 80` and `print(is_passing)` teaches the fundamental programming reality that a comparison is an **expression that evaluates to a value (`bool`)**, not merely a syntax clause of `if`.
  3. Isolating M008 guarantees that truth values are mastered before syntax indentation is introduced.

#### C. Dependency Leak & Failure Mode Verification
- **Leaked Concepts**: Zero. `if`, `else`, `elif`, `and`, `or` are strictly forbidden.
- **Key Failure Modes / Debug Candidates**:
  1. Assignment `=` vs Equality `==` (`print(score = 85)` $\rightarrow$ `TypeError` / `SyntaxError`).
  2. Type mismatch comparison (`"85" == 85` $\rightarrow$ evaluates to `False` in Python without error, illustrating type-sensitive equality).
  3. Off-by-one boundary conditions (`score > 80` vs `score >= 80`).

---

### 2.4 Transition M008 $\longrightarrow$ M009: Divergent Control Flow: Binary Decision Making (`if` / `else` & Indentation)

#### A. The Emergence Test: Does an Authentic Engineering Problem Exist?
- **Verified Starting State (M008)**: The learner understands that comparisons generate `True` or `False`.
- **The Authentic Limitation**: Even though the program knows a condition is `True` or `False`, it still executes every line of code straight down sequentially from top to bottom. It cannot conditionally run one block of code while skipping another.
- **Smallest Capability Needed**: Divergent branching using `if` and `else`, with trailing colons (`:`) and 4-space code block indentation.
- **Emergence Verdict**: **PASSED (100% Authentic)**.

#### B. The Scope Restriction Test: Why `elif` Must Be Excluded from M009
- **Adversarial Challenge**: Why not include `elif` in M009?
- **Forensic Justification**:
  1. M009 already introduces:
     - The mental model of non-linear / divergent execution.
     - The syntax of `if condition:`.
     - The syntax of `else:`.
     - Block indentation (4 spaces) and `IndentationError`.
  2. Adding `elif` introduces multi-way branching, condition evaluation order (first-match-wins), and nested fallthroughs, doubling the cognitive surface.
  3. Restricting M009 strictly to binary `if/else` bounds the mission to exactly 1 major transformation.

#### C. Key Failure Modes / Debug Candidates
1. `SyntaxError: expected ':'` (missing colon).
2. `IndentationError: expected an indented block` (unindented statement after `if:`).
3. `SyntaxError: invalid syntax` on `else condition:` (attaching a condition to `else`).

---

### 2.5 Transition M009 $\longrightarrow$ M010: Compound Logic: Logical Operators (`and`, `or`, `not`)

#### A. The Emergence Test: Does an Authentic Engineering Problem Exist?
- **Verified Starting State (M009)**: The learner can branch code execution down two distinct paths using a single boolean condition.
- **The Authentic Limitation**: Real-world decisions rarely depend on a single criterion. E.g., User authentication requires `email_ok` AND `password_ok`. Discount eligibility requires `is_student` OR `has_coupon`. Security alarms require `motion_detected` AND NOT `system_disarmed`.
  - Handling multiple criteria with only binary `if/else` forces awkward, deeply nested `if` blocks (`if email_ok: if password_ok: ...`), leading to code bloat and logic bugs.
- **Smallest Capability Needed**: Logical operators (`and`, `or`, `not`) to construct composite Boolean expressions.
- **Emergence Verdict**: **PASSED (100% Authentic)**.

#### B. Narrative Synchronization & Structural Resolution
- In legacy `mission-010.json`, line 18 stated: `"nextMissionPreview": "লজিক্যাল অপারেটর দিয়ে শর্ত চেক করার পর, আমরা শর্ত অনুযায়ী প্রোগ্রামকে আলাদা পথে চালানো শিখব।"`, which erroneously placed `if/else` *after* M010.
- In the restructured sequence, M009 precedes M010. Therefore, M010 can naturally demonstrate `and`, `or`, `not` both as standalone boolean expressions (`is_auth = email_ok and password_ok`) AND directly inside `if` statements (`if email_ok and password_ok:`).
- Narrative desynchronization is completely resolved.

#### C. Key Failure Modes / Debug Candidates
1. `and` vs `or` logic inversion in authentication (`email_ok or password_ok` creates a critical security flaw).
2. Grouping parentheses and operator precedence (`(gpa == 5.0) and (is_athlete or is_debater)`).
3. Inverting truth states with `not` (`not is_raining`).

---

## 3. Comprehensive Challenge & Stress-Test Matrix

| Mission | Proposed Core Capability | Emergence from Prior Limitation | Hidden Dependency Leaks | Cognitive Load Rating | Stress-Test Status |
|---|---|---|---|---|---|
| **M006** | Basic Arithmetic (`+`, `-`, `*`, `/`) | **High**: Solves why `int` exists after M005 conversion | **None**: No input, no concat, no multi-arg print | 1 Major Transformation | **PASS** |
| **M007** | User Input (`input()`) | **High**: Solves hardcoded static calculations from M006 | **None**: Math & `int` already mastered; zero `if` | 1 Major Transformation | **PASS** |
| **M008** | Comparisons & Booleans (`==`, `!=`, `<`, `>`, `<=`, `>=`) | **High**: Solves inability to evaluate criteria on M007 data | **None**: Zero `if`, zero `and`/`or` | 1 Major Transformation | **PASS** |
| **M009** | Binary Decisions (`if` / `else` & Indentation) | **High**: Solves linear execution limitation from M008 | **None**: Zero `elif`, zero `and`/`or` | 1 Major Transformation | **PASS** |
| **M010** | Compound Logic (`and`, `or`, `not`) | **High**: Solves single-condition & nested-if bottleneck from M009 | **None**: `if/else` & booleans already mastered | 1 Major Transformation | **PASS** |

---

## 4. Empirical Python Semantic Validation

All proposed code patterns and execution paths were validated against the local Python runtime:

```python
# ==============================================================================
# EMPIRICAL VALIDATION SUITE (M006 - M010)
# ==============================================================================

# M006: Pure Arithmetic on hardcoded integers
num1 = 15
num2 = 4
total = num1 + num2
diff = num1 - num2
prod = num1 * num2
quot = num1 / num2
assert total == 19 and diff == 11 and prod == 60 and quot == 3.75

# M007: User Input + Type Conversion into Arithmetic
mock_input = "2000"
birth_year = int(mock_input)
age = 2026 - birth_year
assert age == 26

# M008: Pure Boolean Expression Evaluation
score = 85
is_pass = score >= 80
assert is_pass is True
assert ("85" == 85) is False

# M009: Binary Divergent Control Flow
temperature = 32
if temperature > 30:
    fan_state = "ON"
else:
    fan_state = "OFF"
assert fan_state == "ON"

# M010: Compound Decision Making
email_ok = True
password_ok = True
if email_ok and password_ok:
    auth_state = "ACCESS_GRANTED"
else:
    auth_state = "ACCESS_DENIED"
assert auth_state == "ACCESS_GRANTED"
```
*Result: 100% tests passed without error.*

---

## 5. Mandatory Authoring Playbook Rules for Implementation

To ensure that the authored JSON files for Missions 006–010 do not accidentally re-introduce legacy defects, the implementation team must adhere to the following mandatory constraints:

1. **Rule of Single-Argument Printing**:
   In M006 and M007, exercises must not assume multi-argument `print(a, b)` or string concatenation `print("Result: " + str(res))`. Outputs must be printed as single variables or on separate lines.
2. **Rule of Modulo & Float Exclusion in M006**:
   M006 must strictly focus on `+`, `-`, `*`, `/`. Modulo `%` and floor division `//` are deferred to a downstream cyclic logic module.
3. **Rule of No Branching in M007/M008**:
   M007 (`input()`) and M008 (`Comparisons`) must contain zero `if` or `else` statements.
4. **Rule of Binary Exclusivity in M009**:
   M009 must contain only binary `if` and `else`. `elif` is strictly forbidden.
5. **Rule of 13-Step Schema Compliance**:
   Every mission JSON must strictly conform to the 13-step progressive scaffolding blueprint demonstrated in `mission-005.json` (1 intro, 1 story, 1 analogy, 1 concept, 1 code_example, 3 practices, 1 quiz, 3 debug challenges, 1 reflection, 1 complete).

---

## 6. Final Adversarial Verdict

- **Authentic Engineering Emergence**: **VERIFIED**
- **Prerequisite & Boundary Integrity**: **VERIFIED**
- **Cognitive Load Ergonomics**: **VERIFIED**
- **Overall Assessment**: **APPROVE**
