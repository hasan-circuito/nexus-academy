# Technical & Pedagogical Implementation Blueprint: Mission 006 (Basic Arithmetic)

**Agent**: `explorer_m006_0`  
**Working Directory**: `B:\nexus-academy\.agents\explorer_m006_0`  
**Target File**: `data/missions/mission-006.json`  
**Milestone**: M006 — Basic Arithmetic  
**Date**: 2026-08-28  
**Status**: INVESTIGATION COMPLETE — BLUEPRINT READY FOR WORKER AUTHORING  

---

## 1. Observation

### 1.1 Direct File Observations
- **`B:\nexus-academy\.agents\ORIGINAL_REQUEST.md` (Lines 27-32, 54-82, 83-97)**:
  - Mandates implementation of verified progression:
    - **Mission 006 — Basic Arithmetic**: New capability: `+`, `-`, `*`, `/`.
    - Prohibited: `//`, `%`, `input()`, conditionals, loops, reassignment (`x = x + 1`, `+=`), `float()`.
    - Core pedagogy: Problem before concept; structural reference from Missions 004/005; authentic high-quality Bengali text; exact Python syntax; strict schema authority `types/mission.types.ts`.
- **`B:\nexus-academy\types\mission.types.ts` (Lines 45-70, 75-305)**:
  - `MissionData` schema requires: `id: "006"`, `title`, `banglaTitle`, `banglaSubtitle`, `cognitiveLoadEstimate`, `curiosity` (all 6 fields: `didYouKnow`, `realWorldApplication`, `aiApplication`, `eeeApplication`, `historicalFact`, `nextMissionPreview`), and `steps` (array of exactly 13 step objects).
- **`B:\nexus-academy\data\missions\mission-004.json` & `mission-005.json`**:
  - Confirmed 13-step progression model: `intro` -> `story` -> `analogy` -> `concept` -> `code_example` -> `practice` (guided) -> `practice` (independent) -> `practice` (transfer/domain) -> `debug_challenge` (syntax) -> `debug_challenge` (type error/runtime) -> `debug_challenge` (logic/assignment target) -> `reflection` (Critical Thinking Lab with 3 accordion questions) -> `mission_complete`.
- **`B:\nexus-academy\data\missions\mission-006.json` (Existing Legacy File)**:
  - Observed that the previous file in `data/missions/mission-006.json` was titled "The Art of Listening: User Input", which violates `ORIGINAL_REQUEST.md` where Mission 006 is "Basic Arithmetic" and Mission 007 is "User Input". The file must be authored/rewritten completely for Basic Arithmetic (`+`, `-`, `*`, `/`).
- **`engines/python/strategies/SmartOutputSourceStrategy.ts` (Lines 6-110)**:
  - Validates `smart_output_source` via:
    1. Execution success / runtime error check
    2. Output normalization check against `expectedOutput`
    3. Forbidden pattern regex check against normalized source (`forbiddenPatterns`)
    4. Required variable check against `\b<varName>\s*=` (`requiredVariables`)
    5. Required pattern regex check against normalized source (`requiredPatterns`)
    6. Returns feedback messages from `feedbackMessages` (`onPass`, `onOutputMismatch`, `onPatternFail`, `onHardcoded`, `onMissingVariable`).

---

## 2. Logic Chain

1. **Pedagogy & Problem-First Narrative**:
   - In Mission 005, learners mastered storing numbers and changing types (`int()`, `str()`).
   - *The Problem*: Numbers stored in variables (`price = 40`, `discount = 15`) sit inert in memory. The program cannot combine, add, or calculate them.
   - *The Need*: The CPU must perform calculations on stored data to produce new meaningful numbers.
   - *The Concept*: The 4 binary arithmetic operators (`+`, `-`, `*`, `/`) and the assignment rule (right-hand expression evaluates first -> value is stored in left-hand variable).
2. **Cognitive Boundary Control**:
   - *Allowed*: Variables, integer literals, `print()`, `int()`, `str()`, `+`, `-`, `*`, `/`.
   - *Strictly Prohibited*: `//` (deferred to 008), `%` (deferred to 008), `input()` (deferred to 007), operator precedence edge cases / `()` (deferred to 009), state mutation `x = x + 1` / `+=` (deferred to 010), `float()`, `if/else`, loops, custom functions.
3. **Practice & Debugging Scaffolding**:
   - Practice 1 (Guided): Store item prices and discount, compute total bill `total = item1 + item2 - discount`, print total.
   - Practice 2 (Independent): Store ticket price and count, compute total cost `total_cost = ticket_count * unit_price`, split equally `per_person = total_cost / 2`, print both.
   - Practice 3 (Transfer / EEE Integrated): Ohm's law calculation $V = I \times R$, `voltage = current * resistance`, print voltage.
   - Debug 1 (Syntax): Math 'x' used instead of `*` (`total = price x quantity`).
   - Debug 2 (Runtime / Type Error): String concatenated to integer (`price_text = "50"`, `total = price_text + tax` -> `TypeError`).
   - Debug 3 (Syntax / Assignment Target): Reversing LHS and RHS (`a + b = result` -> `SyntaxError: cannot assign to expression`).
4. **Critical Thinking Lab (CTL) Triad**:
   - Q1 (Why Concept Exists): Why is processing data via math operators the fundamental power of software beyond static memory?
   - Q2 (Domain Spotlight — EEE / Signal Processing): How does basic arithmetic convert and amplify raw sensor voltages in microcontrollers?
   - Q3 (Engineering Failure — Ariane 5): How can subtle type and numerical overflow errors in arithmetic cause a multi-million-dollar space rocket disaster?

---

## 3. Caveats

- **Division Float Behavior**: In Python 3, `/` always produces a `float` (e.g. `20 / 5 -> 4.0`, `200 / 2 -> 100.0`). The curriculum must explicitly explain this in `concept`, `code_example`, and `practice` without introducing `float()` conversion function.
- **No Self-Reassignment**: Reassignment like `x = x + 1` or `x += 1` must NEVER appear in Mission 006 (that is Mission 010's core capability). All practices assign expressions to fresh, distinct variable names (`total`, `total_cost`, `per_person`, `voltage`).
- **No String Concatenation as a Concept**: String concatenation with `+` is an anti-pattern here; `+` is taught strictly for arithmetic addition. In Debug 2, adding string and integer is diagnosed as a `TypeError` and resolved via `int(price_text) + tax`.
- **Pure 13-Step Model**: Steps must strictly match the 13-step array format required by `StepRegistry.tsx` and `types/mission.types.ts`.

---

## 4. Conclusion & Complete Implementation Blueprint

### 4.1 Target File: `data/missions/mission-006.json`
The complete JSON blueprint for `data/missions/mission-006.json` is fully specified below:

```json
{
  "id": "006",
  "title": "Basic Arithmetic",
  "banglaTitle": "কম্পিউটার যখন গণিত করে",
  "banglaSubtitle": "যোগ, বিয়োগ, গুণ ও ভাগের মাধ্যমে ডেটা প্রসেসিং",
  "cognitiveLoadEstimate": {
    "readingLevel": 2,
    "newConceptCount": 1,
    "practiceComplexity": 2,
    "estimatedTotalMinutes": 20
  },
  "curiosity": {
    "didYouKnow": "জানতে কি? 'Computer' শব্দটি একসময় কোনো ইলেকট্রনিক যন্ত্রের নাম ছিল না, বরং যেসব মানুষ সারাদিন হাতে কলমে জটিল গাণিতিক হিসাব করতেন তাদের পেশার নাম ছিল 'কম্পিউটার'!",
    "realWorldApplication": "বিমানের অটো-পাইলট সিস্টেম প্রতি সেকেন্ডে বাতাসের বেগ, চাপ ও উচ্চতার ডেটা নিয়ে হাজার হাজার গাণিতিক যোগ-বিয়োগ ও গুণ করে ডানার পজিশন ঠিক রাখে।",
    "aiApplication": "আধুনিক কৃত্রিম বুদ্ধিমত্তা (AI) বা নিউরাল নেটওয়ার্ক মূলত কোটি কোটি সংখ্যার গুণ ও যোগফল (weight * input + bias) ছাড়া আর কিছুই নয়!",
    "eeeApplication": "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিংয়ে ওহমের সূত্র (V = I * R) এবং পাওয়ার সূত্র (P = V * I) দিয়ে সার্কিটের ভোল্টেজ ও বিদ্যুৎ শক্তি হিসাব করা হয়।",
    "historicalFact": "১৮২২ সালে চার্লস ব্যাবেজ ডিফারেন্স ইঞ্জিন ডিজাইন করেছিলেন শুধুমাত্র মানুষের হাতে করা গাণিতিক হিসাবের ভুল দূর করার জন্য।",
    "nextMissionPreview": "আমরা মেমোরিতে থাকা সংখ্যা গণনা করতে শিখেছি, কিন্তু বাইরের ইউজার বা মানুষ কিবোর্ড থেকে সংখ্যা দিলে তা কীভাবে রিসিভ করবো? পরবর্তী মিশনে দেখবো User Input (input())!"
  },
  "steps": [
    {
      "type": "intro",
      "missionNumber": "006",
      "title": "Basic Arithmetic",
      "banglaTitle": "কম্পিউটার যখন গণিত করে",
      "tagline": "যোগ, বিয়োগ, গুণ ও ভাগের মাধ্যমে ডেটা প্রসেসিং",
      "description": "মিশন-০৫ এ তুমি শিখেছো মেমোরিতে রাখা তথ্যের রূপ বদলানো। কিন্তু মেমোরিতে ডেটা জমা থাকলেই কাজ শেষ হয় না। আসল সফটওয়্যার তখনই তৈরি হয় যখন কম্পিউটার সেই ডেটা নিয়ে সক্রিয়ভাবে হিসাব-নিকাশ করতে পারে। এই মিশনে আমরা পাইথনের ৪টি মৌলিক গাণিতিক অপারেটর (+, -, *, /) ব্যবহার করে ডেটা প্রসেস করা শিখবো।",
      "learningObjectives": [
        "+ (যোগ), - (বিয়োগ), * (গুণ) এবং / (ভাগ) অপারেটরের ব্যবহার শেখা",
        "ডানপাশের গাণিতিক এক্সপ্রেশন আগে সমাধান হয়ে বাঁপাশের ভেরিয়েবলে মান সংরক্ষণের নিয়ম বোঝা",
        "বাস্তব জীবনের বিল, খরচ এবং ইলেকট্রিক্যাল সার্কিটের গাণিতিক হিসাব কোডে সমাধান করা"
      ],
      "estimatedMinutes": 2
    },
    {
      "type": "story",
      "title": "ক্লান্তিহীন গণিতবিদ",
      "setting": "লন্ডন, ১৮২২ সাল...",
      "content": "১৮২২ সালে ব্রিটিশ গণিতবিদ চার্লস ব্যাবেজ যখন সমুদ্রযাত্রার জন্য তৈরি নৌ-সারণি (Nautical Tables) পরীক্ষা করছিলেন, তখন তিনি দেখতে পান মানুষের হাতে করা গণনায় অসংখ্য ভুলের ছড়াছড়ি! এক সামান্য হিসাবের ভুলে সাগরে দিক হারিয়ে জাহাজডুবি পর্যন্ত হতে পারত। ব্যাবেজ উপলব্ধি করলেন, মানুষের মস্তিষ্ক একটানা হাজার হাজার হিসাব করতে গিয়ে ক্লান্ত হয়ে পড়ে এবং ভুল করে। তাই তিনি এমন একটি বাষ্পচালিত ধাতব যন্ত্রের নকশা করলেন যা কোনো ক্লান্তি ছাড়া স্বয়ংক্রিয়ভাবে নির্ভুল গণিত করতে পারবে — যার নাম ডিফারেন্স ইঞ্জিন (Difference Engine)।",
      "moral": "মানুষের গণনা ক্লান্তিতে ভুল হতে পারে, কিন্তু সঠিক নির্দেশ পেলে কম্পিউটার কখনো গণিতে ভুল করে না।"
    },
    {
      "type": "analogy",
      "title": "নোটবুক বনাম ক্যালকুলেটর",
      "realWorld": {
        "label": "নোটবুক ও টেবিল ক্যালকুলেটর",
        "icon": "Box",
        "description": "নোটবুকে সংখ্যা লিখে রাখা হয় (স্টোরেজ বা মেমোরি)। কিন্তু দুটি সংখ্যা যোগ বা গুণ করতে আমরা ক্যালকুলেটরের বোতাম চাপি (প্রসেসিং)।"
      },
      "pythonConcept": {
        "label": "ভেরিয়েবল ও গাণিতিক অপারেটর",
        "icon": "TerminalSquare",
        "description": "ভেরিয়েবল হলো নোটবুকের পাতা যেখানে ডেটা জমা থাকে, আর +, -, *, / হলো পাইথনের ভেতরের ক্যালকুলেটর ইঞ্জিন যা নতুন মান গণনা করে।"
      },
      "connection": "শুধু ভেরিয়েবলে সংখ্যা লিখে রাখলে হিসাব হয় না; হিসাব করানোর জন্য ক্যালকুলেটরের মতো অপারেটর ব্যবহার করতে হয়।",
      "deeperInsight": "কম্পিউটার আগে ডানপাশের গাণিতিক হিসাবটি ক্যালকুলেটরের মতো সম্পন্ন করে, তারপর ফলাফলটি নোটবুকের নতুন পাতায় লিখে রাখে।"
    },
    {
      "type": "concept",
      "title": "পাইথনের ৪টি মৌলিক গাণিতিক অপারেটর",
      "content": "পাইথনে সংখ্যা নিয়ে হিসাব করার জন্য ৪টি মৌলিক বাইনারি অপারেটর রয়েছে:\n১. যোগ (+): দুটি সংখ্যার যোগফল বের করে। যেমন: 20 + 5 দিলে 25 হয়।\n২. বিয়োগ (-): প্রথম সংখ্যা থেকে দ্বিতীয় সংখ্যা বিয়োগ করে। যেমন: 20 - 5 দিলে 15 হয়।\n৩. গুণ (*): দুটি সংখ্যার গুণফল বের করে। পাইথনে গুণের জন্য কিবোর্ডের x নয়, বরং অ্যাস্টেরিস্ক * ব্যবহার করতে হয়। যেমন: 20 * 5 দিলে 100 হয়।\n৪. ভাগ (/): প্রথম সংখ্যাকে দ্বিতীয় সংখ্যা দিয়ে ভাগ করে। পাইথনে সাধারণ ভাগ করলে উত্তর সবসময় দশমিক (Float) আকারে আসে। যেমন: 20 / 5 দিলে 4.0 পাওয়া যায়।\n\nসবচেয়ে গুরুত্বপূর্ণ নিয়ম: = চিহ্নের ডানপাশের গাণিতিক হিসাবটি (Expression) পাইথন আগে সম্পন্ন করে, তারপর সেই মান বাঁপাশের ভেরিয়েবলে জমা রাখে।",
      "keyPoints": [
        "+ দিয়ে যোগ এবং - দিয়ে বিয়োগ করা হয়।",
        "* (অ্যাস্টেরিস্ক) দিয়ে গুণ করা হয়; গণিতের x পাইথনে কাজ করে না।",
        "/ (স্ল্যাশ) দিয়ে ভাগ করা হয় এবং পাইথনে সাধারণ ভাগের ফলাফল সবসময় দশমিক (Float) হয়।",
        "এক্সপ্রেশনের হিসাব = এর ডানপাশে আগে ঘটে, তারপর বাঁপাশের ভেরিয়েবলে অ্যাসাইন হয়।"
      ],
      "whyCallout": "শুধুমাত্র মেমোরিতে ডেটা রেখে কোনো সফটওয়্যার কাজ করতে পারে না; ডেটাকে প্রসেস করে নতুন ফলাফল তৈরি করাই কম্পিউটিংয়ের মূল ভিত্তি।",
      "whenToUse": "মোট বিল, গতিবেগ, ভোল্টেজ, ক্ষেত্রফল বা যেকোনো গাণিতিক হিসাব নির্ণয় করতে গাণিতিক অপারেটর ব্যবহার করবে।",
      "whenNotToUse": "টেক্সটের সাথে সরাসরি সংখ্যা যোগ বা বিয়োগ করতে যাবে না; আগে টাইপ ঠিক আছে কি না নিশ্চিত হও।",
      "commonMisconception": "অনেকে মনে করে 20 / 5 করলে পূর্ণসংখ্যা 4 পাওয়া যাবে। কিন্তু পাইথনে সাধারণ ভাগ (/) সবসময় দশমিকসহ 4.0 প্রদান করে।"
    },
    {
      "type": "code_example",
      "title": "কোডে ৪টি গাণিতিক অপারেটর",
      "explanation": "ভেরিয়েবলে সংরক্ষিত সংখ্যার ওপর কীভাবে যোগ, বিয়োগ, গুণ ও ভাগ অপারেটর কাজ করে তা নিচে দেখো।",
      "language": "python",
      "code": "a = 20\nb = 5\n\nsum_val = a + b\ndiff = a - b\nprod = a * b\ndiv = a / b\n\nprint(sum_val)\nprint(diff)\nprint(prod)\nprint(div)",
      "output": "25\n15\n100\n4.0",
      "annotations": [
        {
          "lineNumber": 1,
          "explanation": "ভেরিয়েবল a তে 20 রাখা হলো"
        },
        {
          "lineNumber": 2,
          "explanation": "ভেরিয়েবল b তে 5 রাখা হলো"
        },
        {
          "lineNumber": 4,
          "explanation": "a + b যোগ হয়ে sum_val এ 25 জমা হলো"
        },
        {
          "lineNumber": 5,
          "explanation": "a - b বিয়োগ হয়ে diff এ 15 জমা হলো"
        },
        {
          "lineNumber": 6,
          "explanation": "a * b গুণ হয়ে prod এ 100 জমা হলো"
        },
        {
          "lineNumber": 7,
          "explanation": "a / b ভাগ হয়ে div এ 4.0 (Float) জমা হলো"
        }
      ],
      "postExplanation": "লক্ষ্য করো, a / b এর মান 4 না হয়ে 4.0 হয়েছে, কারণ পাইথনে সাধারণ ভাগ (/) সবসময় Float রিটার্ন করে।"
    },
    {
      "type": "practice",
      "title": "দোকানের মোট বিল ও ডিসকাউন্ট হিসাব",
      "prompt": "একটি দোকানে দুটি পণ্যের দাম item1 = 40 এবং item2 = 60 টাকা। দোকানদার বিশেষ ডিসকাউন্ট দিয়েছেন discount = 15 টাকা। মোট বিল total = item1 + item2 - discount সূত্র ব্যবহার করে বের করো এবং total প্রিন্ট করো।",
      "starterCode": "item1 = 40\nitem2 = 60\ndiscount = 15\n\n# total হিসাব করো এবং প্রিন্ট করো\n",
      "hints": [
        "total = item1 + item2 - discount লিখে মোট বিল হিসাব করো।",
        "print(total) লিখে ফলাফল স্ক্রিনে দেখাও।"
      ],
      "displayHint": "total = item1 + item2 - discount হিসাব করো এবং print(total) করো",
      "expectedOutput": "85\n",
      "validation": {
        "type": "smart_output_source",
        "ignoreWhitespace": true,
        "ignoreCase": true,
        "requiredVariables": [
          "item1",
          "item2",
          "discount",
          "total"
        ],
        "requiredPatterns": [
          "item1\\s*\\+\\s*item2\\s*-\\s*discount",
          "print\\s*\\(\\s*total\\s*\\)"
        ],
        "forbiddenPatterns": [
          "print\\s*\\(\\s*85\\s*\\)",
          "total\\s*=\\s*85"
        ],
        "feedbackMessages": {
          "onPass": "দারুণ! তুমি সফলভাবে যোগ ও বিয়োগ অপারেটর ব্যবহার করে মোট বিল হিসাব করেছ।",
          "onOutputMismatch": "আউটপুট 85 আসেনি। item1 + item2 - discount এর হিসাবটি আরেকবার চেক করো।",
          "onPatternFail": "ভেরিয়েবলগুলো যোগ-বিয়োগ করে total এ রাখতে হবে এবং print(total) করতে হবে।",
          "onMissingVariable": "item1, item2, discount এবং total — চারটি ভেরিয়েবলই তৈরি করেছ কি?",
          "onHardcoded": "আউটপুট ঠিক আছে, কিন্তু সরাসরি 85 প্রিন্ট করা যাবে না! item1 + item2 - discount এক্সপ্রেশন ব্যবহার করো।"
        }
      },
      "solution": "item1 = 40\nitem2 = 60\ndiscount = 15\n\ntotal = item1 + item2 - discount\nprint(total)",
      "solutionExplanation": "item1 এবং item2 এর দাম যোগ করে (40 + 60 = 100) তা থেকে discount (15) বিয়োগ করে 85 পাওয়া গেছে এবং total ভেরিয়েবলে সংরক্ষণ করে প্রিন্ট করা হয়েছে।"
    },
    {
      "type": "practice",
      "title": "টিকিট খরচ ও জনপ্রতি ভাগাভাগি",
      "prompt": "একটি কনসার্টের প্রতি টিকিটের দাম unit_price = 50 টাকা। মোট টিকিট কেনা হয়েছে ticket_count = 4 টি। মোট খরচ total_cost = ticket_count * unit_price হিসাব করো। তারপর ২ জন বন্ধুর মধ্যে সমান ভাগে ভাগ করার জন্য per_person = total_cost / 2 বের করো। সবশেষে total_cost এবং per_person দুটি মানই পরপর প্রিন্ট করো।",
      "starterCode": "unit_price = 50\nticket_count = 4\n\n# মোট খরচ ও জনপ্রতি খরচ হিসাব করো এবং প্রিন্ট করো\n",
      "hints": [
        "প্রথমে total_cost = ticket_count * unit_price দিয়ে মোট খরচ বের করো।",
        "তারপর per_person = total_cost / 2 দিয়ে জনপ্রতি খরচ বের করো।",
        "print(total_cost) এবং print(per_person) দিয়ে দুটি মানই প্রিন্ট করো।"
      ],
      "displayHint": "total_cost = ticket_count * unit_price এবং per_person = total_cost / 2 হিসাব করো",
      "expectedOutput": "200\n100.0\n",
      "validation": {
        "type": "smart_output_source",
        "ignoreWhitespace": true,
        "ignoreCase": true,
        "requiredVariables": [
          "unit_price",
          "ticket_count",
          "total_cost",
          "per_person"
        ],
        "requiredPatterns": [
          "total_cost\\s*=\\s*(ticket_count\\s*\\*\\s*unit_price|unit_price\\s*\\*\\s*ticket_count)",
          "per_person\\s*=\\s*total_cost\\s*/\\s*2",
          "print\\s*\\(\\s*total_cost\\s*\\)",
          "print\\s*\\(\\s*per_person\\s*\\)"
        ],
        "forbiddenPatterns": [
          "print\\s*\\(\\s*200\\s*\\)",
          "print\\s*\\(\\s*100(\\.0)?\\s*\\)",
          "total_cost\\s*=\\s*200",
          "per_person\\s*=\\s*100"
        ],
        "feedbackMessages": {
          "onPass": "চমৎকার! তুমি গুণ (*) এবং ভাগ (/) অপারেটর সঠিকভাবে ব্যবহার করেছ।",
          "onOutputMismatch": "আউটপুট প্রত্যাশিত মানের সাথে মিলছে না। মোট খরচ (200) এবং জনপ্রতি খরচ (100.0) প্রিন্ট করেছ কি?",
          "onPatternFail": "ticket_count * unit_price দিয়ে total_cost এবং total_cost / 2 দিয়ে per_person বের করতে হবে।",
          "onMissingVariable": "unit_price, ticket_count, total_cost এবং per_person — সবগুলো ভেরিয়েবল তৈরি করেছ কি?",
          "onHardcoded": "সরাসরি 200 বা 100 প্রিন্ট করা যাবে না! ভেরিয়েবলের গাণিতিক সূত্র ব্যবহার করো।"
        }
      },
      "solution": "unit_price = 50\nticket_count = 4\n\ntotal_cost = ticket_count * unit_price\nper_person = total_cost / 2\n\nprint(total_cost)\nprint(per_person)",
      "solutionExplanation": "৪টি টিকিটের মোট খরচ গুণ করে বের করা হয়েছে 200, এবং ২ জনের মধ্যে ভাগ করায় জনপ্রতি খরচ হয়েছে 100.0 (Float)।"
    },
    {
      "type": "practice",
      "title": "ওহমের সূত্র দিয়ে ভোল্টেজ হিসাব",
      "prompt": "একটি ইলেকট্রিক্যাল সার্কিটে বিদ্যুৎ প্রবাহ current = 3 অ্যাম্পিয়ার এবং রোধ resistance = 10 ওহম। ওহমের সূত্র V = I * R অনুযায়ী ভোল্টেজ voltage = current * resistance বের করো এবং voltage প্রিন্ট করো।",
      "starterCode": "current = 3\nresistance = 10\n\n# voltage হিসাব করো এবং প্রিন্ট করো\n",
      "hints": [
        "voltage = current * resistance লিখে ভোল্টেজ হিসাব করো।",
        "print(voltage) দিয়ে ভোল্টেজ প্রিন্ট করো।"
      ],
      "displayHint": "voltage = current * resistance ব্যবহার করো",
      "expectedOutput": "30\n",
      "validation": {
        "type": "smart_output_source",
        "ignoreWhitespace": true,
        "ignoreCase": true,
        "requiredVariables": [
          "current",
          "resistance",
          "voltage"
        ],
        "requiredPatterns": [
          "voltage\\s*=\\s*(current\\s*\\*\\s*resistance|resistance\\s*\\*\\s*current)",
          "print\\s*\\(\\s*voltage\\s*\\)"
        ],
        "forbiddenPatterns": [
          "print\\s*\\(\\s*30\\s*\\)",
          "voltage\\s*=\\s*30"
        ],
        "feedbackMessages": {
          "onPass": "অসাধারণ! তুমি EEE এর ওহমের সূত্র সফলভাবে কোডে রূপান্তর করে ভোল্টেজ বের করেছ।",
          "onOutputMismatch": "ভোল্টেজের মান 30 আসেনি। current * resistance সূত্রটি আবার দেখো।",
          "onPatternFail": "current * resistance দিয়ে voltage বের করতে হবে এবং print(voltage) করতে হবে।",
          "onMissingVariable": "current, resistance এবং voltage — তিনটি ভেরিয়েবলই তৈরি করেছ কি?",
          "onHardcoded": "সরাসরি 30 প্রিন্ট করা যাবে না! current * resistance হিসাব করো।"
        }
      },
      "solution": "current = 3\nresistance = 10\n\nvoltage = current * resistance\nprint(voltage)",
      "solutionExplanation": "ওহমের সূত্র অনুযায়ী কারেন্ট (3) এবং রেজিস্ট্যান্স (10) গুণ করে ভোল্টেজ পাওয়া গেছে 30 ভোল্ট।"
    },
    {
      "type": "debug_challenge",
      "title": "বাগ খোঁজো: গণিতের x বনাম পাইথনের গুণ",
      "scenario": "একজন শিক্ষার্থী পণ্যের মোট দাম বের করার জন্য গণিতের নিয়মে 'x' লিখেছে, কিন্তু পাইথন সিনট্যাক্স এরর দিচ্ছে। কোডটি সংশোধন করো।",
      "buggyCode": "price = 20\nquantity = 5\ntotal = price x quantity\nprint(total)",
      "errorMessage": "SyntaxError: invalid syntax",
      "bugLine": 3,
      "bugType": "syntax",
      "hints": [
        "পাইথনে গুণের জন্য ইংরেজি অক্ষর 'x' ব্যবহার করা যায় না।",
        "কিবোর্ডের কোন গাণিতিক চিহ্নটি পাইথনে গুণের জন্য ব্যবহৃত হয়?",
        "price এবং quantity এর মাঝে অ্যাস্টেরিস্ক (*) চিহ্ন দাও।"
      ],
      "fixedCode": "price = 20\nquantity = 5\ntotal = price * quantity\nprint(total)",
      "explanation": "পাইথনে গুণের জন্য x অক্ষরটি কাজ করে না, কারণ পাইথন এটিকে ভেরিয়েবলের নাম মনে করে বিভ্রান্ত হয়। গুণের জন্য সর্বদা অ্যাস্টেরিস্ক * অপারেটর ব্যবহার করতে হয়।"
    },
    {
      "type": "debug_challenge",
      "title": "বাগ খোঁজো: টেক্সট ও নাম্বারের যোগের ভুল",
      "scenario": "একজন শিক্ষার্থী টেক্সট হিসেবে থাকা মূল্যের সাথে ট্যাক্স যোগ করতে চেয়েছিল, কিন্তু পাইথন রানটাইম টাইপ এরর দিচ্ছে। কোডটি ঠিক করো।",
      "buggyCode": "price_text = \"50\"\ntax = 10\ntotal = price_text + tax\nprint(total)",
      "errorMessage": "TypeError: can only concatenate str (not \"int\") to str",
      "bugLine": 3,
      "bugType": "runtime",
      "hints": [
        "price_text একটি String (টেক্সট) এবং tax একটি Integer (নাম্বার)।",
        "টেক্সটের সাথে নাম্বার সরাসরি যোগ করা যায় না।",
        "int(price_text) ব্যবহার করে টেক্সটটিকে নাম্বারে রূপান্তর করে যোগ করো।"
      ],
      "fixedCode": "price_text = \"50\"\ntax = 10\ntotal = int(price_text) + tax\nprint(total)",
      "explanation": "String এর সাথে Integer যোগ করা যায় না। গাণিতিক যোগ সম্পন্ন করার জন্য প্রথমে int(price_text) দিয়ে টেক্সটটিকে নাম্বারে রূপান্তর করতে হবে।"
    },
    {
      "type": "debug_challenge",
      "title": "বাগ খোঁজো: উল্টো অ্যাসাইনমেন্টের ফাঁদ",
      "scenario": "একজন শিক্ষার্থী গণিতের সমীকরণের মতো ভেরিয়েবলের মান বাঁপাশে এবং নাম ডানপাশে লিখে ফেলেছে। পাইথন অ্যাসাইনমেন্টের নিয়ম ভঙ্গ করায় ক্র্যাশ করেছে। কোডটি ঠিক করো।",
      "buggyCode": "a = 10\nb = 20\na + b = result\nprint(result)",
      "errorMessage": "SyntaxError: cannot assign to expression",
      "bugLine": 3,
      "bugType": "syntax",
      "hints": [
        "পাইথনে '=' চিহ্নটি সমীকরণ নয়, এটি অ্যাসাইনমেন্ট অপারেটর।",
        "ভেরিয়েবলের নাম সবসময় বাঁপাশে (= এর বামে) এবং গাণিতিক হিসাব ডানপাশে (= এর ডানে) থাকতে হয়।",
        "লাইন ৩ কে 'result = a + b' এভাবে সাজাও।"
      ],
      "fixedCode": "a = 10\nb = 20\nresult = a + b\nprint(result)",
      "explanation": "পাইথনে = হলো অ্যাসাইনমেন্ট অপারেটর। সবসময় ডানপাশের গাণিতিক এক্সপ্রেশন (a + b) আগে ক্যালকুলেট হয় এবং তার ফলাফল বাঁপাশের ভেরিয়েবলে (result) জমা হয়। তাই বাঁপাশে কোনো এক্সপ্রেশন রাখা যায় না।"
    },
    {
      "type": "reflection",
      "title": "Critical Thinking Lab",
      "instruction": "নিচের ৩টি মৌলিক প্রশ্ন নিয়ে আগে নিজে গভীরভাবে চিন্তা করো। তারপর 'আমি চিন্তা করেছি, উত্তর দেখাও!' বাটনে ক্লিক করে Expert Thinking উন্মোচন করো।",
      "prompts": [
        "কম্পিউটার মেমোরিতে সংখ্যা রাখার চেয়ে তাদের ওপর গাণিতিক প্রসেসিং করার ক্ষমতা কেন সফটওয়্যারের মূল ভিত্তি?",
        "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং এবং সিগন্যাল প্রসেসিংয়ে মৌলিক পাটিগণিত কীভাবে অ্যানালগ সংকেতকে ডিজিটালে রূপান্তর ও পরিবর্ধন করে?",
        "প্রকৌশল বিপর্যয়: গাণিতিক গণনায় টাইপ বা সীমার অসঙ্গতি থাকলে কীভাবে একটি কোটি ডলারের রকেট বা স্বয়ংক্রিয় সিস্টেম ধ্বংস হতে পারে?"
      ],
      "criticalThinkingQuestions": [
        {
          "question": "কম্পিউটার মেমোরিতে সংখ্যা রাখার চেয়ে তাদের ওপর গাণিতিক প্রসেসিং (+, -, *, /) করার ক্ষমতা কেন সফটওয়্যারের মূল ভিত্তি?",
          "expertThinking": "মেমোরিতে সংরক্ষিত সংখ্যা হলো শুধুই স্ট্যাটিক ডেটা (যেমন: দাম বা তাপমাত্রা)। কিন্তু বাস্তব দুনিয়ার প্রতিটি সিদ্ধান্ত এবং প্রক্রিয়া নির্ভর করে পরিবর্তনের ওপর। ডেটাকে নতুন তথ্যে রূপান্তর করার জন্যই গাণিতিক অপারেটর প্রয়োজন। গাণিতিক প্রসেসিং ছাড়া কম্পিউটার শুধুমাত্র একটি নোটবুকের মতো কাজ করতো, কোনো স্বয়ংক্রিয় সিদ্ধান্ত নিতে পারতো না।",
          "realWorldEngineering": "ফ্লাইট কন্ট্রোল সিস্টেম: বিমানের বিভিন্ন সেন্সর প্রতি মিলিসেকেন্ডে বাতাসের চাপ, গতি ও উচ্চতার সংখ্যা রেকর্ড করে। সেন্ট্রাল কম্পিউটার গাণিতিক হিসাবের মাধ্যমে সঙ্গে সঙ্গে ডানা ও ইঞ্জিনের থ্রাস্ট সমন্বয় করে।",
          "beyondProgramming": "জ্ঞানের সঞ্চয় আর সেই জ্ঞানের ব্যবহার এক নয়। অনেক তথ্য জেনে বসে থাকার চেয়ে প্রয়োজন অনুযায়ী তথ্যকে বিশ্লেষণ ও সমন্বয় করে নতুন সিদ্ধান্তে পৌঁছানোই আসল বুদ্ধিমত্তা।"
        },
        {
          "question": "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং এবং সিগন্যাল প্রসেসিংয়ে মৌলিক পাটিগণিত (+, -, *, /) কীভাবে অ্যানালগ সংকেতকে ডিজিটালে রূপান্তর ও পরিবর্ধন করে?",
          "expertThinking": "ইলেকট্রনিক্সে অ্যানালগ ভোল্টেজকে মাইক্রোকন্ট্রোলারে রিড করার পর তা একটি পূর্ণসংখ্যায় পরিণত হয় (যেমন: 0 থেকে 1023)। এরপর ভোল্টেজ নির্ণয় করতে স্কেলিং গুণ (*) ও ভাগ (/) করা হয়। আবার একাধিক সেন্সর সিগন্যাল থেকে নয়েজ বা ব্যাকগ্রাউন্ড শব্দ দূর করতে বিয়োগ (-) এবং গড় সিগন্যাল বের করতে যোগ (+) ও ভাগ (/) এর মৌলিক পাটিগণিতই ব্যবহৃত হয়।",
          "realWorldEngineering": "ডিজিটাল থার্মোমিটার ও ইসিজি (ECG) মেশিন: সেন্সর থেকে আসা মাইক্রোভোল্ট লেভেলের সংকেতকে ডিজিটাল গাণিতিক গুণন (voltage * gain) এর মাধ্যমে পরিবর্ধিত ও পরিষ্কার করে স্ক্রিনে দেখানো হয়।",
          "beyondProgramming": "যেকোনো জটিল ব্যবস্থার ভিত্তি রচিত হয় অতি সাধারণ উপাদানের ওপর। আধুনিক কৃত্রিম বুদ্ধিমত্তা কিংবা জটিল ইঞ্জিনিয়ারিংয়ের মূলেও রয়েছে কোটি কোটি সাধারণ যোগ ও গুণের সমাহার।"
        },
        {
          "question": "প্রকৌশল বিপর্যয়: গাণিতিক গণনায় টাইপ বা সীমার অসঙ্গতি থাকলে কীভাবে একটি কোটি ডলারের রকেট বা স্বয়ংক্রিয় সিস্টেম ধ্বংস হতে পারে?",
          "expertThinking": "সফটওয়্যারে গাণিতিক অপারেশনের সময় ডেটার টাইপ এবং ফলাফলের সীমা অত্যন্ত সংবেদনশীল। ১৯৯৬ সালে আরিয়ান ৫ (Ariane 5) রকেটের নিয়ন্ত্রণ সফটওয়্যারে একটি ৬৪-বিট দশমিক সংখ্যাকে ১৬-বিট পূর্ণসংখ্যায় রূপান্তর করার সময় সংখ্যাটি ধারণক্ষমতার চেয়ে বড় হয়ে গিয়েছিল। এর ফলে সিস্টেমে এরর তৈরি হয় এবং রকেটটি উৎক্ষেপণের মাত্র ৩৭ সেকেন্ড পর ধ্বংস হয়ে যায়।",
          "realWorldEngineering": "Ariane 5 Flight 501: এই ট্র্যাজেডি প্রমাণ করে যে সাধারণ গাণিতিক রূপান্তর ও অপারেশনের ত্রুটি কোটি কোটি ডলারের ক্ষতি সাধন করতে পারে। এজন্য আধুনিক মিশন-ক্রিটিক্যাল কোডে প্রতিটি গাণিতিক অপারেশনের টাইপ ও বাউন্ডারি কঠোরভাবে ভ্যালিডেট করা হয়।",
          "beyondProgramming": "ছোটখাটো অমিল বা টাইপের বিভ্রান্তিকে অবহেলা করলে তা পরবর্তীতে চেইন রিঅ্যাকশনের মাধ্যমে বিশাল দুর্যোগে রূপ নিতে পারে। তাই প্রতিটি প্রাথমিক ধাপ নিখুঁত রাখা জরুরি।"
        }
      ]
    },
    {
      "type": "mission_complete",
      "title": "Mission 006 Complete",
      "summary": "অভিনন্দন! তুমি পাইথনের চারটি মৌলিক গাণিতিক অপারেটর (+, -, *, /) ব্যবহার করে মেমোরিতে ডেটা প্রসেসিং করার দক্ষতা অর্জন করেছ।",
      "keyLearnings": [
        "পাইথনে +, -, *, / অপারেটর দিয়ে গাণিতিক হিসাব সম্পন্ন করা যায়।",
        "= চিহ্নের ডানপাশের এক্সপ্রেশন আগে গণনা হয়ে বাঁপাশের ভেরিয়েবলে জমা হয়।",
        "সাধারণ ভাগ (/) সবসময় দশমিক সংখ্যা (Float) ফলাফল প্রদান করে।"
      ]
    }
  ]
}
```

---

## 5. Verification Method

To independently verify the blueprint:

1. **Step Count & Progression Integrity**:
   - Verify that `steps` contains exactly 13 step objects in sequence: `intro`, `story`, `analogy`, `concept`, `code_example`, `practice` (guided), `practice` (independent), `practice` (transfer/domain), `debug_challenge` (syntax), `debug_challenge` (type error/runtime), `debug_challenge` (logic/assignment target), `reflection` (CTL), `mission_complete`.
2. **Schema Conformance**:
   - Verify every field matches `MissionData` in `types/mission.types.ts`.
   - Verify `cognitiveLoadEstimate`: `readingLevel: 2`, `newConceptCount: 1`, `practiceComplexity: 2`, `estimatedTotalMinutes: 20`.
   - Verify `curiosity` contains all 6 non-null string fields.
3. **Python Execution & Smart Output Source Validation**:
   - Run all Python code snippets in Python 3.12:
     - Code example produces `25\n15\n100\n4.0\n`
     - Practice 1 produces `85\n`
     - Practice 2 produces `200\n100.0\n`
     - Practice 3 produces `30\n`
     - Debug 1 fixed produces `100\n`
     - Debug 2 fixed produces `60\n`
     - Debug 3 fixed produces `30\n`
4. **Boundary & Forbidden Dependency Audit**:
   - Ensure zero instances of `//`, `%`, `input()`, `if/else`, `for/while`, `x = x + 1`, `+=`, `float()`.
5. **Bengali Typography & Backtick Integrity**:
   - All code tokens inside Bengali prose are wrapped in backticks (e.g. `+`, `-`, `*`, `/`, `int()`, `total`).