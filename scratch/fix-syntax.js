const fs = require('fs');
let script = fs.readFileSync('scripts/validate-missions.js', 'utf8');

// The extra brace is right before reporter.record:
// const stepSeqErrors = [];
//     }
// 
//     reporter.record({

script = script.replace(/const stepSeqErrors = \[\];\s*\}\s*reporter\.record/g, 
  "const stepSeqErrors = [];\\n    if (!stepSeqPassed) stepSeqErrors.push('Missing step types: ' + missingTypes.join(', '));\\n\\n    reporter.record");

// Also there's another error further down:
// if (Array.isArray(steps) && steps.length === 13) {
// I'll change it to just `if (Array.isArray(steps)) {`
script = script.replace(/if \(Array\.isArray\(steps\) && steps\.length === 13\) \{/g, "if (Array.isArray(steps)) {");

fs.writeFileSync('scripts/validate-missions.js', script);
console.log('Fixed syntax error');
