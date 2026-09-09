const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

s = s.replace(/res = res\.replace\(\/\[\\r\\n\]\+\$\r?\n/g, "res = res.replace(/[\\r\\n]+$/g, '');\n");

fs.writeFileSync('scripts/validate-missions.js', s);
console.log('Fixed regex line');
