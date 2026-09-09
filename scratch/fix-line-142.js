const fs = require('fs');
let s = fs.readFileSync('scripts/validate-missions.js', 'utf8');

s = s.replace(/console\.log\('='\·repeat\(80\) \+ '\r?\n'\);/g, "console.log('='.repeat(80) + '\\n');");
// Actually, it's just `console.log('='.repeat(80) + '\n');` in the code, but split over lines. Let's just fix it without regex.

const badStr = "console.log('='.repeat(80) + '\r\n');";
const badStr2 = "console.log('='.repeat(80) + '\n');";

s = s.replace("console.log('='.repeat(80) + '\r\n');", "console.log('='.repeat(80) + '\\n');");
s = s.replace("console.log('='.repeat(80) + '\n');", "console.log('='.repeat(80) + '\\n');");

fs.writeFileSync('scripts/validate-missions.js', s);
console.log('Fixed');
