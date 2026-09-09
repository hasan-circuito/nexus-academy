// engines/progress/ProgressEngine.ts
// NEXUS Academy — Mission Progress Engine
//
// Two-phase mission completion:
//   Phase 1: completeMission() emits MISSION_COMPLETING
//   Phase 2: onMissionCompleted() subscribes to MISSION_COMPLETED and persists final state

import { storage } from '@/services/LocalStorageDataService';
import type { DataService } from '@/services/DataService';
import { EventBus } from '@/engines/events/EventBus';
import type { MissionCompletedEvent } from '@/engines/events/events.types';
import type { MissionData } from '@/types/mission.types';
import { initEngines } from '@/engines/init';

export class ProgressEngine {
  private unsubscribers: Array<() => void> = [];

  constructor(private dataService: DataService) {}

  init(): void {
    const unsub = EventBus.subscribe<MissionCompletedEvent>(
      'MISSION_COMPLETED',
      (event) => this.onMissionCompleted(event)
    );
    this.unsubscribers.push(unsub);
  }

  destroy(): void {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }

  private onMissionCompleted(event: MissionCompletedEvent): void {
    const { missionId, understandingScore, xpEarned, timestamp } = event.payload;

    const progress = this.dataService.getProgress();
    if (!progress) return;

    const mp = progress.missions[missionId];
    if (!mp) return;

    // Guard: prevent double-completion
    if (mp.status === 'complete') return;

    // Mark mission complete with final score from UnderstandingEngine
    mp.status = 'complete';
    mp.completedAt = timestamp;
    mp.understandingScore = understandingScore;
    mp.xpEarned = xpEarned;

    // Streak logic
    const today = new Date().toISOString().split('T')[0];
    if (progress.streak.lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (progress.streak.lastStudyDate === yesterday) {
        progress.streak.current += 1;
      } else {
        progress.streak.current = 1;
      }
      progress.streak.lastStudyDate = today;
      progress.streak.longest = Math.max(progress.streak.longest, progress.streak.current);
    }

    // Add mission_completed activity
    progress.activityHistory = progress.activityHistory || [];
    progress.activityHistory.unshift({
      id: Math.random().toString(36).substr(2, 9),
      type: 'mission_completed',
      message: `Completed Mission ${missionId}`,
      timestamp,
    });
    if (progress.activityHistory.length > 50) progress.activityHistory.pop();

    this.dataService.saveProgress(progress);

    // Trigger React re-render (LocalStorageDataService already dispatches this,
    // but we do it explicitly here as well in case a different DataService is used)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nexus_storage_update'));
    }
  }

  /**
   * Public static entry point — called by MissionFooter.tsx / mission complete step.
   * Engines are booted by useProgress.ts at startup; this method trusts they are ready.
   * Emits MISSION_COMPLETING to kick off the two-phase completion pattern.
   */
  static completeMission(mission: MissionData): void {
    if (typeof window === 'undefined') return;

    initEngines(); // Ensure all engine subscribers are registered before emitting

    const progress = storage.getProgress();

    // Ensure mission progress object exists
    if (!progress.missions[mission.id]) {
      progress.missions[mission.id] = {
        status: 'in_progress',
        understandingScore: 0,
        xpEarned: 0,
        steps: {},
        quizAttempts: [],
        debugAttempts: [],
        reflection: { completed: false },
      };
      storage.saveProgress(progress);
    }

    const mp = progress.missions[mission.id];

    // Guard: prevent double-completion
    if (mp.status === 'complete') return;

    // Determine which step types exist in this mission
    const hasQuiz = mission.steps.some(s => s.type === 'quiz');
    const hasPractice = mission.steps.some(s => s.type === 'practice');
    const hasDebug = mission.steps.some(s => s.type === 'debug_challenge');
    const hasReflection = mission.steps.some(s => s.type === 'reflection');

    // Phase 1: emit MISSION_COMPLETING — UnderstandingEngine will compute score and emit MISSION_COMPLETED
    EventBus.emit({
      type: 'MISSION_COMPLETING',
      payload: {
        missionId: mission.id,
        hasQuiz,
        hasPractice,
        hasDebug,
        hasReflection,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Calculates what the score and XP would be for a mission without completing it.
   * Used by MissionCompleteStep for display purposes.
   */
  static calculateProjectedScore(mission: MissionData): { score: number, xp: number } {
    if (typeof window === 'undefined') return { score: 0, xp: 0 };
    const progress = storage.getProgress();
    const mp = progress.missions[mission.id];
    if (!mp) return { score: 0, xp: 0 };

    const steps = mp.steps || {};

    const hasQuiz = mission.steps.some(s => s.type === 'quiz');
    const hasPractice = mission.steps.some(s => s.type === 'practice');
    const hasDebug = mission.steps.some(s => s.type === 'debug_challenge');
    const hasReflection = mission.steps.some(s => s.type === 'reflection');

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

    const score = Math.round(
      (quizScore * wQuiz + debugScore * wDebug + practiceScore * wPractice +
       reflectionScore * wReflection + hintPenalty * wHints) * 100
    );

    const xp = Math.round((score / 100) * 400);

    return { score, xp };
  }
}
