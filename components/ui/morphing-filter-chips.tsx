'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FilterChipItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface MorphingFilterChipsProps {
  items: readonly FilterChipItem[] | FilterChipItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  layoutId?: string;
}

/**
 * Morphing Filter Chips
 * Liquid-sliding tab switcher utilizing Framer Motion's layoutId for fluid active-state animation.
 */
export function MorphingFilterChips({
  items,
  activeId,
  onChange,
  className,
  layoutId = 'morphing-pill',
}: MorphingFilterChipsProps) {
  return (
    <div
      className={cn(
        'relative flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md',
        className
      )}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors select-none cursor-pointer',
              isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.2 rounded-full',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-zinc-800/80 text-zinc-400'
                )}
              >
                {item.count}
              </span>
            )}

            {/* Sliding Fluid Indicator Pill */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                className="absolute inset-0 -z-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
