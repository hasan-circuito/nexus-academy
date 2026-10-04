'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  strokeWidth?: number;
}

/**
 * Magic UI Signature Border Beam
 * A traveling laser packet orbiting the perimeter of a card.
 */
export function BorderBeam({
  className,
  duration = 8,
  colorFrom = '#10b981', // Emerald glow
  colorTo = '#06b6d4',   // Cyan beam
  strokeWidth = 2,
}: BorderBeamProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden', className)}>
      <svg
        className="w-full h-full absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="50%" stopColor={colorTo} stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="15"
          fill="none"
          stroke="url(#beam-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray="160 800"
          initial={{ strokeDashoffset: 960 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>
    </div>
  );
}
