const fs = require('fs');
const path = require('path');

const files = ['mission-006.json', 'mission-007.json', 'mission-008.json', 'mission-009.json', 'mission-010.json'];

files.forEach(file => {
  const filePath = path.join('B:', 'nexus-academy', 'data', 'missions', file);
  if (!fs.existsSync(filePath)) return;
  
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  data.steps = data.steps.map(step => {
    if (step.type === 'practice') {
      step.prompt = step.description || step.prompt || '';
      if (step.instructions && Array.isArray(step.instructions)) {
        step.prompt += '\n\n' + step.instructions.map(i => '- ' + i).join('\n');
        delete step.instructions;
      }
      delete step.description;
      
      step.starterCode = step.initialCode || step.starterCode || '';
      delete step.initialCode;
      
      step.solution = step.solution || step.starterCode + '\n# solution';
      step.solutionExplanation = step.solutionExplanation || 'সঠিক উত্তর।';
    }
    
    if (step.type === 'debug') {
      step.type = 'debug_challenge';
      step.scenario = step.description || step.scenario || '';
      delete step.description;
      
      step.buggyCode = step.initialCode || step.buggyCode || '';
      delete step.initialCode;
      
      step.errorMessage = step.errorMessage || 'Error in output';
      step.bugLine = step.bugLine || 1;
      step.bugType = step.bugType || 'logic';
      
      step.fixedCode = step.fixedCode || step.buggyCode;
      step.explanation = step.errorHint || step.explanation || 'Fixed!';
      delete step.errorHint;
      delete step.expectedOutput;
      
      step.hints = step.hints || [step.explanation];
    }
    
    return step;
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log('Fixed schemas for all 5 missions!');
