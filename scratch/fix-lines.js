const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

// The file has literal newlines where '\n' was originally present in a regex or string.
// Let's find all instances where a line ends abruptly with `\r` or where `\n` is literally broken inside a regex or string.
// This is tedious, but we can do a quick replace for the known patterns.

s = s.replace(/res\.replace\(\/\\[rn]\r?\n/g, "res.replace(/[\\r\\n");
s = s.replace(/res\.replace\(\/\\r\r?\n/g, "res.replace(/\\r\\n");

// Actually, let's just restore ALL instances of a broken regex or string.
s = s.replace(/console\.log\('=/g, "console.log('\\n=");
s = s.replace(/console\.log\('-/g, "console.log('\\n-");
s = s.replace(/console\.log\('  Mission/g, "console.log('\\n  Mission");

// The regex on line 201 was: res = res.replace(/[\r\n]+$/g, '');
// The regex on line 202 was: res = res.trim().replace(/\s+/g, ' '); or replace(/\r\n/g, '')?
// Let's just fix lines 201-205 by completely replacing them with valid code.

const lines = s.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('if (config.ignoreTrailingNewline)')) {
        lines[i] = "    if (config.ignoreTrailingNewline) res = res.replace(/[\\r\\n]+$/g, '');";
        if (lines[i+1] === "") {
            lines.splice(i+1, 1);
        }
    }
    if (lines[i].includes('if (config.ignoreWhitespace)')) {
        lines[i] = "    if (config.ignoreWhitespace) res = res.trim().replace(/\\s+/g, ' ');";
        if (lines[i+1] && lines[i+1].includes("g, ' '))")) {
             lines.splice(i+1, 1);
        }
    }
    
    // Check for hanging console.log('
    if (lines[i].trim() === "console.log('") {
        if (lines[i+1] && lines[i+1].startsWith("' + '='.repeat")) {
            lines[i] = "    console.log('\\n' + '='.repeat(80));";
            lines.splice(i+1, 1);
        }
    }
}

fs.writeFileSync('scripts/validate-missions.js', lines.join('\n'));
console.log('Fixed lines');
