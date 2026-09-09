const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

let out = "";
let inSingle = false;
let inDouble = false;

for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "'" && !inDouble && s[i-1] !== '\\') inSingle = !inSingle;
    if (c === '"' && !inSingle && s[i-1] !== '\\') inDouble = !inDouble;
    
    if (c === '\n' && (inSingle || inDouble)) {
        out += '\\n';
    } else if (c === '\r' && (inSingle || inDouble)) {
        // ignore
    } else {
        out += c;
    }
}

fs.writeFileSync('scripts/validate-missions.js', out);
console.log('Fixed token by token');
