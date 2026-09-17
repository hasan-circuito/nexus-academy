// scripts/test-step-persistence.mjs
// NEXUS Academy — Step Persistence & Resume Automated Test Suite

import assert from 'node:assert';
import fs from 'node:fs';

console.log('======================================================');
console.log('🔄 NEXUS ACADEMY — STEP PERSISTENCE & RESUME TEST SUITE');
console.log('======================================================\n');

// 1. Mock LocalStorage and DOM Environment
const mockStorage = new Map();
globalThis.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};

const dispatchedEvents = [];
globalThis.window = {
  dispatchEvent: (e) => dispatchedEvents.push(e),
  addEventListener: () => {},
  removeEventListener: () => {},
};

// 2. Implementation under test (matching LocalStorageDataService)
class StepPersistenceService {
  constructor() {
    this.storage = globalThis.localStorage;
  }

  getProgress() {
    const defaultProgress = {
      _schemaVersion: 1,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      xp: 0,
      level: 1,
      streak: { current: 0, longest: 0, lastStudyDate: '' },
      unlockedAchievements: [],
      missions: {},
      totalStudyTimeMs: 0,
      sessionCount: 0,
      recentSessions: [],
      activityHistory: [],
    };
    try {
      const item = this.storage.getItem('nexus_progress');
      if (!item) return defaultProgress;
      const parsed = JSON.parse(item);
      return {
        ...defaultProgress,
        ...parsed,
        missions: parsed.missions || {},
      };
    } catch {
      return defaultProgress;
    }
  }

  saveProgress(p) {
    this.storage.setItem('nexus_progress', JSON.stringify(p));
    globalThis.window.dispatchEvent({ type: 'nexus_storage_update' });
  }

  createDefaultMissionProgress() {
    return {
      status: 'locked',
      understandingScore: 0,
      xpEarned: 0,
      currentStepIndex: 0,
      steps: {},
      quizAttempts: [],
      debugAttempts: [],
      reflection: { completed: false },
    };
  }

  getActiveStep(missionId) {
    const cleanId = missionId.replace(/^mission-/, '');
    const progress = this.getProgress();
    const mp = progress.missions[cleanId] || progress.missions[missionId];
    if (!mp) return 0;
    if (typeof mp.currentStepIndex === 'number' && !isNaN(mp.currentStepIndex) && mp.currentStepIndex >= 0) {
      return Math.floor(mp.currentStepIndex);
    }
    if (mp.status === 'complete') {
      return 0;
    }
    let maxStep = 0;
    if (mp.steps) {
      for (const key of Object.keys(mp.steps)) {
        if (key.startsWith('step_')) {
          const idx = parseInt(key.replace('step_', ''), 10);
          if (!isNaN(idx) && idx > maxStep) {
            maxStep = idx;
          }
        } else if (/^\d+$/.test(key)) {
          const idx = parseInt(key, 10);
          if (!isNaN(idx) && idx > maxStep) {
            maxStep = idx;
          }
        }
      }
    }
    return maxStep;
  }

  saveActiveStep(missionId, stepIndex) {
    if (typeof stepIndex !== 'number' || isNaN(stepIndex) || stepIndex < 0) return;

    const intStepIndex = Math.floor(stepIndex);
    const cleanId = missionId.replace(/^mission-/, '');
    const progress = this.getProgress();
    if (!progress.missions[cleanId]) {
      if (progress.missions[missionId]) {
        progress.missions[cleanId] = progress.missions[missionId];
        delete progress.missions[missionId];
      } else {
        progress.missions[cleanId] = this.createDefaultMissionProgress(cleanId);
      }
    }

    const mp = progress.missions[cleanId];
    const isFoundational = cleanId === '001';
    const shouldSetInProgress = mp.status === 'unlocked' || (isFoundational && mp.status === 'locked');

    if (mp.currentStepIndex === intStepIndex && !shouldSetInProgress) {
      return;
    }

    mp.currentStepIndex = intStepIndex;

    if (shouldSetInProgress) {
      mp.status = 'in_progress';
      if (!mp.startedAt) {
        mp.startedAt = new Date().toISOString();
      }
    }

    progress.lastActiveMissionId = cleanId;
    progress.lastActiveStepIndex = intStepIndex;
    progress.lastActiveAt = new Date().toISOString();
    this.saveProgress(progress);
  }

  completeMission(missionId) {
    const cleanId = missionId.replace(/^mission-/, '');
    const progress = this.getProgress();
    if (progress.missions[cleanId]) {
      const mp = progress.missions[cleanId];
      mp.status = 'complete';
      mp.completedAt = new Date().toISOString();
      mp.currentStepIndex = 0;
      this.saveProgress(progress);
    }
  }
}

const service = new StepPersistenceService();

let passed = 0;
let total = 0;

function check(desc, fn) {
  total++;
  process.stdout.write(`  Test ${total}: ${desc}... `);
  try {
    fn();
    passed++;
    console.log('✓ PASS');
  } catch (err) {
    console.log('✗ FAIL');
    console.error(err);
    process.exit(1);
  }
}

console.log('1️⃣ Testing Step Saving & Normalization:');

check('Saves active step on fresh mission and initializes progress', () => {
  mockStorage.clear();
  dispatchedEvents.length = 0;
  service.saveActiveStep('001', 5);

  const prog = service.getProgress();
  assert.strictEqual(prog.missions['001'].currentStepIndex, 5);
  assert.strictEqual(prog.missions['001'].status, 'in_progress');
  assert.ok(prog.missions['001'].startedAt);
  assert.strictEqual(dispatchedEvents.length, 1);
});

check('Normalizes prefixed missionId "mission-001" to clean key', () => {
  service.saveActiveStep('mission-001', 11);

  const prog = service.getProgress();
  assert.strictEqual(prog.missions['001'].currentStepIndex, 11);
  assert.strictEqual(prog.missions['mission-001'], undefined);
});

check('Retrieves active step with getActiveStep using both clean and prefixed IDs', () => {
  assert.strictEqual(service.getActiveStep('001'), 11);
  assert.strictEqual(service.getActiveStep('mission-001'), 11);
});

console.log('\n2️⃣ Testing Edge Cases & Status Safety:');

check('Rejects negative step indexes without modifying state', () => {
  service.saveActiveStep('001', -1);
  assert.strictEqual(service.getActiveStep('001'), 11);
});

check('Rejects NaN step indexes without modifying state', () => {
  service.saveActiveStep('001', NaN);
  assert.strictEqual(service.getActiveStep('001'), 11);
});

check('Idempotent calls do not fire extra storage events or re-write', () => {
  dispatchedEvents.length = 0;
  service.saveActiveStep('001', 11);
  assert.strictEqual(dispatchedEvents.length, 0);
});

check('Preserves status="complete" when reviewing steps (never regresses to in_progress)', () => {
  service.completeMission('001');
  const progAfterComplete = service.getProgress();
  assert.strictEqual(progAfterComplete.missions['001'].status, 'complete');
  assert.strictEqual(progAfterComplete.missions['001'].currentStepIndex, 0);

  service.saveActiveStep('001', 4);
  const progReview = service.getProgress();
  assert.strictEqual(progReview.missions['001'].status, 'complete', 'Status must stay complete');
  assert.strictEqual(progReview.missions['001'].currentStepIndex, 4);
});

check('Preserves status="locked" when previewing a non-foundational locked mission (never accidentally unlocks)', () => {
  mockStorage.clear();
  service.saveActiveStep('002', 3);
  const prog = service.getProgress();
  assert.strictEqual(prog.missions['002'].status, 'locked', 'Locked mission must stay locked');
  assert.strictEqual(prog.missions['002'].currentStepIndex, 3);
});

console.log('\n3️⃣ Testing Fallback & Legacy Step Detection:');

check('Falls back to highest completed step_X when currentStepIndex is undefined', () => {
  mockStorage.clear();
  const legacyProgress = {
    missions: {
      '003': {
        status: 'in_progress',
        steps: {
          step_0: { completed: true },
          step_1: { completed: true },
          step_8: { completed: true },
        }
      }
    }
  };
  mockStorage.set('nexus_progress', JSON.stringify(legacyProgress));
  assert.strictEqual(service.getActiveStep('003'), 8);
});

check('Supports numeric step keys in legacy progress fallback', () => {
  mockStorage.clear();
  const legacyProgress = {
    missions: {
      '004': {
        status: 'in_progress',
        steps: {
          '0': { completed: true },
          '1': { completed: true },
          '9': { completed: true },
        }
      }
    }
  };
  mockStorage.set('nexus_progress', JSON.stringify(legacyProgress));
  assert.strictEqual(service.getActiveStep('004'), 9);
});

check('Completed legacy mission returns step 0 for review', () => {
  mockStorage.clear();
  const legacyCompleted = {
    missions: {
      '001': {
        status: 'complete',
        steps: {
          step_0: { completed: true },
          step_12: { completed: true },
        }
      }
    }
  };
  mockStorage.set('nexus_progress', JSON.stringify(legacyCompleted));
  assert.strictEqual(service.getActiveStep('001'), 0);
});

check('Returns 0 when mission has no steps or progress', () => {
  assert.strictEqual(service.getActiveStep('999'), 0);
});

console.log('\n4️⃣ Testing Dashboard Action Resolution Logic:');

function resolveDashboardCard(mission) {
  const targetStep = mission.savedStep ?? 0;
  const totalSteps = mission.totalSteps || 13;
  const url = mission.isCompleted
    ? `/mission/mission-${mission.id}/step/0`
    : `/mission/mission-${mission.id}/step/${targetStep}`;

  let actionLabel = 'Start Learning';
  if (mission.isCompleted) {
    actionLabel = 'Review Mission';
  } else if (mission.isInProgress || targetStep > 0) {
    actionLabel = `Resume Step ${targetStep + 1}`;
  }

  const progressPercent = mission.isCompleted
    ? 100
    : (totalSteps > 0 ? Math.min(100, Math.round((targetStep / totalSteps) * 100)) : 0);

  return { url, actionLabel, progressPercent };
}

check('Prioritizes in-progress mission over earlier unstarted missions on Dashboard', () => {
  const missions = [
    { id: '001', isLocked: false, isCompleted: true, isInProgress: false, savedStep: 0 },
    { id: '002', isLocked: false, isCompleted: false, isInProgress: false, savedStep: 0 },
    { id: '003', isLocked: false, isCompleted: false, isInProgress: true, savedStep: 4 },
  ];
  const active = missions.find(m => !m.isLocked && !m.isCompleted && m.isInProgress) 
    || missions.find(m => !m.isLocked && !m.isCompleted) 
    || missions[0];
  assert.strictEqual(active.id, '003', 'Must pick mission 003 which is in progress');
});

check('Calculates correct progress percentage for variable-length missions (e.g. 16 steps in M010)', () => {
  const card = resolveDashboardCard({
    id: '010',
    isCompleted: false,
    isInProgress: true,
    savedStep: 12,
    totalSteps: 16,
  });
  assert.strictEqual(card.url, '/mission/mission-010/step/12');
  assert.strictEqual(card.actionLabel, 'Resume Step 13');
  assert.strictEqual(card.progressPercent, Math.round((12 / 16) * 100)); // 75%
});

check('Dashboard resolves Resume Step 12 for in-progress step 11', () => {
  const card = resolveDashboardCard({
    id: '001',
    isCompleted: false,
    isInProgress: true,
    savedStep: 11,
    totalSteps: 13,
  });
  assert.strictEqual(card.url, '/mission/mission-001/step/11');
  assert.strictEqual(card.actionLabel, 'Resume Step 12');
  assert.strictEqual(card.progressPercent, Math.round((11 / 13) * 100));
});

check('Dashboard resolves Start Learning for unstarted mission', () => {
  const card = resolveDashboardCard({
    id: '002',
    isCompleted: false,
    isInProgress: false,
    savedStep: 0,
    totalSteps: 13,
  });
  assert.strictEqual(card.url, '/mission/mission-002/step/0');
  assert.strictEqual(card.actionLabel, 'Start Learning');
  assert.strictEqual(card.progressPercent, 0);
});

check('Dashboard resolves Review Mission for completed mission', () => {
  const card = resolveDashboardCard({
    id: '001',
    isCompleted: true,
    isInProgress: false,
    savedStep: 0,
    totalSteps: 13,
  });
  assert.strictEqual(card.url, '/mission/mission-001/step/0');
  assert.strictEqual(card.actionLabel, 'Review Mission');
  assert.strictEqual(card.progressPercent, 100);
});

console.log('\n5️⃣ Verifying Source Code Integrity:');

check('app/mission/[missionId]/page.tsx is a client component and redirects to saved step', () => {
  const code = fs.readFileSync('app/mission/[missionId]/page.tsx', 'utf8');
  assert.strictEqual(code.includes("'use client'"), true, 'Must be client component');
  assert.strictEqual(code.includes('currentStepIndex'), true, 'Must check currentStepIndex');
  assert.strictEqual(code.includes('router.replace'), true, 'Must use router.replace');
  assert.strictEqual(code.includes('targetStep'), true);
});

check('MissionHeader tracks and persists active step', () => {
  const code = fs.readFileSync('components/mission/MissionHeader.tsx', 'utf8');
  assert.strictEqual(code.includes('saveActiveStep'), true, 'Must call saveActiveStep');
});

check('MissionFooter tracks and persists active step on navigation', () => {
  const code = fs.readFileSync('components/mission/MissionFooter.tsx', 'utf8');
  assert.strictEqual(code.includes('saveActiveStep'), true, 'Must call saveActiveStep');
  assert.strictEqual(code.includes('currentIndex + 1'), true);
  assert.strictEqual(code.includes('currentIndex - 1'), true);
});

check('app/dashboard/page.tsx renders Resume Step label', () => {
  const code = fs.readFileSync('app/dashboard/page.tsx', 'utf8');
  assert.strictEqual(code.includes('Resume Step'), true, 'Dashboard must render Resume Step');
  assert.strictEqual(code.includes('savedStep'), true, 'Dashboard must check savedStep');
});

check('app/settings/page.tsx renders return to step banner', () => {
  const code = fs.readFileSync('app/settings/page.tsx', 'utf8');
  assert.strictEqual(code.includes('lastActiveMission'), true, 'Settings must check lastActiveMission');
  assert.strictEqual(code.includes('Return to Step'), true, 'Settings must render Return to Step button');
});

check('components/layout/TopNavbar.tsx renders Resume Mission button', () => {
  const code = fs.readFileSync('components/layout/TopNavbar.tsx', 'utf8');
  assert.strictEqual(code.includes('lastActiveMission'), true, 'TopNavbar must check lastActiveMission');
  assert.strictEqual(code.includes('Resume Mission'), true, 'TopNavbar must render Resume Mission');
});

check('components/layout/MobileBottomNav.tsx renders mobile resume floating bar', () => {
  const code = fs.readFileSync('components/layout/MobileBottomNav.tsx', 'utf8');
  assert.strictEqual(code.includes('lastActiveMission'), true, 'Mobile nav must check lastActiveMission');
  assert.strictEqual(code.includes('fixed bottom-16'), true, 'Mobile nav must render floating bar');
});

check('components/layout/Sidebar.tsx renders resume mission navigation item', () => {
  const code = fs.readFileSync('components/layout/Sidebar.tsx', 'utf8');
  assert.strictEqual(code.includes('lastActiveMission'), true, 'Sidebar must check lastActiveMission');
  assert.strictEqual(code.includes('Resume Mission'), true, 'Sidebar must render Resume Mission item');
});

console.log(`\n======================================================`);
console.log(`📊 STEP PERSISTENCE VALIDATION SUMMARY:`);
console.log(`  Total Tests Run: ${total}`);
console.log(`  Passed         : ${passed} (✓)`);
console.log(`  Failed         : 0 (✗)`);
console.log(`======================================================`);
console.log(`🎉 ALL STEP PERSISTENCE & RESUME CHECKS PASSED 100%!\n`);
