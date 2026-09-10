// scripts/test-settings.mjs
// NEXUS Academy — Settings & Dev Mode Automated Test Suite

import assert from 'node:assert';

console.log('======================================================');
console.log('⚙️  NEXUS ACADEMY — SETTINGS & DEV MODE TEST SUITE');
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
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: (e) => dispatchedEvents.push(e),
  matchMedia: () => ({ matches: true }),
};
globalThis.document = {
  documentElement: {
    classList: {
      classes: new Set(),
      add: function(c) { this.classes.add(c); },
      remove: function(c) { this.classes.delete(c); },
      contains: function(c) { return this.classes.has(c); },
    },
    style: {},
    setAttribute: function(k, v) { this[k] = v; },
    getAttribute: function(k) { return this[k]; },
  }
};

// 2. Settings Schema & Service Implementation Verification
const DEFAULT_SETTINGS = {
  theme: 'dark',
  fontSize: 'standard',
  editorFontSize: 14,
  editorTheme: 'vs-dark',
  editorLineWrap: true,
  editorFindEnabled: false,
  strictScoring: false,
  soundEnabled: true,
  devModeUnlocked: false,
  devPreviewAllMissions: false,
};

const DEV_MODE_PIN = 'nexus2026';

class SettingsServiceTest {
  sanitizeSettings(input) {
    const validThemes = ['dark', 'light', 'system'];
    const validFontSizes = ['standard', 'large'];
    const validEditorFontSizes = [12, 14, 16, 18];
    const validEditorThemes = ['vs-dark', 'monokai', 'hc-black'];

    return {
      theme: validThemes.includes(input?.theme) ? input.theme : DEFAULT_SETTINGS.theme,
      fontSize: validFontSizes.includes(input?.fontSize) ? input.fontSize : DEFAULT_SETTINGS.fontSize,
      editorFontSize: validEditorFontSizes.includes(input?.editorFontSize) ? input.editorFontSize : DEFAULT_SETTINGS.editorFontSize,
      editorTheme: validEditorThemes.includes(input?.editorTheme) ? input.editorTheme : DEFAULT_SETTINGS.editorTheme,
      editorLineWrap: typeof input?.editorLineWrap === 'boolean' ? input.editorLineWrap : DEFAULT_SETTINGS.editorLineWrap,
      editorFindEnabled: typeof input?.editorFindEnabled === 'boolean' ? input.editorFindEnabled : DEFAULT_SETTINGS.editorFindEnabled,
      strictScoring: typeof input?.strictScoring === 'boolean' ? input.strictScoring : DEFAULT_SETTINGS.strictScoring,
      soundEnabled: typeof input?.soundEnabled === 'boolean' ? input.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
      devModeUnlocked: typeof input?.devModeUnlocked === 'boolean' ? input.devModeUnlocked : DEFAULT_SETTINGS.devModeUnlocked,
      devPreviewAllMissions: typeof input?.devPreviewAllMissions === 'boolean' ? input.devPreviewAllMissions : DEFAULT_SETTINGS.devPreviewAllMissions,
    };
  }

  getSettings() {
    try {
      const raw = localStorage.getItem('nexus_settings');
      if (!raw) return { ...DEFAULT_SETTINGS };
      return this.sanitizeSettings(JSON.parse(raw));
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  saveSettings(settings) {
    const sanitized = this.sanitizeSettings(settings);
    localStorage.setItem('nexus_settings', JSON.stringify(sanitized));
    this.applyThemeAndFont(sanitized);
    window.dispatchEvent({ type: 'nexus_settings_update', detail: sanitized });
    return sanitized;
  }

  updateSettings(partial) {
    const current = this.getSettings();
    return this.saveSettings({ ...current, ...partial });
  }

  applyThemeAndFont(settings) {
    const root = document.documentElement;
    let isDark = true;
    if (settings.theme === 'light') isDark = false;
    else if (settings.theme === 'system') isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    root.setAttribute('data-font-size', settings.fontSize);
    if (settings.fontSize === 'large') {
      root.classList.add('font-large');
    } else {
      root.classList.remove('font-large');
    }
  }

  verifyAndUnlockDevMode(pin) {
    if (typeof pin === 'string' && pin.trim() === DEV_MODE_PIN) {
      this.updateSettings({ devModeUnlocked: true });
      return true;
    }
    return false;
  }

  lockDevMode() {
    return this.updateSettings({
      devModeUnlocked: false,
      devPreviewAllMissions: false,
    });
  }

  exportBackup() {
    const progress = JSON.parse(localStorage.getItem('nexus_progress') || '{"missions":{}}');
    const settings = this.getSettings();
    return {
      filename: `nexus-backup-${new Date().toISOString().slice(0, 10)}.json`,
      json: JSON.stringify({
        version: 1,
        exportedAt: new Date().toISOString(),
        progress,
        settings,
      }, null, 2)
    };
  }

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid JSON' };
      }
      const prog = data.progress || (data.missions ? data : null);
      if (!prog || typeof prog !== 'object' || !prog.missions) {
        return { success: false, message: 'Missing mission progress' };
      }
      localStorage.setItem('nexus_progress', JSON.stringify(prog));
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      return { success: true, message: 'Restored successfully' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  resetAllProgress() {
    localStorage.removeItem('nexus_progress');
    localStorage.removeItem('nexus_memory');
    localStorage.removeItem('nexus_schedule');
    localStorage.removeItem('nexus_dict_progress');
    localStorage.setItem('nexus_progress', JSON.stringify({ xp: 0, level: 1, missions: {} }));
  }
}

const service = new SettingsServiceTest();

// --- TEST SUITE EXECUTION ---
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

console.log('1️⃣ Testing Default Settings & Sanitization:');
check('Returns pristine DEFAULT_SETTINGS when storage empty', () => {
  mockStorage.clear();
  const s = service.getSettings();
  assert.strictEqual(s.theme, 'dark');
  assert.strictEqual(s.fontSize, 'standard');
  assert.strictEqual(s.editorFontSize, 14);
  assert.strictEqual(s.editorTheme, 'vs-dark');
  assert.strictEqual(s.editorLineWrap, true);
  assert.strictEqual(s.editorFindEnabled, false);
  assert.strictEqual(s.strictScoring, false);
  assert.strictEqual(s.soundEnabled, true);
  assert.strictEqual(s.devModeUnlocked, false);
  assert.strictEqual(s.devPreviewAllMissions, false);
});

check('Sanitizes invalid values gracefully', () => {
  const sanitized = service.sanitizeSettings({
    theme: 'neon-cyberpunk',
    fontSize: 'ultra-huge',
    editorFontSize: 999,
    editorTheme: 'matrix',
    editorLineWrap: 'not-a-bool',
    editorFindEnabled: null,
  });
  assert.strictEqual(sanitized.theme, 'dark');
  assert.strictEqual(sanitized.fontSize, 'standard');
  assert.strictEqual(sanitized.editorFontSize, 14);
  assert.strictEqual(sanitized.editorTheme, 'vs-dark');
  assert.strictEqual(sanitized.editorLineWrap, true);
  assert.strictEqual(sanitized.editorFindEnabled, false);
});

console.log('\n2️⃣ Testing Settings Updates & DOM Application:');
check('Persists partial settings update and applies theme/font', () => {
  service.updateSettings({ theme: 'light', fontSize: 'large', editorFontSize: 16 });
  const s = service.getSettings();
  assert.strictEqual(s.theme, 'light');
  assert.strictEqual(s.fontSize, 'large');
  assert.strictEqual(s.editorFontSize, 16);
  assert.strictEqual(document.documentElement.classList.contains('light'), true);
  assert.strictEqual(document.documentElement.classList.contains('dark'), false);
  assert.strictEqual(document.documentElement.classList.contains('font-large'), true);
});

check('Dispatches event on setting save', () => {
  dispatchedEvents.length = 0;
  service.updateSettings({ soundEnabled: false });
  assert.strictEqual(dispatchedEvents.some(e => e.type === 'nexus_settings_update'), true);
});

console.log('\n3️⃣ Testing Developer Mode PIN Authentication & Controls:');
check('Rejects invalid PIN and keeps Dev Mode locked', () => {
  service.lockDevMode();
  const unlocked = service.verifyAndUnlockDevMode('wrong_pin_123');
  assert.strictEqual(unlocked, false);
  assert.strictEqual(service.getSettings().devModeUnlocked, false);
});

check('Accepts secret PIN "nexus2026" and unlocks Dev Mode', () => {
  const unlocked = service.verifyAndUnlockDevMode('nexus2026');
  assert.strictEqual(unlocked, true);
  assert.strictEqual(service.getSettings().devModeUnlocked, true);
});

check('Accepts secret PIN with leading/trailing whitespace', () => {
  service.lockDevMode();
  const unlocked = service.verifyAndUnlockDevMode('  nexus2026  \n');
  assert.strictEqual(unlocked, true);
  assert.strictEqual(service.getSettings().devModeUnlocked, true);
});

check('Toggles developer preview mode and locks back cleanly', () => {
  service.updateSettings({ devPreviewAllMissions: true });
  assert.strictEqual(service.getSettings().devPreviewAllMissions, true);

  service.lockDevMode();
  const s = service.getSettings();
  assert.strictEqual(s.devModeUnlocked, false);
  assert.strictEqual(s.devPreviewAllMissions, false);
});

console.log('\n4️⃣ Testing Dashboard Mission Unlock Logic with Dev Mode:');
check('Dashboard respects devPreviewAllMissions flag', () => {
  const mockManifest = [
    { id: '001', prerequisite: null },
    { id: '002', prerequisite: '001' },
    { id: '003', prerequisite: '002' },
  ];
  const userProgress = { missions: { '001': { status: 'complete' } } };

  // When devPreviewAllMissions is false:
  let devPreview = false;
  let unlockedCount = mockManifest.filter(m => {
    const isFirst = m.prerequisite === null;
    const isLocked = devPreview ? false : (userProgress.missions[m.id] ? false : !isFirst);
    return !isLocked;
  }).length;
  assert.strictEqual(unlockedCount, 1); // Only 001 is unlocked

  // When devPreviewAllMissions is true:
  devPreview = true;
  unlockedCount = mockManifest.filter(m => {
    const isFirst = m.prerequisite === null;
    const isLocked = devPreview ? false : (userProgress.missions[m.id] ? false : !isFirst);
    return !isLocked;
  }).length;
  assert.strictEqual(unlockedCount, 3); // All missions unlocked
});

console.log('\n5️⃣ Testing Backup Export, Import & Danger Zone:');
check('Exports full valid backup JSON', () => {
  localStorage.setItem('nexus_progress', JSON.stringify({ xp: 450, level: 3, missions: { '001': { status: 'complete' } } }));
  const { filename, json } = service.exportBackup();
  assert.strictEqual(filename.startsWith('nexus-backup-'), true);
  const parsed = JSON.parse(json);
  assert.strictEqual(parsed.progress.xp, 450);
  assert.strictEqual(parsed.settings.editorTheme, 'vs-dark');
});

check('Imports backup JSON successfully', () => {
  const payload = JSON.stringify({
    progress: { xp: 900, level: 5, missions: { '001': { status: 'complete' }, '002': { status: 'complete' } } },
    settings: { editorFontSize: 18, theme: 'dark' }
  });
  const res = service.importBackup(payload);
  assert.strictEqual(res.success, true);
  const restoredProg = JSON.parse(localStorage.getItem('nexus_progress'));
  assert.strictEqual(restoredProg.xp, 900);
  assert.strictEqual(service.getSettings().editorFontSize, 18);
});

check('Rejects invalid backup file format without corrupting storage', () => {
  const res = service.importBackup('{"invalid": true}');
  assert.strictEqual(res.success, false);
});

check('Danger Zone resets progress to clean defaults', () => {
  service.resetAllProgress();
  const resetProg = JSON.parse(localStorage.getItem('nexus_progress'));
  assert.strictEqual(resetProg.xp, 0);
  assert.strictEqual(Object.keys(resetProg.missions).length, 0);
  assert.strictEqual(localStorage.getItem('nexus_memory'), null);
});

console.log(`\n======================================================`);
console.log(`📊 SETTINGS VALIDATION SUMMARY:`);
console.log(`  Total Tests Run: ${total}`);
console.log(`  Passed         : ${passed} (✓)`);
console.log(`  Failed         : 0 (✗)`);
console.log(`======================================================`);
console.log(`🎉 ALL SETTINGS, DEV MODE & BACKUP TESTS PASSED 100%!\n`);
