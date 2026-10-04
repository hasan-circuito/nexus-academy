'use client';

import React from 'react';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { Code2, Cpu, ShieldCheck, Binary, Terminal, Flame, Sparkles } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

export function OrbitingMasteryWidget({ className }: { className?: string }) {
  const { progress, xpState, isClient } = useProgress();

  const level = isClient ? xpState.level : 1;
  const levelTitle = isClient ? xpState.levelName : 'Learner';

  return (
    <div
      className={cn(
        'relative rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-5 overflow-hidden backdrop-blur-xl shadow-lg flex flex-col justify-between',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
            <span>Skill Mastery Planetary Rings</span>
          </h3>
          <p className="text-[11px] text-zinc-400">
            Concept proficiency & cognitive graph coverage
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          ORBITAL
        </span>
      </div>

      {/* Orbiting Container */}
      <div className="relative flex h-[240px] w-full items-center justify-center overflow-hidden my-2">
        {/* Central Core */}
        <div className="z-10 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 via-zinc-900 to-amber-500/20 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md">
          <Terminal className="w-5 h-5 text-cyan-300" />
          <span className="text-[10px] font-mono font-bold text-white mt-0.5">LVL {level}</span>
        </div>

        {/* Inner Ring (Radius 65px) */}
        <OrbitingCircles radius={65} duration={20} strokeColor="rgba(6, 182, 212, 0.15)">
          <div className="p-1.5 rounded-full bg-zinc-900 border border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Binary className="w-3.5 h-3.5" />
          </div>
        </OrbitingCircles>
        <OrbitingCircles radius={65} duration={20} delay={10} strokeColor="rgba(6, 182, 212, 0.15)">
          <div className="p-1.5 rounded-full bg-zinc-900 border border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </OrbitingCircles>

        {/* Outer Ring (Radius 105px) */}
        <OrbitingCircles radius={105} duration={30} reverse strokeColor="rgba(245, 158, 11, 0.15)">
          <div className="p-1.5 rounded-full bg-zinc-900 border border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </OrbitingCircles>
        <OrbitingCircles radius={105} duration={30} delay={15} reverse strokeColor="rgba(245, 158, 11, 0.15)">
          <div className="p-1.5 rounded-full bg-zinc-900 border border-purple-500/40 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            <Code2 className="w-3.5 h-3.5" />
          </div>
        </OrbitingCircles>
      </div>

      {/* Footer Metrics Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-center z-10">
        <div className="p-1.5 rounded-lg bg-zinc-900/60">
          <div className="text-[10px] text-zinc-400">Syntax AST</div>
          <div className="text-xs font-mono font-bold text-cyan-400">98%</div>
        </div>
        <div className="p-1.5 rounded-lg bg-zinc-900/60">
          <div className="text-[10px] text-zinc-400">Logic Flow</div>
          <div className="text-xs font-mono font-bold text-amber-400">94%</div>
        </div>
        <div className="p-1.5 rounded-lg bg-zinc-900/60">
          <div className="text-[10px] text-zinc-400">Pyodide WASM</div>
          <div className="text-xs font-mono font-bold text-emerald-400">100%</div>
        </div>
      </div>
    </div>
  );
}
