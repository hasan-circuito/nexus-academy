const fs = require('fs');
const file = 'docs/engineering/MISSION_ENGINEERING_SPEC.md';
let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

lines.forEach((l, i) => {
  if (l.startsWith('#')) {
    console.log(`${i+1}: ${l}`);
  }
});
