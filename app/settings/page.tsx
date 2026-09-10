'use client';

import React, { useState, useRef } from 'react';
import {
  Moon,
  Sun,
  Monitor,
  Type,
  BrainCircuit,
  RotateCcw,
  AlertTriangle,
  Download,
  Upload,
  Lock,
  Unlock,
  KeyRound,
  Check,
  X,
  Volume2,
  VolumeX,
  Code2,
  ShieldAlert,
  FileJson,
  Sparkles,
  Search,
  WrapText,
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import {
  type ThemeMode,
  type AppFontSize,
  type EditorFontSize,
  type EditorTheme,
} from '@/types/settings.types';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    resetSettings,
    verifyAndUnlockDevMode,
    lockDevMode,
    exportBackup,
    importBackup,
    resetAllProgress,
    isClient,
  } = useSettings();

  // Toast feedback state
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'info',
  });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3500);
  };

  // Modals state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleThemeChange = (theme: ThemeMode) => {
    updateSettings({ theme });
    showToast(`Theme updated to ${theme.toUpperCase()}`);
  };

  const handleFontSizeChange = (fontSize: AppFontSize) => {
    updateSettings({ fontSize });
    showToast(`UI Font size set to ${fontSize === 'large' ? 'Large (বড়)' : 'Standard (সাধারণ)'}`);
  };

  const handleEditorFontSizeChange = (size: EditorFontSize) => {
    updateSettings({ editorFontSize: size });
    showToast(`Editor font size set to ${size}px`);
  };

  const handleEditorThemeChange = (editorTheme: EditorTheme) => {
    updateSettings({ editorTheme });
    showToast(`Editor theme changed to ${editorTheme}`);
  };

  const handleToggleLineWrap = () => {
    const next = !settings.editorLineWrap;
    updateSettings({ editorLineWrap: next });
    showToast(next ? 'Editor line wrap enabled' : 'Editor line wrap disabled');
  };

  const handleToggleFind = () => {
    const next = !settings.editorFindEnabled;
    updateSettings({ editorFindEnabled: next });
    showToast(next ? 'Editor Find (Ctrl+F) enabled' : 'Editor Find (Ctrl+F) disabled');
  };

  const handleToggleStrictScoring = () => {
    const next = !settings.strictScoring;
    updateSettings({ strictScoring: next });
    showToast(next ? 'Strict scoring enabled (কঠোর মূল্যায়ন সক্রিয়)' : 'Strict scoring disabled');
  };

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    updateSettings({ soundEnabled: next });
    showToast(next ? 'Sound effects enabled (শব্দ সক্রিয়)' : 'Sound effects muted (শব্দ নিঃশব্দ)');
  };

  const handleToggleDevPreview = () => {
    const next = !settings.devPreviewAllMissions;
    updateSettings({ devPreviewAllMissions: next });
    showToast(next ? 'Dev Preview Mode: All missions 001–010 unlocked!' : 'Dev Preview Mode disabled');
  };

  // Developer PIN submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAndUnlockDevMode(pinInput);
    if (success) {
      setIsPinModalOpen(false);
      setPinInput('');
      setPinError('');
      showToast('Developer Mode unlocked! (ডেভেলপার মোড আনলক হয়েছে)', 'success');
    } else {
      setPinError('Incorrect PIN. Please check the secret code.');
    }
  };

  const handleLockDevMode = () => {
    lockDevMode();
    showToast('Developer Mode locked.', 'info');
  };

  // Backup Export
  const handleExportBackup = () => {
    try {
      const { filename, json } = exportBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Backup downloaded successfully! (ব্যাকআপ ডাউনলোড সম্পন্ন)', 'success');
    } catch {
      showToast('Failed to export backup.', 'error');
    }
  };

  // Backup Import
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = importBackup(text);
        if (result.success) {
          showToast(result.message, 'success');
        } else {
          showToast(result.message, 'error');
        }
      } catch {
        showToast('Error reading backup file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Reset Progress
  const handleConfirmReset = () => {
    resetAllProgress();
    setIsResetModalOpen(false);
    showToast('All progress reset to default. (সকল অগ্রগতি মুছে ফেলা হয়েছে)', 'info');
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 pb-24">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all animate-in slide-in-from-bottom-5 duration-300 bg-card border-border text-foreground">
          {toast.type === 'success' && <Check className="w-5 h-5 text-success shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />}
          {toast.type === 'info' && <Sparkles className="w-5 h-5 text-primary shrink-0" />}
          <span className="text-sm font-medium font-bangla-ui">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground font-bangla-ui flex items-center gap-3">
            Settings <span className="text-lg font-normal text-muted-foreground font-bangla">(সেটিংস)</span>
          </h1>
          <button
            onClick={() => {
              resetSettings();
              showToast('All settings reset to default', 'info');
            }}
            className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors"
          >
            Reset Defaults
          </button>
        </div>
        <p className="text-muted-foreground text-sm font-bangla">
          Manage your app preferences, editor, and learning environment. (আপনার পছন্দ ও শিক্ষার পরিবেশ কাস্টমাইজ করুন)
        </p>
      </section>

      <div className="space-y-6">
        {/* 1. Theme Settings — Aesthetic & Eye-Friendly Themes */}
        <section className="p-6 rounded-xl border border-border bg-card space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 font-bangla-ui">
                <Sparkles className="w-5 h-5 text-primary" /> Appearance Hub (চেহারা ও নান্দনিক থিম)
              </h2>
              <p className="text-xs text-muted-foreground mt-1 font-bangla">
                Choose an eye-friendly, distraction-free appearance designed for the peace of the learner.
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
              4 Peaceful Aesthetics
            </span>
          </div>

          {/* 4 Rich Theme Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'midnight' as ThemeMode,
                name: 'Midnight Sanctuary',
                banglaName: 'মিডনাইট স্যাঙ্কচুয়ারি',
                icon: '🌙',
                badge: 'Eye-Friendly',
                description: 'Deep Charcoal Slate (#0b0f19) with soft Emerald & Cyan glow. Zero glare, pure peaceful focus.',
                swatches: ['#0b0f19', '#34d399', '#22d3ee', '#151e30'],
                previewBg: '#0b0f19',
                accentColor: '#34d399',
                activeRing: 'ring-emerald-400/50 border-emerald-400',
              },
              {
                id: 'warm-zen' as ThemeMode,
                name: 'Warm Zen',
                banglaName: 'ওয়ার্ম জেন',
                icon: '🍵',
                badge: 'Zero Blue Light',
                description: 'Deep Warm Sepia (#181512) with glowing Amber & Bone White. Physical library book warmth.',
                swatches: ['#181512', '#f59e0b', '#f5efe6', '#2a2520'],
                previewBg: '#181512',
                accentColor: '#f59e0b',
                activeRing: 'ring-amber-400/50 border-amber-400',
              },
              {
                id: 'nordic' as ThemeMode,
                name: 'Nordic Frost',
                banglaName: 'নর্ডিক ফ্রস্ট',
                icon: '❄️',
                badge: 'Clean Pastel',
                description: 'Velvety Polar Navy (#0f141c) with pastel Lavender, Sapphire & Mint. Scandinavian tranquility.',
                swatches: ['#0f141c', '#c084fc', '#6ee7b7', '#1f2a3c'],
                previewBg: '#0f141c',
                accentColor: '#c084fc',
                activeRing: 'ring-purple-400/50 border-purple-400',
              },
              {
                id: 'cyber-oasis' as ThemeMode,
                name: 'Cyber-Oasis',
                banglaName: 'সাইবার ওয়েসিস',
                icon: '⚡',
                badge: 'Futuristic Glass',
                description: 'Deep Obsidian (#06080d) with frosted glassmorphism and subtle Neon Cyan ambient glow.',
                swatches: ['#06080d', '#00f0ff', '#818cf8', 'rgba(34,211,238,0.2)'],
                previewBg: '#06080d',
                accentColor: '#00f0ff',
                activeRing: 'ring-cyan-400/50 border-cyan-400',
              },
            ].map((theme) => {
              const isSelected =
                isClient &&
                (settings.theme === theme.id ||
                  (settings.theme === 'dark' && theme.id === 'midnight'));

              return (
                <button
                  key={theme.id}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`group flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? `bg-surface-elevated shadow-lg ring-2 ${theme.activeRing}`
                      : 'border-border bg-surface hover:bg-surface-hover hover:border-border-hover'
                  }`}
                >
                  {/* Top Header */}
                  <div className="w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{theme.icon}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-foreground-muted">
                        {theme.badge}
                      </span>
                    </div>

                    {/* Miniature UI Card Preview */}
                    <div
                      className="w-full h-16 rounded-lg p-2 border border-white/10 flex flex-col justify-between shadow-inner"
                      style={{ backgroundColor: theme.previewBg }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 rounded-full bg-white/20" />
                          <span className="w-2 h-2 rounded-full bg-white/20" />
                          <span className="w-2 h-2 rounded-full bg-white/20" />
                        </div>
                        <span
                          className="w-8 h-2 rounded-full opacity-80"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-12 h-3.5 rounded text-[8px] font-bold flex items-center justify-center text-black"
                          style={{ backgroundColor: theme.accentColor }}
                        >
                          Run
                        </div>
                        <div className="h-2 w-16 bg-white/15 rounded" />
                      </div>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground tracking-tight">
                        {theme.name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-bangla mt-0.5">
                        {theme.banglaName}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {theme.description}
                    </p>
                  </div>

                  {/* Footer with Swatches and Active Indicator */}
                  <div className="w-full pt-4 mt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center -space-x-1.5">
                      {theme.swatches.map((color, i) => (
                        <span
                          key={i}
                          className="inline-block w-4 h-4 rounded-full border border-black/40 shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {isSelected ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                        Select
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Secondary Options: Light Mode & System Auto */}
          <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              Standard Environment Modes:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto" role="radiogroup" aria-label="Standard Environment Modes">
              <button
                role="radio"
                aria-checked={isClient && settings.theme === 'light'}
                onClick={() => handleThemeChange('light')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  isClient && settings.theme === 'light'
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/40 font-semibold'
                    : 'border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Mode (দিনের আলো)</span>
              </button>

              <button
                role="radio"
                aria-checked={isClient && settings.theme === 'system'}
                onClick={() => handleThemeChange('system')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  isClient && settings.theme === 'system'
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/40 font-semibold'
                    : 'border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>System Auto (সিস্টেম অনুযায়ী)</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Typography Settings */}
        <section className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 font-bangla-ui">
            <Type className="w-5 h-5 text-primary" /> Typography & Reading (টাইপোগ্রাফি ও ফন্ট সাইজ)
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface">
            <div>
              <h3 className="font-medium text-foreground text-sm font-bangla-ui">
                UI & Bangla Font Size (বাংলা ও ইউআই টেক্সট আকার)
              </h3>
              <p className="text-xs text-muted-foreground font-bangla mt-0.5">
                Adjust text size for reading comfort across missions and explanations.
              </p>
            </div>
            <div className="flex bg-surface-elevated rounded-lg p-1 border border-border shrink-0">
              <button
                onClick={() => handleFontSizeChange('standard')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isClient && settings.fontSize === 'standard'
                    ? 'bg-card shadow-sm border border-border text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Standard (সাধারণ)
              </button>
              <button
                onClick={() => handleFontSizeChange('large')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isClient && settings.fontSize === 'large'
                    ? 'bg-card shadow-sm border border-border text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Large (বড়)
              </button>
            </div>
          </div>
        </section>

        {/* 3. Python Editor Preferences */}
        <section className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 font-bangla-ui">
              <Code2 className="w-5 h-5 text-primary" /> Python Editor (কোড এডিটর পছন্দসমূহ)
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-bangla">
              Customize your coding workspace and Monaco editor settings.
            </p>
          </div>

          <div className="space-y-3">
            {/* Editor Font Size */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface">
              <div>
                <h3 className="font-medium text-foreground text-sm font-bangla-ui">
                  Editor Font Size (এডিটরে কোডের ফন্ট সাইজ)
                </h3>
                <p className="text-xs text-muted-foreground font-bangla mt-0.5">
                  Choose the font size used in Python coding environments.
                </p>
              </div>
              <div className="flex bg-surface-elevated rounded-lg p-1 border border-border gap-1 shrink-0">
                {([12, 14, 16, 18] as EditorFontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleEditorFontSizeChange(size)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                      isClient && settings.editorFontSize === size
                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* Editor Theme */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface">
              <div>
                <h3 className="font-medium text-foreground text-sm font-bangla-ui">
                  Editor Theme (কোড এডিটর থিম)
                </h3>
                <p className="text-xs text-muted-foreground font-bangla mt-0.5">
                  Syntax highlighting colors inside Monaco.
                </p>
              </div>
              <div className="flex flex-wrap bg-surface-elevated rounded-lg p-1 border border-border gap-1 shrink-0 max-w-full sm:max-w-md">
                {(
                  [
                    { id: 'auto', label: 'Auto (Sync)' },
                    { id: 'nexus-midnight', label: 'Midnight' },
                    { id: 'nexus-warm-zen', label: 'Warm Zen' },
                    { id: 'nexus-nordic', label: 'Nordic' },
                    { id: 'nexus-cyber', label: 'Cyber' },
                    { id: 'vs-dark', label: 'VS Dark' },
                    { id: 'monokai', label: 'Monokai' },
                    { id: 'hc-black', label: 'HC Black' },
                  ] as { id: EditorTheme; label: string }[]
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleEditorThemeChange(t.id)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isClient && settings.editorTheme === t.id
                        ? 'bg-card text-primary border border-border font-semibold shadow-sm ring-1 ring-primary/40'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Word Wrap Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
              <div className="flex items-start gap-3">
                <WrapText className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground text-sm font-bangla-ui">
                    Word Wrap (স্বয়ংক্রিয় লাইন ব্রেকিং)
                  </h3>
                  <p className="text-xs text-muted-foreground font-bangla">
                    Wrap long lines of code within the visible editor area so horizontal scrolling is avoided.
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleLineWrap}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  isClient && settings.editorLineWrap ? 'bg-primary' : 'bg-surface-elevated border border-border'
                }`}
                aria-label="Toggle line wrap"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isClient && settings.editorLineWrap ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Editor Find / Search (Ctrl+F) */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
              <div className="flex items-start gap-3">
                <Search className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground text-sm font-bangla-ui">
                    Editor Find Widget (Ctrl+F সার্চ উইজেট)
                  </h3>
                  <p className="text-xs text-muted-foreground font-bangla max-w-md">
                    Disabled by default to prevent the search dialog popup from accidentally blocking the learner&apos;s code view.
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleFind}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  isClient && settings.editorFindEnabled ? 'bg-primary' : 'bg-surface-elevated border border-border'
                }`}
                aria-label="Toggle editor find widget"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isClient && settings.editorFindEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 4. Learning Preferences */}
        <section className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 font-bangla-ui">
              <BrainCircuit className="w-5 h-5 text-primary" /> Learning Preferences (শেখার পছন্দ ও প্রতিক্রিয়া)
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-bangla">
              Configure pedagogical rigor and sound feedback.
            </p>
          </div>

          <div className="space-y-3">
            {/* Strict Scoring */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
              <div>
                <h3 className="font-medium text-foreground text-sm font-bangla-ui">
                  Strict Scoring (কঠোর মূল্যায়ন মোড)
                </h3>
                <p className="text-xs text-muted-foreground font-bangla max-w-md mt-0.5">
                  Require higher accuracy in quizzes and debug challenges before marking a mission complete.
                </p>
              </div>
              <button
                onClick={handleToggleStrictScoring}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  isClient && settings.strictScoring ? 'bg-primary' : 'bg-surface-elevated border border-border'
                }`}
                aria-label="Toggle strict scoring"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isClient && settings.strictScoring ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound Feedback */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
              <div className="flex items-start gap-3">
                {isClient && settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                )}
                <div>
                  <h3 className="font-medium text-foreground text-sm font-bangla-ui">
                    Sound Effects & Feedback (সাউন্ড এফেক্ট)
                  </h3>
                  <p className="text-xs text-muted-foreground font-bangla mt-0.5">
                    Play audio cues upon step completion, achievements, and level-ups.
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                  isClient && settings.soundEnabled ? 'bg-primary' : 'bg-surface-elevated border border-border'
                }`}
                aria-label="Toggle sound feedback"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isClient && settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 5. Developer Mode (Mission Unlocker) */}
        <section className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 font-bangla-ui">
              <KeyRound className="w-5 h-5 text-primary" /> Developer Mode (ডেভেলপার মোড)
            </h2>
            {isClient && settings.devModeUnlocked ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                <Unlock className="w-3.5 h-3.5" /> Unlocked
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                <Lock className="w-3.5 h-3.5" /> Locked
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface space-y-4">
            {!isClient || !settings.devModeUnlocked ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground text-sm font-bangla-ui">
                    Developer & Reviewer Controls
                  </h3>
                  <p className="text-xs text-muted-foreground font-bangla">
                    Unlock developer tools to preview and test all missions 001–010 without prerequisite restrictions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPinError('');
                    setPinInput('');
                    setIsPinModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-sm font-medium text-foreground transition-colors shrink-0"
                >
                  <KeyRound className="w-4 h-4 text-primary" /> Unlock Developer Mode
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground text-sm font-bangla-ui flex items-center gap-2">
                      Developer Preview Mode (সকল মিশন আনলক মোড)
                    </h3>
                    <p className="text-xs text-muted-foreground font-bangla mt-0.5">
                      When enabled, all missions 001–010 on the dashboard are treated as unlocked for immediate testing and QA.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleDevPreview}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                      settings.devPreviewAllMissions ? 'bg-primary' : 'bg-surface-elevated border border-border'
                    }`}
                    aria-label="Toggle developer preview mode"
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.devPreviewAllMissions ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    PIN verified. You can lock developer controls back at any time.
                  </span>
                  <button
                    onClick={handleLockDevMode}
                    className="text-xs font-medium text-muted-foreground hover:text-destructive flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-destructive/10 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" /> Lock Dev Mode
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. Danger Zone & Data Management */}
        <section className="p-6 rounded-xl border border-destructive/30 bg-destructive/5 space-y-4 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-destructive flex items-center gap-2 font-bangla-ui">
              <ShieldAlert className="w-5 h-5" /> Danger Zone & Data Management (ডাটা ব্যাকআপ ও রিসেট)
            </h2>
            <p className="text-xs text-muted-foreground mt-1 font-bangla">
              Export your progress for safekeeping, import on a new machine, or start fresh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export Backup */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-medium text-foreground text-sm flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-primary" /> Export Backup (.json)
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-bangla">
                  Download a complete backup of your XP, mission states, settings, and memory.
                </p>
              </div>
              <button
                onClick={handleExportBackup}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border text-sm font-medium text-foreground transition-colors"
              >
                <Download className="w-4 h-4 text-primary" /> Export Backup (.json)
              </button>
            </div>

            {/* Import Backup */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-medium text-foreground text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" /> Import Progress (.json)
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-bangla">
                  Restore previously exported progress and settings from a JSON file.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                onClick={handleImportClick}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover border border-border text-sm font-medium text-foreground transition-colors"
              >
                <Upload className="w-4 h-4 text-primary" /> Import Progress (.json)
              </button>
            </div>
          </div>

          {/* Reset Progress */}
          <div className="p-4 rounded-xl border border-destructive/20 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-foreground text-sm font-bangla-ui flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-destructive" /> Reset Learning Progress (অগ্রগতি সম্পূর্ণ রিসেট)
              </h3>
              <p className="text-xs text-muted-foreground font-bangla mt-0.5">
                Permanently delete all your XP, levels, quiz scores, and mission states.
              </p>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" /> Reset Progress
            </button>
          </div>
        </section>
      </div>

      {/* MODAL 1: Secret PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Developer PIN</h3>
                  <p className="text-xs text-muted-foreground">Enter the developer access passcode.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Secret PIN
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  autoFocus
                  placeholder="Enter secret PIN"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {pinError && (
                  <p className="text-xs text-destructive mt-1.5 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {pinError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-sm font-medium text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground text-sm font-semibold transition-colors"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl border border-destructive/40 bg-card shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Reset All Progress?</h3>
                <p className="text-xs text-destructive font-semibold">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-bangla leading-relaxed">
              Are you sure you want to proceed? All your completed missions, quizzes, earned XP, levels, and learning history will be permanently wiped clean.
            </p>

            <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground font-bangla">
                Recommended: Download a backup file before resetting.
              </div>
              <button
                onClick={handleExportBackup}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Backup Now
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-sm font-medium text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
