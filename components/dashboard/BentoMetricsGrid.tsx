'use client';

import React, { useRef, useState } from 'react';
import { Target, Trophy, Flame, Code2, ArrowUpRight } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import manifest from '@/data/missions/manifest.json';
import { cn } from '@/lib/utils';

interface BentoCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent: 'emerald' | 'cyan' | 'amber' | 'purple';
  className?: string;
  children?: React.ReactNode;
}

const ACCENT_STYLES = {
  emerald: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    glow: 'rgba(16, 185, 129, 0.15)',
    borderHover: 'hover:border-emerald-500/40',
  },
  cyan: {
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    glow: 'rgba(6, 182, 212, 0.15)',
    borderHover: 'hover:border-cyan-500/40',
  },
  amber: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    glow: 'rgba(245, 158, 11, 0.15)',
    borderHover: 'hover:border-amber-500/40',
  },
  purple: {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    glow: 'rgba(168, 85, 247, 0.15)',
    borderHover: 'hover:border-purple-500/40',
  },
};

export function BentoCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
  className,
  children,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const currentAccent = ACCENT_STYLES[accent];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCoords(null)}
      className={cn(
        'relative rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-5 overflow-hidden group transition-all duration-300 backdrop-blur-xl',
        currentAccent.borderHover,
        className
      )}
    >
      {/* 21st.dev Cursor Spotlight Glow */}
      {coords && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${currentAccent.glow}, transparent 80%)`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-3">
          <div className={cn('p-2.5 rounded-xl border', currentAccent.badge)}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        <div>
          <div className="text-2xl font-black tracking-tight text-white mb-0.5 font-mono">
            {value}
          </div>
          <div className="text-sm font-semibold text-zinc-200">{title}</div>
          <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{subtitle}</div>
        </div>

        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
}

export function BentoMetricsGrid({ className }: { className?: string }) {
  const { progress, xpState, isClient } = useProgress();

  const totalMissions = manifest.missions.length;
  const completedMissionsCount = isClient
    ? Object.values(progress.missions).filter(m => m.status === 'complete').length
    : 0;

  const avgUnderstandingScore = isClient && completedMissionsCount > 0
    ? Math.round(
        Object.values(progress.missions).reduce((acc, m) => acc + (m.understandingScore || 0), 0) /
          completedMissionsCount
      )
    : 0;

  const streakDays = isClient ? progress.streak.current : 0;
  const totalXP = isClient ? progress.xp : 0;

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      <BentoCard
        title="বোধগম্যতা স্কোর"
        value={`${avgUnderstandingScore}%`}
        subtitle="কুইজ, ডিবাগ ও প্র্যাকটিস চ্যালেঞ্জের সম্মিলিত স্কোর"
        icon={Target}
        accent="emerald"
      />
      <BentoCard
        title="মোট অর্জিত XP"
        value={`${totalXP}`}
        subtitle={`লেভেল ${isClient ? xpState.level : 1} (${isClient ? xpState.levelName : 'ল্যাব শিক্ষার্থী'})`}
        icon={Trophy}
        accent="purple"
      />
      <BentoCard
        title="লার্নিং স্ট্রিক"
        value={`${streakDays} দিন`}
        subtitle="প্রতিদিনের কোড সমাধান ও ল্যাব প্র্যাকটিস"
        icon={Flame}
        accent="amber"
      />
      <BentoCard
        title="ল্যাব মিশন সমাপ্তি"
        value={`${completedMissionsCount} / ${totalMissions}`}
        subtitle={`কারিকুলামের ${Math.round((completedMissionsCount / totalMissions) * 100)}% সম্পন্ন হয়েছে`}
        icon={Code2}
        accent="cyan"
      />
    </div>
  );
}
