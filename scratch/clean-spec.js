const fs = require('fs');
const file = 'docs/engineering/MISSION_ENGINEERING_SPEC.md';
let content = fs.readFileSync(file, 'utf8');

// Find the duplicate start:
// Line 1411:
// 6. Would splitting create artificial repetition?
// - Yes → merge.
// - No → keep split.
// Immediately followed by:
// Two programming constructs must not automatically become two missions...

const cutStartMarker = '6. Would splitting create artificial repetition?\n- Yes → merge.\n- No → keep split.\n';
const cutStartIdx = content.indexOf(cutStartMarker);

if (cutStartIdx === -1) {
  console.log('Error: cutStartMarker not found');
  process.exit(1);
}

const duplicateStartsAt = cutStartIdx + cutStartMarker.length;

// The duplicate ends right before question 7:
// 7. Can every practice, debug task, quiz, and project be completed
const cutEndMarker = '7. Can every practice, debug task, quiz, and project be completed';
const duplicateEndsAt = content.lastIndexOf(cutEndMarker);

if (duplicateEndsAt === -1) {
  console.log('Error: cutEndMarker not found');
  process.exit(1);
}

const before = content.substring(0, duplicateStartsAt);
const after = content.substring(duplicateEndsAt);

fs.writeFileSync(file, before + after);
console.log('Successfully removed duplicate rules from MISSION_ENGINEERING_SPEC.md');
