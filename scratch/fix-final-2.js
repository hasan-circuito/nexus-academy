const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

// Fix specific broken lines
s = s.replace(/'Nexus\r?\n'/g, "'Nexus\\n'");
s = s.replace(/'10\r?\n15\r?\n'/g, "'10\\n15\\n'");
s = s.replace(/'50\r?\n3\r?\n'/g, "'50\\n3\\n'");

fs.writeFileSync('scripts/validate-missions.js', s);
console.log('Fixed more string newlines');
