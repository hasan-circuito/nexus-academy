# -*- coding: utf-8 -*-
with open("B:/nexus-academy/.agents/spec_miner_curriculum_0/handoff.md", "a", encoding="utf-8") as f:
    f.write("""================================================================================
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
  - *Validation*: `smart_output_source`, requiredVariables: `["candies", "kids", "share", "remaining"]`, expectedOutput: `"6\\n2\\n"`.
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
  - *Validation*: `smart_output_source`, requiredVariables: `["total_seconds", "minutes", "seconds"]`, expectedOutput: `"2\\n15\\n"`.
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
  - *Validation*: `smart_output_source`, requiredVariables: `["amount", "notes_100", "change"]`, expectedOutput: `"5\\n80\\n"`.
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
""")
print("Mission 008 appended.")
