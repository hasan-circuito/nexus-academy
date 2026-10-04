'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Terminal,
  MessageSquare,
  Settings,
  ArrowRight,
  Flame,
  X,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import missionsIndex from '@/data/missions/index.json';

export interface NexusOmnibarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  category: 'Missions' | 'Navigation' | 'Tools';
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

/**
 * Nexus Omnibar (⌘K Command Palette)
 * Global quick navigation and command interface inspired by Raycast and Linear.
 */
export function NexusOmnibar({ isOpen, onClose }: NexusOmnibarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Command items catalog
  const allCommands = useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = [
      {
        id: 'nav-dashboard',
        category: 'Navigation',
        title: 'Developer Cockpit (Dashboard v2)',
        description: 'View progress metrics, streak velocity, and launchpad',
        icon: <Terminal className="w-4 h-4 text-cyan-400" />,
        action: () => {
          router.push('/dashboard-v2');
          onClose();
        },
        badge: 'ACTIVE',
      },
      {
        id: 'nav-feedback',
        category: 'Navigation',
        title: 'Community Discussion Hub (/feedback-v2)',
        description: 'Propose RFCs, upvote improvements, and view creator updates',
        icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
        action: () => {
          router.push('/feedback-v2');
          onClose();
        },
        badge: 'LIVE',
      },
      {
        id: 'nav-dictionary',
        category: 'Tools',
        title: 'Python Concept Dictionary',
        description: 'Interactive reference for variables, data types, and syntax rules',
        icon: <BookOpen className="w-4 h-4 text-amber-400" />,
        action: () => {
          router.push('/dictionary');
          onClose();
        },
      },
      {
        id: 'nav-settings',
        category: 'Navigation',
        title: 'Platform Settings & Themes',
        description: 'Configure editor, switch visual themes, or toggle dev mode',
        icon: <Settings className="w-4 h-4 text-zinc-400" />,
        action: () => {
          router.push('/settings');
          onClose();
        },
      },
    ];

    const missionItems: CommandItem[] = missionsIndex.map((m) => ({
      id: `mission-${m.id}`,
      category: 'Missions',
      title: `Mission ${m.id}: ${m.title}`,
      description: `${m.banglaTitle} • ${m.difficulty.toUpperCase()} • ${m.estimatedMinutes} mins`,
      icon: <Code2 className="w-4 h-4 text-cyan-400" />,
      action: () => {
        router.push(`/missions/${m.id}`);
        onClose();
      },
      badge: `M${m.id}`,
    }));

    return [...navItems, ...missionItems];
  }, [router, onClose]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  // Keyboard navigation inside list
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length)
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          selected.action();
        }
      }
    },
    [filteredCommands, selectedIndex]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-xl rounded-2xl bg-zinc-950/95 border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800/80">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command, mission, or tool (e.g. M001, feedback)..."
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                  No matching commands found.
                </div>
              ) : (
                filteredCommands.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                          : 'text-zinc-300 hover:bg-zinc-900/60 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            'p-1.5 rounded-lg border',
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                          )}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold truncate">{item.title}</span>
                            {item.badge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">{item.description}</p>
                        </div>
                      </div>
                      <ArrowRight
                        className={cn(
                          'w-3.5 h-3.5 shrink-0 transition-transform ml-2',
                          isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-zinc-600 opacity-0'
                        )}
                      />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hotkey Guide */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/60 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
              <div className="flex items-center gap-2">
                <span>Navigate: <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">↓</kbd></span>
                <span>Select: <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">↵</kbd></span>
              </div>
              <div>
                <span>Exit: <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">ESC</kbd></span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
