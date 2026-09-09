'use client';

import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { ProgressEngine } from '@/engines/progress/ProgressEngine';
import type { MissionData } from '@/types/mission.types';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useState } from 'react';
import { MissionProgressGate, type IncompleteStepInfo } from '@/services/MissionProgressGate';

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

  const [incompleteSteps, setIncompleteSteps] = useState<IncompleteStepInfo[]>([]);
  const [showGateModal, setShowGateModal] = useState(false);

  const handlePrev = useCallback(() => {
    if (hasPrev) router.push(`/mission/${missionId}/step/${currentIndex - 1}`);
  }, [hasPrev, router, missionId, currentIndex]);

  const handleNext = useCallback(async () => {
    if (hasNext) {
      router.push(`/mission/${missionId}/step/${currentIndex + 1}`);
    } else {
      // Last step: check completion gate before completing
      const missing = MissionProgressGate.getIncompleteSteps(missionData);
      if (missing.length > 0) {
        setIncompleteSteps(missing);
        setShowGateModal(true);
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
      {showGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-warning/30 shadow-2xl rounded-2xl max-w-lg w-full p-6 space-y-5 text-left animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/20 text-warning flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg font-bangla-ui">
                    মিশন সম্পূর্ণ করতে বাকি আছে!
                  </h3>
                  <p className="text-xs text-muted-foreground font-bangla">
                    মিশন শেষ করতে নিচের ধাপগুলো সফলভাবে সম্পন্ন করুন:
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGateModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-surface"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {incompleteSteps.map((step) => (
                <div
                  key={step.index}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border hover:border-primary/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold text-warning px-2 py-0.5 rounded-full bg-warning/10 inline-block mb-1">
                      {step.category}
                    </span>
                    <p className="text-sm font-medium text-foreground truncate font-bangla">
                      ধাপ {step.stepNumber}: {step.title}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowGateModal(false);
                      router.push(`/mission/${missionId}/step/${step.index}`);
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>এই ধাপে যাও</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setShowGateModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                বন্ধ করো
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
