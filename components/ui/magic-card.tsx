'use client';

import React, { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * Magic UI Signature Magic Card
 * Features an interactive radial specular spotlight following cursor on borders and surface.
 */
export function MagicCard({
  children,
  className,
  gradientSize = 250,
  gradientColor = 'rgba(6, 182, 212, 0.15)',
  gradientOpacity = 0.8,
  ...props
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--spotlight-opacity', `${gradientOpacity}`);
  }, [gradientOpacity]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--spotlight-opacity', '0');
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          '--spotlight-size': `${gradientSize}px`,
          '--spotlight-color': gradientColor,
          '--spotlight-opacity': '0',
        } as React.CSSProperties
      }
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-5 backdrop-blur-xl transition-all duration-300',
        'hover:border-zinc-700/80 hover:shadow-[0_0_25px_rgba(6,182,212,0.08)]',
        className
      )}
      {...props}
    >
      {/* Specular Spotlight Halo */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-[var(--spotlight-opacity)] transition-opacity duration-300 ease-out"
        style={{
          background: `radial-gradient(var(--spotlight-size) circle at var(--mouse-x, 0px) var(--mouse-y, 0px), var(--spotlight-color), transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Surface content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
