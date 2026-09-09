// engines/knowledge-graph/KnowledgeGraphService.ts
// NEXUS Academy — Knowledge Graph & Mission Unlock Engine
// Subscribes to MISSION_COMPLETED and unlocks the next sequential mission.

import type { DataService } from '@/services/DataService';
import { EventBus } from '@/engines/events/EventBus';
import type { MissionCompletedEvent } from '@/engines/events/events.types';

export class KnowledgeGraphService {
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

    const progress = this.dataService.getProgress();
    if (!progress) return;

    // missionId is a zero-padded string like '001', '002'
    const missionNum = parseInt(missionId, 10);
    const nextMissionId = String(missionNum + 1).padStart(3, '0');

    const already = progress.missions[nextMissionId];
    if (!already) {
      // Create new unlocked mission progress
      progress.missions[nextMissionId] = {
        status: 'unlocked',
        unlockedAt: timestamp,
        understandingScore: 0,
        xpEarned: 0,
        steps: {},
        quizAttempts: [],
        debugAttempts: [],
        reflection: { completed: false },
      };
      this.addUnlockActivity(progress, nextMissionId, missionNum, timestamp);
      this.emitUnlocked(missionId, nextMissionId, timestamp);
    } else if (already.status !== 'unlocked' && already.status !== 'complete') {
      already.status = 'unlocked';
      already.unlockedAt = timestamp;
      this.addUnlockActivity(progress, nextMissionId, missionNum, timestamp);
      this.emitUnlocked(missionId, nextMissionId, timestamp);
    }

    this.dataService.saveProgress(progress);
  }

  private addUnlockActivity(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progress: any,
    nextMissionId: string,
    missionNum: number,
    timestamp: string
  ): void {
    progress.activityHistory = progress.activityHistory || [];
    progress.activityHistory.unshift({
      id: Math.random().toString(36).substr(2, 9),
      type: 'mission_unlocked',
      message: `Unlocked Mission ${missionNum + 1}`,
      timestamp,
    });
    if (progress.activityHistory.length > 50) progress.activityHistory.pop();
    void nextMissionId;
  }

  private emitUnlocked(missionId: string, nextMissionId: string, timestamp: string): void {
    EventBus.emit({
      type: 'MISSION_UNLOCKED',
      payload: {
        missionId: nextMissionId,
        unlockedByMissionId: missionId,
        timestamp,
      },
    });
  }
}
