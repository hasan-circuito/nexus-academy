// engines/retention/SpacedRepetitionService.ts
// NEXUS Academy — Spaced Repetition Engine
// Subscribes to MISSION_COMPLETED and schedules a review for the completed mission.

import type { DataService } from '@/services/DataService';
import { EventBus } from '@/engines/events/EventBus';
import type { MissionCompletedEvent } from '@/engines/events/events.types';
import { SM2_MIN_EF, SPACED_REPETITION_INTERVALS } from '@/types/progress.types';

export class SpacedRepetitionService {
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
    const { missionId, timestamp } = event.payload;

    const schedule = this.dataService.getReviewSchedule();

    // Avoid scheduling duplicates
    const alreadyScheduled = schedule.some(item => item.missionId === missionId);
    if (alreadyScheduled) return;

    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    schedule.push({
      missionId,
      topicSlug: missionId,
      scheduledFor: tomorrow,
      intervalDays: 1,
      reviewNumber: 1,
      status: 'pending',
      repetitions: 0,
      easinessFactor: 2.5,
    });

    this.dataService.saveReviewSchedule(schedule);

    EventBus.emit({
      type: 'REVIEW_SCHEDULED',
      payload: {
        missionId,
        intervalDays: 1,
        scheduledFor: tomorrow,
        timestamp,
      },
    });
  }

  computeNextInterval(currentInterval: number, easinessFactor: number, repetitions: number, quality: number) {
    if (quality < 3) return { intervalDays: 1, easinessFactor, repetitions: 0 };
    let nextInterval: number;
    if (repetitions === 0) nextInterval = 1;
    else if (repetitions === 1) nextInterval = 6;
    else nextInterval = Math.round(currentInterval * easinessFactor);
    const newEF = Math.max(SM2_MIN_EF, easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    return { intervalDays: nextInterval, easinessFactor: newEF, repetitions: repetitions + 1 };
  }

  getV1Interval(reviewNumber: number): number {
    const index = Math.min(reviewNumber, SPACED_REPETITION_INTERVALS.length - 1);
    return SPACED_REPETITION_INTERVALS[index];
  }
}
