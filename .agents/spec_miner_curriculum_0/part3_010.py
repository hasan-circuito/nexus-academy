# -*- coding: utf-8 -*-
with open("B:/nexus-academy/.agents/spec_miner_curriculum_0/handoff.md", "a", encoding="utf-8") as f:
    f.write("""================================================================================
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
  - *Validation*: `smart_output_source`, requiredVariables: `["count"]`, requiredPatterns: [`count\\s*=\\s*count\\s*\\+\\s*1`, `count\\s*=\\s*count\\s*\\+\\s*5`], expectedOutput: `"6\\n"`.
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
  - *Validation*: `smart_output_source`, requiredVariables: `["score"]`, requiredPatterns: [`score\\s*\\+=\\s*50`, `score\\s*-=\\s*30`], expectedOutput: `"120\\n"`.
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
  - *Validation*: `smart_output_source`, requiredVariables: `["balance", "deposit"]`, requiredPatterns: [`balance\\s*\\+=\\s*deposit`].
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
""")
print("Mission 010 appended.")
