## Description
<!-- Provide a brief explanation of what this PR introduces, fixes, or enhances. -->

## Type of Change
- [ ] 🚀 New feature (platform infrastructure, engine enhancement, UI)
- [ ] 🐛 Bug fix (fixes an issue without breaking existing contracts)
- [ ] 📖 Curriculum authoring (new mission or module addition)
- [ ] 📝 Pedagogical enhancement (analogy, Bengali translation, explanation refinement)
- [ ] 📚 Documentation update (playbook, architecture, README)
- [ ] 🧪 Test suite expansion

## Related Issue
<!-- Closes #issue_number or fixes #issue_number -->
Closes #

---

## Pre-Submission Verification Checklist

### For Code & Infrastructure PRs:
- [ ] **Automated Test Suite:** Ran `npm test` locally and all 1,640+ automated assertions passed (100%).
- [ ] **Type Safety:** Ran `npx tsc --noEmit` with zero TypeScript compiler errors.
- [ ] **Layer Isolation:** No UI or React components are imported into `engines/` or `services/`.
- [ ] **Storage Decoupling:** No direct `localStorage` access (all persistence is mediated by `DataService`).
- [ ] **EventBus Hygiene:** Every EventBus subscriber provides an unsubscribe cleanup function in `useEffect`.
- [ ] **Event Chain Depth:** No event emission chain exceeds 3 levels of depth.

### For Curriculum & Mission PRs:
- [ ] **Single Concept Law:** Introduces exactly one new programming capability (`newConceptCount: 1`).
- [ ] **Rule 24 Closed-World Invariant:** Code snippets and starter exercises contain zero unearned/untaught syntax.
- [ ] **Rule 21 Debugging Standard:** Debug challenges reflect realistic, domain-appropriate bugs without spoon-feeding.
- [ ] **Rule 22 B2B Agency Scenario:** Framed around junior engineer tasks at *Nexus AI* across rotating industry clients.
- [ ] **Preflight Validation:** Executed `npm run mission:preflight <id>` with exit code 0.
- [ ] **Python 3.12 AST Compilation:** All Python snippets parse cleanly without syntax errors via `ast.parse`.

---

## Additional Context / Screenshots
<!-- Add any helpful screenshots, performance considerations, or reviewer notes here. -->
