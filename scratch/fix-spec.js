const fs = require('fs');
let content = fs.readFileSync('docs/engineering/MISSION_ENGINEERING_SPEC.md', 'utf8');

const marker = '8. Can mastery be observed through independent and transferable performance?';
const idx = content.indexOf(marker);

if (idx !== -1) {
    const endIdx = content.indexOf('- Yes', idx);
    const keep = content.substring(0, endIdx + 5) + ' → author the mission.\n\n' +
        '## The Core Law\n' +
        'Nexus Academy must never design its curriculum by asking, "What Python topic comes next?"\n' +
        'It must ask, "What can this learner do now, what meaningful limitation do they encounter next, and what is the smallest new capability they need to overcome it?"\n\n' +
        'That single principle should govern mission ordering, splitting, merging, difficulty progression, and mastery decisions.\n\n' +
        '## Rule 19 — Pedagogy Evolves with Capability (The 5-Phase Architecture)\n' +
        'As the learner\'s capability grows, the mission pedagogy must evolve to match their cognitive maturity. A 120+ mission curriculum cannot rely on beginner-level scaffolding for advanced ML topics. (Note: Total mission count is flexible and driven by necessity; it may exceed 150+ missions if required).\n\n' +
        'The curriculum must scale across 5 defined phases:\n\n' +
        '**Phase 1: Foundation**\n' +
        '- *Topics:* Variables, I/O, Operators, Control Flow, Basic Types.\n' +
        '- *Format:* Deep Pedagogy. Heavy use of Story, Analogy, and Critical Thinking.\n' +
        '- *Goal:* Build the engineering mindset from zero.\n\n' +
        '**Phase 2: Builder**\n' +
        '- *Topics:* Functions, Data Structures, File Handling, Error Handling.\n' +
        '- *Format:* Leaner Pedagogy. Stories become shorter, analogies are replaced by architecture diagrams, and exercises shift toward Mini-Projects.\n' +
        '- *Goal:* Transition from syntax mastery to tool creation.\n\n' +
        '**Phase 3: Engineer**\n' +
        '- *Topics:* OOP, Modules, Functional Programming, Decorators, Generators, Testing.\n' +
        '- *Format:* Problem-Driven. Introduces a complex system limitation -> introduces the advanced concept -> refactors the system.\n\n' +
        '**Phase 4: Data & ML Focus**\n' +
        '- *Topics:* NumPy, Pandas, Supervised Learning, NLP/LLM Basics.\n' +
        '- *Format:* Data-Driven Projects. Solves real-world problems using datasets.\n\n' +
        '**Phase 5: Professional**\n' +
        '- *Topics:* Advanced OOP, Concurrency, Memory Management, System Internals, API.\n' +
        '- *Format:* Capstone Projects & Code Reviews. Mimics real-world sprint tickets.\n\n' +
        '*Invariant:* The \'WHY\' (Need) must remain in EVERY phase, but the \'HOW\' (Format) must mature.\n\n' +
        '## Rule 20 — Dynamic Step Flexibility (No 13-Step Hard Limit)\n' +
        'A mission\'s internal step structure must adapt to its context.\n' +
        '- A simple mission may complete in 10-12 steps.\n' +
        '- A complex mission may require 20-25 steps.\n' +
        '- If a concept requires deep analysis, it may be broken down into 3-4 sub-steps.\n' +
        'Never force artificial padding just to reach a specific step count. Every step must serve the learner\'s cognitive journey.\n\n' +
        '## Rule 21 — The Hidden State Debug Standard\n' +
        'Professional developers rarely debug hardcoded syntax errors (e.g., `files = 0`). Real bugs emerge from dynamic system states.\n' +
        '- **Rule:** Debug challenges must avoid spoon-feeding the error in the description.\n' +
        '- **Implementation:** The bug should arise from a logical interaction (e.g., `duration = end_day - start_day` where both are 15, resulting in a hidden `0` that causes a ZeroDivisionError).\n' +
        '- **Goal:** The learner must trace the logic and state flow to discover *why* the bug happened, rather than just reading the description to find the answer.';
        
    fs.writeFileSync('docs/engineering/MISSION_ENGINEERING_SPEC.md', keep);
    console.log('Spec successfully fixed.');
}
