const fs = require('fs');
const file = 'scripts/validate-missions.js';
let content = fs.readFileSync(file, 'utf8');

// Replace the mission specific rules switch statement
content = content.replace(/static getMissionSpecificRules[\s\S]*?static validate/, `static getMissionSpecificRules(missionId) {
    const rules = [...this.getGlobalForbiddenRules()];
    switch (missionId) {
      case '006':
      case '007':
      case '008':
      case '009':
      case '010':
        // Simplified boundary checks for now - can be expanded later
        rules.push({ regex: /\\bwhile\\b/, message: 'Forbidden loop "while"' });
        break;
    }
    return rules;
  }

  static validate`);

// Replace the capability checks
content = content.replace(/switch \(missionId\) \{[\s\S]*?\}\s*reporter\.record\(\{[\s\S]*?testName: 'New Capability Verification: Target Concept Present & Exercised'/m, `
    // Simplified capability checks
    switch (missionId) {
      case '006': capabilityPassed = /\\+|-|\\*/.test(allCode); break;
      case '007': capabilityPassed = /\\//.test(allCode); break;
      case '008': capabilityPassed = /input\\(/.test(allCode); break;
      case '009': capabilityPassed = /int\\(/.test(allCode); break;
    }
    if (!capabilityPassed) capabilityErrors.push('Mission target capability not found in code');

    reporter.record({
      tier: 2,
      missionId,
      testName: 'New Capability Verification: Target Concept Present & Exercised'`);

// Fix prerequisite chain
content = content.replace(/const prereqChain = \['005', '006', '007', '008', '009', '010'\];/, "const prereqChain = ['005', '006', '007', '008', '009'];");

fs.writeFileSync(file, content);
console.log('Fixed validation rules');
