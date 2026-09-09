const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

s = s.replace(/console\.log\('([^']*)'\);/g, (match, p1) => {
    return "console.log('" + p1.replace(/\r?\n/g, "\\n") + "');";
});

fs.writeFileSync('scripts/validate-missions.js', s);
console.log('Fixed');
