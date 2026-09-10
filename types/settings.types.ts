// types/settings.types.ts
// NEXUS Academy — Settings Schema and Types

export type ThemeMode = 'dark' | 'light' | 'system';
export type AppFontSize = 'standard' | 'large';
export type EditorFontSize = 12 | 14 | 16 | 18;
export type EditorTheme = 'vs-dark' | 'monokai' | 'hc-black';

export interface NexusSettings {
  theme: ThemeMode;
  fontSize: AppFontSize;
  editorFontSize: EditorFontSize;
  editorTheme: EditorTheme;
  editorLineWrap: boolean;
  editorFindEnabled: boolean;
  strictScoring: boolean;
  soundEnabled: boolean;
  devModeUnlocked: boolean;
  devPreviewAllMissions: boolean;
}

export const DEV_MODE_PIN = 'nexus2026';

export const DEFAULT_SETTINGS: NexusSettings = {
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
