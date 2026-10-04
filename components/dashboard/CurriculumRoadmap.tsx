'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, CircleDot, Lock, ChevronDown, ChevronUp, BookOpen, ArrowRight, Play } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/hooks/useSettings';
import { storage } from '@/services/LocalStorageDataService';
import { getMissionStepCount } from '@/services/ContentService';
import manifest from '@/data/missions/manifest.json';
import { cn } from '@/lib/utils';

interface PhaseDefinition {
  id: number;
  phaseNumber: string;
  title: string;
  tagline: string;
  missionIds: string[];
}

const PHASE_DEFINITIONS: PhaseDefinition[] = [
  {
    id: 1,
    phaseNumber: 'ফেজ ১',
    title: 'ফান্ডামেন্টালস ও পাইথন মেমোরি মডেল',
    tagline: 'ভ্যারিয়েবলস, অবজেক্ট রেফারেন্স, id() ফাংশন ও স্ট্রিং পরিচিতি',
    missionIds: ['001', '002', '003', '004', '005'],
  },
  {
    id: 2,
    phaseNumber: 'ফেজ ২',
    title: 'ইনপুট, টাইপ কনভার্সন ও স্ট্রিং ফরম্যাটিং',
    tagline: 'input(), টাইপ কাস্টিং, গাণিতিক হিসাব ও আধুনিক f-strings',
    missionIds: ['006', '007', '008', '009', '010'],
  },
  {
    id: 3,
    phaseNumber: 'ফেজ ৩',
    title: 'বুলিয়ান লজিক, অপারেটরস ও ব্রাঞ্চিং',
    tagline: 'লজিক্যাল ট্রুথ টেবিল, কম্প্যারিজন অপারেটরস ও if স্টেটমেন্টস',
    missionIds: ['011', '012', '013', '014'],
  },
  {
    id: 4,
    phaseNumber: 'ফেজ ৪ (আসন্ন)',
    title: 'লুপস, ইটারেশন ও ডেটা স্ট্রাকচারস',
    tagline: 'while & for লুপস, লিস্ট ম্যানিপুলেশন, ডিকশনারি ও ফাংশন আর্কিটেকচার',
    missionIds: [],
  },
];

const toBnDigits = (n: number | string) => n.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[+d]);

export function CurriculumRoadmap({ className }: { className?: string }) {
  const { progress, isClient } = useProgress();
  const { settings } = useSettings();
  const [expandedPhaseId, setExpandedPhaseId] = useState<number | null>(null);

  // Map manifest missions for quick lookup
  const missionMap = React.useMemo(() => {
    const map = new Map<string, (typeof manifest.missions)[0]>();
    manifest.missions.forEach(m => map.set(m.id, m));
    return map;
  }, []);

  return (
    <div
      className={cn(
        'rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-6 backdrop-blur-xl shadow-xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800/80">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>সিলেবাস মাইলস্টোন রোডম্যাপ (Phase Roadmap)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            ১৪টি ল্যাব মিশনকে দীর্ঘ লিস্টের বদলে ৪টি সুবিন্যস্ত ফেজে সাজানো হয়েছে
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          ১৪টি প্রকাশিত ল্যাব মিশন
        </span>
      </div>

      {/* Connected Timeline */}
      <div className="relative">
        {/* Continuous Track Line */}
        <div className="absolute top-5 left-4 md:left-5 bottom-6 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-zinc-800" />

        <div className="space-y-6">
          {PHASE_DEFINITIONS.map(phase => {
            const missionsInPhase = phase.missionIds
              .map(id => missionMap.get(id))
              .filter(Boolean) as (typeof manifest.missions)[0][];

            const completedCount = isClient
              ? missionsInPhase.filter(m => progress.missions[m.id]?.status === 'complete').length
              : 0;

            const totalInPhase = missionsInPhase.length;

            let phaseStatus: 'completed' | 'active' | 'locked' = 'locked';
            let progressPct = 0;

            if (totalInPhase === 0) {
              phaseStatus = 'locked';
              progressPct = 0;
            } else if (completedCount === totalInPhase) {
              phaseStatus = 'completed';
              progressPct = 100;
            } else if (
              isClient &&
              (settings.devPreviewAllMissions ||
                missionsInPhase.some(m => {
                  const s = progress.missions[m.id]?.status;
                  return s === 'in_progress' || s === 'unlocked' || m.prerequisite === null;
                }))
            ) {
              phaseStatus = 'active';
              progressPct = Math.round((completedCount / totalInPhase) * 100);
            }

            const isCompleted = phaseStatus === 'completed';
            const isActive = phaseStatus === 'active';
            const isLocked = phaseStatus === 'locked';

            // Auto-expand active phase by default if none selected
            const isExpanded =
              expandedPhaseId === phase.id || (expandedPhaseId === null && isActive);

            return (
              <div key={phase.id} className="relative flex items-start gap-4 md:gap-5 pl-1 group">
                {/* 21st.dev Node Indicator */}
                <div className="relative z-10 shrink-0 mt-1">
                  {isCompleted && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.6)]">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                  {isActive && (
                    <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse">
                      <CircleDot className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                  {isLocked && (
                    <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Phase Card */}
                <div
                  className={cn(
                    'flex-1 p-5 rounded-xl border transition-all duration-200',
                    isActive
                      ? 'bg-zinc-900/90 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                      : isCompleted
                      ? 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
                      : 'bg-zinc-950/40 border-zinc-800/40 opacity-70'
                  )}
                >
                  {/* Top Bar of Phase */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setExpandedPhaseId(isExpanded ? -1 : phase.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setExpandedPhaseId(isExpanded ? -1 : phase.id);
                      }
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-400 whitespace-nowrap shrink-0 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                          {phase.phaseNumber}
                        </span>
                        <h4
                          className={cn(
                            'text-sm sm:text-base font-bold',
                            isActive ? 'text-cyan-300' : 'text-zinc-100'
                          )}
                        >
                          {phase.title}
                        </h4>
                        {isActive && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                            চলমান ফেজ
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                            সম্পন্ন ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{phase.tagline}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {totalInPhase > 0 && (
                        <span className="text-xs font-mono text-zinc-300">
                          {toBnDigits(completedCount)} / {toBnDigits(totalInPhase)} মিশন ({toBnDigits(progressPct)}%)
                        </span>
                      )}
                      <div className="p-1 rounded-md text-zinc-400 hover:text-white">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Progress Line */}
                  {totalInPhase > 0 && (
                    <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden mt-3">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          isCompleted
                            ? 'bg-emerald-500'
                            : isActive
                            ? 'bg-cyan-500'
                            : 'bg-transparent'
                        )}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  )}

                  {/* Expandable Missions Container */}
                  {isExpanded && totalInPhase > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-2.5 animate-in fade-in duration-300">
                      {missionsInPhase.map(m => {
                        const persisted = isClient ? progress.missions[m.id] : null;
                        const mComplete = isClient && persisted?.status === 'complete';
                        const mLocked = isClient
                          ? settings.devPreviewAllMissions
                            ? false
                            : persisted
                            ? persisted.status !== 'unlocked' &&
                              persisted.status !== 'complete' &&
                              persisted.status !== 'in_progress'
                            : m.prerequisite !== null
                          : m.prerequisite !== null;

                        const rawStep = isClient ? storage.getActiveStep(m.id) : 0;
                        const totalSteps = getMissionStepCount(m.id);
                        const savedStep = Math.min(Math.max(0, rawStep), Math.max(0, totalSteps - 1));
                        const targetUrl = mComplete
                          ? `/mission/mission-${m.id}/step/0`
                          : `/mission/mission-${m.id}/step/${savedStep}`;

                        return (
                          <div
                            key={m.id}
                            className={cn(
                              'flex items-center justify-between p-3 rounded-lg border text-xs transition-colors',
                              mLocked
                                ? 'bg-zinc-950/40 border-zinc-800/40 text-zinc-500'
                                : mComplete
                                ? 'bg-emerald-950/20 border-emerald-800/30 text-zinc-200 hover:border-emerald-700/60'
                                : 'bg-zinc-900/80 border-cyan-500/30 text-white hover:border-cyan-400'
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">
                                M{m.id}
                              </span>
                              <div className="truncate">
                                <span className="font-medium text-zinc-100">{m.banglaTitle}</span>
                                <span className="text-zinc-400 ml-1.5 hidden sm:inline">
                                  ({m.title})
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 ml-3">
                              {mComplete ? (
                                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> ১০০%
                                </span>
                              ) : mLocked ? (
                                <span className="text-zinc-600 flex items-center gap-1">
                                  <Lock className="w-3 h-3" /> লকড
                                </span>
                              ) : (
                                <span className="text-cyan-400 font-mono text-[11px] whitespace-nowrap">
                                  ধাপ {toBnDigits(savedStep + 1)}/{toBnDigits(totalSteps)}
                                </span>
                              )}

                              <Link
                                href={targetUrl}
                                className={cn(
                                  'px-3 py-1.5 rounded-md font-semibold text-[11px] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0',
                                  mComplete
                                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                                    : mLocked
                                    ? 'bg-zinc-900 text-zinc-600 pointer-events-none'
                                    : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                                )}
                              >
                                {mComplete ? 'রিভিউ' : mLocked ? 'লক' : 'প্রবেশ'}
                                {!mLocked && <ArrowRight className="w-3 h-3 shrink-0" />}
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
