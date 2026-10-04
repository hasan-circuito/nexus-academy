'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, Sparkles, Sliders, ArrowRight, Search, Command } from 'lucide-react';
import { HudStatusWidget } from '@/components/dashboard/HudStatusWidget';
import { CockpitLaunchpad } from '@/components/dashboard/CockpitLaunchpad';
import { BentoMetricsGrid } from '@/components/dashboard/BentoMetricsGrid';
import { CurriculumRoadmap } from '@/components/dashboard/CurriculumRoadmap';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { SpacedRecallWidget } from '@/components/dashboard/SpacedRecallWidget';
import { CompilerPipelineWidget } from '@/components/dashboard/CompilerPipelineWidget';
import { OrbitingMasteryWidget } from '@/components/dashboard/OrbitingMasteryWidget';
import { NexusOmnibar } from '@/components/ui/nexus-omnibar';
import { useSettings } from '@/hooks/useSettings';
import { useProgress } from '@/hooks/useProgress';

export default function DashboardV2Page() {
  const { settings } = useSettings();
  const { isClient } = useProgress();
  const [isOmnibarOpen, setIsOmnibarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 p-5 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 pb-28 relative">
      {/* Background Ambient Radial Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.12),rgba(255,255,255,0))]" />

      {/* Global Nexus Omnibar */}
      <NexusOmnibar isOpen={isOmnibarOpen} onClose={() => setIsOmnibarOpen(false)} />

      {/* Top Version Switcher Pill (Experiment Safe Switcher) */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Developer Cockpit (Dashboard v2)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Living fire border beam, 3D tilt card, animated compiler telemetry, and orbital skill rings
            </p>
          </div>
        </div>

        {/* Omnibar & Toggle Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Omnibar Trigger */}
          <button
            type="button"
            onClick={() => setIsOmnibarOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-cyan-500/50 text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Dashboard v1 (Classic)</span>
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 shadow-sm">
              <span>⬡ Dashboard v2 (Cockpit)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Mode Banner if enabled */}
      {isClient && settings.devPreviewAllMissions && (
        <div className="relative z-10 flex items-center justify-between p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 font-bold uppercase tracking-wider rounded-md bg-cyan-500/20 text-cyan-300 font-mono">
              Dev Mode
            </span>
            <span className="text-zinc-200 font-medium">
              Developer preview active: All missions and lab steps unlocked for testing.
            </span>
          </div>
          <Link href="/settings" className="font-semibold text-cyan-400 hover:underline shrink-0 ml-4 flex items-center gap-1">
            <span>Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Section 1: Hero Cockpit Launchpad Card (3D Tilt + Fire Plasma BorderBeam) */}
      <div className="relative z-10">
        <CockpitLaunchpad />
      </div>

      {/* Section 2: HUD Status & Streak Widget */}
      <div className="relative z-10">
        <HudStatusWidget onOpenSearch={() => setIsOmnibarOpen(true)} />
      </div>

      {/* Section 3: Bento Grid Metrics (4 Spotlight Cards) */}
      <div className="relative z-10">
        <BentoMetricsGrid />
      </div>

      {/* Section 4: Magic UI Live Telemetry (WASM Compiler Pipeline + Orbital Skill Rings) */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <CompilerPipelineWidget className="h-full" />
        </div>
        <div className="lg:col-span-5">
          <OrbitingMasteryWidget className="h-full" />
        </div>
      </section>

      {/* Section 5: Full-Width Milestone Curriculum Roadmap (Tracing Laser Path) */}
      <section className="relative z-10 w-full">
        <CurriculumRoadmap />
      </section>

      {/* Section 6: Bottom Utility Hub (Activity Heatmap + Spaced Recall) */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <ActivityHeatmap className="h-full" />
        </div>
        <div className="lg:col-span-5">
          <SpacedRecallWidget className="h-full" />
        </div>
      </section>
    </div>
  );
}

