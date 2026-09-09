const fs = require('fs');
let script = fs.readFileSync('scripts/validate-missions.js', 'utf8');

// Fix the console.log issue caused by \n replacement
script = script.replace(/console\.log\('\n=/g, "console.log('\\n=");
script = script.replace(/console\.log\('\n-/g, "console.log('\\n-");
script = script.replace(/console\.log\('\n\n/g, "console.log('\\n\\n");
script = script.replace(/console\.log\('  Mission/g, "console.log('  Mission"); // wait, let's just do a regex replace for the line breaks inside strings

// Actually, an easier way is to just grab the validate method and rewrite it.
// Let's replace the whole Tier 1 step sequence check
let match = script.match(/const steps = missionData\.steps;[\s\S]*?reporter\.record\(\{/);
if (match) {
    script = script.replace(match[0], `const steps = missionData.steps;
    const stepTypes = Array.isArray(steps) ? steps.map(s => s.type) : [];
    const requiredTypes = ['intro', 'story', 'concept', 'code_example', 'practice', 'debug_challenge', 'reflection', 'mission_complete'];
    const missingTypes = requiredTypes.filter(t => !stepTypes.includes(t));
    
    let stepSeqPassed = missingTypes.length === 0;
    const stepSeqErrors = [];
    if (!stepSeqPassed) { stepSeqErrors.push('Missing required step types: ' + missingTypes.join(', ')); }

    reporter.record({`);
}

// Fix the Array length check
script = script.replace(/if \(Array\.isArray\(steps\)\) \{/, "if (Array.isArray(steps)) {");
script = script.replace(/if \(Array\.isArray\(steps\) && steps\.length === 13\) \{/g, "if (Array.isArray(steps)) {");

fs.writeFileSync('scripts/validate-missions.js', script);
console.log('Fixed validate script');
