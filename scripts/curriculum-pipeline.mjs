#!/usr/bin/env node
// scripts/curriculum-pipeline.mjs
// NEXUS Academy — Curriculum Pipeline Engine & Central Knowledge Graph CLI
//
// Subcommands:
// 1. preflight <id> : Validates prerequisites, displays pedagogical contract & AST barriers
// 2. scaffold <id>  : Generates 13-step golden mission JSON conforming to mission.types.ts
// 3. validate <id>  : Runs 4-tier validation suite + Forbidden Syntax AST check
// 4. package <id>   : Validates, registers in manifest & index, updates graph, checks build

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CURRICULUM_GRAPH_PATH = path.join(ROOT_DIR, 'data', 'curriculum', 'curriculum-graph.json');
const MISSIONS_DIR = path.join(ROOT_DIR, 'data', 'missions');
const MANIFEST_PATH = path.join(MISSIONS_DIR, 'manifest.json');
const INDEX_PATH = path.join(MISSIONS_DIR, 'index.json');
const VALIDATE_SCRIPT_PATH = path.join(ROOT_DIR, 'scripts', 'validate-missions.mjs');
const CONTENT_SERVICE_PATH = path.join(ROOT_DIR, 'services', 'ContentService.ts');

// Helper: Normalize mission ID to 3-digit zero-padded string
function normalizeMissionId(rawId) {
  if (!rawId) return null;
  const num = parseInt(rawId.toString().replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return null;
  return String(num).padStart(3, '0');
}

// Helper: Load JSON file safely
function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Helper: Write JSON file with 2-space indentation
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

// Helper: Load curriculum graph
function getCurriculumGraph() {
  if (!fs.existsSync(CURRICULUM_GRAPH_PATH)) {
    throw new Error(`Curriculum graph not found at ${CURRICULUM_GRAPH_PATH}. Please initialize it.`);
  }
  return loadJson(CURRICULUM_GRAPH_PATH);
}

// ============================================================================
// 1. PREFLIGHT SUBCOMMAND
// ============================================================================
export function runPreflight(missionId) {
  console.log('\n======================================================');
  console.log(`✈️  NEXUS ACADEMY — MISSION PREFLIGHT CONTRACT CHECK: M${missionId}`);
  console.log('======================================================\n');

  const graph = getCurriculumGraph();
  const missionsList = Array.isArray(graph) ? graph : (graph.missions || []);
  const contract = missionsList.find(m => m.id === missionId);

  if (!contract) {
    console.error(`❌ Contract for Mission ${missionId} not found in data/curriculum/curriculum-graph.json.`);
    console.error(`   Please add Mission ${missionId} to the curriculum graph before authoring.`);
    return false;
  }

  // Prerequisite check
  const prereqId = contract.prerequisite;
  if (prereqId) {
    console.log(`🔍 Checking Prerequisite M${prereqId}...`);
    const prereqContract = missionsList.find(m => m.id === prereqId);
    if (!prereqContract) {
      console.error(`❌ Prerequisite M${prereqId} is missing in curriculum-graph.json!`);
      return false;
    }

    const manifest = loadJson(MANIFEST_PATH);
    const manifestMissions = manifest.missions || [];
    const prereqInManifest = manifestMissions.find(m => m.id === prereqId);
    if (!prereqInManifest) {
      console.error(`❌ Prerequisite M${prereqId} is not registered in data/missions/manifest.json!`);
      return false;
    }

    const prereqFilePath = path.join(MISSIONS_DIR, `mission-${prereqId}.json`);
    if (!fs.existsSync(prereqFilePath)) {
      console.error(`❌ Prerequisite file missing: ${prereqFilePath}!`);
      return false;
    }

    console.log(`  ✓ Prerequisite M${prereqId} verified in graph, manifest, and disk.\n`);
  } else {
    console.log(`  ✓ Foundational mission (No prerequisites required).\n`);
  }

  // Display the contract
  console.log('📋 MISSION AUTHORING SPECIFICATION (MES Rules 21, 22, 23):');
  console.log(`  • Mission ID        : ${contract.id}`);
  console.log(`  • Title             : ${contract.title}`);
  console.log(`  • Bengali Title     : ${contract.banglaTitle}`);
  if (contract.banglaSubtitle) {
    console.log(`  • Subtitle          : ${contract.banglaSubtitle}`);
  }
  console.log(`  • Engineering Domain: ${contract.clientIndustry} (Rule 22 Context)`);
  console.log(`  • Pain-Point Trigger: ${contract.painPointTrigger}`);
  console.log(`  • Single Capability : ${contract.newCapability} (Invariant 1: newConceptCount = 1)`);
  console.log(`  • Prerequisite ID   : ${contract.prerequisite || 'None'}`);
  console.log('\n🧠 LEARNER KNOWN SCOPE (Up to this mission):');
  const scope = Array.isArray(contract.learnerKnownScope) ? contract.learnerKnownScope : [];
  console.log(`  [ ${scope.join(', ')} ]`);

  console.log('\n🚫 FORBIDDEN SYNTAX BARRIER (Hard AST Rejection):');
  const forbidden = Array.isArray(contract.forbiddenSyntax) ? contract.forbiddenSyntax : [];
  console.log(`  [ ${forbidden.join(', ')} ]`);

  console.log('\n======================================================');
  console.log('✅ PREFLIGHT CONTRACT PASSED: Ready to scaffold & author.');
  console.log(`   Command: npm run mission:scaffold -- ${missionId}`);
  console.log('======================================================\n');
  return true;
}

// ============================================================================
// 2. SCAFFOLD SUBCOMMAND
// ============================================================================
export function runScaffold(missionId, { dryRun = false, force = false } = {}) {
  console.log('\n======================================================');
  console.log(`🏗️  NEXUS ACADEMY — SCAFFOLDING MISSION SKELETON: M${missionId}`);
  console.log('======================================================\n');

  const graph = getCurriculumGraph();
  const missionsList = Array.isArray(graph) ? graph : (graph.missions || []);
  const contract = missionsList.find(m => m.id === missionId);

  if (!contract) {
    console.error(`❌ Mission ${missionId} not found in curriculum graph.`);
    console.error(`   Define the contract in data/curriculum/curriculum-graph.json first.`);
    return false;
  }

  const targetFilePath = path.join(MISSIONS_DIR, `mission-${missionId}.json`);
  if (fs.existsSync(targetFilePath) && !force && !dryRun) {
    console.error(`❌ File already exists: ${targetFilePath}`);
    console.error(`   Use --force to overwrite if you wish to reset this mission.`);
    return false;
  }

  const client = contract.clientIndustry || 'Enterprise';
  const capability = contract.newCapability || 'Core Capability';
  const painPoint = contract.painPointTrigger || 'System limitation';

  // Construct 13-step golden mission conforming to types/mission.types.ts
  const missionSkeleton = {
    id: missionId,
    title: contract.title,
    banglaTitle: contract.banglaTitle,
    banglaSubtitle: contract.banglaSubtitle || `${contract.title} এর ব্যবহার ও মূল নীতি`,
    cognitiveLoadEstimate: {
      readingLevel: 2,
      newConceptCount: 1, // Single Concept Law
      practiceComplexity: 2,
      estimatedTotalMinutes: 20
    },
    curiosity: {
      didYouKnow: `আধুনিক সফটওয়্যার সিস্টেমে ${capability} প্রতিদিন লক্ষ লক্ষ লাইনে ব্যবহৃত হয়।`,
      realWorldApplication: `${client} প্ল্যাটফর্মে লাইভ ডেটা প্রসেসিং ও অটোমেশনের জন্য এটি অপরিহার্য।`,
      aiApplication: `এআই ও এলএলএম ডেটা পাইপলাইনে প্রম্পট ও টোকেন হ্যান্ডলিংয়ে এই ধারণা কাজে লাগে।`,
      eeeApplication: `IoT ও মাইক্রোকন্ট্রোলার সেন্সর রিডিং মনিটর করতে এই আর্কিটেকচার প্রয়োগ করা হয়।`,
      historicalFact: `পাইথনের আধুনিক সংস্করণে এই ফিচারটি ডেভেলপারদের কোডিং গতি বহুগুণ বাড়িয়ে দিয়েছে।`,
      nextMissionPreview: `পরবর্তী মিশনে আমরা এই সক্ষমতার ওপর ভিত্তি করে আরও বাস্তবমুখী সমস্যা সমাধান করব।`
    },
    steps: [
      {
        type: 'intro',
        missionNumber: missionId,
        title: contract.title,
        banglaTitle: contract.banglaTitle,
        tagline: painPoint,
        description: `আগের মিশনে আমরা সিস্টেমের ভিত্তি তৈরি করেছি। কিন্তু বাস্তব সফটওয়্যারে যখন ${painPoint}, তখন নতুন সমাধানের প্রয়োজন হয়। এই মিশনে আমরা সফটওয়্যারকে আরও এক ধাপ সক্ষম করব ${capability} দিয়ে।`,
        learningObjectives: [
          `${painPoint} এর পেছনের কারণ ও সীমাবদ্ধতা বোঝা`,
          `${capability} প্রয়োগ করে ক্লিন ও নির্ভরযোগ্য কোড লেখা`,
          `বাস্তব সিস্টেম আর্কিটেকচারে ডোমেইন-উপযোগী বাগ ডিবাগ করা`
        ],
        estimatedMinutes: 2
      },
      {
        type: 'story',
        title: `বাস্তব সফটওয়্যার সংকট: ${client} সিস্টেম`,
        setting: `একটি বাস্তব ${client} সফটওয়্যার প্রজেক্ট...`,
        content: `একটি সফটওয়্যারে কাজ করতে গিয়ে দেখা গেল ${painPoint}। কোডে পুরনো পদ্ধতিতে সমাধান করতে গিয়ে সিস্টেম জটিল ও ভঙ্গুর হয়ে পড়ছিল। ডেভেলপার উপলব্ধি করল: সফটওয়্যারকে আরও নির্ভরযোগ্য করতে হলে নতুন সক্ষমতা প্রয়োজন। আর সেখান থেকেই জন্ম নিল ${capability}।`,
        moral: `লজিক বোঝার আগে কোড লেখা শুরু করা ইঞ্জিনিয়ারদের প্রধান ভুলের একটি। প্রয়োজন বুঝে সঠিক কনসেপ্ট প্রয়োগ করাই আসল ইঞ্জিনিয়ারিং।`
      },
      {
        type: 'analogy',
        title: `বাস্তব জীবনের উপমা`,
        realWorld: {
          label: `বাস্তব অভিজ্ঞতা`,
          description: `বাস্তব জীবনে আমরা যেভাবে তথ্য পরিবর্তন বা ট্র্যাক করি`,
          icon: `Lightbulb`
        },
        pythonConcept: {
          label: capability,
          description: `পাইথনে এর সরাসরি সমতুল্য কনসেপ্ট ও মেকানিজম`,
          icon: `Code2`
        },
        connection: `বাস্তব সিস্টেমের মতোই পাইথন প্রোগ্রামও ধাপে ধাপে স্টেট পরিবর্তন ও ডেটা ট্রান্সফার করে।`,
        deeperInsight: `কম্পিউটার নিজে কিছু জানে না; সুনির্দিষ্ট নির্দেশনা ছাড়া সে কোনো পদক্ষেপ নিতে পারে না।`
      },
      {
        type: 'concept',
        title: `${capability} এর মূল গঠন ও প্রয়োগ`,
        content: `${capability} পাইথনের একটি মৌলিক শক্তি।\n\nএটি ব্যবহারের নিয়ম:\n১. পরিষ্কারভাবে স্টেট ও ভেরিয়েবল সংজ্ঞায়িত করো।\n২. সঠিক আউটপুট তৈরি করতে পাইথনের নিয়ম মেনে চলো।`,
        keyPoints: [
          `একক দায়িত্ব নীতি (Single Concept Law) মেনে কাজ করো।`,
          `টাইপ এবং সিনট্যাক্স সম্পর্কে সতর্ক থাকো।`,
          `কোড যেন অন্য ডেভেলপারদের কাছে সহজে পাঠযোগ্য হয়।`
        ],
        whyCallout: `${painPoint} দূর করাই এই কনসেপ্টের মূল কারণ।`,
        whenToUse: `যখন ${client} এর মতো ডাইনামিক ডেটা নির্ভর সিস্টেম তৈরি করতে হয়।`,
        whenNotToUse: `যেখানে সরলতর মেমোরি অ্যাসাইনমেন্ট দিয়েই সমাধান সম্ভব।`,
        commonMisconception: `নতুনরা প্রায়শই ধারণা করে এটি জটিল, কিন্তু মূল নিয়মটি একদম সোজা।`
      },
      {
        type: 'visualization',
        title: `স্টেট ও ডেটা ফ্লো ডায়াগ্রাম`,
        description: `পাইথন কীভাবে ব্যাকগ্রাউন্ডে স্টেট এবং মান মূল্যায়ন করে:`,
        visualizationType: 'execution_flow',
        caption: `ইনপুট ➡️ প্রসেসিং ➡️ রূপান্তর ➡️ চূড়ান্ত আউটপুট`,
        data: {
          steps: [
            '১. প্রাথমিক স্টেট তৈরি',
            '২. অপারেন্ড ও মান স্ক্যান',
            '৩. মূল্যায়ন ও প্রসেসিং',
            '৪. মেমোরি আপডেট ও কনসোল প্রদর্শন'
          ]
        }
      },
      {
        type: 'code_example',
        title: `প্রজেক্ট কোড ডেমো`,
        explanation: `নিচের উদাহরণটিতে লক্ষ্য করো কীভাবে ${capability} প্রয়োগ করা হয়েছে:`,
        language: 'python',
        code: `# ${client} Demo\nstatus = "System Ready"\nprint(status)`,
        output: 'System Ready',
        annotations: [
          {
            lineNumber: 2,
            explanation: 'ভেরিয়েবলে প্রাথমিক স্টেট সংরক্ষণ করা হচ্ছে।'
          },
          {
            lineNumber: 3,
            explanation: 'print() এর মাধ্যমে মেমোরির তথ্য কনসোলে প্রদর্শিত হচ্ছে।'
          }
        ],
        postExplanation: 'কোডটি পরিষ্কার এবং কোনো অপ্রয়োজনীয় জটিলতা ছাড়া কাজ সম্পন্ন করে।'
      },
      {
        type: 'eee_example',
        title: `হার্ডওয়্যার ও IoT পার্সপেক্টিভ`,
        context: `একটি মাইক্রোকন্ট্রোলার থেকে সেন্সর রিডিং পর্যবেক্ষণ করার দৃশ্য:`,
        hardware: 'ESP32',
        domain: 'sensor_data',
        code: 'sensor_reading = 24\nprint("Sensor Reading:", sensor_reading)',
        output: 'Sensor Reading: 24',
        explanation: 'এমবেডেড ইঞ্জিনিয়ারিংয়েও মেমোরি ও ভেরিয়েবল ম্যানেজমেন্টের নিয়ম অপরিবর্তিত থাকে।'
      },
      {
        type: 'ai_example',
        title: `AI ও মেশিন লার্নিং পার্সপেক্টিভ`,
        context: `একটি এআই মডেলের প্রসেসিং মেট্রিক ট্র্যাক করার দৃশ্য:`,
        aiDomain: 'large_language_models',
        code: 'active_tokens = 1024\nprint("Active tokens:", active_tokens)',
        output: 'Active tokens: 1024',
        explanation: 'লার্জ ল্যাঙ্গুয়েজ মডেলেও স্টেট ম্যানেজমেন্ট একই গণিত অনুসরণ করে।'
      },
      {
        type: 'practice',
        title: `হাতে-কলমে অনুশীলন: ${client} সলিউশন`,
        prompt: `আমাদের ${client} ক্লায়েন্টের জন্য একটি প্রাথমিক স্ক্রিপ্ট তৈরি করো:\n\nধাপ ১: \`client_name\` ভেরিয়েবলে "${client}" রাখো।\nধাপ ২: print() ব্যবহার করে \`Client: ${client}\` প্রিন্ট করো।`,
        starterCode: '# ধাপ ১: ভেরিয়েবল তৈরি করো\n\n# ধাপ ২: প্রিন্ট করো\n',
        hints: [
          `client_name = "${client}" এভাবে ভেরিয়েবল ডিক্লেয়ার করো।`,
          `print("Client:", client_name) ব্যবহার করতে পারো।`
        ],
        displayHint: `print("Client:", client_name)`,
        expectedOutput: `Client: ${client}\n`,
        validation: {
          type: 'smart_output_source',
          ignoreWhitespace: true,
          ignoreCase: true,
          requiredVariables: ['client_name'],
          feedbackMessages: {
            onPass: 'দারুণ! তোমার সমাধান সফলভাবে এক্সিকিউট হয়েছে।',
            onMissingVariable: 'client_name ভেরিয়েবলটি সংজ্ঞায়িত করেছো কি?',
            onPatternFail: 'আউটপুট ফরম্যাটটি আবার যাচাই করো।'
          }
        },
        solution: `client_name = "${client}"\nprint("Client:", client_name)`,
        solutionExplanation: 'ভেরিয়েবল ডিক্লেয়ার করে সরাসরি print() এর সাহায্যে কাঙ্ক্ষিত আউটপুট প্রদর্শিত হয়েছে।'
      },
      {
        type: 'quiz',
        title: `জ্ঞান যাচাই: ${capability}`,
        instructions: `সঠিক উত্তরটি নির্বাচন করো। পাসিং স্কোর: ৭০%`,
        passingScore: 70,
        questions: [
          {
            id: 'q1',
            questionType: 'multiple_choice',
            question: `${capability} ব্যবহারের প্রধান উদ্দেশ্য কোনটি?`,
            difficulty: 'easy',
            options: [
              'সফটওয়্যার স্টেটকে কার্যকরভাবে পরিচালনা ও প্রদর্শন করা',
              'কম্পিউটারের প্রসেসর বন্ধ করে দেওয়া',
              'প্রোগ্রাম ক্র্যাশ করানো',
              'ইন্টারনেট সংযোগ বিচ্ছিন্ন করা'
            ],
            correctOptionIndex: 0,
            explanation: 'এটি সফটওয়্যারের নির্ভরযোগ্যতা ও পাঠযোগ্যতা নিশ্চিত করে।'
          },
          {
            id: 'q2',
            questionType: 'multiple_choice',
            question: `কোড এক্সিকিউশনের ক্ষেত্রে কোন নিয়মটি সত্য?`,
            difficulty: 'medium',
            options: [
              'কোড ওপর থেকে নিচে ক্রমানুসারে লাইন বাই লাইন এক্সিকিউট হয়',
              'কোড নিচ থেকে ওপরের দিকে উল্টোভাবে এক্সিকিউট হয়',
              'কোডের লাইনগুলো এলোমেলোভাবে রান হয়',
              'কম্পিউটার কোনো নির্দেশনা ছাড়াই নিজে কোড লেখে'
            ],
            correctOptionIndex: 0,
            explanation: 'পাইথন স্ক্রিপ্ট ক্রমানুসারে ওপরের লাইন থেকে নিচের লাইনে এক্সিকিউট হয়।'
          }
        ]
      },
      {
        type: 'debug_challenge',
        title: `বাগ খোঁজো: ${capability} ত্রুটি (Rule 21)`,
        scenario: `${client} সিস্টেমে ${capability} এর একটি স্পেসিফিকেশন মিসম্যাচ দেখা দিয়েছে। কোডটি পর্যালোচনা করে সঠিক আউটপুট নিশ্চিত করো:`,
        buggyCode: `# ${client} স্পেসিফিকেশন বাগ\nitem_label = "${client} Item"\n# ভুল ভেরিয়েবল বা আউটপুট ফরম্যাট\nprint("Result:", "item_label")`,
        errorMessage: `Output Mismatch: Printed literal string instead of evaluated variable`,
        bugLine: 4,
        bugType: 'logic',
        hints: [
          'পাইথনে কোটেশনের ভেতরের টেক্সট আক্ষরিকভাবে প্রিন্ট হয়।',
          'ভেরিয়েবলের আসল মান প্রদর্শন করতে কোটেশন ছাড়া ভেরিয়েবলের নাম ব্যবহার করো।',
          `${capability} এর সঠিক স্পেসিফিকেশন মেনে চলো।`
        ],
        fixedCode: `# ${client} সমাধান\nitem_label = "${client} Item"\n# সঠিক আউটপুট ফরম্যাট\nprint("Result:", item_label)`,
        explanation: `${capability} এর স্পেসিফিকেশন অনুযায়ী সঠিক ভেরিয়েবল রেফারেন্স ব্যবহার করায় কাঙ্ক্ষিত আউটপুট প্রদর্শিত হয়েছে।`
      },
      {
        type: 'reflection',
        title: `ক্রিটিক্যাল থিংকিং ল্যাব: ইঞ্জিনিয়ারিং মাইন্ডসেট`,
        instruction: `একজন সফটওয়্যার ইঞ্জিনিয়ার হিসেবে নিচের প্রশ্নটি গভীরভাবে ভেবে উত্তর দাও:`,
        prompts: [
          `${capability} বাস্তব সফটওয়্যারে কীভাবে কাজে লাগবে?`,
          `${capability} সঠিকভাবে প্রয়োগ না করলে সিস্টেমে কী ধরনের ত্রুটি হতে পারে?`,
          `লজিক ডিজাইন করার সময় কোন কোন বিষয়ের দিকে খেয়াল রাখা দরকার?`
        ],
        criticalThinkingQuestions: [
          {
            question: `${client} সিস্টেমে ${capability} সংক্রান্ত ত্রুটি ঘটলে ব্যবহারকারী বা ডেটার ওপর কী প্রভাব পড়তে পারে?`,
            expertThinking: `সফটওয়্যারে সঠিক ডেটা ও স্পেসিফিকেশন বজায় না রাখলে আউটপুটে বিভ্রান্তি এবং ভুল সিদ্ধান্ত তৈরি হতে পারে। তাই কোডের প্রতিটি ট্রান্সফরমেশন নিখুঁতভাবে যাচাই করা উচিত।`,
            realWorldEngineering: `${client} প্ল্যাটফর্মে ভুল ফরম্যাট বা ডেটা প্রদর্শিত হলে গ্রাহকের বিভ্রান্তি এবং সিস্টেমের নির্ভরযোগ্যতা নষ্ট হয়।`,
            beyondProgramming: `বাস্তব জীবনেও সঠিক ও সুস্পষ্ট তথ্যের ওপর ভিত্তি করে যোগাযোগ রক্ষা করা জরুরি।`
          }
        ]
      },
      {
        type: 'mission_complete',
        title: `অভিনন্দন! মিশন ${missionId} সম্পন্ন!`,
        summary: `তুমি সফলভাবে ${capability} আয়ত্ত করেছ এবং ${client} ক্লায়েন্টের সমাধান সম্পূর্ণ করেছ!`,
        keyLearnings: [
          `${capability} এর পরিষ্কার ধারণা লাভ।`,
          `ডোমেইন-উপযোগী বাগ শনাক্ত ও সমাধান করার দক্ষতা।`,
          `প্রফেশনাল সফটওয়্যার ইঞ্জিনিয়ারিং মাইন্ডসেট অর্জন।`
        ]
      }
    ]
  };

  if (dryRun) {
    console.log('🔍 DRY RUN: Generated skeleton JSON preview:');
    console.log(JSON.stringify(missionSkeleton, null, 2));
    console.log('\n✓ Dry run completed without writing to disk.');
    return true;
  }

  writeJson(targetFilePath, missionSkeleton);
  console.log(`✨ Mission skeleton created: ${targetFilePath}`);
  console.log(`   Steps count: ${missionSkeleton.steps.length} (Strict 13-step golden architecture)`);
  console.log(`\nNext step: Author/refine content, then run:`);
  console.log(`   npm run mission:validate -- ${missionId}\n`);
  return true;
}

// ============================================================================
// 3. VALIDATE SUBCOMMAND
// ============================================================================
export function runValidate(missionId) {
  console.log(`\n======================================================`);
  console.log(`🧪 VALIDATING MISSION ${missionId} VIA AUTOMATED QUALITY GATE`);
  console.log(`======================================================\n`);

  const res = spawnSync('node', [VALIDATE_SCRIPT_PATH, '--mission', missionId], {
    stdio: 'inherit',
    env: process.env
  });

  if (res.status !== 0) {
    console.error(`\n❌ Quality gate rejected Mission ${missionId} (exit code ${res.status}).`);
    return false;
  }

  console.log(`\n🎉 Mission ${missionId} passed 100% of quality gate checks!\n`);
  return true;
}

// ============================================================================
// 4. PACKAGE SUBCOMMAND
// ============================================================================
export function runPackage(missionId) {
  console.log('\n======================================================');
  console.log(`📦 NEXUS ACADEMY — PACKAGING MISSION M${missionId}`);
  console.log('======================================================\n');

  // Step 1: Run validation first
  console.log(`Step 1: Running validation suite on M${missionId}...`);
  const isValid = runValidate(missionId);
  if (!isValid) {
    console.error(`❌ Packaging aborted: Mission ${missionId} failed validation.`);
    return false;
  }

  // Step 2: Load mission file, contract, manifest, and index
  const missionFilePath = path.join(MISSIONS_DIR, `mission-${missionId}.json`);
  const mission = loadJson(missionFilePath);

  const graph = getCurriculumGraph();
  const graphMissions = Array.isArray(graph) ? graph : (graph.missions || []);
  const contract = graphMissions.find(m => m.id === missionId);

  if (!contract) {
    console.error(`❌ Contract for Mission ${missionId} not found in data/curriculum/curriculum-graph.json.`);
    console.error(`   A pedagogical contract must exist in curriculum-graph.json before packaging.`);
    return false;
  }

  // Step 3: Register in manifest.json
  console.log(`Step 2: Registering in data/missions/manifest.json...`);
  const manifest = loadJson(MANIFEST_PATH);
  if (!Array.isArray(manifest.missions)) {
    manifest.missions = [];
  }

  const existingManifestIdx = manifest.missions.findIndex(m => m.id === missionId);
  const manifestEntry = {
    id: missionId,
    title: mission.title,
    banglaTitle: mission.banglaTitle,
    banglaSubtitle: mission.banglaSubtitle || '',
    status: 'published',
    prerequisite: contract?.prerequisite ?? (parseInt(missionId, 10) > 1 ? String(parseInt(missionId, 10) - 1).padStart(3, '0') : null),
    primaryConcept: contract?.newCapability || mission.title,
    estimatedMinutes: mission.cognitiveLoadEstimate?.estimatedTotalMinutes || 20,
    difficulty: 'beginner'
  };

  if (existingManifestIdx !== -1) {
    manifest.missions[existingManifestIdx] = manifestEntry;
    console.log(`  ✓ Updated existing manifest entry for M${missionId}.`);
  } else {
    manifest.missions.push(manifestEntry);
    manifest.missions.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
    console.log(`  ✓ Added new manifest entry for M${missionId}.`);
  }
  writeJson(MANIFEST_PATH, manifest);

  // Step 4: Register in index.json
  console.log(`Step 3: Registering in data/missions/index.json...`);
  const index = loadJson(INDEX_PATH);
  const existingIndexIdx = index.findIndex(m => m.id === missionId);
  const existingDesc = existingIndexIdx !== -1 ? index[existingIndexIdx].description : null;
  const prereqId = manifestEntry.prerequisite;

  const indexEntry = {
    id: missionId,
    title: mission.title,
    banglaTitle: mission.banglaTitle,
    banglaSubtitle: mission.banglaSubtitle || '',
    description: existingDesc || `Master ${manifestEntry.primaryConcept} with practical engineering exercises`,
    status: parseInt(missionId, 10) === 1 ? 'unlocked' : 'locked',
    estimatedMinutes: manifestEntry.estimatedMinutes,
    difficulty: manifestEntry.difficulty,
    knowledgeGraph: {
      prerequisiteIds: prereqId ? [prereqId] : [],
      enablesIds: existingIndexIdx !== -1 ? (index[existingIndexIdx].knowledgeGraph?.enablesIds || []) : [],
      relatedIds: [],
      topicSlug: (contract?.newCapability || mission.title).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
    },
    tags: ['python', ...(contract?.learnerKnownScope ? contract.learnerKnownScope.slice(-3) : [])]
  };

  if (existingIndexIdx !== -1) {
    index[existingIndexIdx] = indexEntry;
    console.log(`  ✓ Updated existing index entry for M${missionId}.`);
  } else {
    index.push(indexEntry);
    index.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
    console.log(`  ✓ Added new index entry for M${missionId}.`);
  }

  // Ensure prerequisite's enablesIds contains missionId
  if (prereqId) {
    const prereqIndexEntry = index.find(m => m.id === prereqId);
    if (prereqIndexEntry && prereqIndexEntry.knowledgeGraph) {
      if (!prereqIndexEntry.knowledgeGraph.enablesIds.includes(missionId)) {
        prereqIndexEntry.knowledgeGraph.enablesIds.push(missionId);
      }
    }
  }
  writeJson(INDEX_PATH, index);

  // Step 5: Update curriculum-graph.json state
  console.log(`Step 4: Updating graph state in curriculum-graph.json...`);
  if (contract) {
    contract.status = 'published';
  }
  graph.updatedAt = new Date().toISOString().split('T')[0];
  writeJson(CURRICULUM_GRAPH_PATH, graph);
  console.log(`  ✓ Graph state updated to published.`);

  // Step 5: Ensure registration in services/ContentService.ts
  console.log(`Step 5: Ensuring registration in services/ContentService.ts...`);
  if (fs.existsSync(CONTENT_SERVICE_PATH)) {
    let csContent = fs.readFileSync(CONTENT_SERVICE_PATH, 'utf-8');
    const importStmt = `import mission${missionId} from '@/data/missions/mission-${missionId}.json';`;
    const mapEntry = `  '${missionId}': mission${missionId} as MissionData,`;

    let changed = false;
    if (!csContent.includes(`mission${missionId} from`)) {
      const lastImportMatch = csContent.match(/import mission\d+ from [^;]+;\n/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        csContent = csContent.replace(lastImport, `${lastImport}${importStmt}\n`);
        changed = true;
      }
    }
    if (!csContent.includes(`'${missionId}':`)) {
      csContent = csContent.replace(
        /(const missions: Record<string, MissionData> = \{[\s\S]*?)(\n\};)/,
        `$1\n${mapEntry}$2`
      );
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(CONTENT_SERVICE_PATH, csContent, 'utf-8');
      console.log(`  ✓ Registered M${missionId} in services/ContentService.ts.`);
    } else {
      console.log(`  ✓ M${missionId} already registered in services/ContentService.ts.`);
    }
  }

  // Step 6: Build Readiness Verification
  console.log(`Step 6: Verifying TypeScript compilation & build readiness...`);
  const tscRes = spawnSync('npx', ['tsc', '--noEmit'], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    shell: true
  });

  if (tscRes.status !== 0) {
    console.error(`❌ TypeScript compilation check failed! Fix type errors before shipping.`);
    return false;
  }
  console.log(`  ✓ TypeScript compilation clean (0 errors).`);

  // Step 7: Verify full mission suite passes
  console.log(`Step 6: Verifying full mission suite integrity with new mission...`);
  const fullValRes = spawnSync('node', [VALIDATE_SCRIPT_PATH], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: process.env
  });

  if (fullValRes.status !== 0) {
    console.error(`❌ Full mission test suite check failed after registering M${missionId}!`);
    return false;
  }
  console.log(`  ✓ Full mission suite verified 100%.`);

  console.log('\n======================================================');
  console.log(`🎉 MISSION ${missionId} SUCCESSFULLY PACKAGED & PUBLISHED!`);
  console.log('======================================================\n');
  return true;
}

// ============================================================================
// CLI ROUTER & ENTRY POINT
// ============================================================================
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printUsage();
  process.exit(0);
}

const flags = new Set(args.filter(a => a.startsWith('-')));
const positional = args.filter(a => !a.startsWith('-'));

const subcommand = positional[0];
const rawMissionId = positional[1];
const dryRun = flags.has('--dry-run');
const force = flags.has('--force');

function printUsage() {
  console.log(`
NEXUS Academy — Curriculum Pipeline CLI

Usage:
  node scripts/curriculum-pipeline.mjs <subcommand> <missionId> [options]

Subcommands:
  preflight <id>   Check prerequisites, display contract, scope, forbidden AST nodes
  scaffold  <id>   Generate 13-step golden mission JSON skeleton (--dry-run, --force)
  validate  <id>   Run 4-tier validation suite + Forbidden Syntax AST check
  package   <id>   Validate, register in manifest & index, update graph, test build

Examples:
  node scripts/curriculum-pipeline.mjs preflight 001
  node scripts/curriculum-pipeline.mjs scaffold 011 --dry-run
  node scripts/curriculum-pipeline.mjs scaffold --dry-run 011
  node scripts/curriculum-pipeline.mjs validate 010
  node scripts/curriculum-pipeline.mjs package 010
`);
}

if (!subcommand) {
  printUsage();
  process.exit(0);
}

const missionId = normalizeMissionId(rawMissionId);
if (!missionId) {
  console.error(`❌ Error: Valid 3-digit mission ID required (e.g. 001, 010). Received: "${rawMissionId || ''}"`);
  printUsage();
  process.exit(1);
}

let success = false;
switch (subcommand.toLowerCase()) {
  case 'preflight':
    success = runPreflight(missionId);
    break;
  case 'scaffold':
    success = runScaffold(missionId, { dryRun, force });
    break;
  case 'validate':
    success = runValidate(missionId);
    break;
  case 'package':
    success = runPackage(missionId);
    break;
  default:
    console.error(`❌ Unknown subcommand: "${subcommand}"`);
    printUsage();
    process.exit(1);
}

process.exit(success ? 0 : 1);
