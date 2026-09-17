'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { storage } from '@/services/LocalStorageDataService';
import { getMissionStepCount } from '@/services/ContentService';
import { Loader2 } from 'lucide-react';

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const rawMissionId = (params?.missionId as string) || '';

  useEffect(() => {
    if (!rawMissionId) return;

    // Retrieve saved active step index (backed by currentStepIndex with step history fallback)
    const activeStep = storage.getActiveStep(rawMissionId);
    const totalSteps = getMissionStepCount(rawMissionId);
    const targetStep = Math.min(Math.max(0, activeStep), Math.max(0, totalSteps - 1));

    router.replace(`/mission/${rawMissionId}/step/${targetStep}`);
  }, [rawMissionId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Resuming mission...</p>
    </div>
  );
}
