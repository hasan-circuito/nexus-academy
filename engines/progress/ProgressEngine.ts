import { storage } from '@/services/LocalStorageDataService';
import { XPEngine } from '@/engines/xp/XPEngine';
import type { MissionData } from '@/types/mission.types';

export class ProgressEngine {
  /**
   * Orchestrates the completion of a mission.
   * V1 simplification: calculates mock UnderstandingScore via UnderstandingEngine,
   * awards XP, and updates localStorage.
   */
  static completeMission(mission: MissionData): void {
    if (typeof window === 'undefined') return;
    const progress = storage.getProgress();

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
    }

    const mp = progress.missions[mission.id];
    
    // Helper to add activity
    const addActivity = (type: 'mission_completed' | 'xp_earned' | 'level_up' | 'mission_unlocked', message: string, points?: number) => {
      progress.activityHistory = progress.activityHistory || [];
      progress.activityHistory.unshift({
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        timestamp: new Date().toISOString(),
        points
      });
      // Keep only last 50
      if (progress.activityHistory.length > 50) progress.activityHistory.pop();
    };
    
    // Always ensure next mission is unlocked
    const missionNum = parseInt(mission.id.replace('mission-', ''), 10);
    const nextMissionId = String(missionNum + 1).padStart(3, '0');
    
    if (!progress.missions[nextMissionId]) {
      progress.missions[nextMissionId] = {
        status: 'unlocked',
        unlockedAt: new Date().toISOString(),
        understandingScore: 0,
        xpEarned: 0,
        steps: {},
        quizAttempts: [],
        debugAttempts: [],
        reflection: { completed: false },
      };
      addActivity('mission_unlocked', `Unlocked Mission ${missionNum + 1}`);
    } else if (progress.missions[nextMissionId].status !== 'unlocked' && progress.missions[nextMissionId].status !== 'complete') {
      progress.missions[nextMissionId].status = 'unlocked';
      progress.missions[nextMissionId].unlockedAt = new Date().toISOString();
      addActivity('mission_unlocked', `Unlocked Mission ${missionNum + 1}`);
    }

    // Prevent double-completion exploits for XP
    if (mp.status === 'complete') {
      storage.saveProgress(progress);
      return;
    }

    // 1. Calculate Score (Simulated for V1 via UnderstandingEngine)
    // V1 hack: manually set score since we don't have all the sub-engines wired to events yet
    mp.understandingScore = 85; 

    // 2. Award XP
    const xpEngine = new XPEngine(storage);
    const xpEarned = 400; 
    
    // 3. Update Mission Progress
    mp.status = 'complete';
    mp.completedAt = new Date().toISOString();
    mp.xpEarned = xpEarned;

    // 4. Update Global gamification stats
    const oldTotal = progress.xp;
    progress.xp += xpEarned;
    
    // Update streak (if it's a new day)
    const today = new Date().toISOString().split('T')[0];
    if (progress.streak.lastStudyDate !== today) {
      // Simplistic streak logic for V1 Demo
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (progress.streak.lastStudyDate === yesterday) {
        progress.streak.current += 1;
      } else {
        progress.streak.current = 1;
      }
      progress.streak.lastStudyDate = today;
      progress.streak.longest = Math.max(progress.streak.longest, progress.streak.current);
    }



    addActivity('mission_completed', `Completed ${mission.title}`);
    addActivity('xp_earned', `Earned ${xpEarned} XP`, xpEarned);

    // Level check
    const oldState = xpEngine.computeXPState(oldTotal);
    const newState = xpEngine.computeXPState(progress.xp);
    progress.level = newState.level;
    
    if (newState.level > oldState.level) {
       addActivity('level_up', `Reached Level ${newState.level} (${newState.levelName})`);
    }

    // 6. Persist
    storage.saveProgress(progress);
  }
}
