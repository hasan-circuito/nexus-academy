import type { MissionData, MissionIndexEntry } from '@/types/mission.types';
import mission001 from '@/data/missions/mission-001.json';
import mission002 from '@/data/missions/mission-002.json';
import mission003 from '@/data/missions/mission-003.json';
import mission004 from '@/data/missions/mission-004.json';
import mission005 from '@/data/missions/mission-005.json';
import mission006 from '@/data/missions/mission-006.json';
import mission007 from '@/data/missions/mission-007.json';
import mission008 from '@/data/missions/mission-008.json';
import mission009 from '@/data/missions/mission-009.json';
import mission010 from '@/data/missions/mission-010.json';
import mission011 from '@/data/missions/mission-011.json';
import mission012 from '@/data/missions/mission-012.json';

const missions: Record<string, MissionData> = {
  '001': mission001 as MissionData,
  '002': mission002 as MissionData,
  '003': mission003 as MissionData,
  '004': mission004 as MissionData,
  '005': mission005 as MissionData,
  '006': mission006 as MissionData,
  '007': mission007 as MissionData,
  '008': mission008 as MissionData,
  '009': mission009 as MissionData,
  '010': mission010 as MissionData,
  '011': mission011 as MissionData,
  '012': mission012 as MissionData,
};

export async function getMissionIndex(): Promise<MissionIndexEntry[]> {
  const res = await import('@/data/missions/index.json');
  return res.default as unknown as MissionIndexEntry[];
}

export async function getMissionData(missionId: string): Promise<MissionData> {
  const id = missionId.replace('mission-', '');
  console.log('[ContentService] getMissionData called with:', missionId, '-> id:', id);
  console.log('[ContentService] missions keys:', Object.keys(missions));
  let data = missions[id];

  if (!data) {
    try {
      const dynamicModule = await import(`@/data/missions/mission-${id}.json`);
      data = (dynamicModule.default || dynamicModule) as MissionData;
    } catch {
      throw new Error(`[ContentService] Failed to load mission ${missionId}`);
    }
  }

  console.log('[ContentService] data for id:', data ? 'FOUND' : 'NOT FOUND');
  if (!data) {
    throw new Error(`[ContentService] Failed to load mission ${missionId}`);
  }
  
  // Handle case where json is imported as module with default export
  if (data && (data as any).default) {
    console.log('[ContentService] unwrapping .default');
    return (data as any).default as MissionData;
  }
  
  return data as unknown as MissionData;
}
