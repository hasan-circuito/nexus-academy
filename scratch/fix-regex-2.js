const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

// The problematic lines:
// /g, '
// ');
// OR something like that. I will just find and remove them.

s = s.replace(/\/g, '[\s\S]*?'\);/, "");

fs.writeFileSync('scripts/validate-missions.js', s);
console.log('Fixed');
