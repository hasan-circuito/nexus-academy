'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutGrid, Sparkles, Sliders, ArrowRight } from 'lucide-react';
import { HudStatusWidget } from '@/components/dashboard/HudStatusWidget';
import { CockpitLaunchpad } from '@/components/dashboard/CockpitLaunchpad';
import { BentoMetricsGrid } from '@/components/dashboard/BentoMetricsGrid';
import { CurriculumRoadmap } from '@/components/dashboard/CurriculumRoadmap';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { SpacedRecallWidget } from '@/components/dashboard/SpacedRecallWidget';
import { useSettings } from '@/hooks/useSettings';
import { useProgress } from '@/hooks/useProgress';

export default function DashboardV2Page() {
  const { settings } = useSettings();
  const { isClient } = useProgress();

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-5 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 pb-28">
      {/* Top Version Switcher Pill (Experiment Safe Switcher) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl">
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
              BorderBeam motion glow, GitHub-style execution heatmap, and structured curriculum roadmap
            </p>
          </div>
        </div>

        {/* Toggle Pills */}
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

      {/* Developer Mode Banner if enabled */}
      {isClient && settings.devPreviewAllMissions && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
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

      {/* Section 1: Hero Cockpit Launchpad Card (with BorderBeam) */}
      <CockpitLaunchpad />

      {/* Section 2: HUD Status & Streak Widget */}
      <HudStatusWidget />

      {/* Section 3: Bento Grid Metrics (4 Spotlight Cards) */}
      <BentoMetricsGrid />

      {/* Section 4: Full-Width Milestone Curriculum Roadmap */}
      <section className="w-full">
        <CurriculumRoadmap />
      </section>

      {/* Section 5: Bottom Utility Hub (Activity Heatmap + Spaced Recall) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
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
