const fs = require('fs');
const file = 'docs/engineering/Critical Thinking Lab .md';
const content = fs.readFileSync(file, 'utf8');

// The file should have:
// 1. # AI Behavior Notice (lines 1-16)
// 2. # Critical Thinking Lab Engineering Rulebook
// 3. # 1. Purpose
// 4. # 2. Core Philosophy
// 5. # 3. Mission
// 6. # 4. Universal Structure
// 7. # 5. Question Progression Rule
// 8. # 6. Q1 — Why Does This Concept Exist?
// 9. # 7. Q2 — Domain Spotlight
// 10. # 8. Q3 — Engineering Failure
// 11. # 9. Optional Q4 — Future Thinking
// 12. # 10. Expert Thinking
// 13. # 11. Dependency Rule
// 14. # 12. Hallucination Prevention Rule
// 15. # 13. Scope Rule
// 16. # 14. One Question = One Insight
// 17. # 15. Realism Rule
// 18. # 16. Quality Checklist
// 19. # 17. Final Principle

// Let's locate each section precisely:
const secNotice = content.substring(content.indexOf('# AI Behavior Notice'), content.indexOf('# Critical Thinking Lab Engineering Rulebook')).trim();
const secRulebook = content.substring(content.indexOf('# Critical Thinking Lab Engineering Rulebook'), content.indexOf('# 1. Purpose')).trim();
const sec1 = content.substring(content.indexOf('# 1. Purpose'), content.indexOf('# 2. Core Philosophy')).trim();
const sec2 = content.substring(content.indexOf('# 2. Core Philosophy'), content.indexOf('# 3. Mission')).trim();
const sec3 = content.substring(content.indexOf('# 3. Mission'), content.indexOf('# 4. Universal Structure')).trim();
const sec4 = content.substring(content.indexOf('# 4. Universal Structure'), content.indexOf('# 5. Question Progression Rule')).trim();
const sec5 = content.substring(content.indexOf('# 5. Question Progression Rule'), content.indexOf('# 6. Q1 — Why Does This Concept Exist?')).trim();
const sec6 = content.substring(content.indexOf('# 6. Q1 — Why Does This Concept Exist?'), content.indexOf('# 7. Q2 — Domain Spotlight')).trim();

// Sec 7 ends before Section 8
let sec7Raw = content.substring(content.indexOf('# 7. Q2 — Domain Spotlight'));
// find where selection rule is
const selRuleIdx = sec7Raw.indexOf('Selection Rule');
const sec7Body = sec7Raw.substring(0, selRuleIdx) + `Selection Rule

Ask yourself:

"If this programming concept disappeared today...
which field would suffer the most?"

That becomes today's Domain Spotlight.

Never choose a weaker example simply to maintain balance.`;

// Section 8:
const sec8Marker = 'Engineers do not only design successful systems.';
const sec8Start = content.indexOf(sec8Marker);
const sec9Start = content.indexOf('# 9. Optional Q4 — Future Thinking');
const sec8Body = `# 8. Q3 — Engineering Failure

Purpose

` + content.substring(sec8Start, sec9Start).trim();

// Section 9 through 17:
const sec9ToEnd = content.substring(sec9Start).trim();

const cleanDoc = [
  secNotice,
  secRulebook,
  sec1,
  sec2,
  sec3,
  sec4,
  sec5,
  sec6,
  sec7Body,
  sec8Body,
  sec9ToEnd
].join('\n\n---\n\n') + '\n';

fs.writeFileSync(file, cleanDoc);
console.log('Cleaned perfectly!');
