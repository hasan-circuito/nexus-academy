'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  strokeColor?: string;
}

/**
 * Magic UI Signature Orbiting Circles
 * Concentric orbital planetary paths that rotate icons / skill telemetry smoothly around a center core.
 */
export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 80,
  path = true,
  strokeColor = 'rgba(255, 255, 255, 0.08)',
}: OrbitingCirclesProps) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeDasharray="4 4"
          />
        </svg>
      )}

      <div
        style={
          {
            '--duration': `${duration}s`,
            '--radius': `${radius}px`,
            '--delay': `-${delay}s`,
            '--direction': reverse ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
        className={cn(
          'absolute flex size-full items-center justify-center rounded-full animate-orbit',
          className
        )}
      >
        <div
          style={{
            transform: `translate(calc(var(--radius) * 1), 0)`,
          }}
          className="flex items-center justify-center"
        >
          {children}
        </div>
      </div>
    </>
  );
}
