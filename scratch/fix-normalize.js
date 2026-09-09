const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

const regexToReplace = /static normalizeOutput\([^\{]+\{[\s\S]*?return res;\s*\}/;

const validMethod = `static normalizeOutput(str, config = {}) {
    if (str == null) return '';
    let res = String(str);
    if (config.ignoreCase) res = res.toLowerCase();
    if (config.ignoreTrailingNewline) res = res.replace(/[\\r\\n]+$/g, '');
    if (config.ignoreWhitespace) res = res.trim().replace(/\\s+/g, ' ');
    return res;
  }`;

s = s.replace(regexToReplace, validMethod);

fs.writeFileSync('scripts/validate-missions.js', s);
console.log('Fixed normalizeOutput');
