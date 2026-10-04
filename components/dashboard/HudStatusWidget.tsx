'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, Sparkles, Terminal, Search, Command } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

interface HudStatusWidgetProps {
  className?: string;
  onOpenSearch?: () => void;
}

export function HudStatusWidget({ className, onOpenSearch }: HudStatusWidgetProps) {
  const { progress, xpState, isClient } = useProgress();

  const currentLevel = isClient ? xpState.level : 1;
  const levelTitle = isClient ? (xpState.levelNameBangla || xpState.levelName) : 'শিক্ষানবিশ কোডার';
  const currentXP = isClient ? progress.xp : 0;
  const xpToNextLevel = isClient ? xpState.xpToNextLevel : 100;
  const xpPercent = isClient ? Math.min(100, Math.max(0, xpState.percentToNextLevel)) : 0;
  const streakDays = isClient ? progress.streak.current : 0;

  return (
    <div
      className={cn(
        'rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800/80 p-5 relative overflow-hidden backdrop-blur-xl shadow-lg',
        className
      )}
    >
      {/* Background ambient glow orbs */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Learner Greeting & Status */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
            <Terminal className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                স্বাগতম, কোডার!
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                Pyodide WASM Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              আজকের পাইথন চ্যালেঞ্জ সম্পন্ন করে আপনার লার্নিং স্ট্রিক ধরে রাখুন
            </p>
          </div>
        </div>

        {/* Center: Streak Flame & Days */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            >
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            </motion.div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-lg font-extrabold text-white font-mono">{streakDays} দিন</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                STREAK
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-1">ধারাবাহিক লার্নিং</span>
          </div>
        </div>

        {/* Right: Level & XP Bar */}
        <div className="w-full lg:w-72">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 font-medium text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>লেভেল {currentLevel}: {levelTitle}</span>
            </div>
            <div className="font-mono text-zinc-400 text-[11px]">
              <span className="text-cyan-400 font-semibold">{currentXP}</span> XP
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="relative w-full h-2.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
            <span>পরবর্তী লেভেলে বাকি: {xpToNextLevel} XP</span>
            <span className="text-amber-400 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" /> {xpPercent}% পূর্ণ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
