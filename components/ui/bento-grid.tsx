'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BorderBeam } from '@/components/ui/border-beam';

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className,
  title,
  subtitle,
  header,
  icon,
  badge,
  hasBeam = false,
  children,
}: {
  className?: string;
  title: string;
  subtitle: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  hasBeam?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface p-5 sm:p-6',
        'flex flex-col justify-between transition-colors hover:border-emerald-500/30 hover:bg-surface-elevated/70 shadow-sm',
        className
      )}
    >
      {/* Optional traveling laser border beam */}
      {hasBeam && <BorderBeam duration={7} colorFrom="#10b981" colorTo="#06b6d4" />}

      {/* Top Graphic Header */}
      {header && <div className="mb-4 overflow-hidden rounded-xl">{header}</div>}

      {/* Main Content */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between gap-2">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              {icon}
            </div>
          )}
          {badge && (
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-muted-foreground">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-foreground font-bangla-ui tracking-tight group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground font-bangla leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Extra child content */}
      {children && <div className="mt-4 relative z-10">{children}</div>}
    </motion.div>
  );
}
