// services/MissionProgressGate.ts
// NEXUS Academy — Mission Step Completion & Gate Verification Service

import { storage } from '@/services/LocalStorageDataService';
import type { MissionData } from '@/types/mission.types';

export interface IncompleteStepInfo {
  index: number;
  stepNumber: number;
  type: string;
  title: string;
  category: string;
}

export class MissionProgressGate {
  /**
   * Returns list of incomplete interactive steps (quiz, practice, debug) for a given mission.
   */
  public static getIncompleteSteps(missionData: MissionData): IncompleteStepInfo[] {
    if (typeof window === 'undefined') return [];

    const prog = storage.getProgress();
    const mp = prog.missions[missionData.id];
    const steps = (mp?.steps || {}) as Record<string, any>;

    const incomplete: IncompleteStepInfo[] = [];

    const practiceSteps = missionData.steps
      .map((step, index) => ({ step, index }))
      .filter((x) => x.step.type === 'practice');

    const debugSteps = missionData.steps
      .map((step, index) => ({ step, index }))
      .filter((x) => x.step.type === 'debug_challenge');

    const quizSteps = missionData.steps
      .map((step, index) => ({ step, index }))
      .filter((x) => x.step.type === 'quiz');

    // 1. Check Quiz Steps
    quizSteps.forEach(({ step, index }) => {
      const stepDone = steps[`step_${index}`]?.passed === true;
      const genericDone = steps['quiz']?.passed === true;
      const isDone = stepDone || genericDone;

      if (!isDone) {
        incomplete.push({
          index,
          stepNumber: index + 1,
          type: 'quiz',
          title: step.title || 'কুইজ মূল্যায়ন',
          category: 'কুইজ (Quiz)',
        });
      }
    });

    // 2. Check Practice Steps
    practiceSteps.forEach(({ step, index }) => {
      const stepDone = steps[`step_${index}`]?.passed === true;
      const stepTitleDone = steps[`practice_${step.title}`]?.passed === true;
      // If there's only 1 practice step in the mission, fallback to generic 'practice'
      const genericFallback = practiceSteps.length === 1 && steps['practice']?.passed === true;
      // If multiple practice steps exist, check if generic 'practice' was passed in legacy data
      const legacyPracticeDone = steps['practice']?.passed === true && Object.keys(steps).filter(k => k.startsWith('step_')).length === 0;

      const isDone = stepDone || stepTitleDone || genericFallback || legacyPracticeDone;

      if (!isDone) {
        incomplete.push({
          index,
          stepNumber: index + 1,
          type: 'practice',
          title: step.title,
          category: 'প্র্যাকটিস (Practice)',
        });
      }
    });

    // 3. Check Debug Challenge Steps
    debugSteps.forEach(({ step, index }) => {
      const stepDone = steps[`step_${index}`]?.passed === true;
      const stepTitleDone = steps[`debug_${step.title}`]?.passed === true;
      // If there's only 1 debug step in the mission, fallback to generic 'debug_challenge'
      const genericFallback = debugSteps.length === 1 && steps['debug_challenge']?.passed === true;
      // If multiple debug steps exist, check if generic 'debug_challenge' was passed in legacy data
      const legacyDebugDone = steps['debug_challenge']?.passed === true && Object.keys(steps).filter(k => k.startsWith('step_')).length === 0;

      const isDone = stepDone || stepTitleDone || genericFallback || legacyDebugDone;

      if (!isDone) {
        incomplete.push({
          index,
          stepNumber: index + 1,
          type: 'debug_challenge',
          title: step.title,
          category: 'ডিবাগ চ্যালেঞ্জ (Debug)',
        });
      }
    });

    return incomplete;
  }

  /**
   * Returns true if all required steps are completed.
   */
  public static canComplete(missionData: MissionData): boolean {
    return MissionProgressGate.getIncompleteSteps(missionData).length === 0;
  }
}
