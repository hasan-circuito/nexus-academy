const fs = require('fs');
const file = 'docs/engineering/MISSION_ENGINEERING_SPEC.md';
let content = fs.readFileSync(file, 'utf8');

// Normalize to check
console.log('File has \\r\\n ?', content.includes('\r\n'));

const marker1 = '6. Would splitting create artificial repetition?';
const idx1 = content.indexOf(marker1);
console.log('idx1:', idx1);

if (idx1 !== -1) {
  // Find the end of this item: "- No → keep split."
  const endOf6 = content.indexOf('- No → keep split.', idx1) + '- No → keep split.'.length;
  
  // Find where question 7 starts
  const q7Marker = '7. Can every practice, debug task, quiz, and project be completed';
  const q7Idx = content.lastIndexOf(q7Marker);
  console.log('endOf6:', endOf6, 'q7Idx:', q7Idx);
  
  if (q7Idx > endOf6) {
    const before = content.substring(0, endOf6);
    const after = content.substring(q7Idx);
    fs.writeFileSync(file, before + '\n' + after);
    console.log('Successfully cut duplicate block!');
  }
}
