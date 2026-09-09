// engines/init.ts
// NEXUS Academy — Central Engine Bootstrapper
//
// Call initEngines() once at app startup (client-side only).
// Subsequent calls are no-ops (guarded by isInitialized flag).

import { storage } from '@/services/LocalStorageDataService';
import type { DataService } from '@/services/DataService';
import { UnderstandingEngine } from './understanding/UnderstandingEngine';
import { XPEngine } from './xp/XPEngine';
import { ProgressEngine } from './progress/ProgressEngine';
import { KnowledgeGraphService } from './knowledge-graph/KnowledgeGraphService';
import { SpacedRepetitionService } from './retention/SpacedRepetitionService';
import { LearningMemoryService } from './memory/LearningMemoryService';
import { AchievementService } from './achievements/AchievementService';

let isInitialized = false;
let engines: { destroy: () => void }[] = [];

export function initEngines(dataService: DataService = storage): void {
  if (typeof window === 'undefined') return; // SSR guard
  if (isInitialized) return;
  isInitialized = true;

  const understandingEngine = new UnderstandingEngine(dataService);
  const xpEngine = new XPEngine(dataService);
  const progressEngine = new ProgressEngine(dataService);
  const knowledgeGraph = new KnowledgeGraphService(dataService);
  const srs = new SpacedRepetitionService(dataService);
  const memory = new LearningMemoryService(dataService);
  const achievements = new AchievementService(dataService);

  [understandingEngine, xpEngine, progressEngine, knowledgeGraph, srs, memory, achievements].forEach(e => e.init());

  engines = [understandingEngine, xpEngine, progressEngine, knowledgeGraph, srs, memory, achievements];
}

export function destroyEngines(): void {
  engines.forEach(e => e.destroy());
  engines = [];
  isInitialized = false;
}
