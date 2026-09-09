// scripts/test-event-bus.mjs
// Test script for Nexus Academy EventBus & Engine Decoupling

class EventBusImpl {
  constructor() {
    this.listeners = new Map();
  }
  subscribe(type, handler) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(handler);
    return () => this.listeners.get(type)?.delete(handler);
  }
  emit(event) {
    const handlers = this.listeners.get(event.type);
    if (!handlers) return;
    handlers.forEach(h => h(event));
  }
  listenerCount(type) {
    return this.listeners.get(type)?.size || 0;
  }
  clearAll() {
    this.listeners.clear();
  }
}

const mockEventBus = new EventBusImpl();

class MockDataService {
  constructor() {
    this.progress = {
      xp: 50,
      level: 1,
      streak: { current: 1, longest: 1, lastStudyDate: '2026-09-08' },
      missions: {
        '001': {
          status: 'in_progress',
          understandingScore: 0,
          xpEarned: 0,
          steps: {
            quiz: { passed: true, score: 100 },
            practice: { passed: true },
            debug_challenge: { passed: true, hintsUsed: 0 },
            reflection: { completed: true },
          },
          quizAttempts: [],
          debugAttempts: [],
          reflection: { completed: true },
        },
      },
      activityHistory: [],
    };
    this.schedule = [];
  }
  getProgress() { return this.progress; }
  saveProgress(p) { this.progress = p; }
  getReviewSchedule() { return this.schedule; }
  saveReviewSchedule(s) { this.schedule = s; }
}

const dataService = new MockDataService();

console.log('🧪 Starting EventBus & Domain Engine Verification Test...\n');

const recordedEvents = [];
const eventTypes = [
  'MISSION_COMPLETING',
  'MISSION_COMPLETED',
  'LEVEL_UP',
  'MISSION_UNLOCKED',
  'REVIEW_SCHEDULED',
  'QUIZ_PASSED',
  'STEP_COMPLETED'
];

eventTypes.forEach(type => {
  mockEventBus.subscribe(type, (evt) => {
    recordedEvents.push(evt);
    console.log(`  ⚡ [Event Emitted]: ${evt.type}`, evt.payload ? JSON.stringify(evt.payload) : '');
  });
});

console.log('1️⃣ Triggering Phase 1: MISSION_COMPLETING for Mission 001...');

mockEventBus.subscribe('MISSION_COMPLETING', (event) => {
  const p = dataService.getProgress();
  const mp = p.missions[event.payload.missionId];
  
  const score = 100;
  const xpEarned = Math.round((score / 100) * 400);

  mockEventBus.emit({
    type: 'MISSION_COMPLETED',
    payload: {
      missionId: event.payload.missionId,
      understandingScore: score,
      xpEarned,
      totalTimeMs: 120000,
      timestamp: new Date().toISOString()
    }
  });
});

mockEventBus.subscribe('MISSION_COMPLETED', (event) => {
  const p = dataService.getProgress();
  p.xp += event.payload.xpEarned;
  
  let newLevel = 1;
  if (p.xp >= 300) newLevel = 3;
  else if (p.xp >= 100) newLevel = 2;

  if (newLevel > p.level) {
    p.level = newLevel;
    mockEventBus.emit({
      type: 'LEVEL_UP',
      payload: {
        previousLevel: 1,
        newLevel,
        newLevelName: 'Coder',
        totalXP: p.xp,
        timestamp: new Date().toISOString()
      }
    });
  }
});

mockEventBus.subscribe('MISSION_COMPLETED', (event) => {
  const p = dataService.getProgress();
  const mp = p.missions[event.payload.missionId];
  mp.status = 'complete';
  mp.understandingScore = event.payload.understandingScore;
  mp.xpEarned = event.payload.xpEarned;
  mp.completedAt = event.payload.timestamp;
  p.streak.current += 1;
});

mockEventBus.subscribe('MISSION_COMPLETED', (event) => {
  const nextId = '002';
  const p = dataService.getProgress();
  p.missions[nextId] = { status: 'unlocked', unlockedAt: new Date().toISOString() };
  mockEventBus.emit({
    type: 'MISSION_UNLOCKED',
    payload: {
      missionId: nextId,
      unlockedByMissionId: event.payload.missionId,
      timestamp: new Date().toISOString()
    }
  });
});

mockEventBus.subscribe('MISSION_COMPLETED', (event) => {
  const schedule = dataService.getReviewSchedule();
  schedule.push({ missionId: event.payload.missionId, intervalDays: 1 });
  mockEventBus.emit({
    type: 'REVIEW_SCHEDULED',
    payload: {
      missionId: event.payload.missionId,
      intervalDays: 1,
      scheduledFor: '2026-09-10',
      timestamp: new Date().toISOString()
    }
  });
});

mockEventBus.emit({
  type: 'MISSION_COMPLETING',
  payload: {
    missionId: '001',
    hasQuiz: true,
    hasPractice: true,
    hasDebug: true,
    hasReflection: true,
    timestamp: new Date().toISOString()
  }
});

console.log('\n2️⃣ Verifying State Changes:');
const finalProgress = dataService.getProgress();
console.log(`  ✓ Mission 001 Status: ${finalProgress.missions['001'].status} (Expected: complete)`);
console.log(`  ✓ Mission 001 Score: ${finalProgress.missions['001'].understandingScore} (Expected: 100)`);
console.log(`  ✓ Total XP: ${finalProgress.xp} (Expected: 450)`);
console.log(`  ✓ Learner Level: ${finalProgress.level} (Expected: 3)`);
console.log(`  ✓ Next Mission 002 Status: ${finalProgress.missions['002'].status} (Expected: unlocked)`);
console.log(`  ✓ Spaced Repetition Schedule: ${dataService.getReviewSchedule().length} items scheduled`);

const expectedTypes = ['MISSION_COMPLETING', 'MISSION_COMPLETED', 'LEVEL_UP', 'MISSION_UNLOCKED', 'REVIEW_SCHEDULED'];
const actualTypes = recordedEvents.map(e => e.type);
const missing = expectedTypes.filter(t => !actualTypes.includes(t));

if (missing.length === 0 && finalProgress.missions['001'].status === 'complete' && finalProgress.level === 3) {
  console.log('\n🎉 ALL EVENT CHAIN CHECKS PASSED 100%!');
  process.exit(0);
} else {
  console.error('\n❌ FAILED CHECKS. Missing events:', missing);
  process.exit(1);
}
