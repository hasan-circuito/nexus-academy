const fs = require('fs');
const file = 'docs/engineering/Critical Thinking Lab .md';
let content = fs.readFileSync(file, 'utf8');

const firstHeader = '# Critical Thinking Lab Engineering Rulebook';
const firstIdx = content.indexOf(firstHeader);
const secondIdx = content.indexOf(firstHeader, firstIdx + firstHeader.length);

if (secondIdx !== -1) {
  const targetEnd = content.indexOf('# 8. Q3 — Engineering Failure', secondIdx);
  if (targetEnd !== -1) {
    let before = content.substring(0, secondIdx).trim();
    const after = content.substring(targetEnd);
    
    // Ensure Section 7 ends properly
    if (!before.includes('Never choose a weaker example simply to maintain balance.')) {
      const p = before.indexOf('which field would suffer the most?');
      if (p !== -1) {
        before = before.substring(0, p + 'which field would suffer the most?"'.length) + 
          "\n\nThat becomes today's Domain Spotlight.\n\nNever choose a weaker example simply to maintain balance.";
      }
    }
    
    fs.writeFileSync(file, before + '\n\n---\n\n' + after);
    console.log('Deduplication of Critical Thinking Lab .md complete.');
  } else {
    console.log('Could not find targetEnd');
  }
} else {
  console.log('No second header found');
}
