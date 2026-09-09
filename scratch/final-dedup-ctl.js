const fs = require('fs');
const file = 'docs/engineering/Critical Thinking Lab .md';
const content = fs.readFileSync(file, 'utf8');

// Section 1 to 7 ends before line 250
const sec8LastIdx = content.lastIndexOf('# 8. Q3 — Engineering Failure');
const sec1To7End = content.indexOf('# 8. Q3 — Engineering Failure');

const part1 = content.substring(0, sec1To7End).trim();
const part2 = content.substring(sec8LastIdx).trim();

const cleanDoc = part1 + '\n\n---\n\n' + part2 + '\n';
fs.writeFileSync(file, cleanDoc);
console.log('Finished final deduplication');
