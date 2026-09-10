'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMissionData } from '@/services/ContentService';

export function MissionHeader() {
  const pathname = usePathname();
  const params = useParams();
  const [totalSteps, setTotalSteps] = useState(13); // default until loaded

  // Extract step index from URL
  const match = pathname.match(/step\/(\d+)/);
  const stepIndex = match ? parseInt(match[1], 10) : 0;

  // Load actual step count from mission data
  useEffect(() => {
    const missionId = params?.missionId as string;
    if (missionId) {
      getMissionData(missionId)
        .then(data => setTotalSteps(data.steps.length))
        .catch(() => setTotalSteps(13));
    }
  }, [params?.missionId]);

  const progressPercent = totalSteps > 0
    ? Math.min(100, Math.max(0, ((stepIndex + 1) / totalSteps) * 100))
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex-1" />
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="flex justify-between w-full max-w-sm text-xs font-medium text-muted-foreground">
            <span>Step {stepIndex + 1} of {totalSteps}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full max-w-sm h-1.5 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="flex-1 flex justify-end items-center gap-2">
          <Link
            href="/dashboard"
            className="p-2 rounded-full hover:bg-surface-hover text-muted-foreground transition-colors"
            aria-label="Save and Exit Mission"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
