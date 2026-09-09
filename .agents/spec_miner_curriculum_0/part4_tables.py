# -*- coding: utf-8 -*-
with open("B:/nexus-academy/.agents/spec_miner_curriculum_0/handoff.md", "a", encoding="utf-8") as f:
    f.write("""## 4. Discovered Features & Edge Cases

### Features Discovered
| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|---|---|---|---|---|---|---|
| 1 | Mission 006 | Binary Arithmetic Operators | Computes additions, subtractions, multiplications, divisions | Number literals/variables (`a + b`, `a - b`, `a * b`, `a / b`) | Evaluated numeric result (int or float) | `TypeError` if operand is string; `ZeroDivisionError` if division by zero | `ORIGINAL_REQUEST.md` |
| 2 | Mission 007 | Runtime User Input | Pauses execution to accept stdin string | Keyboard stdin stream via `input()` | Raw String (`str`) | `ValueError` if non-numeric string passed to `int()` | `ORIGINAL_REQUEST.md` |
| 3 | Mission 008 | Floor Division (`//`) | Computes whole integer quotient discarding fractional part | Positive integers (`a // b`) | Integer quotient (`int`) | `ZeroDivisionError` if divisor is 0 | `ORIGINAL_REQUEST.md` |
| 4 | Mission 008 | Modulo Remainder (`%`) | Computes integer remainder after division | Positive integers (`a % b`) | Integer remainder (`int`) | `ZeroDivisionError` if divisor is 0 | `ORIGINAL_REQUEST.md` |
| 5 | Mission 009 | Precedence & Grouping | Evaluates expressions by hierarchy (`()`, `* / // %`, `+ -`) | Multi-operator compound expressions | Evaluated number | `SyntaxError` if parentheses unclosed | `ORIGINAL_REQUEST.md` |
| 6 | Mission 010 | Self-Referential Assignment | Evaluates RHS using current state and rebinds to LHS | Variable and expression (`x = x + 1`) | Mutated variable state | `NameError` if variable uninitialized | `ORIGINAL_REQUEST.md` |
| 7 | Mission 010 | Augmented Assignment (`+=`, `-=`, `*=`) | Syntactic sugar for self-referential mutation | Variable and increment (`x += val`) | Mutated variable state | `NameError` if variable uninitialized; `=+` logic bug | `ORIGINAL_REQUEST.md` |

### Edge Cases
| # | Feature | Input / Scenario | Observed Behavior | Handling / Teaching Strategy |
|---|---|---|---|---|
| 1 | `/` operator | `10 / 2` | Returns float `5.0` | Let learner observe decimal naturally; formal float theory deferred. |
| 2 | `input()` return | `input()` with `50` entered | Returns String `"50"` | Emphasize the String Concatenation Trap; demonstrate `int(input())`. |
| 3 | Modulo `%` | `6 % 25` | Returns `6` (since 6 = 0 * 25 + 6) | Teach dividend vs divisor role clearly in packaging analogy. |
| 4 | Division by 0 | `50 // 0` or `50 % 0` | Raises `ZeroDivisionError` | Featured in Debug Challenge 3 of Mission 008. |
| 5 | Precedence | `10 + 5 * 2` | Evaluates to `20` (not `30`) | Key motivator in Mission 009; contrast with `(10 + 5) * 2`. |
| 6 | Math bracket mismatch | `[a + b] * 2` | Evaluates to list `[15, 15]` | Addressed in Debug Challenge 3 of Mission 009 (distinguishing `[]` from `()`). |
| 7 | Typo `=+` vs `+=` | `score =+ 5` | Reassigns positive integer `5` (silent logic bug) | Highlighted in Debug Challenge 2 of Mission 010. |
| 8 | Unassigned expression | `points + 20` | Evaluates in memory but discards result; `points` remains unchanged | Addressed in Debug Challenge 3 of Mission 010. |

---

## 5. Strict Boundary & Anti-Pattern Compliance Matrix

| Mission | New Capability | Allowed Capabilities | Strictly Prohibited (Immediate Fail if present) |
|---|---|---|---|
| **006** | `+`, `-`, `*`, `/` | Variables, literals, `print()`, `int()`, `str()` | `//`, `%`, `input()`, `if/else`, loops, `x = x + 1`, string concatenation |
| **007** | `input()` | `+`, `-`, `*`, `/`, `int()`, `str()`, `print()`, variables | `float()`, `try/except`, validation, `if/else`, loops, `//`, `%`, `x += 1` |
| **008** | `//`, `%` | `+`, `-`, `*`, `/`, `int()`, `input()`, `print()`, variables | `if/else`, comparisons (`==`, `!=`, `>`, `<`), booleans, loops |
| **009** | Precedence & `()` | `+`, `-`, `*`, `/`, `//`, `%`, `int()`, `input()`, `print()` | New operators (`**`), custom functions, conditionals, loops |
| **010** | `x = x + 1`, `+=` | All 001–009 capabilities | Conditionals (`if/else`), loops (`for`, `while`), comparison (`==`) |

---

## 6. Cognitive Load & Pedagogy Verification

1. **Cognitive Load Limits**:
   - Every mission introduces exactly ONE new conceptual mental model (`newConceptCount: 1`).
   - Reading level is kept strictly at Level 2 (approachable for beginner Bangla speakers).
   - Practice complexity is rated 2 (scaffolded from guided to independent).
   - Estimated completion time per mission is 20 minutes (achievable in a single focused session).

2. **Language & Style**:
   - Learner-facing text must be natural, engaging, high-quality Bengali.
   - Python code, variable names, keywords, and error names remain exact standard Python.
   - Avoid awkward English transliterations; use clear Bangla explanations alongside established technical terms.

3. **Step Structure Compliance**:
   - Exactly 13 steps per mission in strict registry order:
     - Step 0: `intro`
     - Step 1: `story`
     - Step 2: `analogy`
     - Step 3: `concept`
     - Step 4: `code_example`
     - Step 5: `practice` (Guided)
     - Step 6: `practice` (Independent)
     - Step 7: `practice` (Transfer/Integrated)
     - Step 8: `debug_challenge` (Bug 1 - Simple syntax)
     - Step 9: `debug_challenge` (Bug 2 - Tricky/subtle)
     - Step 10: `debug_challenge` (Bug 3 - Deep logic/conceptual)
     - Step 11: `reflection` (Critical Thinking Lab with Q1, Q2, Q3)
     - Step 12: `mission_complete` (Summary & key learnings)

---

## 7. Caveats

1. **Pyodide Environment Stdin**:
   - `input()` in Pyodide WASM environment in browser runs with mock input dialog or predefined standard inputs. Practice validation strategies should use `smart_output_source` with required regex patterns and expected input feeds.
2. **Bengali Language Quality**:
   - Technical terms (e.g. Variable, String, Integer, Modulo, Operator Precedence, State Mutation) should be introduced alongside their English terms in parentheses for clear comprehension.
3. **Immutability of Strings and Integers**:
   - When teaching `x = x + 1` in Mission 010, the concept is rebinding/overwriting the variable name to a new integer object in memory, not mutating the integer object itself.

---

## 8. Conclusion

The specification mining for Missions 006 through 010 is complete, airtight, and verified against all architectural and pedagogical rules in `ORIGINAL_REQUEST.md`, `MISSION_ENGINEERING_SPEC.md`, and `types/mission.types.ts`.

The curriculum designs provide a zero-dependency-leak progression that is completely ready for the JSON authoring and implementation phase.

---

## 9. Verification Method

1. **Schema Validation**: Verify JSON structure against `B:\\nexus-academy\\types\\mission.types.ts`.
2. **Node Validation**: Run `node -e "JSON.parse(fs.readFileSync('...'))"` on generated files.
3. **Dependency Audit**: Verify that no challenge in Mission N requires knowledge introduced in Mission N+1.
4. **Boundary Audit**: Confirm zero prohibited concepts are present in any step.
""")
print("Final section appended.")
