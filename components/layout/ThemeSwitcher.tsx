'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { type ThemeMode } from '@/types/settings.types';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  banglaName: string;
  icon: string;
  badge: string;
  description: string;
  swatches: string[];
  glowColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'midnight',
    name: 'Midnight Sanctuary',
    banglaName: 'মিডনাইট স্যাঙ্কচুয়ারি',
    icon: '🌙',
    badge: 'Eye-Friendly',
    description: 'Charcoal Slate, calming Emerald & Cyan. Zero glare.',
    swatches: ['#0b0f19', '#34d399', '#22d3ee'],
    glowColor: 'rgba(52, 211, 153, 0.35)',
  },
  {
    id: 'warm-zen',
    name: 'Warm Zen',
    banglaName: 'ওয়ার্ম জেন',
    icon: '🍵',
    badge: 'Zero Blue Light',
    description: 'Deep Sepia & glowing Amber. Library warmth for night study.',
    swatches: ['#181512', '#f59e0b', '#f5efe6'],
    glowColor: 'rgba(245, 158, 11, 0.35)',
  },
  {
    id: 'nordic',
    name: 'Nordic Frost',
    banglaName: 'নর্ডিক ফ্রস্ট',
    icon: '❄️',
    badge: 'Clean Pastel',
    description: 'Polar Navy with pastel Lavender & Mint. Modern serene code.',
    swatches: ['#0f141c', '#c084fc', '#6ee7b7'],
    glowColor: 'rgba(192, 132, 252, 0.35)',
  },
  {
    id: 'cyber-oasis',
    name: 'Cyber-Oasis',
    banglaName: 'সাইবার ওয়েসিস',
    icon: '⚡',
    badge: 'Futuristic Glass',
    description: 'Obsidian & frosted glass with subtle Neon Cyan glow.',
    swatches: ['#06080d', '#00f0ff', '#818cf8'],
    glowColor: 'rgba(0, 240, 255, 0.35)',
  },
];

export const SECONDARY_THEMES: { id: ThemeMode; name: string; icon: string; banglaName: string }[] = [
  { id: 'light', name: 'Light Mode', icon: '☀️', banglaName: 'লাইট মোড' },
  { id: 'system', name: 'System Auto', icon: '💻', banglaName: 'সিস্টেম অনুযায়ী' },
];

interface ThemeSwitcherProps {
  compact?: boolean;
  className?: string;
}

export function ThemeSwitcher({ compact = false, className }: ThemeSwitcherProps) {
  const { settings, updateSettings, isClient } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const activeThemeId = isClient ? settings.theme : 'midnight';
  const activeTheme =
    THEME_OPTIONS.find((t) => t.id === activeThemeId) ||
    (activeThemeId === 'dark' ? THEME_OPTIONS[0] : null);

  const handleSelectTheme = (themeId: ThemeMode) => {
    updateSettings({ theme: themeId });
    setIsOpen(false);
  };

  return (
    <div className={cn('relative inline-block text-left', className)} ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Change Theme (থিম পরিবর্তন)"
        title="Change Theme (থিম পরিবর্তন)"
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border transition-all duration-200',
          'bg-surface hover:bg-surface-hover text-foreground shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          compact ? 'p-2' : 'px-3 py-1.5 text-xs font-medium',
          isOpen && 'ring-1 ring-primary/40 border-primary/50'
        )}
      >
        <span className="text-sm leading-none select-none">
          {activeTheme ? activeTheme.icon : activeThemeId === 'light' ? '☀️' : '💻'}
        </span>
        {!compact && (
          <>
            <span className="font-medium tracking-tight">
              {activeTheme ? activeTheme.name : activeThemeId === 'light' ? 'Light' : 'System'}
            </span>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                isOpen && 'rotate-180 text-foreground'
              )}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-border shadow-2xl z-50',
            'bg-surface-elevated/95 backdrop-blur-xl p-2.5 space-y-2',
            'animate-in fade-in-0 zoom-in-95 duration-150 origin-top-right'
          )}
        >
          {/* Header */}
          <div className="px-2 py-1 flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground font-bangla-ui">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Learner Themes (শান্ত ও সুন্দর থিম)</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-1.5 py-0.5 rounded bg-surface border border-border">
              Eye-Friendly
            </span>
          </div>

          {/* 4 Aesthetic Theme Cards */}
          <div className="space-y-1.5">
            {THEME_OPTIONS.map((theme) => {
              const isSelected =
                activeThemeId === theme.id ||
                (activeThemeId === 'dark' && theme.id === 'midnight');

              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all duration-150 border',
                    isSelected
                      ? 'border-primary/50 bg-primary/10 text-foreground shadow-sm'
                      : 'border-transparent hover:border-border hover:bg-surface text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="text-xl mt-0.5 select-none">{theme.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-foreground tracking-tight">
                        {theme.name}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] text-primary font-medium">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {theme.description}
                    </p>
                    {/* Swatches pill preview */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex items-center -space-x-1">
                        {theme.swatches.map((color, i) => (
                          <span
                            key={i}
                            className="inline-block w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-foreground-faint font-bangla">
                        {theme.banglaName}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              {SECONDARY_THEMES.map((sec) => {
                const isSelected = activeThemeId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectTheme(sec.id)}
                    className={cn(
                      'flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors border',
                      isSelected
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-transparent hover:border-border hover:bg-surface text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span>{sec.icon}</span>
                    <span className="truncate">{sec.name}</span>
                    {isSelected && <Check className="w-3 h-3 ml-auto text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
