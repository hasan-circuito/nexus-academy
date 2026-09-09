const fs = require('fs');
const file = 'docs/engineering/Critical Thinking Lab .md';
const content = fs.readFileSync(file, 'utf8');

// The first section up to the end of Section 7 (before the duplicated # 2. Core Philosophy)
const section7Idx = content.indexOf('# 7. Q2 — Domain Spotlight');
const duplicateCorePhilosophyIdx = content.indexOf('# 2. Core Philosophy', section7Idx);

const part1 = content.substring(0, duplicateCorePhilosophyIdx).trim();

// Part 2 starts from "Purpose\n\nEngineers do not only design successful systems."
const part2Marker = 'Purpose\n\nEngineers do not only design successful systems.';
const part2Idx = content.indexOf(part2Marker);
const part2 = content.substring(part2Idx);

// Complete clean content
let cleanPart1 = part1;
if (!cleanPart1.includes('Never choose a weaker example simply to maintain balance.')) {
  if (cleanPart1.includes('which field would suffer the most?')) {
    const p = cleanPart1.indexOf('which field would suffer the most?') + 'which field would suffer the most?"'.length;
    cleanPart1 = cleanPart1.substring(0, p) + "\n\nThat becomes today's Domain Spotlight.\n\nNever choose a weaker example simply to maintain balance.";
  } else if (cleanPart1.includes('"If this programming concept disappeared today...')) {
    const p = cleanPart1.indexOf('"If this programming concept disappeared today...');
    cleanPart1 = cleanPart1.substring(0, p) + '"If this programming concept disappeared today...\n\nwhich field would suffer the most?"\n\nThat becomes today\'s Domain Spotlight.\n\nNever choose a weaker example simply to maintain balance.';
  }
}

const fullClean = cleanPart1 + '\n\n---\n\n# 8. Q3 — Engineering Failure\n\n' + part2;

fs.writeFileSync(file, fullClean);
console.log('Successfully cleaned Critical Thinking Lab .md');
