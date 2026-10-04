'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MagneticUpvoteProps {
  count: number;
  hasUpvoted: boolean;
  onUpvote: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * 54px Magnetic Upvote Pod
 * Features spring-based physical magnetic deflection towards cursor and radiant active state.
 */
export function MagneticUpvote({
  count,
  hasUpvoted,
  onUpvote,
  className,
  disabled = false,
}: MagneticUpvoteProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Spring physics for magnetic displacement
  const springX = useSpring(0, { stiffness: 350, damping: 25 });
  const springY = useSpring(0, { stiffness: 350, damping: 25 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ref.current || disabled) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = (e.clientX - centerX) * 0.25;
      const distanceY = (e.clientY - centerY) * 0.25;
      springX.set(Math.max(-8, Math.min(8, distanceX)));
      springY.set(Math.max(-8, Math.min(8, distanceY)));
    },
    [disabled, springX, springY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    springX.set(0);
    springY.set(0);
  }, [springX, springY]);

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onUpvote();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'group relative flex flex-col items-center justify-center w-[54px] min-h-[58px] py-2 px-1 rounded-xl font-mono text-xs transition-all duration-200 select-none cursor-pointer',
        hasUpvoted
          ? 'bg-amber-500/15 border border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
          : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/90',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={`Upvote (${count})`}
    >
      {/* Upvote Arrow */}
      <motion.div
        animate={isHovered ? { y: -2 } : { y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <ChevronUp
          className={cn(
            'w-4 h-4 transition-colors',
            hasUpvoted ? 'text-amber-400 stroke-[2.5]' : 'text-zinc-400 group-hover:text-zinc-200'
          )}
        />
      </motion.div>

      {/* Upvote Count */}
      <span
        className={cn(
          'text-[12px] font-bold tracking-tight transition-colors mt-0.5',
          hasUpvoted ? 'text-amber-300 font-extrabold' : 'text-zinc-300 group-hover:text-white'
        )}
      >
        {count}
      </span>

      {/* Subtle bottom active indicator pip */}
      {hasUpvoted && (
        <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
      )}
    </motion.button>
  );
}
