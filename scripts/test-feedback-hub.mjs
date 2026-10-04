// scripts/test-feedback-hub.mjs
// NEXUS Academy — Feedback & Telemetry Hub Automated Test Suite
// Transpiles and executes the REAL FeedbackService.ts and app/api/feedback/route.ts modules,
// verifying Zero-AI-Emoji Constraint, Seed Telemetry, Server Runtime Store, GitHub Cloud Sync,
// Rate-Limit/Token Fallbacks, LocalStorage Quota Resilience, Deep Cloud Merge & Variable Step Counts.

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

console.log('======================================================');
console.log('[TELEMETRY_TEST] NEXUS ACADEMY — FEEDBACK HUB SUITE');
console.log('======================================================\n');

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    failed++;
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
  }
}

const ROOT = process.cwd();

// 1. ZERO AI EMOJI CONSTRAINT VERIFICATION
const FILES_TO_CHECK = [
  'types/feedback.types.ts',
  'data/feedback/initial-feedback.json',
  'services/FeedbackService.ts',
  'app/api/feedback/route.ts',
  'components/feedback/FeedbackHubV2.tsx',
  'app/feedback/page.tsx',
  'app/feedback-v2/page.tsx',
  'components/mission/MissionFooter.tsx',
];

const FORBIDDEN_EMOJI_REGEX =
  /[\u{1F300}-\u{1FAFF}\u{2702}-\u{27B0}]|💡|🐛|💬|🚀|🔨|✅|📌|👍|✨|📣|👋|🔥/u;

const seedPath = path.join(ROOT, 'data/feedback/initial-feedback.json');
const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

// Mock LocalStorage and Window for runtime simulation
const mockStorage = new Map();
let simulateQuotaExceeded = false;

globalThis.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => {
    if (simulateQuotaExceeded) {
      const err = new Error('QuotaExceededError: DOM Exception 22');
      err.name = 'QuotaExceededError';
      throw err;
    }
    mockStorage.set(k, String(v));
  },
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear(),
};

const dispatchedEvents = [];
globalThis.window = {
  dispatchEvent: (e) => dispatchedEvents.push(e),
  addEventListener: () => {},
  removeEventListener: () => {},
};

// Helper to transpile and load actual TypeScript modules in isolated VM/CommonJS context
function loadActualModules(customFetch) {
  const moduleCache = new Map();

  function requireModule(specifier) {
    if (moduleCache.has(specifier)) {
      return moduleCache.get(specifier);
    }

    if (specifier === 'next/server') {
      const nextServer = {
        NextRequest: class NextRequest {
          constructor(bodyObj) {
            this._body = bodyObj;
          }
          async json() {
            return this._body;
          }
        },
        NextResponse: {
          json(data, init = {}) {
            return {
              status: init.status || 200,
              ok: (init.status || 200) >= 200 && (init.status || 200) < 300,
              async json() {
                return JSON.parse(JSON.stringify(data));
              },
            };
          },
        },
      };
      moduleCache.set(specifier, nextServer);
      return nextServer;
    }

    if (specifier === '@/data/feedback/initial-feedback.json') {
      const clone = JSON.parse(JSON.stringify(seedData));
      moduleCache.set(specifier, clone);
      return clone;
    }

    if (specifier === '@/types/settings.types') {
      const mod = { DEV_MODE_PIN: 'nexus2026' };
      moduleCache.set(specifier, mod);
      return mod;
    }

    let filePath = '';
    if (specifier === '@/types/feedback.types') {
      filePath = path.join(ROOT, 'types/feedback.types.ts');
    } else if (specifier === '@/services/FeedbackService') {
      filePath = path.join(ROOT, 'services/FeedbackService.ts');
    } else if (specifier === '@/app/api/feedback/route') {
      filePath = path.join(ROOT, 'app/api/feedback/route.ts');
    } else {
      throw new Error(`Unexpected import in test loader: ${specifier}`);
    }

    const tsSource = fs.readFileSync(filePath, 'utf-8');
    const transpiled = ts.transpileModule(tsSource, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    });

    const mod = { exports: {} };
    moduleCache.set(specifier, mod.exports);

    const sandbox = {
      exports: mod.exports,
      module: mod,
      require: requireModule,
      process,
      console,
      Date,
      Math,
      Set,
      Map,
      Array,
      Object,
      JSON,
      String,
      Number,
      Boolean,
      RegExp,
      Error,
      Event: class Event {
        constructor(type) {
          this.type = type;
        }
      },
      window: globalThis.window,
      localStorage: globalThis.localStorage,
      fetch: customFetch || globalThis.fetch,
    };

    vm.runInNewContext(transpiled.outputText, sandbox, { filename: filePath });
    moduleCache.set(specifier, mod.exports);
    return mod.exports;
  }

  return {
    types: requireModule('@/types/feedback.types'),
    serviceMod: requireModule('@/services/FeedbackService'),
    routeMod: requireModule('@/app/api/feedback/route'),
    nextServer: requireModule('next/server'),
  };
}

async function main() {
  await runTest('Zero AI Emoji Constraint across all Feedback Hub files', () => {
    for (const relPath of FILES_TO_CHECK) {
      const fullPath = path.join(ROOT, relPath);
      assert.ok(fs.existsSync(fullPath), `Expected file to exist: ${relPath}`);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const match = content.match(FORBIDDEN_EMOJI_REGEX);
      assert.strictEqual(
        match,
        null,
        `Forbidden AI emoji "${match ? match[0] : ''}" found in ${relPath}`
      );
    }
  });

  await runTest('Seed dataset contains valid Creator Directives and Roadmap Poll', () => {
    assert.ok(Array.isArray(seedData.directives), 'directives must be an array');
    assert.ok(seedData.directives.length >= 2, 'at least 2 directives required');
    const pinnedDir = seedData.directives.find((d) => d.pinned);
    assert.ok(pinnedDir, 'must have a pinned Creator Directive');
    assert.strictEqual(pinnedDir.authorName, 'Hasan Mahmud');
    assert.ok(
      pinnedDir.poll && Array.isArray(pinnedDir.poll.options),
      'pinned directive must have a poll'
    );
    assert.strictEqual(pinnedDir.poll.options.length, 3, 'poll must have 3 options');
  });

  await runTest(
    'Seed dataset contains valid Feedback Items across all categories & statuses',
    () => {
      assert.ok(Array.isArray(seedData.items), 'items must be an array');
      assert.ok(seedData.items.length >= 5, 'at least 5 seed feedback items required');

      const categories = new Set(seedData.items.map((i) => i.category));
      assert.ok(categories.has('improve'), 'must include improve category');
      assert.ok(categories.has('problem'), 'must include problem category');
      assert.ok(categories.has('feedback'), 'must include feedback category');

      const statuses = new Set(seedData.items.map((i) => i.status));
      assert.ok(statuses.has('in_progress'), 'must include in_progress status');
      assert.ok(statuses.has('resolved'), 'must include resolved status');
      assert.ok(statuses.has('planned'), 'must include planned status');

      for (const item of seedData.items) {
        assert.ok(
          item.id && item.code && item.title && item.message,
          'item missing required fields'
        );
        assert.ok(Array.isArray(item.replies), 'item.replies must be an array');
        assert.ok(item.replies.length >= 1, `seed item ${item.id} should have creator reply`);
        assert.strictEqual(item.replies[0].badgeCode, 'FOUNDER // HASAN MAHMUD');
      }
    }
  );

  await runTest(
    'Real FeedbackService: submission, validation, default author fallback, and API bridge',
    async () => {
      mockStorage.clear();
      delete process.env.GITHUB_FEEDBACK_TOKEN;

      let bridgeCalls = 0;
      const mods = loadActualModules(async (url, opts) => {
        if (url === '/api/feedback') {
          bridgeCalls++;
          if (opts?.method === 'POST') {
            const req = new mods.nextServer.NextRequest(JSON.parse(opts.body));
            return mods.routeMod.POST(req);
          }
          return mods.routeMod.GET();
        }
        throw new Error(`Unexpected URL: ${url}`);
      });

      const { feedbackService } = mods.serviceMod;

      await assert.rejects(
        () =>
          feedbackService.submitFeedback({
            title: 'ab',
            message: 'valid message',
            category: 'improve',
            impact: 'standard',
          }),
        /৩ অক্ষরের/,
        'Must reject title < 3 chars'
      );

      await assert.rejects(
        () =>
          feedbackService.submitFeedback({
            title: 'Valid Title',
            message: '123',
            category: 'improve',
            impact: 'standard',
          }),
        /৫ অক্ষরের/,
        'Must reject message < 5 chars'
      );

      const created = await feedbackService.submitFeedback({
        category: 'problem',
        impact: 'blocker',
        authorName: '   ',
        title: 'মিশন ০০৭-এ দশমিক সংখ্যা ইনপুট সমস্যা',
        message: 'ফ্লোট কনভার্সন করার সময় একটি উদাহরণ যোগ করলে ভালো হয়।',
        telemetry: { missionId: '007', stepNumber: 5 },
      });

      assert.strictEqual(created.authorName, 'একজন শিক্ষার্থী (Learner)');
      assert.strictEqual(created.category, 'problem');
      assert.strictEqual(created.impact, 'blocker');
      assert.strictEqual(created.status, 'open');
      assert.strictEqual(created.telemetry.missionId, '007');
      assert.strictEqual(feedbackService.getItems().length, seedData.items.length + 1);
      assert.ok(
        feedbackService.getResonatedIds().includes(created.id),
        'Must auto-resonate newly submitted item'
      );
      assert.strictEqual(bridgeCalls, 1, 'Must call POST /api/feedback');

      // Verify server runtime store also persisted the created item on GET /api/feedback
      const getRes = await mods.routeMod.GET();
      const getPayload = await getRes.json();
      assert.ok(
        getPayload.items.some((i) => i.id === created.id),
        'GET /api/feedback must include item created via POST /api/feedback'
      );
    }
  );

  await runTest(
    'Real FeedbackService: Resonance (▲ সহমত) toggle increments and decrements accurately',
    () => {
      mockStorage.clear();
      const { serviceMod } = loadActualModules(async () => ({ ok: false }));
      const { feedbackService } = serviceMod;

      const target = feedbackService.getItems().find((i) => i.id === 'fb-101');
      const initialCount = target.resonances;

      const res1 = feedbackService.toggleResonance('fb-101');
      assert.strictEqual(res1.active, true);
      assert.strictEqual(
        res1.items.find((i) => i.id === 'fb-101').resonances,
        initialCount + 1
      );

      const res2 = feedbackService.toggleResonance('fb-101');
      assert.strictEqual(res2.active, false);
      assert.strictEqual(res2.items.find((i) => i.id === 'fb-101').resonances, initialCount);
    }
  );

  await runTest(
    'Real FeedbackService & API Route: Creator Reply and Status Switcher persist & sync',
    async () => {
      mockStorage.clear();
      delete process.env.GITHUB_FEEDBACK_TOKEN;

      const mods = loadActualModules(async (url, opts) => {
        if (url === '/api/feedback') {
          if (opts?.method === 'POST') {
            const req = new mods.nextServer.NextRequest(JSON.parse(opts.body));
            return mods.routeMod.POST(req);
          }
          return mods.routeMod.GET();
        }
        throw new Error(`Unexpected URL: ${url}`);
      });

      const { feedbackService } = mods.serviceMod;

      await assert.rejects(
        () => feedbackService.addCreatorReply({ feedbackId: 'fb-101', content: '   ' }),
        /খালি রাখা যাবে না/
      );

      const res = await feedbackService.addCreatorReply({
        feedbackId: 'fb-103',
        content: 'ধন্যবাদ! আমরা এটি নিয়ে কাজ করতেছি, আপডেট চলমান।',
        newStatus: 'in_progress',
      });

      const updatedItem = res.items.find((i) => i.id === 'fb-103');
      assert.strictEqual(updatedItem.status, 'in_progress');
      assert.strictEqual(
        updatedItem.replies[updatedItem.replies.length - 1].badgeCode,
        'FOUNDER // HASAN MAHMUD'
      );

      // Direct status update
      const afterStatusUpdate = await feedbackService.updateItemStatus('fb-103', 'resolved');
      assert.strictEqual(
        afterStatusUpdate.find((i) => i.id === 'fb-103').status,
        'resolved'
      );

      // Verify server runtime store reflects both reply and resolved status
      const getRes = await mods.routeMod.GET();
      const serverData = await getRes.json();
      const serverFb103 = serverData.items.find((i) => i.id === 'fb-103');
      assert.strictEqual(serverFb103.status, 'resolved');
      assert.ok(
        serverFb103.replies.some((r) => r.id === res.reply.id),
        'Server runtime store must retain creator reply'
      );
    }
  );

  await runTest(
    'Real FeedbackService: Roadmap Poll voting increments and switches votes cleanly',
    () => {
      mockStorage.clear();
      const { serviceMod } = loadActualModules(async () => ({ ok: false }));
      const { feedbackService } = serviceMod;

      const dir = feedbackService.getDirectives().find((d) => d.id === 'dir-001');
      const opt1Initial = dir.poll.options[0].votes;
      const opt2Initial = dir.poll.options[1].votes;

      // Vote for option 1
      const v1 = feedbackService.voteOnPoll('dir-001', 'poll-roadmap-q4', 'opt-missions-15-20');
      const dirAfter1 = v1.directives.find((d) => d.id === 'dir-001');
      assert.strictEqual(dirAfter1.poll.options[0].votes, opt1Initial + 1);

      // Clicking same option again is idempotent
      const v1Repeat = feedbackService.voteOnPoll(
        'dir-001',
        'poll-roadmap-q4',
        'opt-missions-15-20'
      );
      assert.strictEqual(
        v1Repeat.directives.find((d) => d.id === 'dir-001').poll.options[0].votes,
        opt1Initial + 1
      );

      // Switch vote to option 2 -> option 1 decrements, option 2 increments
      const v2 = feedbackService.voteOnPoll('dir-001', 'poll-roadmap-q4', 'opt-memory-tracer');
      const dirAfter2 = v2.directives.find((d) => d.id === 'dir-001');
      assert.strictEqual(dirAfter2.poll.options[0].votes, opt1Initial);
      assert.strictEqual(dirAfter2.poll.options[1].votes, opt2Initial + 1);
    }
  );

  await runTest(
    'Real FeedbackService: Creator Console PIN verification accepts 2441 and nexus2026',
    () => {
      mockStorage.clear();
      const { serviceMod } = loadActualModules(async () => ({ ok: false }));
      const { feedbackService } = serviceMod;

      assert.strictEqual(feedbackService.isCreatorUnlocked(false), false);
      assert.strictEqual(feedbackService.isCreatorUnlocked(true), true);
      assert.strictEqual(feedbackService.unlockCreatorConsole('0000'), false);
      assert.strictEqual(feedbackService.unlockCreatorConsole('2441'), true);
      assert.strictEqual(feedbackService.isCreatorUnlocked(false), true);
      feedbackService.lockCreatorConsole();
      assert.strictEqual(feedbackService.isCreatorUnlocked(false), false);
      assert.strictEqual(feedbackService.unlockCreatorConsole('nexus2026'), true);
      assert.strictEqual(feedbackService.isCreatorUnlocked(false), true);
    }
  );

  await runTest(
    'GitHub Cloud Sync: Issue creation, PR filtering, status PATCH, and rate-limit fallback',
    async () => {
      mockStorage.clear();
      process.env.GITHUB_FEEDBACK_TOKEN = 'ghp_validMockTokenForTesting123456';

      const githubCalls = [];
      let simulateRateLimit = false;

      const mods = loadActualModules(async (url, opts = {}) => {
        githubCalls.push({ url, method: opts.method || 'GET', body: opts.body });

        if (simulateRateLimit) {
          return {
            ok: false,
            status: 403,
            async json() {
              return { message: 'API rate limit exceeded' };
            },
          };
        }

        // POST new GitHub Issue
        if (url.endsWith('/issues') && opts.method === 'POST') {
          return {
            ok: true,
            status: 201,
            async json() {
              return {
                number: 404,
                html_url: 'https://github.com/hasan-circuito/nexus-academy/issues/404',
              };
            },
          };
        }

        // GET GitHub Issues (includes 1 real issue + 1 Pull Request that must be filtered out)
        if (url.includes('/issues?labels=nexus-feedback')) {
          return {
            ok: true,
            status: 200,
            async json() {
              return [
                {
                  number: 404,
                  title: '[PROBLEM] মিশন ০১০-এ ধাপ ১৬ লোড হচ্ছে না',
                  body: 'ধাপ ১৬-তে ক্লিক করলে সমস্যা হচ্ছে।\n\n<!-- NEXUS_TELEMETRY\nAUTHOR: রাফি আহমেদ\nCATEGORY: problem\nIMPACT: high_impact\nMISSION: 010\nMISSION_TITLE: Modern String Formatting\nSTEP: 16\nTHEME: midnight\nXP: 1200\nLEVEL: 5\n-->',
                  state: 'open',
                  labels: [{ name: 'nexus-feedback' }, { name: 'category:problem' }, { name: 'impact:high_impact' }],
                  created_at: '2026-10-04T06:00:00.000Z',
                  reactions: { '+1': 9 },
                  html_url: 'https://github.com/hasan-circuito/nexus-academy/issues/404',
                },
                {
                  number: 405,
                  title: 'PR that should be ignored',
                  pull_request: { url: 'https://api.github.com/repos/x/y/pulls/405' },
                  state: 'open',
                  labels: [{ name: 'nexus-feedback' }],
                },
              ];
            },
          };
        }

        // POST comment or PATCH issue state
        return {
          ok: true,
          status: 200,
          async json() {
            return { ok: true };
          },
        };
      });

      try {
        // 1. Create feedback -> should POST to GitHub Issues and return githubIssueNumber=404
        const createReq = new mods.nextServer.NextRequest({
          action: 'create_feedback',
          payload: {
            category: 'problem',
            impact: 'high_impact',
            authorName: 'রাফি আহমেদ',
            title: 'মিশন ০১০-এ ধাপ ১৬ লোড হচ্ছে না',
            message: 'ধাপ ১৬-তে ক্লিক করলে সমস্যা হচ্ছে।',
            telemetry: {
              missionId: '010',
              missionTitle: 'Modern String Formatting',
              stepNumber: 16,
              theme: 'midnight',
              learnerXp: 1200,
              learnerLevel: 5,
            },
          },
        });
        const createRes = await mods.routeMod.POST(createReq);
        const createData = await createRes.json();
        assert.strictEqual(createData.item.githubIssueNumber, 404);
        assert.strictEqual(createData.item.syncOrigin, 'github');

        // 2. GET issues -> should filter out PR #405 and parse full telemetry from Issue #404
        const getRes = await mods.routeMod.GET();
        const getData = await getRes.json();
        assert.strictEqual(getData.syncStatus.cloudConfigured, true);
        assert.strictEqual(getData.syncStatus.mode, 'GITHUB_CLOUD_SYNC');
        assert.ok(
          !getData.items.some((i) => i.githubIssueNumber === 405),
          'Must filter out GitHub Pull Requests from issues list'
        );
        const ghItem = getData.items.find((i) => i.githubIssueNumber === 404);
        assert.ok(ghItem, 'Must include GitHub Issue #404');
        assert.strictEqual(ghItem.telemetry.missionId, '010');
        assert.strictEqual(ghItem.telemetry.stepNumber, 16);
        assert.strictEqual(ghItem.telemetry.missionTitle, 'Modern String Formatting');
        assert.strictEqual(ghItem.telemetry.theme, 'midnight');
        assert.strictEqual(ghItem.telemetry.learnerXp, 1200);

        // 3. Creator Reply with newStatus='resolved' -> should POST comment AND PATCH issue state='closed'
        const replyReq = new mods.nextServer.NextRequest({
          action: 'creator_reply',
          payload: {
            feedbackId: ghItem.id,
            content: 'সমস্যাটি সমাধান করা হয়েছে!',
            newStatus: 'resolved',
            githubIssueNumber: 404,
          },
        });
        await mods.routeMod.POST(replyReq);
        assert.ok(
          githubCalls.some((c) => c.url.endsWith('/issues/404/comments') && c.method === 'POST'),
          'Must POST comment to GitHub Issue #404'
        );
        assert.ok(
          githubCalls.some(
            (c) =>
              c.url.endsWith('/issues/404') &&
              c.method === 'PATCH' &&
              c.body.includes('"state":"closed"')
          ),
          'Must PATCH GitHub Issue #404 state to closed when resolved'
        );

        // 4. Simulate GitHub API 403 Rate Limit -> should gracefully fall back to HYBRID_LOCAL_PERSISTENCE
        simulateRateLimit = true;
        const fallbackRes = await mods.routeMod.GET();
        const fallbackData = await fallbackRes.json();
        assert.strictEqual(fallbackData.syncStatus.mode, 'HYBRID_LOCAL_PERSISTENCE');
        assert.ok(fallbackData.items.length >= 5, 'Fallback must still return runtime/seed items');
      } finally {
        delete process.env.GITHUB_FEEDBACK_TOKEN;
      }
    }
  );

  await runTest(
    'LocalStorage QuotaExceededError resilience & deep syncWithCloud merge',
    async () => {
      mockStorage.clear();
      simulateQuotaExceeded = true;

      try {
        const mods = loadActualModules(async (url, opts) => {
          if (url === '/api/feedback' && (!opts || opts.method === 'GET')) {
            return {
              ok: true,
              status: 200,
              async json() {
                return {
                  directives: [
                    {
                      id: 'dir-remote-999',
                      code: 'DIR-2026.99',
                      authorName: 'Hasan Mahmud',
                      authorBadge: 'FOUNDER // LEARNER #0',
                      tag: '[DIRECTIVE // CLOUD_TEST]',
                      title: 'ক্লাউড নির্দেশনা',
                      content: 'রিমোট সার্ভার থেকে প্রাপ্ত নির্দেশনা।',
                      createdAt: new Date().toISOString(),
                      pinned: true,
                    },
                  ],
                  items: [
                    {
                      ...seedData.items[0],
                      status: 'resolved',
                      resonances: 99,
                      replies: [
                        ...seedData.items[0].replies,
                        {
                          id: 'rep-remote-999',
                          authorName: 'Hasan Mahmud',
                          authorRole: 'Founder & Learner #0',
                          badgeCode: 'FOUNDER // HASAN MAHMUD',
                          content: 'রিমোট ক্লাউড রিপ্লাই যুক্ত হয়েছে।',
                          createdAt: new Date().toISOString(),
                          statusUpdatedTo: 'resolved',
                        },
                      ],
                    },
                  ],
                  syncStatus: {
                    cloudConfigured: true,
                    repo: 'hasan-circuito/nexus-academy',
                    lastSyncedAt: new Date().toISOString(),
                    mode: 'GITHUB_CLOUD_SYNC',
                  },
                };
              },
            };
          }
          return { ok: true, status: 201, async json() { return {}; } };
        });

        const { feedbackService } = mods.serviceMod;

        // Even with QuotaExceededError on localStorage.setItem, in-memory fallback preserves submitted item
        const item = await feedbackService.submitFeedback({
          category: 'improve',
          impact: 'high_impact',
          title: 'কোটা ফুল থাকলেও ফিডব্যাক হারাবে না',
          message: 'মেমোরি ফলব্যাকের মাধ্যমে ডেটা সুরক্ষিত থাকে।',
        });
        assert.ok(
          feedbackService.getItems().some((i) => i.id === item.id),
          'In-memory fallback must retain submitted item when localStorage throws QuotaExceededError'
        );

        // syncWithCloud deep merges remote replies, status, resonances, and directives
        const synced = await feedbackService.syncWithCloud();
        const mergedFb101 = synced.items.find((i) => i.id === 'fb-101');
        assert.strictEqual(mergedFb101.status, 'resolved', 'Must adopt remote status update');
        assert.strictEqual(mergedFb101.resonances, 99, 'Must adopt higher remote resonances');
        assert.ok(
          mergedFb101.replies.some((r) => r.id === 'rep-remote-999'),
          'Must merge remote replies onto existing local item'
        );
        assert.ok(
          synced.directives.some((d) => d.id === 'dir-remote-999'),
          'Must merge remote directives into local directives'
        );
      } finally {
        simulateQuotaExceeded = false;
      }
    }
  );

  await runTest(
    'Navigation, contextual MissionFooter link, and dynamic step count in FeedbackHub.tsx',
    () => {
      const appConstants = fs.readFileSync(path.join(ROOT, 'constants/app.ts'), 'utf-8');
      assert.ok(appConstants.includes("FEEDBACK: '/feedback'"), 'ROUTES.FEEDBACK missing');
      assert.ok(appConstants.includes("FEEDBACK_V2: '/feedback-v2'"), 'ROUTES.FEEDBACK_V2 missing');
      assert.ok(
        appConstants.includes('ROUTES.FEEDBACK') && appConstants.includes('ROUTES.FEEDBACK_V2'),
        'NAV_ITEMS Feedback routes missing'
      );

      const sidebar = fs.readFileSync(path.join(ROOT, 'components/layout/Sidebar.tsx'), 'utf-8');
      assert.ok(
        sidebar.includes('MessageSquareCode'),
        'Sidebar must register MessageSquareCode icon'
      );

      const mobileNav = fs.readFileSync(
        path.join(ROOT, 'components/layout/MobileBottomNav.tsx'),
        'utf-8'
      );
      assert.ok(mobileNav.includes("href: '/feedback'"), 'MobileBottomNav must include /feedback');

      const topNav = fs.readFileSync(path.join(ROOT, 'components/layout/TopNavbar.tsx'), 'utf-8');
      assert.ok(
        topNav.includes("pathname.startsWith('/feedback')"),
        'TopNavbar must recognize /feedback route'
      );

      const missionFooter = fs.readFileSync(
        path.join(ROOT, 'components/mission/MissionFooter.tsx'),
        'utf-8'
      );
      assert.ok(
        missionFooter.includes('/feedback?mission=${missionData.id}&step=${currentIndex + 1}'),
        'MissionFooter must include contextual feedback link with mission and step params'
      );

      const feedbackHub = fs.readFileSync(
        path.join(ROOT, 'components/feedback/FeedbackHubV2.tsx'),
        'utf-8'
      );
      assert.ok(
        feedbackHub.includes('getMissionStepCount'),
        'FeedbackHubV2 must dynamically resolve mission step counts via getMissionStepCount'
      );
      assert.ok(
        feedbackHub.includes('exportTelemetrySnapshot'),
        'FeedbackHubV2 must preserve telemetry snapshot export'
      );
      assert.ok(
        !feedbackHub.includes('NODE 01 // LOCAL VAULT') &&
          !feedbackHub.includes('হাইব্রিড ডেটাবেস আর্কিটেকচার'),
        'FeedbackHubV2 must not publicly expose the internal hybrid database architecture breakdown'
      );
    }
  );

  console.log(`\n======================================================`);
  console.log(`Result: ${passed} passed, ${failed} failed`);
  console.log(`======================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

main();
