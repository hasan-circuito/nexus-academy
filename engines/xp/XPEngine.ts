// engines/xp/XPEngine.ts
// NEXUS Academy — XP and Level-Up Engine
// Subscribes to MISSION_COMPLETED, awards XP, checks for level-ups, emits LEVEL_UP.

import type { DataService } from '@/services/DataService';
import { EventBus } from '@/engines/events/EventBus';
import type { MissionCompletedEvent } from '@/engines/events/events.types';
import { LEVEL_DEFINITIONS, MAX_LEVEL } from './xp.types';
import type { XPState } from './xp.types';

export class XPEngine {
  private dataService: DataService;
  private unsubscribers: Array<() => void> = [];

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

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
    const { xpEarned, timestamp } = event.payload;

    const progress = this.dataService.getProgress();
    if (!progress) return;

    const oldTotal = progress.xp;
    const oldState = this.computeXPState(oldTotal);

    progress.xp += xpEarned;
    const newState = this.computeXPState(progress.xp);
    progress.level = newState.level;

    // Add XP activity
    progress.activityHistory = progress.activityHistory || [];
    progress.activityHistory.unshift({
      id: Math.random().toString(36).substr(2, 9),
      type: 'xp_earned',
      message: `Earned ${xpEarned} XP`,
      timestamp,
      points: xpEarned,
    });
    if (progress.activityHistory.length > 50) progress.activityHistory.pop();

    // Check for level-up
    if (newState.level > oldState.level) {
      progress.activityHistory.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type: 'level_up',
        message: `Reached Level ${newState.level} (${newState.levelName})`,
        timestamp,
      });
      if (progress.activityHistory.length > 50) progress.activityHistory.pop();

      EventBus.emit({
        type: 'LEVEL_UP',
        payload: {
          previousLevel: oldState.level,
          newLevel: newState.level,
          newLevelName: newState.levelName,
          totalXP: progress.xp,
          timestamp,
        },
      });
    }

    this.dataService.saveProgress(progress);
  }

  computeXPState(totalXP: number): XPState {
    let level = 1;
    for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVEL_DEFINITIONS[i].xpRequired) {
        level = LEVEL_DEFINITIONS[i].level;
        break;
      }
    }
    level = Math.min(level, MAX_LEVEL);
    const levelDef = LEVEL_DEFINITIONS[level - 1];
    const nextLevelDef = LEVEL_DEFINITIONS[Math.min(level, MAX_LEVEL - 1)];
    const xpInCurrentLevel = totalXP - levelDef.xpRequired;
    const xpToNextLevel = level === MAX_LEVEL ? 0 : nextLevelDef.xpRequired - levelDef.xpRequired;
    const percentToNextLevel = level === MAX_LEVEL ? 100 : Math.min(100, Math.round((xpInCurrentLevel / xpToNextLevel) * 100));
    return { total: totalXP, level, levelName: levelDef.title, levelNameBangla: levelDef.banglaTitle, xpToNextLevel, xpInCurrentLevel, percentToNextLevel };
  }
}
