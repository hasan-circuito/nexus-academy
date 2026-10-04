'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, Sparkles, Clock, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { storage } from '@/services/LocalStorageDataService';
import { cn } from '@/lib/utils';

export function SpacedRecallWidget({ className }: { className?: string }) {
  const { progress, isClient } = useProgress();

  // Inspect storage for scheduled reviews or pick high-value concept to review
  const reviewData = React.useMemo(() => {
    if (!isClient) {
      return {
        conceptName: 'Python Memory Reference & Variable Pointers',
        missionId: '003',
        daysAgo: 3,
        suggestedMinutes: 2,
        dueCount: 1,
      };
    }

    const schedule = storage.getReviewSchedule();
    const pendingReviews = schedule.filter(item => item.status === 'pending');

    if (pendingReviews.length > 0) {
      const topReview = pendingReviews[0];
      return {
        conceptName: `Mission ${topReview.missionId}: Concept Recall Drill`,
        missionId: topReview.missionId,
        daysAgo: topReview.intervalDays || 1,
        suggestedMinutes: 2,
        dueCount: pendingReviews.length,
      };
    }

    // Default concept drill based on completed mission or foundational
    return {
      conceptName: 'Python Memory Model & id() Function',
      missionId: '004',
      daysAgo: 2,
      suggestedMinutes: 2,
      dueCount: 1,
    };
  }, [isClient]);

  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden shadow-xl',
        className
      )}
    >
      {/* Subtle Purple/Cyan ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Spaced Recall Lab</h3>
              <p className="text-[11px] text-zinc-400 font-mono">SuperMemo SM-2 Spaced Recall</p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {reviewData.dueCount} Due
          </span>
        </div>

        {/* Concept Card */}
        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> Learned {reviewData.daysAgo}d ago
            </span>
            <span className="text-purple-400 font-medium font-mono">
              ~{reviewData.suggestedMinutes} min drill
            </span>
          </div>

          <h4 className="font-bold text-zinc-100 text-sm leading-snug">
            {reviewData.conceptName}
          </h4>

          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Reinforce neural retention pathways through quick retrieval. Zero penalty.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Link
            href={`/mission/mission-${reviewData.missionId}/step/0`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600/90 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start 2-Min Recall Drill</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
