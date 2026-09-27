# Contributing to NEXUS Academy

Thank you for your interest in contributing to **NEXUS Academy**! We are building an open-source, browser-native Python and Computer Science learning laboratory in Bangla, engineered on first principles, WebAssembly Pyodide, and strict pedagogical contracts.

Whether you are fixing a typo, improving a Bengali analogy, adding a dictionary mental model, or authoring a new curriculum mission, your contributions make high-tier computer science education accessible to millions of learners.

---

## Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat fellow contributors with respect, empathy, and constructive feedback.

---

## Who Can Contribute?

We welcome contributors across multiple disciplines. You do not need to be a seasoned software engineer to make a lasting impact:

- 💻 **Software Engineers & Web Developers:** Help optimize our Pyodide WebAssembly execution harness, expand Monaco Editor capabilities, enhance our 23-event EventBus architecture, or add new automated AST syntax verification passes.
- 🎓 **Computer Science Educators & Curriculum Designers:** Propose new mission sequences, craft insightful critical thinking prompts, refine progressive hint ladders, and design domain-appropriate debugging scenarios (Rule 21).
- 🇧🇩 **Bengali Linguists & Technical Translators:** Help translate and contextualize complex computational concepts into clear, natural, and elegant Bengali. Refine analogies to ensure maximum cultural resonance without relying on awkward phonetic transliterations.
- 🎨 **UI/UX Designers & Accessibility Advocates:** Improve responsive layouts, refine accessibility (screen readers, keyboard navigation), optimize typography for Bengali script rendering, and design immersive concept visualization graphics.

---

## Pedagogical Invariants & Design Principles

Before proposing or editing curriculum content, please review our core architectural rules:

1. **The Single Concept Law**: Each mission introduces exactly **one** primary concept (`newCapability`). Learners must experience **zero cognitive leaps**.
2. **Rule 21 — Domain-Appropriate Debugging**: Debug challenges must reflect real runtime errors that arise strictly from concepts the student has already mastered.
3. **Rule 22 — B2B AI Agency Framing**: Story steps place the learner as a junior engineer at *Nexus AI*, delivering software solutions for rotating industry domains (FinTech, HealthTech, AgriTech, GovTech, Smart Grid, E-Commerce).
4. **Rule 24 — The Closed-World Invariant**: Starter code, exercises, and examples must NEVER leak untaught Python syntax (e.g., loops before M018/M023, functions before M027). All code snippets are verified through client-side Python AST node analysis.

---

## Local Development Setup

### 1. Prerequisites
- **Node.js**: `v18.18.0` or higher
- **npm**: `v9.0.0` or higher
- **Python**: `v3.10+` (Used by the test harness for native AST parsing)

### 2. Clone & Install
```bash
git clone https://github.com/hasan-circuito/nexus-academy.git
cd nexus-academy
npm install
```

### 3. Run the Automated Test Suite
Every change must pass our complete 7-suite validation harness (1,640+ automated assertions):
```bash
npm test
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your changes live in the browser.

---

## Curriculum Authoring Workflow

### Scaffolding a New Mission
To scaffold a new mission conforming to the 13-step anatomy and Rule 24 schema:
```bash
npm run mission:scaffold <mission_number>
# Example:
npm run mission:scaffold 015
```

### Preflight Verification
Before opening a Pull Request with a new or edited mission, run preflight checks:
```bash
npm run mission:preflight <mission_number>
# Example:
npm run mission:preflight 015
```

This verifies:
- Single concept boundary compliance
- Prerequisite mission continuity
- AST forbidden syntax detection across all code snippets
- Bangla title, English title, pain-point trigger, and client industry presence

---

## Submitting a Pull Request

1. **Fork** the repository and create a new feature branch from `main`:
   ```bash
   git checkout -b feature/mission-015-elif-routing
   ```
2. **Commit** your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "feat(curriculum): author Mission 015 elif routing"
   ```
3. **Verify** that all automated tests pass:
   ```bash
   npm test
   ```
4. **Push** your branch to GitHub and submit a Pull Request targeting `main`.
5. Clearly explain the rationale, target pedagogical outcome, and how the changes maintain zero cognitive leaps.

---

## Questions and Support

Feel free to open an Issue on GitHub for questions, suggestions, or curriculum discussions. We review community PRs actively!
