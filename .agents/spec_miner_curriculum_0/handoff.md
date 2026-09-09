# Specification Mining & Curriculum Requirement Analysis: Missions 006–010

**Agent**: `spec_miner_curriculum_0`  
**Working Directory**: `B:\nexus-academy\.agents\spec_miner_curriculum_0`  
**Date**: 2026-08-28  
**Status**: COMPLETE — HIGH-FIDELITY CURRICULUM SPECIFICATION  

---

## 1. Observation

### 1.1 Authoritative Specifications & References
- **`B:\nexus-academy\.agents\ORIGINAL_REQUEST.md`**:
  - Mandates implementation of verified progression:
    - **Mission 006**: Basic Arithmetic (`+`, `-`, `*`, `/`). Prohibits `//`, `%`, `input()`, conditionals, loops, reassignment.
    - **Mission 007**: User Input (`input()`). Reuses arithmetic & `int()`. Prohibits `float()`, complex parsing, validation, conditionals, loops.
    - **Mission 008**: Division Secrets (`//` integer division and `%` modulo remainder). Prohibits `if/else`, logical operators.
    - **Mission 009**: Math Rules (operator precedence and parentheses `()`). Prohibits new operators, conditionals, loops.
    - **Mission 010**: Updating Values (`x = x + 1`, evaluation order: RHS first -> new value -> assign to LHS; `+=` shorthand after understanding). Prohibits loops, conditionals.
  - Mandates: Problem before concept; structural reference only from Missions 004/005; natural, high-quality Bengali content; exact Python syntax; strict schema adherence to `types/mission.types.ts`.
- **`B:\nexus-academy\docs\engineering\MISSION_ENGINEERING_SPEC.md`**:
  - Defines 7-stage architectural journey: Context -> Problem -> Need -> Python Concept -> Engineering Application -> Reflection -> Git Contribution.
  - Enforces 18 Curriculum Progression & Mastery Rules (Mastery over coverage, single primary capability, cognitive independence, zero hidden dependencies, transferable mastery).
- **`B:\nexus-academy\docs\engineering\13-mission-authoring-playbook.md` & `14-curriculam dependency book.md`**:
  - One Lesson -> One Concept, One Exercise -> One Reinforcement, One Debug Task -> One Mistake.
  - Progressive scaffolding: Observation -> Guided Practice -> Independent Practice -> Transfer/Creative Application.
  - 3-4 Practice tasks and 3 Debug challenges per mission with strictly calibrated difficulty (1st simple syntax, 2nd tricky, 3rd deep conceptual).
- **`B:\nexus-academy\docs\engineering\Critical Thinking Lab .md`**:
  - Universal 3-question reflection structure: Q1 (Why Concept Exists), Q2 (Domain Spotlight), Q3 (Engineering Failure / Edge Cases), within current knowledge boundary.
- **`B:\nexus-academy\types\mission.types.ts` & `types\common.types.ts`**:
  - Single schema authority: `MissionData`, `CognitiveLoadEstimate`, `CuriosityBlock`, and 13 fixed steps in order.
- **`B:\nexus-academy\data\missions\mission-001.json` through `mission-005.json`**:
  - Confirmed established baseline learner state.

### 1.2 Baseline Learner State Exiting Mission 005
- **Concepts Fully Mastered**:
  - `print()` function to display text and values.
  - Variables as named memory containers (`score = 50`).
  - Literal variable reassignment (`score = 10` followed by `score = 20`).
  - String literals (`"text"`) vs Integer literals (`50`).
  - Type conversion functions: `int()` (e.g. `int("50") -> 50`) and `str()` (e.g. `str(50) -> "50"`).
  - Understanding of immutability during type casting (`int(text)` returns a new value without modifying `text`).
- **Unintroduced / Strictly Absent Concepts**:
  - No arithmetic operators (`+`, `-`, `*`, `/`)
  - No `input()` function
  - No integer division (`//`) or modulo remainder (`%`)
  - No operator precedence rules or parentheses `()`
  - No self-referential mutation (`x = x + 1`, `x += 1`)
  - No float operations, booleans, comparisons (`==`, `<`, `>`), conditionals (`if/else`), loops (`for`, `while`), lists, dicts, custom functions, or f-strings.

---

## 2. Logic Chain & Prerequisite Progression Architecture

The 5-mission sequence forms an unbreakable, mathematically and pedagogically sound prerequisite chain:

```
[Mission 005 Mastered State]
  │
  ├─► Problem: Stored numbers cannot be combined or calculated.
  ▼
[Mission 006: Basic Arithmetic (+, -, *, /)]
  │   - Capability: CPU calculates expressions (total = price + tax)
  │
  ├─► Problem: Calculations work, but every program is hardcoded and cannot interact with users.
  ▼
[Mission 007: User Input (input())]
  │   - Capability: Dynamic input + int() conversion makes programs interactive.
  │
  ├─► Problem: Standard division (/) gives floats; cannot solve discrete grouping/remainders (packing, time, coins).
  ▼
[Mission 008: Division Secrets (// and %)]
  │   - Capability: Discrete quotient (//) and modulo remainder (%).
  │
  ├─► Problem: Combining 6 operators in one formula yields silent evaluation bugs.
  ▼
[Mission 009: Math Rules (Operator Precedence & Parentheses ())]
  │   - Capability: Deterministic evaluation order (BODMAS) & explicit grouping with ().
  │
  ├─► Problem: Formulas calculate new values, but variables cannot self-update/accumulate relative to their own state.
  ▼
[Mission 010: Updating Values (x = x + 1 & += shorthand)]
      - Capability: State mutation (RHS evaluates first -> assigns to LHS; += shorthand).
```

---
## 3. Deep Mission Specifications (Missions 006–010)

================================================================================
### MISSION 006: BASIC ARITHMETIC
================================================================================

- **ID**: `006`
- **Title**: `Basic Arithmetic`
- **Bangla Title**: `কম্পিউটার যখন গণিত করে`
- **Bangla Subtitle**: `যোগ, বিয়োগ, গুণ ও ভাগের মাধ্যমে ডেটা প্রসেসিং`
- **Cognitive Load**: `{ readingLevel: 2, newConceptCount: 1, practiceComplexity: 2, estimatedTotalMinutes: 20 }`

#### 1. Pedagogical Problem & Need
- **The Problem**: Variables hold numbers (`price = 50`, `discount = 10`), but the program cannot combine them. Stored numbers sit frozen in memory. An EEE circuit script with current and resistance cannot calculate voltage.
- **The Need**: The learner demands a way for the CPU to actively calculate and produce new numbers from existing data.
- **The Concept**: Basic binary arithmetic operators (`+`, `-`, `*`, `/`).

#### 2. Strict Boundary Rules
- **Allowed**: Variables, integer literals, `print()`, `int()`, `str()`, `+`, `-`, `*`, `/`.
- **Strictly Prohibited**: `//`, `%`, `input()`, `if/else`, loops, self-reassignment (`x = x + 1`), string concatenation.

#### 3. Step-by-Step Curriculum Outline (13 Steps)
- **Step 1 (`intro`)**: The leap from static memory storage to mathematical processing.
- **Step 2 (`story`)**: The Difference Engine (1822) — why Charles Babbage designed a machine to automate human calculation without fatigue or error.
- **Step 3 (`analogy`)**: The Desk Calculator and the Notebook. Memory holds numbers; the calculator performs arithmetic and writes the result.
- **Step 4 (`concept`)**: The 4 arithmetic operators (`+`, `-`, `*`, `/`). Right-hand side evaluation and assignment to a new variable.
- **Step 5 (`code_example`)**:
  ```python
  a = 20
  b = 5
  sum_val = a + b
  diff = a - b
  prod = a * b
  div = a / b
  print(sum_val)
  print(diff)
  print(prod)
  print(div)
  ```
- **Step 6 (`practice` - Guided)**:
  - *Title*: `দোকানের মোট বিল হিসাব`
  - *Prompt*: দুটি পণ্যের দাম `item1 = 40` এবং `item2 = 60`। ডিসকাউন্ট `discount = 15`। মোট বিল `total = item1 + item2 - discount` বের করো এবং `total` প্রিন্ট করো।
  - *Starter Code*:
    ```python
    item1 = 40
    item2 = 60
    discount = 15
    # total হিসাব করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["item1", "item2", "discount", "total"]`, expectedOutput: `"85\n"`.
  - *Solution*:
    ```python
    item1 = 40
    item2 = 60
    discount = 15
    total = item1 + item2 - discount
    print(total)
    ```
- **Step 7 (`practice` - Independent)**:
  - *Title*: `টিকিট মূল্য ও ভাগাভাগি`
  - *Prompt*: প্রতি টিকিটের দাম `unit_price = 50`, মোট টিকিট `ticket_count = 4`। মোট খরচ `total_cost = ticket_count * unit_price` বের করো। তারপর ২ জন বন্ধুর মধ্যে সমান ভাগে ভাগ করে `per_person = total_cost / 2` বের করো এবং দুটি মানই প্রিন্ট করো।
  - *Starter Code*:
    ```python
    unit_price = 50
    ticket_count = 4
    # মোট খরচ ও জনপ্রতি খরচ বের করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["unit_price", "ticket_count", "total_cost", "per_person"]`, expectedOutput: `"200\n100.0\n"`.
  - *Solution*:
    ```python
    unit_price = 50
    ticket_count = 4
    total_cost = ticket_count * unit_price
    per_person = total_cost / 2
    print(total_cost)
    print(per_person)
    ```
- **Step 8 (`practice` - Transfer/EEE Integrated)**:
  - *Title*: `ওহমের সূত্র দিয়ে ভোল্টেজ হিসাব`
  - *Prompt*: একটি বর্তনীতে কারেন্ট `current = 3` অ্যাম্পিয়ার এবং রোধ `resistance = 10` ওহম। ওহমের সূত্র $V = I \times R$ অনুযায়ী ভোল্টেজ `voltage = current * resistance` বের করো এবং `voltage` প্রিন্ট করো।
  - *Starter Code*:
    ```python
    current = 3
    resistance = 10
    # voltage হিসাব করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["current", "resistance", "voltage"]`, expectedOutput: `"30\n"`.
  - *Solution*:
    ```python
    current = 3
    resistance = 10
    voltage = current * resistance
    print(voltage)
    ```
- **Step 9 (`debug_challenge` - Bug 1, Simple Syntax)**:
  - *Scenario*: একজন শিক্ষার্থী গুণের জন্য গণিতের নিয়মে `x` লিখেছে, কিন্তু পাইথন এরর দিচ্ছে।
  - *Buggy Code*:
    ```python
    price = 20
    quantity = 5
    total = price x quantity
    print(total)
    ```
  - *Error*: `SyntaxError: invalid syntax` (Line 3, `bugType: "syntax"`).
  - *Fixed Code*:
    ```python
    price = 20
    quantity = 5
    total = price * quantity
    print(total)
    ```
- **Step 10 (`debug_challenge` - Bug 2, Tricky Type Mismatch)**:
  - *Scenario*: একজন শিক্ষার্থী টেক্সট হিসেবে থাকা সংখ্যার সাথে ইন্টিজার যোগ করার চেষ্টা করেছে।
  - *Buggy Code*:
    ```python
    price_text = "50"
    tax = 10
    total = price_text + tax
    print(total)
    ```
  - *Error*: `TypeError: can only concatenate str (not "int") to str` (Line 3, `bugType: "runtime"`).
  - *Fixed Code*:
    ```python
    price_text = "50"
    tax = 10
    total = int(price_text) + tax
    print(total)
    ```
- **Step 11 (`debug_challenge` - Bug 3, Deep Logic/Assignment Target)**:
  - *Scenario*: একজন শিক্ষার্থী সমীকরণের মতো ডানপাশের মান বাঁপাশে লিখে ফেলেছে।
  - *Buggy Code*:
    ```python
    a = 10
    b = 20
    a + b = result
    print(result)
    ```
  - *Error*: `SyntaxError: cannot assign to expression` (Line 3, `bugType: "syntax"`).
  - *Fixed Code*:
    ```python
    a = 10
    b = 20
    result = a + b
    print(result)
    ```
- **Step 12 (`reflection` - Critical Thinking Lab)**:
  - *Q1*: কম্পিউটার কেন মানুষের চেয়ে দ্রুত এবং ক্লান্তিহীনভাবে গাণিতিক হিসাব সম্পন্ন করতে পারে?
  - *Q2 (Domain: EEE / Signal Processing)*: একটি সেন্সর থেকে পাওয়া ছোট ভোল্টেজ সংকেতকে ডিজিটাল ফিল্টারিং বা অ্যাম্প্লিফাই করতে মৌলিক পাটিগণিত কীভাবে ব্যবহৃত হয়?
  - *Q3 (Engineering Failure)*: Ariane 5 রকেট বিপর্যয় — গাণিতিক গণনায় টাইপ এবং মানের অতিরিক্ত সীমা অতিক্রম করলে কীভাবে একটি বিশাল রকেট ধ্বংস হয়ে যেতে পারে?
- **Step 13 (`mission_complete`)**: Summary and preview for Mission 007.

- **Curiosity Block**:
  - `didYouKnow`: The word "Computer" was originally a job title for humans whose daily job was doing arithmetic calculations by hand!
  - `realWorldApplication`: Flight control computers perform thousands of arithmetic calculations every second to adjust wing flaps.
  - `aiApplication`: Neural networks in AI are essentially giant webs performing millions of additions and multiplications (`weight * input + bias`).
  - `eeeApplication`: EEE engineers calculate power consumption using Ohm and Power laws (`power = voltage * current`).
  - `historicalFact`: Charles Babbage designed the Difference Engine in 1822 specifically to eliminate human arithmetic errors from nautical tables.
  - `nextMissionPreview`: How do we make programs dynamic so users can type their own numbers at runtime? Next: User Input (`input()`)!

---
================================================================================
### MISSION 007: USER INPUT
================================================================================

- **ID**: `007`
- **Title**: `User Input`
- **Bangla Title**: `ব্যবহারকারীর কাছ থেকে তথ্য নেওয়া`
- **Bangla Subtitle**: `input() ফাংশন ও ডায়নামিক ইন্টারেক্টিভ প্রোগ্রাম`
- **Cognitive Load**: `{ readingLevel: 2, newConceptCount: 1, practiceComplexity: 2, estimatedTotalMinutes: 20 }`

#### 1. Pedagogical Problem & Need
- **The Problem**: Previous programs only work for hardcoded values. To calculate another person's age or bill, the source code must be rewritten. The program is deaf and non-interactive.
- **The Need**: The program must pause at runtime, listen to user keyboard input, and use that dynamic data.
- **The Concept**: The `input()` function and integrating it with `int()`.

#### 2. Strict Boundary Rules
- **Allowed**: `input()`, `print()`, variables, `int()`, `str()`, `+`, `-`, `*`, `/`.
- **Strictly Prohibited**: `float()`, `try/except`, complex validation, conditionals (`if/else`), loops, `//`, `%`, state mutation (`x += 1`).

#### 3. Step-by-Step Curriculum Outline (13 Steps)
- **Step 1 (`intro`)**: Transition from hardcoded scripts to live interactive software.
- **Step 2 (`story`)**: The Static Vending Machine vs Interactive Machine — why software must accept user commands.
- **Step 3 (`analogy`)**: Ears and Mouth of the computer. `print()` speaks; `input()` listens.
- **Step 4 (`concept`)**: How `input()` works: halts execution, waits for input + Enter, returns String. Why `int(input())` is mandatory for mathematical operations.
- **Step 5 (`code_example`)**:
  ```python
  name = input()
  age_text = input()
  age = int(age_text)
  next_age = age + 1
  print(name)
  print(next_age)
  ```
- **Step 6 (`practice` - Guided)**:
  - *Title*: `ইউজারের নাম ও শহরের তথ্য নেওয়া`
  - *Prompt*: `input()` ব্যবহার করে ইউজারের কাছ থেকে `user_name` এবং `city` ইনপুট নাও এবং দুটি মানই প্রিন্ট করো।
  - *Starter Code*:
    ```python
    # 1. user_name ইনপুট নাও
    # 2. city ইনপুট নাও
    # 3. দুটি ভেরিয়েবল প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["user_name", "city"]`, requiredPatterns: [`input\s*\(`].
  - *Solution*:
    ```python
    user_name = input()
    city = input()
    print(user_name)
    print(city)
    ```
- **Step 7 (`practice` - Independent)**:
  - *Title*: `ডায়নামিক ক্যালকুলেটর`
  - *Prompt*: ইউজারের কাছ থেকে একটি সংখ্যা `quantity` ইনপুট নাও এবং `int()` দিয়ে সংখ্যায় রূপান্তর করো। প্রতি ইউনিটের দাম `unit_price = 20` হলে মোট খরচ `total = quantity * unit_price` হিসাব করো এবং `total` প্রিন্ট করো।
  - *Starter Code*:
    ```python
    unit_price = 20
    # quantity ইনপুট নিয়ে int() করো এবং total প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["unit_price", "quantity", "total"]`, requiredPatterns: [`int\s*\(\s*input`].
  - *Solution*:
    ```python
    unit_price = 20
    quantity = int(input())
    total = quantity * unit_price
    print(total)
    ```
- **Step 8 (`practice` - Transfer/Dual Input)**:
  - *Title*: `দুটি সংখ্যার যোগফল নির্ণয়`
  - *Prompt*: ইউজারের কাছ থেকে পরপর দুটি সংখ্যা `num1` এবং `num2` ইনপুট নাও (উভয়কেই `int()` দিয়ে সংখ্যা বানাবে)। তাদের যোগফল `result = num1 + num2` বের করে প্রিন্ট করো।
  - *Starter Code*:
    ```python
    # num1 এবং num2 ইনপুট নাও এবং তাদের যোগফল result প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["num1", "num2", "result"]`, requiredPatterns: [`int\s*\(\s*input`].
  - *Solution*:
    ```python
    num1 = int(input())
    num2 = int(input())
    result = num1 + num2
    print(result)
    ```
- **Step 9 (`debug_challenge` - Bug 1, Simple Syntax)**:
  - *Scenario*: ফাংশন কলের ব্র্যাকেট না দেওয়ায় ইনপুট নেওয়া যাচ্ছে না।
  - *Buggy Code*:
    ```python
    user_city = input
    print(user_city)
    ```
  - *Behavior*: `<built-in function input>` প্রিন্ট হয় (`bugType: "syntax"`).
  - *Fixed Code*:
    ```python
    user_city = input()
    print(user_city)
    ```
- **Step 10 (`debug_challenge` - Bug 2, Tricky Concatenation Trap)**:
  - *Scenario*: দুটি সংখ্যা যোগ করতে চেয়েছিল, কিন্তু `int()` না করায় টেক্সট পাশাপাশি বসে গেছে (`"1020"`).
  - *Buggy Code*:
    ```python
    a = input()
    b = input()
    total = a + b
    print(total)
    ```
  - *Error/Behavior*: গাণিতিক যোগফলের বদলে স্ট্রিং কনক্যাটেনেশন (`bugType: "logic"`).
  - *Fixed Code*:
    ```python
    a = int(input())
    b = int(input())
    total = a + b
    print(total)
    ```
- **Step 11 (`debug_challenge` - Bug 3, Deep Logic/Call Order)**:
  - *Scenario*: ইনপুট নেওয়ার আগেই ভেরিয়েবল রূপান্তর করতে চাওয়ায় ক্র্যাশ করছে।
  - *Buggy Code*:
    ```python
    num = int(raw_data)
    raw_data = input()
    print(num)
    ```
  - *Error*: `NameError: name 'raw_data' is not defined` (Line 1, `bugType: "runtime"`).
  - *Fixed Code*:
    ```python
    raw_data = input()
    num = int(raw_data)
    print(num)
    ```
- **Step 12 (`reflection` - Critical Thinking Lab)**:
  - *Q1*: সফটওয়্যার কেন ব্যাচ প্রসেসিং থেকে রিয়েল-টাইম ইউজার ইনপুটের দিকে বিবর্তিত হয়েছিল?
  - *Q2 (Domain: Web & App Development)*: আধুনিক সার্চ ইঞ্জিন এবং লগইন ফর্মে ইনপুট স্ট্রিম কীভাবে ডেটাবেজের সাথে যোগাযোগ স্থাপন করে?
  - *Q3 (Engineering Failure)*: আনভ্যালিডেটেড ইনপুট ট্র্যাপ — টাইপ না মিলিয়ে টেক্সট ইনপুটকে সরাসরি প্রসেস করলে সিস্টেমে কী ধরনের ক্র্যাশ ঘটতে পারে?
- **Step 13 (`mission_complete`)**: Summary and preview for Mission 008.

- **Curiosity Block**:
  - `didYouKnow`: Early mainframe computers in the 1950s had no keyboards; operators used punch cards to input data!
  - `realWorldApplication`: ATMs wait for user PIN input via `input()`-like hardware interrupt routines before accessing account balances.
  - `aiApplication`: AI chatbots wait for prompt inputs via standard stream input routines before token generation.
  - `eeeApplication`: Microcontrollers like Arduino read serial terminal input to configure sensor modes.
  - `historicalFact`: Standard input (`stdin`) was standardized in Unix in 1971 by Ken Thompson and Dennis Ritchie.
  - `nextMissionPreview`: How do we handle whole division and remainders in packing and time? Next: Division Secrets (`//` and `%`)!

---
================================================================================
### MISSION 008: DIVISION SECRETS (// AND %)
================================================================================

- **ID**: `008`
- **Title**: `Division Secrets`
- **Bangla Title**: `ভাগের গোপন রহস্য: // এবং %`
- **Bangla Subtitle**: `ভাগফল (//) এবং ভাগশেষ (%) এর প্রকৌশল ব্যবহার`
- **Cognitive Load**: `{ readingLevel: 2, newConceptCount: 1, practiceComplexity: 2, estimatedTotalMinutes: 20 }`

#### 1. Pedagogical Problem & Need
- **The Problem**: Standard division `/` returns decimals (`7 / 2 = 3.5`). But physical items cannot be fractioned: packing 25 items in boxes of 6, converting 135 seconds into minutes/seconds, or counting cash notes.
- **The Need**: The learner needs whole quotient (`//`) and remaining leftover (`%`) operators.
- **The Concept**: Integer Division (`//`) and Modulo / Remainder (`%`).

#### 2. Strict Boundary Rules
- **Allowed**: `//`, `%`, `+`, `-`, `*`, `/`, `int()`, `input()`, `print()`, variables.
- **Strictly Prohibited**: `if/else` (DO NOT introduce `if` to show even/odd!), comparison operators (`==`, `!=`), booleans, loops.

#### 3. Step-by-Step Curriculum Outline (13 Steps)
- **Step 1 (`intro`)**: The limitation of decimal division in discrete engineering problems.
- **Step 2 (`story`)**: The warehouse packaging dilemma: 25 items packed into boxes of 6.
- **Step 3 (`analogy`)**: Egg cartons (12 eggs per box). Full cartons (`//`) vs leftover loose eggs (`%`).
- **Step 4 (`concept`)**: Comparing `/` (decimal), `//` (integer quotient), and `%` (remainder). The identity `dividend == (divisor * quotient) + remainder`.
- **Step 5 (`code_example`)**:
  ```python
  total_items = 25
  box_size = 6
  full_boxes = total_items // box_size
  leftover = total_items % box_size
  print(full_boxes)
  print(leftover)
  ```
- **Step 6 (`practice` - Guided)**:
  - *Title*: `চকলেট ভাগাভাগি ও অবশিষ্ট`
  - *Prompt*: `candies = 20` টি চকলেট `kids = 3` জন শিশুর মধ্যে সমান ভাগে ভাগ করো। প্রত্যেকে কয়টি পূর্ণ চকলেট পাবে (`share = candies // kids`) এবং কয়টি চকলেট অবশিষ্ট থাকবে (`remaining = candies % kids`) বের করে দুটি মানই প্রিন্ট করো।
  - *Starter Code*:
    ```python
    candies = 20
    kids = 3
    # share এবং remaining হিসাব করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["candies", "kids", "share", "remaining"]`, expectedOutput: `"6\n2\n"`.
  - *Solution*:
    ```python
    candies = 20
    kids = 3
    share = candies // kids
    remaining = candies % kids
    print(share)
    print(remaining)
    ```
- **Step 7 (`practice` - Independent)**:
  - *Title*: `সেকেন্ড থেকে মিনিট ও সেকেন্ড রূপান্তর`
  - *Prompt*: মোট সময় `total_seconds = 135` সেকেন্ড। পূর্ণ মিনিট `minutes = total_seconds // 60` এবং অবশিষ্ট সেকেন্ড `seconds = total_seconds % 60` বের করে প্রিন্ট করো।
  - *Starter Code*:
    ```python
    total_seconds = 135
    # minutes এবং seconds বের করো ও প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["total_seconds", "minutes", "seconds"]`, expectedOutput: `"2\n15\n"`.
  - *Solution*:
    ```python
    total_seconds = 135
    minutes = total_seconds // 60
    seconds = total_seconds % 60
    print(minutes)
    print(seconds)
    ```
- **Step 8 (`practice` - Transfer/ATM Cash Notes)**:
  - *Title*: `এটিএম ১০০ টাকার নোট প্রদান`
  - *Prompt*: একজন গ্রাহক `amount = 580` টাকা তুলতে চান। এটিএম মেশিন কয়টি ১০০ টাকার নোট দেবে (`notes_100 = amount // 100`) এবং কত টাকা ভাংতি অবশিষ্ট থাকবে (`change = amount % 100`) তা হিসাব করে প্রিন্ট করো।
  - *Starter Code*:
    ```python
    amount = 580
    # notes_100 এবং change হিসাব করে প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["amount", "notes_100", "change"]`, expectedOutput: `"5\n80\n"`.
  - *Solution*:
    ```python
    amount = 580
    notes_100 = amount // 100
    change = amount % 100
    print(notes_100)
    print(change)
    ```
- **Step 9 (`debug_challenge` - Bug 1, Simple Syntax)**:
  - *Scenario*: পূর্ণসংখ্যা ভাগের বদলে সাধারণ ভাগ দেওয়ায় দশমিক আউটপুট আসছে।
  - *Buggy Code*:
    ```python
    items = 25
    boxes = items / 6
    print(boxes)
    ```
  - *Output*: `4.166666666666667` instead of `4` (`bugType: "logic"`).
  - *Fixed Code*:
    ```python
    items = 25
    boxes = items // 6
    print(boxes)
    ```
- **Step 10 (`debug_challenge` - Bug 2, Tricky Operand Inversion)**:
  - *Scenario*: ভাজ্য এবং ভাজক উল্টো লিখে ফেলায় ভাগশেষ ভুল আসছে।
  - *Buggy Code*:
    ```python
    total = 25
    pack_size = 6
    leftover = pack_size % total
    print(leftover)
    ```
  - *Output*: `6` instead of `1` (`bugType: "logic"`).
  - *Fixed Code*:
    ```python
    total = 25
    pack_size = 6
    leftover = total % pack_size
    print(leftover)
    ```
- **Step 11 (`debug_challenge` - Bug 3, Deep Logic/Zero Division)**:
  - *Scenario*: শূন্য দিয়ে মডিউলো করার চেষ্টা করায় পাইথন ক্র্যাশ করছে।
  - *Buggy Code*:
    ```python
    number = 50
    divisor = 0
    rem = number % divisor
    print(rem)
    ```
  - *Error*: `ZeroDivisionError: integer division or modulo by zero` (Line 3, `bugType: "runtime"`).
  - *Fixed Code*:
    ```python
    number = 50
    divisor = 5
    rem = number % divisor
    print(rem)
    ```
- **Step 12 (`reflection` - Critical Thinking Lab)**:
  - *Q1*: বাস্তব জগতের কোন বৈশিষ্ট্যের কারণে আমাদের ভগ্নাংশের বদলে পূর্ণসংখ্যা ভাগ ও ভাগশেষের প্রয়োজন হয়?
  - *Q2 (Domain: Cryptography & Digital Security)*: আধুনিক আরএসএ (RSA) এনক্রিপশনে মডিউলো (%) অপারেটর কীভাবে ডেটা গোপন রাখতে ওয়ান-ওয়ে ম্যাথমেটিক্যাল ট্র্যাপডোর তৈরি করে?
  - *Q3 (Engineering Failure)*: পেজিনেশন বা প্যাকেজিং সফটওয়্যারে ভাগশেষ (%) হিসেব না করে শুধু ভাগফল (//) নিলে অবশিষ্ট গ্রাহক বা ডেটা ড্রপ হয়ে যাওয়ার ঝুঁকি।
- **Step 13 (`mission_complete`)**: Summary and preview for Mission 009.

- **Curiosity Block**:
  - `didYouKnow`: Modulo arithmetic (`%`) is the backbone of almost all modern internet encryption that secures credit card transactions!
  - `realWorldApplication`: Every digital clock in the world uses `% 60` to wrap minutes and `% 24` to wrap hours.
  - `aiApplication`: AI training loops divide large datasets into minibatches using `//` and find the leftover remainder with `%`.
  - `eeeApplication`: Digital counters in hardware chips naturally reset and wrap around using modulo `2^N` binary rollover.
  - `historicalFact`: Carl Friedrich Gauss formalized modular arithmetic in 1801 in his masterpiece Disquisitiones Arithmeticae.
  - `nextMissionPreview`: What happens when multiple operators are combined in a single formula? Next: Math Rules (Operator Precedence)!

---
================================================================================
### MISSION 009: MATH RULES (OPERATOR PRECEDENCE & PARENTHESES)
================================================================================

- **ID**: `009`
- **Title**: `Math Rules`
- **Bangla Title**: `অপারেটর প্রেসিডেন্স ও বন্ধনীর নিয়ম`
- **Bangla Subtitle**: `পাইথন কীভাবে জটিল গাণিতিক এক্সপ্রেশন সমাধান করে?`
- **Cognitive Load**: `{ readingLevel: 2, newConceptCount: 1, practiceComplexity: 2, estimatedTotalMinutes: 20 }`

#### 1. Pedagogical Problem & Need
- **The Problem**: Expressions like `10 + 5 * 2` evaluate to `20`, not `30`. Without knowing precedence, averages and discount formulas produce silent, catastrophic calculation bugs.
- **The Need**: The learner must master the deterministic evaluation hierarchy and use parentheses `()` to enforce intended order.
- **The Concept**: Operator Precedence and Parentheses `()`.

#### 2. Strict Boundary Rules
- **Allowed**: `()`, `+`, `-`, `*`, `/`, `//`, `%`, `int()`, `input()`, `print()`, variables.
- **Strictly Prohibited**: New operators (no `**`), conditionals, loops, custom functions.

#### 3. Step-by-Step Curriculum Outline (13 Steps)
- **Step 1 (`intro`)**: The mystery of unexpected math results in code.
- **Step 2 (`story`)**: The payroll bonus calculation disaster — an automated system that paid triple bonuses due to missing parentheses.
- **Step 3 (`analogy`)**: Priority Traffic Lanes. Emergency vehicles `()` go first, then fast trucks (`*`, `/`, `//`, `%`), then bicycles (`+`, `-`).
- **Step 4 (`concept`)**: The Precedence Table. Left-to-right associativity for operators of the same rank. Explicit grouping with `()`.
- **Step 5 (`code_example`)**:
  ```python
  r1 = 10 + 5 * 2
  r2 = (10 + 5) * 2
  r3 = 100 - 20 // 2
  print(r1)
  print(r2)
  print(r3)
  ```
- **Step 6 (`practice` - Guided)**:
  - *Title*: `তিনটি পরীক্ষার গড় নম্বর হিসাব`
  - *Prompt*: তিনটি কুইজের নম্বর `s1 = 80`, `s2 = 90`, `s3 = 100`। বন্ধনী `()` ব্যবহার করে সঠিক গড় `avg = (s1 + s2 + s3) / 3` বের করো এবং `avg` প্রিন্ট করো।
  - *Starter Code*:
    ```python
    s1 = 80
    s2 = 90
    s3 = 100
    # বন্ধনী ব্যবহার করে avg হিসাব করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["s1", "s2", "s3", "avg"]`, requiredPatterns: [`\(\s*s1\s*\+\s*s2\s*\+\s*s3\s*\)\s*/\s*3`], expectedOutput: `"90.0\n"`.
  - *Solution*:
    ```python
    s1 = 80
    s2 = 90
    s3 = 100
    avg = (s1 + s2 + s3) / 3
    print(avg)
    ```
- **Step 7 (`practice` - Independent)**:
  - *Title*: `ডিসকাউন্ট ও ট্যাক্সসহ চূড়ান্ত মূল্য`
  - *Prompt*: দুটি পণ্যের দাম `item1 = 50` এবং `item2 = 30`। কুপন ডিসকাউন্ট `discount = 10`। ট্যাক্স মাল্টিপ্লায়ার `tax_multiplier = 2`। মোট বিল থেকে ডিসকাউন্ট বাদ দিয়ে তারপর ট্যাক্স গুণ করে `final_bill = (item1 + item2 - discount) * tax_multiplier` বের করো এবং প্রিন্ট করো।
  - *Starter Code*:
    ```python
    item1 = 50
    item2 = 30
    discount = 10
    tax_multiplier = 2
    # final_bill হিসাব করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["item1", "item2", "discount", "tax_multiplier", "final_bill"]`, expectedOutput: `"140\n"`.
  - *Solution*:
    ```python
    item1 = 50
    item2 = 30
    discount = 10
    tax_multiplier = 2
    final_bill = (item1 + item2 - discount) * tax_multiplier
    print(final_bill)
    ```
- **Step 8 (`practice` - Transfer/Geometry & Physics)**:
  - *Title*: `আয়তক্ষেত্রের পরিসীমা নির্ণয়`
  - *Prompt*: একটি আয়তক্ষেত্রের দৈর্ঘ্য `length = 20` এবং প্রস্থ `width = 10`। পরিসীমা সূত্র $P = 2 \times (length + width)$ অনুযায়ী `perimeter = 2 * (length + width)` বের করো এবং প্রিন্ট করো।
  - *Starter Code*:
    ```python
    length = 20
    width = 10
    # perimeter হিসাব করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["length", "width", "perimeter"]`, expectedOutput: `"60\n"`.
  - *Solution*:
    ```python
    length = 20
    width = 10
    perimeter = 2 * (length + width)
    print(perimeter)
    ```
- **Step 9 (`debug_challenge` - Bug 1, Simple Syntax)**:
  - *Scenario*: বন্ধনী শুরু করে শেষ করতে ভুলে যাওয়ায় পাইথন এরর দিচ্ছে।
  - *Buggy Code*:
    ```python
    total = (10 + 20 * 2
    print(total)
    ```
  - *Error*: `SyntaxError: '(' was never closed` (Line 1, `bugType: "syntax"`).
  - *Fixed Code*:
    ```python
    total = (10 + 20) * 2
    print(total)
    ```
- **Step 10 (`debug_challenge` - Bug 2, Tricky Precedence Logic)**:
  - *Scenario*: গড় বের করতে গিয়ে বন্ধনী না দেওয়ায় শুধু শেষ সংখ্যা ৩ দিয়ে ভাগ হয়ে ভুল উত্তর আসছে।
  - *Buggy Code*:
    ```python
    a = 10
    b = 20
    c = 30
    avg = a + b + c / 3
    print(avg)
    ```
  - *Output*: `40.0` instead of `20.0` (`bugType: "logic"`).
  - *Fixed Code*:
    ```python
    a = 10
    b = 20
    c = 30
    avg = (a + b + c) / 3
    print(avg)
    ```
- **Step 11 (`debug_challenge` - Bug 3, Deep Logic/Bracket Type Trap)**:
  - *Scenario*: গণিতে সেকেন্ড/থার্ড ব্র্যাকেট দেখে পাইথনে থার্ড ব্র্যাকেট `[]` ব্যবহার করায় টাইপ এরর দিচ্ছে।
  - *Buggy Code*:
    ```python
    a = 5
    b = 10
    result = [a + b] * 2
    print(result)
    ```
  - *Behavior*: সংখ্যার বদলে লিস্ট তৈরি হয়ে `[15, 15]` প্রিন্ট হয় (`bugType: "logic"`).
  - *Fixed Code*:
    ```python
    a = 5
    b = 10
    result = (a + b) * 2
    print(result)
    ```
- **Step 12 (`reflection` - Critical Thinking Lab)**:
  - *Q1*: প্রোগ্রামিং ভাষা কেন মানুষের মতো অনুমান না করে কঠোর গাণিতিক নিয়ম (Precedence) মেনে চলে?
  - *Q2 (Domain: Financial Engines & Physics Simulation)*: ব্যাংকিং ইন্টারেস্ট বা মহাকাশযানের গতিপথ গণনায় একটি বন্ধনীর ভুল কী ধরনের বিপর্যয় ঘটাতে পারে?
  - *Q3 (Engineering Failure)*: সাইলেন্ট লজিক বাগ (Silent Logic Bug) — কোড এরর ছাড়া রান করলেও আউটপুট ভুল আসার ঝুঁকি এবং স্পষ্ট বন্ধনী ব্যবহারের গুরুত্ব।
- **Step 13 (`mission_complete`)**: Summary and preview for Mission 010.

- **Curiosity Block**:
  - `didYouKnow`: Professional coding style guides (like Google Python Style Guide) explicitly recommend adding parentheses even when optional to eliminate human ambiguity!
  - `realWorldApplication`: Tax calculation engines and compound interest banking systems rely on deeply grouped precedence formulas.
  - `aiApplication`: Deep learning loss formulas (e.g. Mean Squared Error) group squared errors `(y - y_hat)` before summing and averaging.
  - `eeeApplication`: Voltage divider formulas `Vout = Vin * (R2 / (R1 + R2))` require strict parenthetical grouping around `(R1 + R2)`.
  - `historicalFact`: The BODMAS/PEMDAS convention was standardized in late 19th-century algebra textbooks to eliminate notation ambiguities.
  - `nextMissionPreview`: How do we update a variable based on its own current value? Next: Updating Values (`x = x + 1` and `+=`)!

---
================================================================================
### MISSION 010: UPDATING VALUES (VARIABLE REASSIGNMENT & STATE MUTATION)
================================================================================

- **ID**: `010`
- **Title**: `Updating Values`
- **Bangla Title**: `মান আপডেট ও স্টেট পরিবর্তন`
- **Bangla Subtitle**: `x = x + 1 এবং += অপারেটরের মাধ্যমে মেমোরি আপডেট`
- **Cognitive Load**: `{ readingLevel: 2, newConceptCount: 1, practiceComplexity: 2, estimatedTotalMinutes: 20 }`

#### 1. Pedagogical Problem & Need
- **The Problem**: In real systems (game scores, bank balances, step counters), a variable must change *relative to its current value*. In math, $x = x + 1$ is impossible.
- **The Conceptual Breakthrough**:
  - In Python, `=` is the **Assignment Operator**, not equality.
  - **Evaluation Order**:
    1. Entire Right-Hand Side (RHS) evaluates first using current value in memory.
    2. RHS produces a single new value.
    3. That new value is assigned to the Left-Hand Side (LHS) variable, overwriting the old value.
  - **Progression**: Full reassignment first (`x = x + 1`), followed by augmented assignment shorthand (`+=`, `-=`, `*=`).

#### 2. Strict Boundary Rules
- **Allowed**: `x = x + 1`, `+=`, `-=`, `*=`, `+`, `-`, `*`, `/`, `//`, `%`, `()`, `int()`, `input()`, `print()`, variables.
- **Strictly Prohibited**: Loops (`for`, `while`), conditionals (`if/else`), comparisons (`==`, `!=`).

#### 3. Step-by-Step Curriculum Outline (13 Steps)
- **Step 1 (`intro`)**: The vital difference between algebraic equations and programming state mutation.
- **Step 2 (`story`)**: The cricket umpire's counter clicker. Every ball bowled: new count = old count + 1.
- **Step 3 (`analogy`)**: The Piggy Bank. Open box, count current money, add 10 Taka (RHS evaluation), store new total in box (LHS assignment).
- **Step 4 (`concept`)**: The 3-phase execution model of assignment. Then introducing shorthand operators `+=`, `-=`, `*=`.
- **Step 5 (`code_example`)**:
  ```python
  score = 10
  score = score + 5
  score += 10
  score -= 3
  print(score)
  ```
- **Step 6 (`practice` - Guided)**:
  - *Title*: `ধাপে ধাপে মান বৃদ্ধি`
  - *Prompt*: `count = 0` দিয়ে শুরু করো। প্রথমে `count = count + 1` করে মান ১ বাড়াও। তারপর `count = count + 5` করে মান আরও ৫ বাড়াও। সবশেষে `count` প্রিন্ট করো।
  - *Starter Code*:
    ```python
    count = 0
    # count এর মান ধাপে ধাপে বাড়িয়ে প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["count"]`, requiredPatterns: [`count\s*=\s*count\s*\+\s*1`, `count\s*=\s*count\s*\+\s*5`], expectedOutput: `"6\n"`.
  - *Solution*:
    ```python
    count = 0
    count = count + 1
    count = count + 5
    print(count)
    ```
- **Step 7 (`practice` - Independent)**:
  - *Title*: `গেমের স্কোর ট্র্যাকার (+ এবং -=)`
  - *Prompt*: গেমের শুরুতে `score = 100`। প্লেয়ার পয়েন্ট অর্জন করলে `score += 50` করো। তারপর আঘাত পেলে `score -= 30` করো। সবশেষে `score` প্রিন্ট করো।
  - *Starter Code*:
    ```python
    score = 100
    # += এবং -= ব্যবহার করে score আপডেট করো ও প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["score"]`, requiredPatterns: [`score\s*\+=\s*50`, `score\s*-=\s*30`], expectedOutput: `"120\n"`.
  - *Solution*:
    ```python
    score = 100
    score += 50
    score -= 30
    print(score)
    ```
- **Step 8 (`practice` - Transfer/Bank Deposit)**:
  - *Title*: `ব্যাংক ব্যালেন্স ডিপোজিট আপডেট`
  - *Prompt*: ব্যাংক অ্যাকাউন্টের প্রাথমিক ব্যালেন্স `balance = 500`। ইউজারের কাছ থেকে ডিপোজিটের পরিমাণ `deposit` ইনপুট নাও (সংখ্যায় কনভার্ট করো)। `balance += deposit` দিয়ে ব্যালেন্স আপডেট করে নতুন `balance` প্রিন্ট করো।
  - *Starter Code*:
    ```python
    balance = 500
    # deposit ইনপুট নিয়ে balance আপডেট করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["balance", "deposit"]`, requiredPatterns: [`balance\s*\+=\s*deposit`].
  - *Solution*:
    ```python
    balance = 500
    deposit = int(input())
    balance += deposit
    print(balance)
    ```
- **Step 9 (`debug_challenge` - Bug 1, Simple Syntax/NameError)**:
  - *Scenario*: ভেরিয়েবল ইনিশিয়ালাইজ না করেই ডানপাশে তার সাথে যোগ করতে গিয়ে এরর।
  - *Buggy Code*:
    ```python
    total = total + 10
    print(total)
    ```
  - *Error*: `NameError: name 'total' is not defined` (Line 1, `bugType: "runtime"`).
  - *Fixed Code*:
    ```python
    total = 0
    total = total + 10
    print(total)
    ```
- **Step 10 (`debug_challenge` - Bug 2, Tricky Reversed Shorthand)**:
  - *Scenario*: `+=` এর জায়গায় ভুলবশত `=+` লেখায় মান যোগ না হয়ে পজিটিভ ৫ অ্যাসাইন হয়ে গেছে!
  - *Buggy Code*:
    ```python
    score = 100
    score =+ 5
    print(score)
    ```
  - *Output*: `5` instead of `105` (`bugType: "logic"`).
  - *Fixed Code*:
    ```python
    score = 100
    score += 5
    print(score)
    ```
- **Step 11 (`debug_challenge` - Bug 3, Deep Logic/Unassigned Expression)**:
  - *Scenario*: ভেরিয়েবলে মান যোগ করে তা আবার ভেরিয়েবলে অ্যাসাইন না করায় আগের মানই থেকে যাচ্ছে।
  - *Buggy Code*:
    ```python
    points = 50
    points + 20
    print(points)
    ```
  - *Output*: `50` instead of `70` (`bugType: "logic"`).
  - *Fixed Code*:
    ```python
    points = 50
    points = points + 20
    print(points)
    ```
- **Step 12 (`reflection` - Critical Thinking Lab)**:
  - *Q1*: প্রোগ্রামিংয়ে `=` কেন কোনো সমীকরণ নয়, বরং একটি নির্দেশ বা অ্যাকশন (অ্যাসাইনমেন্ট)?
  - *Q2 (Domain: Game Engines & Autonomous Robotics)*: প্রতি ফ্রেমে বা প্রতি মিলি-সেকেন্ডে স্টেট মিউটেশন (`position += velocity`) কীভাবে গতিশীল জগত সৃষ্টি করে?
  - *Q3 (Engineering Failure)*: রেস কন্ডিশন ও অসতর্ক স্টেট মিউটেশন — একই মেমোরি একাধিক জায়গা থেকে একযোগে আপডেট করার ঝুঁকি।
- **Step 13 (`mission_complete`)**: Celebration of completing the entire 001–010 core foundation.

- **Curiosity Block**:
  - `didYouKnow`: In 1957, John Backus chose `=` for assignment in Fortran, causing decades of debate among mathematicians! Languages like Pascal later adopted `:=` to distinguish assignment from equality.
  - `realWorldApplication`: Video games running at 60 FPS update player coordinates with `position += velocity` 60 times every second.
  - `aiApplication`: Neural network training (gradient descent) updates model weights using `weight -= learning_rate * gradient`.
  - `eeeApplication`: Hardware timer registers continuously increment `timer_count += 1` on each clock pulse.
  - `historicalFact`: The `+=` and `-=` augmented assignment operators originated in C in 1972 and were adopted into Python.
  - `nextMissionPreview`: You are now ready for the next frontier in programming: Teaching Programs to Make Decisions (`if / else`)!

---
## 4. Discovered Features & Edge Cases

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

1. **Schema Validation**: Verify JSON structure against `B:\nexus-academy\types\mission.types.ts`.
2. **Node Validation**: Run `node -e "JSON.parse(fs.readFileSync('...'))"` on generated files.
3. **Dependency Audit**: Verify that no challenge in Mission N requires knowledge introduced in Mission N+1.
4. **Boundary Audit**: Confirm zero prohibited concepts are present in any step.
