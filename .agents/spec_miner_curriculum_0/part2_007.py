# -*- coding: utf-8 -*-
with open("B:/nexus-academy/.agents/spec_miner_curriculum_0/handoff.md", "a", encoding="utf-8") as f:
    f.write("""================================================================================
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
  - *Validation*: `smart_output_source`, requiredVariables: `["user_name", "city"]`, requiredPatterns: [`input\\s*\\(`].
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
  - *Validation*: `smart_output_source`, requiredVariables: `["unit_price", "quantity", "total"]`, requiredPatterns: [`int\\s*\\(\\s*input`].
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
  - *Validation*: `smart_output_source`, requiredVariables: `["num1", "num2", "result"]`, requiredPatterns: [`int\\s*\\(\\s*input`].
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
""")
print("Mission 007 appended.")
