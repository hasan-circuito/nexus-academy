# -*- coding: utf-8 -*-
with open("B:/nexus-academy/.agents/spec_miner_curriculum_0/handoff.md", "a", encoding="utf-8") as f:
    f.write("""================================================================================
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
  - *Validation*: `smart_output_source`, requiredVariables: `["s1", "s2", "s3", "avg"]`, requiredPatterns: [`\\(\\s*s1\\s*\\+\\s*s2\\s*\\+\\s*s3\\s*\\)\\s*/\\s*3`], expectedOutput: `"90.0\\n"`.
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
  - *Validation*: `smart_output_source`, requiredVariables: `["item1", "item2", "discount", "tax_multiplier", "final_bill"]`, expectedOutput: `"140\\n"`.
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
  - *Prompt*: একটি আয়তক্ষেত্রের দৈর্ঘ্য `length = 20` এবং প্রস্থ `width = 10`। পরিসীমা সূত্র $P = 2 \\times (length + width)$ অনুযায়ী `perimeter = 2 * (length + width)` বের করো এবং প্রিন্ট করো।
  - *Starter Code*:
    ```python
    length = 20
    width = 10
    # perimeter হিসাব করো এবং প্রিন্ট করো
    ```
  - *Validation*: `smart_output_source`, requiredVariables: `["length", "width", "perimeter"]`, expectedOutput: `"60\\n"`.
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
""")
print("Mission 009 appended.")
