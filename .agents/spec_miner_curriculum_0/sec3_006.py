# -*- coding: utf-8 -*-
text = """## 3. Deep Mission Specifications (Missions 006–010)

================================================================================
### MISSION 006: BASIC ARITHMETIC
================================================================================

- **ID**: `006`
- **Title**: `Basic Arithmetic`
- **Bangla Title**: `কম্পিউটার যখন গণিত করে`
- **Bangla Subtitle**: `যোগ, বিয়োগ, গুণ ও ভাগের মাধ্যমে ডেটা প্রসেসিং`
- **Cognitive Load**: `{ readingLevel: 2, newConceptCount: 1, practiceComplexity: 2, estimatedTotalMinutes: 20 }`

#### 1. Pedagogical Problem & Need
- **The Problem**: Variables hold numbers (`price = 50`, `discount = 10`), but the program cannot combine them. An EEE circuit script with current and resistance cannot calculate voltage. Stored numbers sit frozen in memory.
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
  - *Validation*: `smart_output_source`, requiredVariables: `["item1", "item2", "discount", "total"]`, expectedOutput: `"85\\n"`.
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
  - *Validation*: `smart_output_source`, requiredVariables: `["unit_price", "ticket_count", "total_cost", "per_person"]`, expectedOutput: `"200\\n100.0\\n"`.
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
  - *Prompt*: একটি বর্তনীতে কারেন্ট `current = 3` অ্যাম্পিয়ার এবং রোধ `resistance = 10` ওহম। ওহমের সূত্র $V = I \\times R$ অনুযায়ী ভোল্টেজ `voltage = current * resistance` বের করো এবং `voltage` প্রিন্ট করো।
  - *Starter Code*:
    ```python
    current = 3
    resistance = 10
    # voltage হিসাব করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["current", "resistance", "voltage"]`, expectedOutput: `"30\\n"`.
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
"""

with open("B:/nexus-academy/.agents/spec_miner_curriculum_0/handoff.md", "a", encoding="utf-8") as f:
    f.write(text)
print("Mission 006 appended successfully.")

