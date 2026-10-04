'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Terminal, Activity, Sparkles, Layers } from 'lucide-react';
import { HeatmapChart } from '@/components/ui/heatmaps';
import { useProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

export function ActivityHeatmap({ className }: { className?: string }) {
  const { progress } = useProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 500,
    height: 240,
  });

  // Responsive width detection
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        // Keep responsive aspect ratio
        const responsiveWidth = Math.max(300, clientWidth);
        const responsiveHeight = Math.max(220, Math.min(280, Math.round(responsiveWidth * 0.5)));
        setDimensions({ width: responsiveWidth, height: responsiveHeight });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl relative overflow-hidden shadow-xl',
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
              <span>ল্যাব কোড এক্সিকিউশন ও অ্যাক্টিভিটি হিটম্যাপ</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-cyan-400 border border-zinc-700">
                visx/heatmap
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              সার্কেল ও রেক্ট্যাংগুলার বাইনারি ডেটা ম্যাট্রিক্স (21st.dev Visx Engine)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 self-start sm:self-auto font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f33d15] shadow-[0_0_6px_#f33d15]" />
            <span className="text-[11px] text-zinc-300">ইনটেনসিটি (হট)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#b4fbde] shadow-[0_0_6px_#b4fbde]" />
            <span className="text-[11px] text-zinc-300">কুল স্পেকট্রাম</span>
          </span>
        </div>
      </div>

      {/* Visx Heatmap Container */}
      <div ref={containerRef} className="w-full flex justify-center items-center overflow-hidden rounded-xl">
        <HeatmapChart
          width={dimensions.width}
          height={dimensions.height}
          events={true}
          margin={{ top: 12, left: 16, right: 16, bottom: 12 }}
          separation={16}
        />
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 gap-2">
        <span className="text-zinc-400 text-[11px] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          যে কোনো সার্কেল বা রেক্ট্যাংগেলে ক্লিক করে ইন্টারঅ্যাক্টিভ সেল ডেটা দেখুন
        </span>

        <span className="font-mono text-[11px] text-zinc-400">
          স্ট্রিক: {progress?.streak?.current || 0} দিন • WASM 0ms
        </span>
      </div>
    </div>
  );
}
