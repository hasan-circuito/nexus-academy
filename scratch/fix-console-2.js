const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

// The file has literal newlines inside string literals that are causing syntax errors.
// Specifically around console.log('
// ')

s = s.replace(/console\.log\('\r?\n'/g, "console.log('\\n'");
s = s.replace(/console\.log\('\r?\n/g, "console.log('\\n");

fs.writeFileSync('scripts/validate-missions.js', s);
console.log('Fixed');
