// engines/understanding/UnderstandingEngine.ts
// NEXUS Academy — Understanding Score Calculator
// Source of truth: ARCHITECTURE.md Section 4
//
// RULE: This is the ONLY engine allowed to emit MISSION_COMPLETED.
// It subscribes to MISSION_COMPLETING (Phase 1) and emits MISSION_COMPLETED (Phase 2).

import type { DataService } from '@/services/DataService';
import type { MissionCompletingEvent } from '@/engines/events/events.types';
import { EventBus } from '@/engines/events/EventBus';

export class UnderstandingEngine {
  private unsubscribers: Array<() => void> = [];

  constructor(private dataService: DataService) {}

  init(): void {
    const unsub = EventBus.subscribe<MissionCompletingEvent>(
      'MISSION_COMPLETING',
      (event) => this.onMissionCompleting(event)
    );
    this.unsubscribers.push(unsub);
  }

  destroy(): void {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }

  private onMissionCompleting(event: MissionCompletingEvent): void {
    const { missionId, hasQuiz, hasPractice, hasDebug, hasReflection, timestamp } = event.payload;

    const progress = this.dataService.getProgress();
    if (!progress) return;

    const mp = progress.missions[missionId];
    if (!mp) return;

    const steps = mp.steps || {};

    // Dynamic weight normalization — same logic as original ProgressEngine
    let wQuiz = hasQuiz ? 0.40 : 0;
    let wDebug = hasDebug ? 0.25 : 0;
    let wPractice = hasPractice ? 0.20 : 0;
    let wReflection = hasReflection ? 0.10 : 0;
    let wHints = hasDebug ? 0.05 : 0;

    const totalWeight = wQuiz + wDebug + wPractice + wReflection + wHints;
    if (totalWeight > 0) {
      wQuiz /= totalWeight;
      wDebug /= totalWeight;
      wPractice /= totalWeight;
      wReflection /= totalWeight;
      wHints /= totalWeight;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quizEvidence = steps['quiz'] as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debugEvidence = steps['debug_challenge'] as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const practiceEvidence = steps['practice'] as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reflectionCompleted = mp.reflection?.completed || (steps['reflection'] as any)?.completed;

    const quizScore = (hasQuiz && quizEvidence?.passed) ? ((quizEvidence.score as number) || 100) / 100 : 0;
    const debugScore = (hasDebug && debugEvidence?.passed) ? 1.0 : 0;
    const practiceScore = (hasPractice && practiceEvidence?.passed) ? 1.0 : 0;
    const reflectionScore = (hasReflection && reflectionCompleted) ? 1.0 : 0;
    const hintPenalty = (hasDebug && debugEvidence?.hintsUsed)
      ? Math.max(0, 1 - ((debugEvidence.hintsUsed as number) * 0.15))
      : 1.0;

    const understandingScore = Math.round(
      (quizScore * wQuiz + debugScore * wDebug + practiceScore * wPractice +
       reflectionScore * wReflection + hintPenalty * wHints) * 100
    );

    const xpEarned = Math.round((understandingScore / 100) * 400);

    EventBus.emit({
      type: 'MISSION_COMPLETED',
      payload: {
        missionId,
        understandingScore,
        xpEarned,
        totalTimeMs: 0,
        timestamp,
      },
    });
  }
}
