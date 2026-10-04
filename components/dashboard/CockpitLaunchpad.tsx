'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Sparkles, Cpu, Clock, Layers, ArrowRight, BookOpen } from 'lucide-react';
import { BorderBeam } from '@/components/ui/border-beam';
import manifest from '@/data/missions/manifest.json';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/hooks/useSettings';
import { storage } from '@/services/LocalStorageDataService';
import { getMissionStepCount } from '@/services/ContentService';
import { cn } from '@/lib/utils';

interface CockpitLaunchpadProps {
  className?: string;
}

export function CockpitLaunchpad({ className }: CockpitLaunchpadProps) {
  const { progress, isClient } = useProgress();
  const { settings } = useSettings();

  // Resolve current active mission
  const resolvedMissionData = React.useMemo(() => {
    const allMissions = manifest.missions;
    let target = allMissions[0];

    if (isClient) {
      if (progress.lastActiveMissionId) {
        const found = allMissions.find(m => m.id === progress.lastActiveMissionId);
        if (found) target = found;
      } else {
        // Find first in-progress or unlocked mission
        const inProgress = allMissions.find(m => {
          const p = progress.missions[m.id];
          return p && p.status === 'in_progress';
        });
        if (inProgress) {
          target = inProgress;
        } else {
          const unlocked = allMissions.find(m => {
            const p = progress.missions[m.id];
            return p ? p.status === 'unlocked' : m.prerequisite === null;
          });
          if (unlocked) target = unlocked;
        }
      }
    }

    const totalSteps = getMissionStepCount(target.id);
    const persisted = isClient ? progress.missions[target.id] : null;
    const isCompleted = isClient ? persisted?.status === 'complete' : false;
    const rawStep = isClient
      ? storage.getActiveStep(target.id)
      : (persisted?.currentStepIndex ?? 0);
    const savedStep = Math.min(Math.max(0, rawStep), Math.max(0, totalSteps - 1));
    const progressPercent = isCompleted
      ? 100
      : (totalSteps > 0 ? Math.round((savedStep / totalSteps) * 100) : 0);

    const targetUrl = isCompleted
      ? `/mission/mission-${target.id}/step/0`
      : `/mission/mission-${target.id}/step/${savedStep}`;

    let actionLabel = 'Start Mission';
    if (isCompleted) {
      actionLabel = 'Review Mission';
    } else if (savedStep > 0) {
      actionLabel = `Resume Step ${savedStep + 1}`;
    }

    return {
      mission: target,
      totalSteps,
      savedStep,
      isCompleted,
      progressPercent,
      targetUrl,
      actionLabel,
    };
  }, [isClient, progress]);

  const {
    mission,
    totalSteps,
    savedStep,
    isCompleted,
    progressPercent,
    targetUrl,
    actionLabel,
  } = resolvedMissionData;

  return (
    <div
      className={cn(
        'relative rounded-2xl bg-zinc-950/90 border border-zinc-800/80 p-6 md:p-8 overflow-hidden backdrop-blur-2xl shadow-2xl',
        className
      )}
    >
      {/* 21st.dev / Magic UI BorderBeam Motion Glow */}
      <BorderBeam duration={8} colorFrom="#10b981" colorTo="#06b6d4" strokeWidth={2} />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          {/* Status Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Mission • {isCompleted ? 'Completed ✓' : 'In Progress'}</span>
            </span>

            <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
              Mission {mission.id}
            </span>

            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
              Rule 24 AST Conformed
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{mission.banglaTitle}</span>
              <span className="text-base font-normal text-zinc-400 hidden sm:inline">
                ({mission.title})
              </span>
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              {mission.banglaSubtitle || mission.primaryConcept}
            </p>
          </div>

          {/* Meta metrics pills */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step: <strong className="text-white">{isCompleted ? totalSteps : savedStep + 1} / {totalSteps}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Est: <strong className="text-white">~{mission.estimatedMinutes || 20} mins</strong></span>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Progress: <strong className="text-emerald-400 font-mono">{progressPercent}%</strong></span>
            </div>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="w-full max-w-md pt-1">
            <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href={targetUrl}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-zinc-950" />
            <span>{actionLabel}</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-950/20 text-zinc-950 border border-zinc-950/30">
              ↵ Enter
            </kbd>
          </Link>

          <Link
            href="/dictionary"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-700/80 text-zinc-300 hover:text-white text-xs font-medium transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explore Concept Dictionary</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
