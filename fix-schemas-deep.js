const fs = require('fs');
const path = require('path');

const files = ['mission-006.json', 'mission-007.json', 'mission-008.json', 'mission-009.json', 'mission-010.json'];

files.forEach(file => {
  const filePath = path.join('B:', 'nexus-academy', 'data', 'missions', file);
  if (!fs.existsSync(filePath)) return;
  
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const mNum = file.match(/\d+/)[0];
  
  data.steps = data.steps.map((step, index) => {
    // FIX INTRO
    if (step.type === 'intro') {
      return {
        id: step.id || `m${mNum}-intro`,
        type: 'intro',
        missionNumber: mNum,
        title: "Introduction",
        banglaTitle: step.title || "ভূমিকা",
        tagline: "শিখতে প্রস্তুত হও!",
        description: step.content || step.description || "এই মিশনে আমরা নতুন কিছু শিখব।",
        learningObjectives: [
          "নতুন কনসেপ্টটি বোঝা",
          "কোডে সেটি প্রয়োগ করা",
          "বাস্তব সমস্যার সমাধান করা"
        ],
        estimatedMinutes: 10
      };
    }
    
    // FIX CONCEPT
    if (step.type === 'concept') {
      return {
        id: step.id || `m${mNum}-concept-${index}`,
        type: 'concept',
        title: step.title || 'কনসেপ্ট',
        content: step.description || step.content || 'কনসেপ্ট এক্সপ্লানেশন।',
        keyPoints: step.points || step.keyPoints || ['প্রথম পয়েন্ট', 'দ্বিতীয় পয়েন্ট'],
        whyCallout: 'এটি প্রোগ্রামিংয়ের খুব গুরুত্বপূর্ণ একটি অংশ।',
        whenToUse: 'যখনই দরকার হবে।',
        whenNotToUse: 'যেখানে অপ্রয়োজনীয়।'
      };
    }
    
    // FIX CODE EXAMPLE
    if (step.type === 'code_example') {
      return {
        id: step.id || `m${mNum}-code-${index}`,
        type: 'code_example',
        title: step.title || 'কোড উদাহরণ',
        explanation: step.explanation || 'নিচের কোডটি লক্ষ্য করো:',
        language: 'python',
        code: step.code || '# কোড',
        output: step.output || 'Success',
        annotations: step.annotations || [
          { lineNumber: 1, explanation: "কোডের শুরু" }
        ]
      };
    }
    
    // FIX PRACTICE
    if (step.type === 'practice') {
      return {
        id: step.id || `m${mNum}-practice-${index}`,
        type: 'practice',
        title: step.title || 'প্র্যাকটিস',
        prompt: step.prompt || step.description || 'কোডটি লেখো:',
        starterCode: step.starterCode || step.initialCode || '# কোড',
        hints: step.hints || ['একটু ভেবে দেখো।'],
        displayHint: 'এখানে ক্লু দেওয়া আছে।',
        expectedOutput: step.expectedOutput || 'Success',
        solution: step.solution || step.starterCode || step.initialCode || '# কোড',
        solutionExplanation: step.solutionExplanation || 'এইভাবেই সমাধান করতে হয়।'
      };
    }
    
    // FIX DEBUG CHALLENGE
    if (step.type === 'debug_challenge' || step.type === 'debug') {
      return {
        id: step.id || `m${mNum}-debug-${index}`,
        type: 'debug_challenge',
        title: step.title || 'ডিবাগ চ্যালেঞ্জ',
        scenario: step.scenario || step.description || 'কোডে একটি বাগ আছে।',
        buggyCode: step.buggyCode || step.initialCode || 'print(a)',
        errorMessage: step.errorMessage || 'NameError',
        bugLine: step.bugLine || 1,
        bugType: 'logic',
        hints: step.hints || ['কোডটি আবার পড়ো।', 'ভুলটি কোথায় হতে পারে?'],
        fixedCode: step.fixedCode || step.buggyCode || step.initialCode || 'print(a)',
        explanation: step.explanation || step.errorHint || 'বাগ ফিক্সড!'
      };
    }
    
    // FIX REFLECTION
    if (step.type === 'reflection') {
      return {
        id: step.id || `m${mNum}-reflection`,
        type: 'reflection',
        title: step.title || 'রিফ্লেকশন',
        instruction: 'নিচের প্রশ্নগুলো নিয়ে একটু চিন্তা করো:',
        prompts: [
          step.question || 'এই মিশনে সবচেয়ে জরুরি কী শিখলে?',
          'কোথায় এটি কাজে লাগতে পারে?',
          'কোন বিষয়টি বুঝতে সমস্যা হয়েছে?'
        ]
      };
    }
    
    return step;
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log('Fixed ALL missing schema fields!');
