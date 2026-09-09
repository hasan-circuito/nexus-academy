# Handoff Report: Mission 007 (User Input) Technical & Pedagogical Implementation Blueprint

**Agent**: `explorer_m007_0`  
**Working Directory**: `B:\nexus-academy\.agents\explorer_m007_0`  
**Target File**: `data/missions/mission-007.json`  
**Date**: 2026-08-28  
**Status**: COMPLETE — BLUEPRINT READY FOR AUTHORING

---

## 1. Observation

### 1.1 Direct File Observations
- **`B:\nexus-academy\.agents\ORIGINAL_REQUEST.md` (Lines 33-36)**:
  > "007 — User Input  
  > New capability: input()  
  > Reuse previously established arithmetic and int() where necessary.  
  > No float(), complex parsing, validation, conditionals, or loops."
- **`B:\nexus-academy\types\mission.types.ts` (Lines 45-305)**:
  - `MissionData` schema demands root fields: `id: string`, `title: string`, `banglaTitle: string`, `banglaSubtitle: string`, `cognitiveLoadEstimate: CognitiveLoadEstimate`, `curiosity: CuriosityBlock`, `steps: MissionStep[]`.
  - Step union supports: `intro`, `story`, `analogy`, `concept`, `code_example`, `practice`, `debug_challenge`, `reflection`, `mission_complete`.
  - `ValidationConfig`: `type: 'smart_output_source'`, `requiredVariables?: string[]`, `requiredPatterns?: string[]`, `forbiddenPatterns?: string[]`, `feedbackMessages?: ValidationFeedback`.
  - `CriticalThinkingQuestion`: `question: string`, `expertThinking: string`, `realWorldEngineering: string`, `beyondProgramming: string`.
- **`B:\nexus-academy\types\common.types.ts` (Lines 33, 45-59, 64-78)**:
  - `BugType` is `'syntax' | 'logic' | 'runtime' | 'indentation' | 'naming'`.
  - Fixed 13-step sequence index layout: `intro` (0), `story` (1), `analogy` (2), `concept` (3), `visualization` / `code_example` (4), `practice` 1 (5), `practice` 2 (6), `practice` 3 (7), `debug_challenge` 1 (8), `debug_challenge` 2 (9), `debug_challenge` 3 (10), `reflection` (11), `mission_complete` (12).
- **`B:\nexus-academy\data\missions\mission-006.json` (Lines 1-321)**:
  - Clean 13-step benchmark implementation with 3 practice steps, 3 debug challenges, 3-question 4-layer Critical Thinking Lab reflection, and root curiosity block.
- **`B:\nexus-academy\data\missions\mission-007.json` (Current state)**:
  - Outdated legacy content covering arithmetic/modulo division with 14 steps. Must be completely rewritten to match the verified single-concept `input()` specification.
- **`B:\nexus-academy\engines\python\strategies\SmartOutputSourceStrategy.ts` (Lines 24-109)**:
  - Confirms validation execution flow: Runtime error check -> Output check -> Forbidden patterns check -> Required variables regex check -> Required patterns regex check.

---

## 2. Logic Chain

1. **Prerequisite Baseline (Exiting M006)**:
   - Learner has mastered: `print()`, variable storage (`x = 5`), string literals (`"text"`), integer literals (`50`), `int()` and `str()` casting, and basic binary arithmetic (`+`, `-`, `*`, `/`).
   - Learner has NOT been introduced to: `input()`, `float()`, `//`, `%`, precedence grouping `()`, variable mutation (`x += 1`), conditionals (`if/else`), or loops.

2. **Pedagogical Problem & Need for Mission 007**:
   - *Problem*: In Mission 006, all mathematical processing used hardcoded values (`item1 = 40`, `item2 = 60`). To calculate for a different customer, the programmer had to open and edit the source code. The program is deaf and cannot interact with live users.
   - *Need*: The learner demands a way for the program to pause at runtime, listen to user input via the keyboard, and dynamically process that input.
   - *Single New Capability*: The `input()` function and its integration with `int()` for numerical computations.

3. **Cognitive Load & Boundary Calibration**:
   - `readingLevel: 2`, `newConceptCount: 1`, `practiceComplexity: 2`, `estimatedTotalMinutes: 22`.
   - Single core mental hurdle: Understanding that `input()` **ALWAYS returns a String**, so `"10" + "20"` results in string concatenation `"1020"`, necessitating `int(input())` or `int(var)` before arithmetic operations.
   - Boundary enforcement: Zero usage of `float()`, zero conditionals (`if`), zero loops, zero `//` or `%`, zero `+=`.

4. **13-Step Pedagogical Scaffolding**:
   - **Step 0 (`intro`)**: Motivation — transforming static scripts into live, interactive software.
   - **Step 1 (`story`)**: The Deaf Cash Register — the disaster of hardcoded prices in a retail checkout.
   - **Step 2 (`analogy`)**: Order Mic & Loudspeaker at a Drive-thru (`print()` = Loudspeaker/Mouth, `input()` = Mic/Ear).
   - **Step 3 (`concept`)**: Execution halting, Return type = String, String concatenation trap (`"10" + "20"` = `"1020"`), and `int(input())` type casting.
   - **Step 4 (`code_example`)**: Full trace showing text input, numeric conversion, arithmetic calculation, and output.
   - **Step 5 (`practice` - Guided)**: Text input for `user_name` and `city` + printing both.
   - **Step 6 (`practice` - Independent)**: Numeric input for `quantity`, converting with `int()`, multiplying by `unit_price = 120`, and printing `total`.
   - **Step 7 (`practice` - Application/Transfer)**: Dual numeric inputs `num1` and `num2`, converting both with `int()`, calculating `result = num1 + num2`, and printing `result`.
   - **Step 8 (`debug_challenge` - Level 1 Syntax)**: Missing parentheses on function call (`user_city = input`).
   - **Step 9 (`debug_challenge` - Level 2 Logic)**: String concatenation trap without `int()` producing `"1020"` instead of `30` (`total = a + b`).
   - **Step 10 (`debug_challenge` - Level 3 Runtime / Conceptual)**: Quoting variable name `"age" + 5` and missing integer conversion before calculation.
   - **Step 11 (`reflection` - Critical Thinking Lab)**: 3 deep questions with 4 layers each (Q1: Hardcoded vs Interactive Systems, Q2: Standard Input & IoT Serial Buffers, Q3: Unvalidated Input Traps & Financial Disasters).
   - **Step 12 (`mission_complete`)**: Summary and 4 key learning takeaways.

---

## 3. Detailed Specification & Blueprint for `data/missions/mission-007.json`

```json
{
  "id": "007",
  "title": "User Input",
  "banglaTitle": "ব্যবহারকারীর কাছ থেকে তথ্য নেওয়া",
  "banglaSubtitle": "input() ফাংশন ও ডায়নামিক ইন্টারেক্টিভ প্রোগ্রাম",
  "cognitiveLoadEstimate": {
    "readingLevel": 2,
    "newConceptCount": 1,
    "practiceComplexity": 2,
    "estimatedTotalMinutes": 22
  },
  "curiosity": {
    "didYouKnow": "জানতে কি? ১৯৫০-এর দশকে মেইনফ্রেম কম্পিউটারে কোনো কিবোর্ড ছিল না! ডেটা ইনপুট দেওয়ার জন্য পাঞ্চ কার্ড (পাঞ্চ করা কাগজের কার্ড) মেশিনে প্রবেশ করাতে হতো।",
    "realWorldApplication": "এটিএম (ATM) বুথ থেকে টাকা তোলার সময় সিস্টেম input() এর মতো ইন্টারাপ্ট রুটিনের মাধ্যমে ইউজারের গোপন পিন (PIN) ও টাকার পরিমাণ কিবোর্ড থেকে গ্রহণ করে।",
    "aiApplication": "ChatGPT বা যেকোনো এআই মডেলের সাথে যখন তুমি কথা বলো, তখন প্রম্পট বক্সের টেক্সটকে স্ট্যান্ডার্ড ইনপুট স্ট্রিম হিসেবে গ্রহণ করে এআই তার প্রসেসিং শুরু করে।",
    "eeeApplication": "ইলেকট্রিক্যাল ও আইওটি ডিভাইসে (যেমন: Arduino বা Raspberry Pi) সিরিয়াল মনিটর দিয়ে কিবোর্ড ইনপুট পাঠিয়ে সেন্সরের রেঞ্জ বা মোটরের স্পিড নিয়ন্ত্রণ করা হয়।",
    "historicalFact": "১৯৭১ সালে ইউনিক্স অপারেটিং সিস্টেম তৈরির সময় কেন থম্পসন এবং ডেনিস রিচি স্ট্যান্ডার্ড ইনপুট (stdin) এর ধারণা উদ্ভাবন করেন, যা আজকের input() ফাংশনের ভিত্তি।",
    "nextMissionPreview": "আমরা ব্যবহারকারীর কাছ থেকে সংখ্যা ইনপুট নিয়ে গণনা করতে পারি, কিন্তু পূর্ণসংখ্যার ভাগফল (//) আর ভাগশেষ (%) কীভাবে আলাদাভাবে বের করবো? পরবর্তী মিশনে দেখবো Division Secrets!"
  },
  "steps": [
    {
      "type": "intro",
      "missionNumber": "007",
      "title": "User Input",
      "banglaTitle": "ব্যবহারকারীর কাছ থেকে তথ্য নেওয়া",
      "tagline": "input() ফাংশন ও ডায়নামিক ইন্টারেক্টিভ প্রোগ্রাম",
      "description": "মিশন-০৬ এ তুমি শিখেছো কম্পিউটার মেমোরিতে থাকা সংখ্যা নিয়ে কীভাবে হিসাব-নিকাশ করতে পারে। কিন্তু এতদিন আমাদের লেখা প্রোগ্রামগুলোতে মানগুলো ফিক্সড বা হার্ডকোড করা ছিল (যেমন: price = 50)। বাস্তব সফটওয়্যার এমন হতে পারে না—সফটওয়্যারকে ব্যবহারকারীর দেওয়া তথ্য শুনে কাজ করতে হয়। এই মিশনে আমরা শিখবো পাইথনের input() ফাংশন ব্যবহার করে কীভাবে কিবোর্ড থেকে লাইভ ডেটা গ্রহণ করতে হয় এবং int() এর সাহায্যে ডায়নামিক ক্যালকুলেশন চালাতে হয়।",
      "learningObjectives": [
        "input() ফাংশন ব্যবহার করে রানটাইমে ব্যবহারকারীর কিবোর্ড ইনপুট গ্রহণ করা",
        "input() ফাংশন যে সবসময় টেক্সট বা String রিটার্ন করে সেই মেকানিজম বোঝা",
        "স্ট্রিং কনক্যাটেনেশন ট্র্যাপ এড়িয়ে গাণিতিক কাজের জন্য int(input()) রূপান্তরের নিয়ম আয়ত্ত করা",
        "ইনপুট ও পূর্বের গাণিতিক অপারেটর (+, -, *, /) সমন্বয়ে ডায়নামিক ও ইন্টারেক্টিভ প্রোগ্রাম তৈরি করা"
      ],
      "estimatedMinutes": 2
    },
    {
      "type": "story",
      "title": "বধির ক্যাশ রেজিস্টার",
      "setting": "একটি ব্যস্ত সুপারশপের বিলিং কাউন্টারে...",
      "content": "সুপারশপের প্রোগ্রামার একটি দুর্দান্ত বিলিং সফটওয়্যার বানিয়েছেন যা মুহূর্তেই পণ্যের দাম যোগ করে দিতে পারে। কিন্তু সফটওয়্যারটিতে পণ্যের দাম আগে থেকেই কোডের ভেতর লিখে রাখা: 'price = 100'। এখন দোকানে যে ক্রেতাই আসুক না কেন, বিল সবসময় ১০০ টাকাই আসে! অন্য কোনো ক্রেতা যদি ৫০ টাকার পণ্য কেনেন, তবে প্রোগ্রামারকে আবার মূল কোড খুলে সংখ্যা বদলাতে হয়। ক্যাশিয়ার বিরক্ত হয়ে বললেন, 'তোমার এই প্রোগ্রাম তো বধির! এটা ক্রেতার কথা শুনতেই পায় না!' তখন প্রোগ্রামার বুঝলেন, সফটওয়্যারকে সচল ও কার্যকর হতে হলে বাইরে থেকে ব্যবহারকারীর কথা শোনার ক্ষমতা থাকতে হবে — আর তখনই আবির্ভাব হলো input() ফাংশনের।",
      "moral": "যে প্রোগ্রাম ব্যবহারকারীর কাছ থেকে নতুন তথ্য গ্রহণ করতে পারে না, তা কখনোই বাস্তব দুনিয়ায় ব্যবহারের উপযোগী নয়।"
    },
    {
      "type": "analogy",
      "title": "অর্ডার মাইক বনাম লাউডস্পিকার",
      "realWorld": {
        "label": "রেস্তোরাঁর অর্ডার মাইক ও স্পিকার",
        "icon": "Mic",
        "description": "ড্রাইভ-থ্রু রেস্তোরাঁয় গ্রাহক মাইকে কথা বলে তার পছন্দের খাবারের অর্ডার দেন (ইনপুট), আর কাউন্টারের লাউডস্পিকারে সেই অর্ডার ঘোষণা করা হয় (আউটপুট)।"
      },
      "pythonConcept": {
        "label": "input() এবং print()",
        "icon": "TerminalSquare",
        "description": "print() হলো লাউডস্পিকার বা মুখ যা স্ক্রিনে কথা বলে (Output), আর input() হলো কান বা অর্ডার মাইক যা কিবোর্ডের মাধ্যমে ব্যবহারকারীর কথা শোনে (Input)।"
      },
      "connection": "কম্পিউটার শুধু print() দিয়ে একমুখী কথা বলে না; input() এর মাধ্যমে সে ব্যবহারকারীর সাথে দ্বিমুখী যোগাযোগ স্থাপন করে।",
      "deeperInsight": "input() কল হওয়ার সাথে সাথে পাইথন কোড এক্সিকিউশন থামিয়ে দিয়ে ব্যবহারকারী কিবোর্ডে লিখে Enter চাপার জন্য অপেক্ষা করে।"
    },
    {
      "type": "concept",
      "title": "input() ফাংশনের কার্যপদ্ধতি ও টাইপ রূপান্তর",
      "content": "পাইথনে কিবোর্ড থেকে তথ্য নেওয়ার জন্য input() ফাংশন ব্যবহার করা হয়।\n\n১. প্রোগ্রাম পজ হওয়া: যখনই পাইথন input() স্টেটমেন্টে পৌঁছায়, কোডের এক্সিকিউশন সেখানে থেমে যায় এবং ব্যবহারকারী কিবোর্ডে কিছু লিখে Enter চাপার জন্য অপেক্ষা করে।\n২. সবসময় String রিটার্ন করে: এটি পাইথনের একটি মহা গুরুত্বপূর্ণ নিয়ম—ব্যবহারকারী কিবোর্ডে যাই লিখুক না কেন (এমনকি সংখ্যা লিখলেও), input() তা টেক্সট বা String আকারে ফেরত দেয়। যেমন: ব্যবহারকারী 25 লিখলে পাইথন পায় \"25\"।\n৩. স্ট্রিং কনক্যাটেনেশন ট্র্যাপ: যেহেতু ইনপুট একটি স্ট্রিং, তাই int() ছাড়া + দিলে গাণিতিক যোগ না হয়ে টেক্সট জোড়া লেগে যায় (যেমন: \"10\" + \"20\" দিলে \"1020\" হয়)।\n৪. int() দিয়ে রূপান্তর: গাণিতিক হিসাব করার জন্য ইনপুট পাওয়ার সাথে সাথে int(input()) দিয়ে অথবা int(variable) দিয়ে সংখ্যায় রূপান্তর করে নিতে হয়।",
      "keyPoints": [
        "input() ব্যবহারকারীর কাছ থেকে কিবোর্ড ইনপুট গ্রহণ করে এবং কোড সাময়িক থামিয়ে রাখে।",
        "input() সবসময় String (টেক্সট) ডেটা রিটার্ন করে, সংখ্যা নয়।",
        "ইনপুটের ওপর গাণিতিক হিসাব চালাতে হলে অবশ্যই int() দিয়ে রূপান্তর করতে হয়।",
        "int(input()) বা দুটি ধাপে int(raw_input) লিখে ইনপুটকে সংখ্যায় পরিণত করা যায়।"
      ],
      "whyCallout": "ব্যবহারকারীর বিভিন্ন ইনপুটের ওপর ভিত্তি করে একই প্রোগ্রাম যেন কোটি কোটি মানুষের জন্য ভিন্ন ভিন্ন ফলাফল তৈরি করতে পারে, সেজন্য input() অপরিহার্য।",
      "whenToUse": "যখন ইউজারের নাম, বয়স, পণ্যের সংখ্যা বা যেকোনো ডায়নামিক তথ্য রানটাইমে কিবোর্ড থেকে প্রয়োজন হয় তখন input() ব্যবহার করবে।",
      "whenNotToUse": "পাই বা আলোর গতির মতো স্থির ধ্রুবক মানে input() প্রয়োজন নেই, এবং int() কনভার্ট না করে ইনপুট দিয়ে গণিত করার চেষ্টা করবে না।",
      "commonMisconception": "অনেকে মনে করে ইনপুট বক্সে সংখ্যা লিখলে পাইথন তা স্বয়ংক্রিয়ভাবে Integer হিসেবে নেয়। না! input() সবসময় String রিটার্ন করে, তাই গাণিতিক কাজে int() বাধ্যতামূলক।"
    },
    {
      "type": "code_example",
      "title": "ইউজার ইনপুট ও সংখ্যা রূপান্তরের উদাহরণ",
      "explanation": "নিচের উদাহরণটিতে দেখো কীভাবে ইউজারের নাম ও একটি সংখ্যা ইনপুট নিয়ে int() দিয়ে রূপান্তর করে মোট মূল্য হিসাব করা হয়েছে।",
      "language": "python",
      "code": "name = input()\nquantity_text = input()\nquantity = int(quantity_text)\ntotal_price = quantity * 50\n\nprint(name)\nprint(total_price)",
      "output": "Rahim\n150",
      "annotations": [
        {
          "lineNumber": 1,
          "explanation": "input() দিয়ে প্রথম লাইনে ব্যবহারকারীর নাম গ্রহণ করে name ভেরিয়েবলে রাখা হলো (String)"
        },
        {
          "lineNumber": 2,
          "explanation": "input() দিয়ে দ্বিতীয় লাইনে সংখ্যার টেক্সট গ্রহণ করে quantity_text এ রাখা হলো (যেমন: \"3\")"
        },
        {
          "lineNumber": 3,
          "explanation": "int() ফাংশন দিয়ে টেক্সট \"3\" কে পূর্ণসংখ্যা 3 এ রূপান্তর করে quantity ভেরিয়েবলে রাখা হলো"
        },
        {
          "lineNumber": 4,
          "explanation": "quantity এর সাথে প্রতি ইউনিটের দাম 50 গুণ করে total_price হিসাব করা হলো (3 * 50 = 150)"
        },
        {
          "lineNumber": 6,
          "explanation": "print(name) দিয়ে নাম স্ক্রিনে দেখানো হলো"
        },
        {
          "lineNumber": 7,
          "explanation": "print(total_price) দিয়ে মোট মূল্য স্ক্রিনে দেখানো হলো"
        }
      ],
      "postExplanation": "লক্ষ্য করো, input() সরাসরি গণিত করতে পারে না। প্রথমে quantity_text এ টেক্সট নেওয়া হয়েছে, তারপর int(quantity_text) দিয়ে পূর্ণসংখ্যা বানিয়ে তবেই গুণ করা সম্ভব হয়েছে।"
    },
    {
      "type": "practice",
      "title": "ইউজারের নাম ও শহরের তথ্য নেওয়া",
      "prompt": "input() ফাংশন ব্যবহার করে ইউজারের কাছ থেকে নাম user_name এবং শহরের নাম city ইনপুট নাও। তারপর print(user_name) এবং print(city) ব্যবহার করে দুটি মান পরপর প্রিন্ট করো।",
      "starterCode": "# 1. user_name ভেরিয়েবলে ইনপুট নাও\n\n# 2. city ভেরিয়েবলে ইনপুট নাও\n\n# 3. user_name এবং city পরপর প্রিন্ট করো\n",
      "hints": [
        "user_name = input() লিখে প্রথম ইনপুটটি গ্রহণ করো।",
        "city = input() লিখে দ্বিতীয় ইনপুটটি গ্রহণ করো।",
        "print(user_name) এবং print(city) দিয়ে দুটি ভেরিয়েবল স্ক্রিনে দেখাও।"
      ],
      "displayHint": "user_name = input(), city = input() এবং print() ব্যবহার করো",
      "expectedOutput": "",
      "validation": {
        "type": "smart_output_source",
        "ignoreWhitespace": true,
        "ignoreCase": true,
        "requiredVariables": [
          "user_name",
          "city"
        ],
        "requiredPatterns": [
          "user_name\\s*=\\s*input\\s*\\(\\s*\\)",
          "city\\s*=\\s*input\\s*\\(\\s*\\)",
          "print\\s*\\(\\s*user_name\\s*\\)",
          "print\\s*\\(\\s*city\\s*\\)"
        ],
        "forbiddenPatterns": [
          "user_name\\s*=\\s*[\"']",
          "city\\s*=\\s*[\"']"
        ],
        "feedbackMessages": {
          "onPass": "দারুণ! তুমি সফলভাবে input() ফাংশন ব্যবহার করে ইউজারের তথ্য গ্রহণ ও প্রিন্ট করেছ।",
          "onOutputMismatch": "আউটপুট সঠিক আসেনি। user_name এবং city ইনপুট নিয়ে প্রিন্ট করেছ কি?",
          "onPatternFail": "user_name = input() এবং city = input() লিখে ইনপুট নিতে হবে এবং দুটি ভেরিয়েবল প্রিন্ট করতে হবে।",
          "onMissingVariable": "user_name এবং city — দুটি ভেরিয়েবলই তৈরি করেছ কি?",
          "onHardcoded": "সরাসরি নাম বা শহরের টেক্সট অ্যাসাইন করা যাবে না! input() ফাংশন ব্যবহার করো।"
        }
      },
      "solution": "user_name = input()\ncity = input()\n\nprint(user_name)\nprint(city)",
      "solutionExplanation": "input() ফাংশন দুবার কল করে পরপর দুটি ইনপুট user_name ও city তে নেওয়া হয়েছে এবং print() দিয়ে তা স্ক্রিনে দেখানো হয়েছে।"
    },
    {
      "type": "practice",
      "title": "বই ক্রয়ের মোট মূল্য হিসাব",
      "prompt": "একটি বইয়ের দাম unit_price = 120 টাকা। ইউজারের কাছ থেকে বইয়ের সংখ্যা quantity ইনপুট নাও এবং int() দিয়ে পূর্ণসংখ্যায় রূপান্তর করো। মোট মূল্য total = quantity * unit_price হিসাব করে total প্রিন্ট করো।",
      "starterCode": "unit_price = 120\n\n# quantity ইনপুট নিয়ে int() করো এবং total হিসাব করে প্রিন্ট করো\n",
      "hints": [
        "quantity = int(input()) লিখে সরাসরি সংখ্যা ইনপুট নিতে পারো, অথবা আগে input() নিয়ে পরে int() করতে পারো।",
        "total = quantity * unit_price লিখে মোট মূল্য হিসাব করো।",
        "print(total) দিয়ে মোট মূল্য স্ক্রিনে দেখাও।"
      ],
      "displayHint": "quantity = int(input()) এবং total = quantity * unit_price ব্যবহার করো",
      "expectedOutput": "",
      "validation": {
        "type": "smart_output_source",
        "ignoreWhitespace": true,
        "ignoreCase": true,
        "requiredVariables": [
          "unit_price",
          "quantity",
          "total"
        ],
        "requiredPatterns": [
          "int\\s*\\(",
          "input\\s*\\(",
          "total\\s*=\\s*(quantity\\s*\\*\\s*unit_price|unit_price\\s*\\*\\s*quantity)",
          "print\\s*\\(\\s*total\\s*\\)"
        ],
        "forbiddenPatterns": [
          "total\\s*=\\s*\\d+",
          "print\\s*\\(\\s*\\d+\\s*\\)"
        ],
        "feedbackMessages": {
          "onPass": "চমৎকার! তুমি সংখ্যা ইনপুট নিয়ে int() রূপান্তর ও গুণ করে মোট মূল্য হিসাব করতে পেরেছ।",
          "onOutputMismatch": "হিসাবে ভুল হচ্ছে। quantity ইনপুট নিয়ে int() করে unit_price দিয়ে গুণ করেছ কি?",
          "onPatternFail": "ইনপুটকে int() দিয়ে সংখ্যা বানিয়ে total = quantity * unit_price হিসাব করতে হবে এবং print(total) করতে হবে।",
          "onMissingVariable": "unit_price, quantity এবং total — তিনটি ভেরিয়েবলই কোডে থাকতে হবে।",
          "onHardcoded": "সরাসরি কোনো নির্দিষ্ট সংখ্যা প্রিন্ট করা যাবে না! ইনপুট নিয়ে সূত্র ব্যবহার করো।"
        }
      },
      "solution": "unit_price = 120\nquantity = int(input())\ntotal = quantity * unit_price\n\nprint(total)",
      "solutionExplanation": "input() থেকে পাওয়া বইয়ের সংখ্যাকে int() দিয়ে রূপান্তর করে unit_price (120) দিয়ে গুণ করে total বের করা হয়েছে এবং প্রিন্ট করা হয়েছে।"
    },
    {
      "type": "practice",
      "title": "ডায়নামিক যোগফল ক্যালকুলেটর",
      "prompt": "ইউজারের কাছ থেকে পরপর দুটি সংখ্যা num1 এবং num2 ইনপুট নাও। উভয় ইনপুটকেই int() দিয়ে পূর্ণসংখ্যায় রূপান্তর করবে। তারপর তাদের যোগফল result = num1 + num2 হিসাব করে result প্রিন্ট করো।",
      "starterCode": "# num1 এবং num2 ইনপুট নাও (int রূপান্তরসহ)\n\n# তাদের যোগফল result হিসাব করো এবং প্রিন্ট করো\n",
      "hints": [
        "num1 = int(input()) এবং num2 = int(input()) লিখে দুটি সংখ্যা ইনপুট নাও।",
        "result = num1 + num2 লিখে যোগফল বের করো।",
        "print(result) দিয়ে ফলাফল স্ক্রিনে দেখাও।"
      ],
      "displayHint": "num1 = int(input()), num2 = int(input()) এবং result = num1 + num2",
      "expectedOutput": "",
      "validation": {
        "type": "smart_output_source",
        "ignoreWhitespace": true,
        "ignoreCase": true,
        "requiredVariables": [
          "num1",
          "num2",
          "result"
        ],
        "requiredPatterns": [
          "num1\\s*=.*input",
          "num2\\s*=.*input",
          "int\\s*\\(",
          "result\\s*=\\s*(num1\\s*\\+\\s*num2|num2\\s*\\+\\s*num1)",
          "print\\s*\\(\\s*result\\s*\\)"
        ],
        "forbiddenPatterns": [
          "result\\s*=\\s*\\d+",
          "print\\s*\\(\\s*\\d+\\s*\\)"
        ],
        "feedbackMessages": {
          "onPass": "অসাধারণ! তুমি দুটি ডায়নামিক ইনপুট গ্রহণ করে তাদের যোগফল সফলভাবে নির্ণয় করেছ।",
          "onOutputMismatch": "ফলাফল মেলেনি। দুটি সংখ্যা ইনপুট নিয়ে int() করে যোগ করেছ কি?",
          "onPatternFail": "num1 এবং num2 ইনপুট নিয়ে int() দিয়ে রূপান্তর করে result = num1 + num2 বের করো এবং print(result) করো।",
          "onMissingVariable": "num1, num2 এবং result — তিনটি ভেরিয়েবলই তৈরি করেছ কি?",
          "onHardcoded": "সরাসরি সংখ্যা প্রিন্ট করা যাবে না! input() ও int() ব্যবহার করে ডায়নামিক যোগ করো।"
        }
      },
      "solution": "num1 = int(input())\nnum2 = int(input())\nresult = num1 + num2\n\nprint(result)",
      "solutionExplanation": "ব্যবহারকারীর কাছ থেকে দুটি সংখ্যা ইনপুট নিয়ে int() দিয়ে পূর্ণসংখ্যা বানানো হয়েছে এবং গাণিতিক যোগফল result এ সংরক্ষণ করে প্রিন্ট করা হয়েছে।"
    },
    {
      "type": "debug_challenge",
      "title": "বাগ খোঁজো: ইনপুটে ব্র্যাকেট মিসিং",
      "scenario": "একজন শিক্ষার্থী ব্যবহারকারীর শহরের নাম ইনপুট নিতে গিয়ে input এর পরে প্রথম বন্ধনী () দিতে ভুলে গেছে। ফলে ফাংশনটি চালু না হয়ে স্ক্রিনে <built-in function input> প্রিন্ট হচ্ছে। কোডটি ঠিক করো।",
      "buggyCode": "user_city = input\nprint(user_city)",
      "errorMessage": "Logic / Output Error: <built-in function input>",
      "bugLine": 1,
      "bugType": "syntax",
      "hints": [
        "input হলো একটি ফাংশন, এটি সাধারণ কোনো মান বা ভেরিয়েবল নয়।",
        "যেকোনো ফাংশনকে চালু বা কল করতে নামের শেষে প্রথম বন্ধনী () দিতে হয়।",
        "লাইন ১ এ user_city = input এর বদলে user_city = input() লেখো।"
      ],
      "fixedCode": "user_city = input()\nprint(user_city)",
      "explanation": "পাইথনে যেকোনো ফাংশনকে এক্সিকিউট বা কল করার জন্য নামের পর প্রথম বন্ধনী () দেওয়া বাধ্যতামূলক। বন্ধনী না দিলে পাইথন ফাংশনটি রান না করে তার মেমোরি রেফারেন্স ভেরিয়েবলে রেখে দেয়।"
    },
    {
      "type": "debug_challenge",
      "title": "বাগ খোঁজো: স্ট্রিং কনক্যাটেনেশন ট্র্যাপ",
      "scenario": "একজন শিক্ষার্থী দুটি সংখ্যা ইনপুট নিয়ে যোগ করতে চেয়েছিল। কিন্তু ইনপুট হিসেবে 10 এবং 20 দিলে উত্তর 30 আসার বদলে '1020' প্রিন্ট হচ্ছে! কোডের লজিক বাগটি দূর করো।",
      "buggyCode": "a = input()\nb = input()\ntotal = a + b\nprint(total)",
      "errorMessage": "Logic Error: \"10\" + \"20\" becomes \"1020\" instead of 30",
      "bugLine": 3,
      "bugType": "logic",
      "hints": [
        "input() ফাংশন কিবোর্ড থেকে পাওয়া তথ্যকে সবসময় String (টেক্সট) হিসেবে ফেরত দেয়।",
        "দুটি স্ট্রিংয়ের মাঝে '+' দিলে তারা পাশাপাশি জোড়া লেগে যায় (Concatenation)।",
        "a এবং b কে int() ফাংশন দিয়ে Integer এ রূপান্তর করে যোগ করো।"
      ],
      "fixedCode": "a = int(input())\nb = int(input())\ntotal = a + b\nprint(total)",
      "explanation": "input() সবসময় টেক্সট রিটার্ন করে। '10' এবং '20' যোগ করলে স্ট্রিং কনক্যাটেনেশনের কারণে '1020' হয়। গাণিতিক যোগফল (30) পাওয়ার জন্য int(input()) ব্যবহার করে স্ট্রিংকে আগে সংখ্যায় রূপান্তর করতে হয়।"
    },
    {
      "type": "debug_challenge",
      "title": "বাগ খোঁজো: ভেরিয়েবলকে কোটেশনে রাখা বা টাইপের অমিল",
      "scenario": "একজন শিক্ষার্থী ব্যবহারকারীর বয়সের সাথে ৫ বছর যোগ করে ভবিষ্যতের বয়স বের করতে চেয়েছিল। কিন্তু সে ভেরিয়েবলের নামকে কোটেশনে লিখে ফেলেছে এবং ইনপুটকে নাম্বারে রূপান্তর করেনি, ফলে পাইথন টাইপ এরর দিচ্ছে। কোডটি ঠিক করো।",
      "buggyCode": "age = input()\nfuture_age = \"age\" + 5\nprint(future_age)",
      "errorMessage": "TypeError: can only concatenate str (not \"int\") to str",
      "bugLine": 2,
      "bugType": "runtime",
      "hints": [
        "কোটেশনের ভেতর 'age' লিখলে পাইথন এটিকে ভেরিয়েবল মনে না করে সাধারণ টেক্সট মনে করে।",
        "টেক্সটের সাথে সরাসরি সংখ্যা (5) যোগ করা যায় না।",
        "age = int(input()) দিয়ে সংখ্যা ইনপুট নাও এবং future_age = age + 5 লেখো।"
      ],
      "fixedCode": "age = int(input())\nfuture_age = age + 5\nprint(future_age)",
      "explanation": "কোটেশনের ভেতর 'age' লিখলে ভেরিয়েবলের ভেতরের মান পাওয়া যায় না, বরং তা স্ট্রিং লিটারেল হয়ে যায়। এছাড়া ইনপুট টেক্সটকে int() না করলে ৫ এর সাথে যোগ করা যায় না। তাই age = int(input()) এবং future_age = age + 5 লিখতে হবে।"
    },
    {
      "type": "reflection",
      "title": "Critical Thinking Lab",
      "instruction": "নিচের ৩টি মৌলিক প্রশ্ন নিয়ে আগে নিজে গভীরভাবে চিন্তা করো। তারপর 'আমি চিন্তা করেছি, উত্তর দেখাও!' বাটনে ক্লিক করে Expert Thinking উন্মোচন করো।",
      "prompts": [
        "সফটওয়্যার কেন পূর্বে থেকে নির্ধারিত ফিক্সড ডেটা (Hardcoded Data) থেকে রিয়েল-টাইম ইউজার ইনপুটের (input()) দিকে বিবর্তিত হয়েছিল?",
        "আধুনিক সফটওয়্যার আর্কিটেকচারে (যেমন: ওয়েব ফর্ম, এআই প্রম্পট বা সেন্সর) ইউজার ইনপুট স্ট্রিম কীভাবে সেন্ট্রাল লজিকের সাথে যুক্ত হয়?",
        "প্রকৌশল বিপর্যয়: ব্যবহারকারীর দেওয়া কাঁচা ইনপুটকে (Raw String Input) যাচাই বা সঠিক টাইপে রূপান্তর না করে সরাসরি গাণিতিক বা ডেটাবেজ লজিকে ব্যবহার করলে কী বিপর্যয় ঘটতে পারে?"
      ],
      "criticalThinkingQuestions": [
        {
          "question": "সফটওয়্যার কেন পূর্বে থেকে নির্ধারিত ফিক্সড ডেটা (Hardcoded Data) থেকে রিয়েল-টাইম ইউজার ইনপুটের (input()) দিকে বিবর্তিত হয়েছিল?",
          "expertThinking": "কম্পিউটারের আদি যুগে (১৯৫০-এর দশক) প্রোগ্রামগুলো ছিল ব্যাচ প্রসেসিং নির্ভর। সেখানে কোড এবং ডেটা একসাথে পাঞ্চ কার্ডে লিখে রান করা হতো। প্রতিবার নতুন ডেটা প্রসেস করতে হলে পুরো প্রোগ্রাম পুনরায় কম্পাইল বা পরিবর্তন করতে হতো।\n\nইউজার ইনপুটের (Interactive Computing) উদ্ভাবন সফটওয়্যারকে সম্পূর্ণ নতুন যুগে নিয়ে যায়। এর ফলে একটি সিঙ্গেল কোডবেস কোটি কোটি ভিন্ন ভিন্ন ব্যবহারকারীর জন্য রিয়েল-টাইমে কাজ করতে পারে। ডেভেলপারকে আর প্রতিটি ব্যবহারকারীর জন্য আলাদা কোড লিখতে হয় না; সফটওয়্যার ব্যবহারকারীর দেওয়া ডেটা গ্রহণ করে ডায়নামিকভাবে সিদ্ধান্ত নেয় ও গণনা করে।",
          "realWorldEngineering": "এটিএম (ATM) বুথ ও পেমেন্ট গেটওয়ে: একই এটিএম সফটওয়্যার দিয়ে লক্ষ লক্ষ গ্রাহক তাদের ভিন্ন ভিন্ন অ্যাকাউন্ট থেকে টাকা তোলেন। সফটওয়্যারটি প্রতিবার ইউজারের কার্ড নাম্বার, পিন ও টাকার পরিমাণ input() এর মতো স্ট্রিম থেকে গ্রহণ করে ডায়নামিক হিসাব পরিচালনা করে।",
          "beyondProgramming": "একমুখী বক্তব্য আর দ্বিমুখী কথোপকথনের পার্থক্য। যে ব্যবস্থা অপর পক্ষের কোনো প্রতিক্রিয়া বা ইনপুট শুনতে পারে না, তা কখনোই সার্বজনীন ও অভিযোজিত হতে পারে না। সক্রিয় যোগাযোগ সবসময় ইনপুট শোনার ওপর নির্ভরশীল।"
        },
        {
          "question": "আধুনিক সফটওয়্যার আর্কিটেকচারে (যেমন: ওয়েব ফর্ম, এআই প্রম্পট বা সেন্সর) ইউজার ইনপুট স্ট্রিম কীভাবে সেন্ট্রাল লজিকের সাথে যুক্ত হয়?",
          "expertThinking": "আধুনিক অপারেটিং সিস্টেমগুলোতে input() মূলত Standard Input (stdin) স্ট্রিমের সাথে যুক্ত থাকে। যখনই ইউজার কোনো ওয়েব ফর্ম সাবমিট করে, চ্যাটজিপিটিতে প্রম্পট লেখে কিংবা কিবোর্ডে টাইপ করে, তখন ওএস সেই ক্যারেক্টারগুলোকে একটি মেমোরি বাফারে জমা রাখে।\n\nসফটওয়্যারের সেন্ট্রাল লজিক এই ইনপুট স্ট্রিম থেকে কাঁচা টেক্সট গ্রহণ করে, সেটিকে পার্স বা রূপান্তর করে (যেমন: স্ট্রিং থেকে ইন্টিজার বা অবজেক্ট), এবং মূল বিজনেস লজিক ইঞ্জিনে পাঠায়। পাইথনের input() ফাংশন হলো এই বিশালাকার ইনপুট পাইপলাইনের সবচেয়ে মৌলিক ও শক্তিশালী প্রবেশদ্বার।",
          "realWorldEngineering": "স্মার্ট থার্মোস্ট্যাট ও আইওটি (IoT): ইউজার মোবাইল অ্যাপে কাঙ্ক্ষিত তাপমাত্রা (যেমন: 24 ডিগ্রি) ইনপুট দিলে অ্যাপটি একটি সিরিয়াল ডেটা স্ট্রিম পাঠায়। মাইক্রোকন্ট্রোলার সেই ইনপুট টেক্সট গ্রহণ করে int() দিয়ে সংখ্যায় রূপান্তর করে এবং হিটার বা এসি চালু করার সিদ্ধান্ত নেয়।",
          "beyondProgramming": "বাইরের পরিবেশ বা সমাজের সংকেত গ্রহণ করতে না পারলে কোনো প্রতিষ্ঠান টিকে থাকতে পারে না। সঠিক সময়ে সঠিক ইনপুট গ্রহণ এবং তা বিশ্লেষণ করাই যেকোনো ব্যবস্থাপনার সাফল্যের চাবিকাঠি।"
        },
        {
          "question": "প্রকৌশল বিপর্যয়: ব্যবহারকারীর দেওয়া কাঁচা ইনপুটকে (Raw String Input) যাচাই বা সঠিক টাইপে রূপান্তর না করে সরাসরি গাণিতিক বা ডেটাবেজ লজিকে ব্যবহার করলে কী বিপর্যয় ঘটতে পারে?",
          "expertThinking": "প্রকৌশল জগতের একটি বিখ্যাত নীতি হলো 'Never trust user input'। ব্যবহারকারীর কাছ থেকে পাওয়া ইনপুট সবসময় টেক্সট (String) হিসেবে আসে। যদি কোনো সিস্টেম টাইপ রূপান্তর বা যাচাই না করে সেই ইনপুট সরাসরি গাণিতিক সূত্রে ব্যবহার করে, তবে মারাত্মক লজিক বা রানটাইম বিপর্যয় ঘটে।\n\nউদাহরণস্বরূপ, একটি ই-কমার্স বা ব্যাংকিং সিস্টেমে যদি দুটি সংখ্যাকে টাইপ কনভার্ট না করে যোগ করা হয়, তবে '100' + '50' যোগফল 150 হওয়ার বদলে '10050' হয়ে যেতে পারে! এছাড়াও টাইপ মিসম্যাচের কারণে সিস্টেম ক্র্যাশ করতে পারে। এজন্য প্রফেশনাল সফটওয়্যার ইঞ্জিনিয়ারিংয়ে ইনপুটকে সাথে সাথে কঠোরভাবে সঠিক ডেটা টাইপে রূপান্তর করা হয়।",
          "realWorldEngineering": "অনলাইন ব্যাংকিং ট্রানজেকশন ট্র্যাপ: ইউজার টাকা ট্রান্সফারের ঘরে সংখ্যা ইনপুট দিলে সিস্টেম যদি তা স্ট্রিং হিসেবে যোগ (Concatenate) করে, তবে ১০০ টাকা ও ৫০ টাকা যোগ হয়ে ১৫০ টাকার বদলে ১০,০৫০ টাকা হয়ে যেতে পারে, যা বিশাল আর্থিক ক্ষতির কারণ হতে পারে।",
          "beyondProgramming": "বাইরে থেকে পাওয়া যেকোনো তথ্যকে যাচাই-বাছাই না করে অন্ধভাবে সত্য ধরে নিলে এবং তা দিয়ে সিদ্ধান্ত গ্রহণ করলে বড় ধরনের ভ্রান্তি ও ক্ষতির ঝুঁকি তৈরি হয়। তথ্যের শুদ্ধতা যাচাই সবসময় প্রথম দায়িত্ব।"
        }
      ]
    },
    {
      "type": "mission_complete",
      "title": "Mission 007 Complete",
      "summary": "অভিনন্দন! তুমি পাইথনের input() ফাংশন এবং int() রূপান্তর ব্যবহার করে ডায়নামিক ও ইন্টারেক্টিভ প্রোগ্রাম তৈরি করার দক্ষতা অর্জন করেছ।",
      "keyLearnings": [
        "input() ফাংশন দিয়ে ব্যবহারকারীর কাছ থেকে কিবোর্ড ইনপুট গ্রহণ করা যায়।",
        "input() সবসময় ডেটাকে টেক্সট বা String হিসেবে প্রদান করে।",
        "ইনপুট দিয়ে গাণিতিক কাজ করার জন্য int() দিয়ে সংখ্যায় রূপান্তর করা বাধ্যতামূলক।",
        "ইনপুট ও গাণিতিক অপারেটর সমন্বয়ে রিয়েল-টাইম ইন্টারঅ্যাক্টিভ সফটওয়্যার তৈরি সম্ভব।"
      ]
    }
  ]
}
```

---

## 4. Caveats
- No float parsing (`float(input())`) is introduced, in accordance with the single capability rule.
- No error-handling constructs (`try/except`) or conditional loops (`while not valid`) are introduced; invalid user input (e.g. typing words into `int(input())`) is reserved for future exception handling missions.
- No string concatenation formatted output (e.g., `print("Hello " + name)`) is mandated in practice to maintain focus exclusively on `input()` and numeric `int()` calculation.

---

## 5. Conclusion
- Mission 007 is fully designed with exact 13 steps conforming to `types/mission.types.ts`.
- The curriculum provides a mathematically and cognitively unbroken step from static arithmetic (M006) to interactive runtime computing (M007).
- Validation configs in `smart_output_source` are fully specified with regex patterns supporting standard Python variations (`int(input())` or intermediate variable assignment).
- The authoring agent can directly take this blueprint to write `data/missions/mission-007.json`.

---

## 6. Verification Method

1. **JSON Syntax Verification**:
   Execute Node.js script to verify JSON parsing of the authored `mission-007.json`:
   ```powershell
   node -e "const data = require('./data/missions/mission-007.json'); console.log('Parsed successfully:', data.id, data.title, data.steps.length);"
   ```
2. **Schema & Step Count Verification**:
   - Verify `steps.length === 13`
   - Verify step sequence: `['intro', 'story', 'analogy', 'concept', 'code_example', 'practice', 'practice', 'practice', 'debug_challenge', 'debug_challenge', 'debug_challenge', 'reflection', 'mission_complete']`
   - Verify all practice steps have `smart_output_source` validation with `requiredVariables`, `requiredPatterns`, `forbiddenPatterns`, and `feedbackMessages`.
   - Verify reflection step has 3 `criticalThinkingQuestions` each with `question`, `expertThinking`, `realWorldEngineering`, and `beyondProgramming`.
