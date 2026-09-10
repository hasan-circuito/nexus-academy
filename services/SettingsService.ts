// services/SettingsService.ts
// NEXUS Academy — Settings Persistence & Management Service

import {
  type NexusSettings,
  type ThemeMode,
  type AppFontSize,
  type EditorFontSize,
  type EditorTheme,
  DEFAULT_SETTINGS,
  DEV_MODE_PIN,
} from '../types/settings.types';
import { storage } from './LocalStorageDataService';
import { createDefaultProgress, createDefaultLearningMemory, type LearnerProgress } from '../types/progress.types';
import { createDefaultDictionaryProgress } from '../types/dictionary.types';

const SETTINGS_KEY = 'nexus_settings';

export class SettingsService {
  private mediaQueryListenerAttached = false;

  private handleMediaChange = (): void => {
    const s = this.getSettings();
    if (s.theme === 'system') {
      this.applyThemeAndFont(s);
    }
  };

  /**
   * Reads settings from localStorage with fallback to DEFAULT_SETTINGS.
   */
  public getSettings(): NexusSettings {
    if (typeof window === 'undefined') {
      return { ...DEFAULT_SETTINGS };
    }

    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return { ...DEFAULT_SETTINGS };

      const parsed = JSON.parse(raw);
      return this.sanitizeSettings(parsed);
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  /**
   * Sanitizes and validates settings object against expected schema.
   */
  public sanitizeSettings(input: Partial<NexusSettings>): NexusSettings {
    const validThemes: ThemeMode[] = [
      'midnight',
      'warm-zen',
      'nordic',
      'cyber-oasis',
      'dark',
      'light',
      'system',
    ];
    const validFontSizes: AppFontSize[] = ['standard', 'large'];
    const validEditorFontSizes: EditorFontSize[] = [12, 14, 16, 18];
    const validEditorThemes: EditorTheme[] = [
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
      theme: validThemes.includes(input?.theme as ThemeMode) ? (input.theme as ThemeMode) : DEFAULT_SETTINGS.theme,
      fontSize: validFontSizes.includes(input?.fontSize as AppFontSize) ? (input.fontSize as AppFontSize) : DEFAULT_SETTINGS.fontSize,
      editorFontSize: validEditorFontSizes.includes(input?.editorFontSize as EditorFontSize) ? (input.editorFontSize as EditorFontSize) : DEFAULT_SETTINGS.editorFontSize,
      editorTheme: validEditorThemes.includes(input?.editorTheme as EditorTheme) ? (input.editorTheme as EditorTheme) : DEFAULT_SETTINGS.editorTheme,
      editorLineWrap: typeof input?.editorLineWrap === 'boolean' ? input.editorLineWrap : DEFAULT_SETTINGS.editorLineWrap,
      editorFindEnabled: typeof input?.editorFindEnabled === 'boolean' ? input.editorFindEnabled : DEFAULT_SETTINGS.editorFindEnabled,
      strictScoring: typeof input?.strictScoring === 'boolean' ? input.strictScoring : DEFAULT_SETTINGS.strictScoring,
      soundEnabled: typeof input?.soundEnabled === 'boolean' ? input.soundEnabled : DEFAULT_SETTINGS.soundEnabled,
      devModeUnlocked: typeof input?.devModeUnlocked === 'boolean' ? input.devModeUnlocked : DEFAULT_SETTINGS.devModeUnlocked,
      devPreviewAllMissions: typeof input?.devPreviewAllMissions === 'boolean' ? input.devPreviewAllMissions : DEFAULT_SETTINGS.devPreviewAllMissions,
    };
  }

  /**
   * Saves settings to localStorage and notifies listeners.
   */
  public saveSettings(settings: NexusSettings): void {
    if (typeof window === 'undefined') return;

    try {
      const sanitized = this.sanitizeSettings(settings);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitized));
      this.applyThemeAndFont(sanitized);

      window.dispatchEvent(new Event('nexus_storage_update'));
      window.dispatchEvent(new CustomEvent('nexus_settings_update', { detail: sanitized }));
    } catch (err) {
      console.error('[SettingsService] Failed to save settings:', err);
    }
  }

  /**
   * Merges partial settings into existing settings.
   */
  public updateSettings(partial: Partial<NexusSettings>): NexusSettings {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    this.saveSettings(updated);
    return updated;
  }

  /**
   * Resets settings back to default.
   */
  public resetSettings(): NexusSettings {
    const defaults = { ...DEFAULT_SETTINGS };
    this.saveSettings(defaults);
    return defaults;
  }

  /**
   * Applies the theme and font size classes/attributes to document root.
   */
  public applyThemeAndFont(settings?: NexusSettings): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const s = settings || this.getSettings();
    const root = document.documentElement;

    // Attach system theme change listener if not already attached
    if (!this.mediaQueryListenerAttached && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', this.handleMediaChange);
        } else if ((mediaQuery as any).addListener) {
          (mediaQuery as any).addListener(this.handleMediaChange);
        }
        this.mediaQueryListenerAttached = true;
      } catch {
        // Safe fallback in test or restricted environments
      }
    }

    // 1. Theme determination & application
    let isDark = true;
    let activeTheme = 'midnight';

    if (s.theme === 'light') {
      isDark = false;
    } else if (s.theme === 'system') {
      const prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
      isDark = prefersDark;
      activeTheme = prefersDark ? 'midnight' : 'light';
    } else if (s.theme === 'dark' || s.theme === 'midnight') {
      isDark = true;
      activeTheme = 'midnight';
    } else if (s.theme === 'warm-zen' || s.theme === 'nordic' || s.theme === 'cyber-oasis') {
      isDark = true;
      activeTheme = s.theme;
    }

    const themeClasses = ['theme-midnight', 'theme-warm-zen', 'theme-nordic', 'theme-cyber-oasis', 'light', 'dark'];
    themeClasses.forEach((cls) => root.classList.remove(cls));

    if (isDark) {
      root.classList.add('dark', `theme-${activeTheme}`);
      if (root.setAttribute) root.setAttribute('data-theme', activeTheme);
      if (root.style) root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      if (root.setAttribute) root.setAttribute('data-theme', 'light');
      if (root.style) root.style.colorScheme = 'light';
    }

    // 2. Font size application
    if (root.setAttribute) {
      root.setAttribute('data-font-size', s.fontSize);
    }
    if (s.fontSize === 'large') {
      root.classList.add('font-large');
    } else {
      root.classList.remove('font-large');
    }
  }

  /**
   * Verifies PIN and unlocks developer mode.
   */
  public verifyAndUnlockDevMode(pin: string): boolean {
    if (typeof pin === 'string' && pin.trim() === DEV_MODE_PIN) {
      this.updateSettings({ devModeUnlocked: true });
      return true;
    }
    return false;
  }

  /**
   * Locks developer mode and disables preview of all missions.
   */
  public lockDevMode(): NexusSettings {
    return this.updateSettings({
      devModeUnlocked: false,
      devPreviewAllMissions: false,
    });
  }

  /**
   * Exports full backup JSON including progress and settings.
   */
  public exportBackup(): { filename: string; json: string } {
    const progress = storage.getProgress();
    const settings = this.getSettings();
    const memory = storage.getMemory();
    const schedule = storage.getReviewSchedule();
    const dictProgress = storage.getDictionaryProgress();

    const backupData = {
      _app: 'NEXUS Academy',
      version: 1,
      exportedAt: new Date().toISOString(),
      progress,
      settings,
      memory,
      schedule,
      dictProgress,
    };

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `nexus-backup-${dateStr}.json`;
    return {
      filename,
      json: JSON.stringify(backupData, null, 2),
    };
  }

  /**
   * Imports and validates backup JSON, restoring state with deep schema verification.
   */
  public importBackup(jsonString: string): { success: boolean; message: string } {
    if (typeof window === 'undefined') {
      return { success: false, message: 'Window is not available' };
    }

    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return { success: false, message: 'Invalid JSON backup: Root must be an object' };
      }

      // Check if file is direct progress object or full backup wrapper
      const progressCandidate = data.progress || (data.missions ? data : null);
      if (!progressCandidate || typeof progressCandidate !== 'object' || Array.isArray(progressCandidate)) {
        return { success: false, message: 'Missing valid learner mission progress in backup file' };
      }

      if (!progressCandidate.missions || typeof progressCandidate.missions !== 'object' || Array.isArray(progressCandidate.missions)) {
        return { success: false, message: 'Invalid mission progress structure in backup file' };
      }

      // Sanitize and validate progress candidate against LearnerProgress schema
      const defaultProgress = createDefaultProgress();
      const sanitizedProgress: LearnerProgress = {
        _schemaVersion: 1,
        createdAt: typeof progressCandidate.createdAt === 'string' ? progressCandidate.createdAt : defaultProgress.createdAt,
        lastActiveAt: new Date().toISOString(),
        xp: typeof progressCandidate.xp === 'number' && !isNaN(progressCandidate.xp) && progressCandidate.xp >= 0 ? progressCandidate.xp : defaultProgress.xp,
        level: typeof progressCandidate.level === 'number' && !isNaN(progressCandidate.level) && progressCandidate.level >= 1 ? progressCandidate.level : defaultProgress.level,
        streak: {
          current: typeof progressCandidate.streak?.current === 'number' ? progressCandidate.streak.current : defaultProgress.streak.current,
          longest: typeof progressCandidate.streak?.longest === 'number' ? progressCandidate.streak.longest : defaultProgress.streak.longest,
          lastStudyDate: typeof progressCandidate.streak?.lastStudyDate === 'string' ? progressCandidate.streak.lastStudyDate : defaultProgress.streak.lastStudyDate,
        },
        unlockedAchievements: Array.isArray(progressCandidate.unlockedAchievements) ? progressCandidate.unlockedAchievements : defaultProgress.unlockedAchievements,
        missions: {},
        totalStudyTimeMs: typeof progressCandidate.totalStudyTimeMs === 'number' ? progressCandidate.totalStudyTimeMs : defaultProgress.totalStudyTimeMs,
        sessionCount: typeof progressCandidate.sessionCount === 'number' ? progressCandidate.sessionCount : defaultProgress.sessionCount,
        recentSessions: Array.isArray(progressCandidate.recentSessions) ? progressCandidate.recentSessions : defaultProgress.recentSessions,
        activityHistory: Array.isArray(progressCandidate.activityHistory) ? progressCandidate.activityHistory : defaultProgress.activityHistory,
      };

      // Sanitize each mission entry
      for (const [mId, mData] of Object.entries(progressCandidate.missions)) {
        if (mData && typeof mData === 'object' && !Array.isArray(mData)) {
          const m = mData as any;
          const validStatuses = ['locked', 'unlocked', 'in_progress', 'complete'];
          sanitizedProgress.missions[mId] = {
            status: validStatuses.includes(m.status) ? m.status : 'locked',
            understandingScore: typeof m.understandingScore === 'number' ? m.understandingScore : 0,
            xpEarned: typeof m.xpEarned === 'number' ? m.xpEarned : 0,
            completedAt: m.completedAt,
            steps: (m.steps && typeof m.steps === 'object' && !Array.isArray(m.steps)) ? m.steps : {},
            quizAttempts: Array.isArray(m.quizAttempts) ? m.quizAttempts : [],
            debugAttempts: Array.isArray(m.debugAttempts) ? m.debugAttempts : [],
            reflection: (m.reflection && typeof m.reflection === 'object') ? m.reflection : { completed: false },
          };
        }
      }

      // Restore sanitized progress
      storage.saveProgress(sanitizedProgress);

      // Restore settings if present
      if (data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings)) {
        const sanitized = this.sanitizeSettings(data.settings);
        this.saveSettings(sanitized);
      }

      // Restore memory if present
      if (data.memory && typeof data.memory === 'object' && !Array.isArray(data.memory)) {
        storage.saveMemory(data.memory);
      }

      // Restore schedule if present
      if (Array.isArray(data.schedule)) {
        storage.saveReviewSchedule(data.schedule);
      }

      // Restore dictionary progress if present
      if (data.dictProgress && typeof data.dictProgress === 'object' && !Array.isArray(data.dictProgress)) {
        storage.saveDictionaryProgress(data.dictProgress);
      }

      // Dispatch refresh events
      window.dispatchEvent(new Event('nexus_storage_update'));

      return { success: true, message: 'Progress & Settings successfully restored!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to parse JSON backup' };
    }
  }

  /**
   * Danger zone: wipes all user learning data and resets back to defaults.
   */
  public resetAllProgress(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem('nexus_progress');
      localStorage.removeItem('nexus_memory');
      localStorage.removeItem('nexus_schedule');
      localStorage.removeItem('nexus_dict_progress');
      localStorage.removeItem('nexus_session');

      // Wipe all user practice code keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nexus_practiceCode_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // Initialize defaults
      storage.saveProgress(createDefaultProgress());
      storage.saveMemory(createDefaultLearningMemory());
      storage.saveReviewSchedule([]);
      storage.saveDictionaryProgress(createDefaultDictionaryProgress());

      window.dispatchEvent(new Event('nexus_storage_update'));
    } catch (e) {
      console.error('[SettingsService] Failed to reset progress:', e);
    }
  }
}

export const settingsService = new SettingsService();
