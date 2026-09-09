const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

// Fix broken string literals that have literal newlines in them
s = s.replace(/'\r?\n'/g, "'\\n'");
s = s.replace(/"\r?\n"/g, '"\\n"');
s = s.replace(/`\r?\n`/g, '`\\n`');
s = s.replace(/\\r\\n/g, '\\n'); // Standardize

fs.writeFileSync('scripts/validate-missions.js', s);
console.log('Fixed simple string newlines');
