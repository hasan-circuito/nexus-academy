'use client';

// components/ui/heatmap-chart-demo.tsx
import React from 'react';
import { HeatmapChart } from '@/components/ui/heatmaps';

const DemoHeatmapChart = () => {
  const width = 800;
  const height = 500;

  return (
    <div className="flex w-full justify-center items-center bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
      <HeatmapChart width={width} height={height} events={true} />
    </div>
  );
};

export { DemoHeatmapChart };
