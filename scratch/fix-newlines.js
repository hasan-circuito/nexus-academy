const fs = require('fs');
let script = fs.readFileSync('scripts/validate-missions.js', 'utf8');

// The replacement generated a literal '\n'. Let's replace the literal backslashes with actual newlines.
script = script.replace(/\\n/g, '\n');

fs.writeFileSync('scripts/validate-missions.js', script);
console.log('Fixed newlines');
