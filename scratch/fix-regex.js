const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

// Replace specific broken lines
s = s.replace(/res\.replace\(\/\[\\r\r?\n/g, "res.replace(/[\\r\\n");
s = s.replace(/\]\+\$\/g/g, "]+$/g");

fs.writeFileSync('scripts/validate-missions.js', s);
console.log('Fixed regex');
