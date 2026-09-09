const fs = require('fs');
const file = 'docs/engineering/Critical Thinking Lab .md';
let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

console.log('Total lines before:', lines.length);
lines.forEach((l, i) => {
  if (l.startsWith('#')) {
    console.log(`${i+1}: ${l}`);
  }
});
