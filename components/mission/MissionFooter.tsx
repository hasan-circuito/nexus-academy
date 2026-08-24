'use client';

import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProgressEngine } from '@/engines/progress/ProgressEngine';
import type { MissionData } from '@/types/mission.types';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useState } from 'react';
import { storage } from '@/services/LocalStorageDataService';

interface Props {
  missionData: MissionData;
  currentIndex: number;
}

export function MissionFooter({ missionData, currentIndex }: Props) {
  const router = useRouter();
  const missionId = `mission-${missionData.id}`;
  const totalSteps = missionData.steps.length;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalSteps - 1;
  const isLastStep = currentIndex === totalSteps - 1;

  const [gateMessage, setGateMessage] = useState<string | null>(null);

  const canCompleteMission = (): boolean => {
    if (typeof window === 'undefined') return false;
    const prog = storage.getProgress();
    const mp = prog.missions[missionData.id];
    if (!mp?.steps) return false;
    
    const quizDone = (mp.steps['quiz'] as any)?.passed === true;
    const practiceDone = (mp.steps['practice'] as any)?.passed === true;
    const debugDone = (mp.steps['debug_challenge'] as any)?.passed === true;
    
    return quizDone && practiceDone && debugDone;
  };

  const handlePrev = useCallback(() => {
    if (hasPrev) router.push(`/mission/${missionId}/step/${currentIndex - 1}`);
  }, [hasPrev, router, missionId, currentIndex]);

  const handleNext = useCallback(async () => {
    if (hasNext) {
      router.push(`/mission/${missionId}/step/${currentIndex + 1}`);
    } else {
      // Last step: check completion gate before completing
      if (!canCompleteMission()) {
        setGateMessage('সব ধাপ (Quiz, Practice, Debug) সম্পন্ন করো!');
        return;
      }
      try {
        ProgressEngine.completeMission(missionData);
      } catch (e) {
        console.error('[MissionFooter] completeMission failed:', e);
      }
      router.push('/dashboard');
    }
  }, [hasNext, router, missionId, currentIndex, missionData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, handlePrev, handleNext]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-30 hover:bg-surface text-foreground"
          aria-label="Previous Step"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        {/* Step indicator */}
        <span className="text-xs text-muted-foreground font-medium hidden sm:block">
          {currentIndex + 1} / {totalSteps}
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-semibold transition-colors bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm"
          aria-label={isLastStep ? 'Complete Mission' : 'Next Step'}
        >
          {hasNext ? (
            <>Next <ArrowRight className="w-4 h-4" /></>
          ) : (
            <>Finish <CheckCircle2 className="w-4 h-4" /></>
          )}
        </button>
      </div>
      {gateMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-warning/10 border border-warning/30 text-warning rounded-lg font-bangla text-sm animate-in fade-in duration-300 z-50">
          {gateMessage}
        </div>
      )}
    </footer>
  );
}
