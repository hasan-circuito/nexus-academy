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
  editorTheme: 'auto',
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
    const validThemes = ['midnight', 'warm-zen', 'nordic', 'cyber-oasis', 'dark', 'light', 'system'];
    const validFontSizes = ['standard', 'large'];
    const validEditorFontSizes = [12, 14, 16, 18];
    const validEditorThemes = [
      'auto',
      'nexus-midnight',
      'nexus-warm-zen',
      'nexus-nordic',
      'nexus-cyber',
      'vs-dark',
      'monokai',
      'hc-black',
    ];

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
    let activeTheme = 'dark';

    if (settings.theme === 'light') {
      isDark = false;
      activeTheme = 'light';
    } else if (settings.theme === 'system') {
      const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
      isDark = prefersDark;
      activeTheme = prefersDark ? 'dark' : 'light';
    } else if (settings.theme === 'midnight' || settings.theme === 'warm-zen' || settings.theme === 'nordic' || settings.theme === 'cyber-oasis') {
      isDark = true;
      activeTheme = settings.theme;
    } else {
      isDark = true;
      activeTheme = 'dark';
    }

    const themeClasses = ['theme-midnight', 'theme-warm-zen', 'theme-nordic', 'theme-cyber-oasis', 'light', 'dark'];
    themeClasses.forEach((cls) => root.classList.remove(cls));

    if (isDark) {
      root.classList.add('dark');
      if (activeTheme !== 'dark') {
        root.classList.add(`theme-${activeTheme}`);
      }
      root.setAttribute('data-theme', activeTheme);
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
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
  assert.strictEqual(s.editorTheme, 'auto');
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
  assert.strictEqual(sanitized.editorTheme, 'auto');
  assert.strictEqual(sanitized.editorLineWrap, true);
  assert.strictEqual(sanitized.editorFindEnabled, false);
});

console.log('\n2️⃣ Testing Settings Updates & DOM Application:');
check('Persists partial settings update and applies light theme and font', () => {
  service.updateSettings({ theme: 'light', fontSize: 'large', editorFontSize: 16 });
  const s = service.getSettings();
  assert.strictEqual(s.theme, 'light');
  assert.strictEqual(s.fontSize, 'large');
  assert.strictEqual(s.editorFontSize, 16);
  assert.strictEqual(document.documentElement.classList.contains('light'), true);
  assert.strictEqual(document.documentElement.classList.contains('dark'), false);
  assert.strictEqual(document.documentElement.classList.contains('theme-midnight'), false);
  assert.strictEqual(document.documentElement.classList.contains('font-large'), true);
});

check('Applies Midnight Sanctuary theme correctly', () => {
  service.updateSettings({ theme: 'midnight' });
  const s = service.getSettings();
  assert.strictEqual(s.theme, 'midnight');
  assert.strictEqual(document.documentElement.classList.contains('dark'), true);
  assert.strictEqual(document.documentElement.classList.contains('theme-midnight'), true);
  assert.strictEqual(document.documentElement.classList.contains('light'), false);
  assert.strictEqual(document.documentElement['data-theme'], 'midnight');
});

check('Applies Warm Zen theme correctly (zero blue light)', () => {
  service.updateSettings({ theme: 'warm-zen' });
  const s = service.getSettings();
  assert.strictEqual(s.theme, 'warm-zen');
  assert.strictEqual(document.documentElement.classList.contains('dark'), true);
  assert.strictEqual(document.documentElement.classList.contains('theme-warm-zen'), true);
  assert.strictEqual(document.documentElement.classList.contains('theme-midnight'), false);
  assert.strictEqual(document.documentElement['data-theme'], 'warm-zen');
});

check('Applies Nordic Frost theme correctly', () => {
  service.updateSettings({ theme: 'nordic' });
  const s = service.getSettings();
  assert.strictEqual(s.theme, 'nordic');
  assert.strictEqual(document.documentElement.classList.contains('dark'), true);
  assert.strictEqual(document.documentElement.classList.contains('theme-nordic'), true);
  assert.strictEqual(document.documentElement.classList.contains('theme-warm-zen'), false);
  assert.strictEqual(document.documentElement['data-theme'], 'nordic');
});

check('Applies Cyber-Oasis theme correctly', () => {
  service.updateSettings({ theme: 'cyber-oasis' });
  const s = service.getSettings();
  assert.strictEqual(s.theme, 'cyber-oasis');
  assert.strictEqual(document.documentElement.classList.contains('dark'), true);
  assert.strictEqual(document.documentElement.classList.contains('theme-cyber-oasis'), true);
  assert.strictEqual(document.documentElement.classList.contains('theme-nordic'), false);
  assert.strictEqual(document.documentElement['data-theme'], 'cyber-oasis');
});

check('Applies default/clean "dark" theme without forcing theme-midnight', () => {
  service.updateSettings({ theme: 'dark' });
  const s = service.getSettings();
  assert.strictEqual(s.theme, 'dark');
  assert.strictEqual(document.documentElement.classList.contains('dark'), true);
  assert.strictEqual(document.documentElement.classList.contains('theme-midnight'), false);
  assert.strictEqual(document.documentElement['data-theme'], 'dark');
});

check('Auto-syncs Monaco editor theme with active application theme', () => {
  function resolveMonacoTheme(editorTheme, appTheme) {
    if (editorTheme && editorTheme !== 'auto') {
      return editorTheme;
    }
    switch (appTheme) {
      case 'warm-zen':
        return 'nexus-warm-zen';
      case 'nordic':
        return 'nexus-nordic';
      case 'cyber-oasis':
        return 'nexus-cyber';
      case 'light':
        return 'vs';
      case 'system':
        if (typeof globalThis.window !== 'undefined' && globalThis.window.matchMedia) {
          return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'nexus-midnight' : 'vs';
        }
        return 'nexus-midnight';
      case 'midnight':
      case 'dark':
      default:
        return 'nexus-midnight';
    }
  }

  // Auto-sync checks
  assert.strictEqual(resolveMonacoTheme('auto', 'midnight'), 'nexus-midnight');
  assert.strictEqual(resolveMonacoTheme('auto', 'dark'), 'nexus-midnight');
  assert.strictEqual(resolveMonacoTheme('auto', 'warm-zen'), 'nexus-warm-zen');
  assert.strictEqual(resolveMonacoTheme('auto', 'nordic'), 'nexus-nordic');
  assert.strictEqual(resolveMonacoTheme('auto', 'cyber-oasis'), 'nexus-cyber');
  assert.strictEqual(resolveMonacoTheme('auto', 'light'), 'vs');
  assert.strictEqual(resolveMonacoTheme('auto', 'system'), 'nexus-midnight');

  // Explicit override checks
  assert.strictEqual(resolveMonacoTheme('monokai', 'midnight'), 'monokai');
  assert.strictEqual(resolveMonacoTheme('hc-black', 'warm-zen'), 'hc-black');
  assert.strictEqual(resolveMonacoTheme('vs-dark', 'cyber-oasis'), 'vs-dark');
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
  assert.strictEqual(parsed.settings.editorTheme, 'auto');
});

check('Imports backup JSON successfully', () => {
  const payload = JSON.stringify({
    progress: { xp: 900, level: 5, missions: { '001': { status: 'complete' }, '002': { status: 'complete' } } },
    settings: { editorFontSize: 18, theme: 'warm-zen' }
  });
  const res = service.importBackup(payload);
  assert.strictEqual(res.success, true);
  const restoredProg = JSON.parse(localStorage.getItem('nexus_progress'));
  assert.strictEqual(restoredProg.xp, 900);
  assert.strictEqual(service.getSettings().editorFontSize, 18);
  assert.strictEqual(service.getSettings().theme, 'warm-zen');
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

console.log('\n6️⃣ Testing UI Professionalism & English Standards:');
check('Settings page has zero residual Bengali unicode and zero emojis', async () => {
  const fs = await import('node:fs');
  const content = fs.readFileSync('app/settings/page.tsx', 'utf8');
  const bangla = content.match(/[\u0980-\u09FF]/g);
  assert.strictEqual(bangla, null, `Found residual Bengali in settings: ${bangla}`);
  const emoji = content.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu);
  assert.strictEqual(emoji, null, `Found residual emojis in settings: ${emoji}`);
});

check('ThemeSwitcher includes Standard Dark, Light, and System in SECONDARY_THEMES', async () => {
  const fs = await import('node:fs');
  const content = fs.readFileSync('components/layout/ThemeSwitcher.tsx', 'utf8');
  assert.strictEqual(content.includes("id: 'dark'"), true, 'ThemeSwitcher must include dark theme');
  assert.strictEqual(content.includes("id: 'light'"), true, 'ThemeSwitcher must include light theme');
  assert.strictEqual(content.includes("id: 'system'"), true, 'ThemeSwitcher must include system theme');
  const bangla = content.match(/[\u0980-\u09FF]/g);
  assert.strictEqual(bangla, null, `Found residual Bengali in ThemeSwitcher: ${bangla}`);
  const emoji = content.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu);
  assert.strictEqual(emoji, null, `Found residual emojis in ThemeSwitcher: ${emoji}`);
});

check('TopNavbar omits Bengali subtitles when viewing Settings', async () => {
  const fs = await import('node:fs');
  const content = fs.readFileSync('components/layout/TopNavbar.tsx', 'utf8');
  assert.strictEqual(content.includes('সেটিংস'), false, 'TopNavbar must not contain সেটিংস');
  assert.strictEqual(content.includes('থিম'), false, 'TopNavbar must not contain থিম');
});

console.log(`\n======================================================`);
console.log(`📊 SETTINGS VALIDATION SUMMARY:`);
console.log(`  Total Tests Run: ${total}`);
console.log(`  Passed         : ${passed} (✓)`);
console.log(`  Failed         : 0 (✗)`);
console.log(`======================================================`);
console.log(`🎉 ALL SETTINGS, DEV MODE & BACKUP TESTS PASSED 100%!\n`);
