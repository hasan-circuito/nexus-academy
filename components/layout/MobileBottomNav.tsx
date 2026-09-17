// components/layout/MobileBottomNav.tsx
// NEXUS Academy — Sleek Mobile Bottom Navigation Bar
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, BarChart3, Settings, Play, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgress } from '@/hooks/useProgress';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BOTTOM_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Dictionary', href: '/dictionary', icon: BookOpen },
  { label: 'Progress', href: '/progress', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { lastActiveMission, isClient } = useProgress();

  // Hide in mission pages to preserve focus mode
  if (pathname.startsWith('/mission')) {
    return null;
  }

  return (
    <>
      {/* Quick Resume floating mini-bar on mobile */}
      {isClient && lastActiveMission && (
        <div className="fixed bottom-16 left-0 right-0 z-30 px-4 py-2 bg-card/95 backdrop-blur-md border-t border-primary/30 lg:hidden flex items-center justify-between shadow-lg animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="text-xs truncate">
              <span className="font-bold text-foreground">Mission {lastActiveMission.missionId}</span>
              <span className="text-muted-foreground ml-1.5 font-mono text-[11px]">
                Step {lastActiveMission.stepIndex + 1}/{lastActiveMission.totalSteps}
              </span>
            </div>
          </div>
          <Link
            href={lastActiveMission.url}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-sm transition-colors"
          >
            <span>Resume</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 h-16 bg-surface/90 backdrop-blur-lg border-t border-border/80 px-2 flex items-center justify-around lg:hidden transition-all duration-300"
      >
      {BOTTOM_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href)) ||
          (item.href === '/dashboard' && (pathname === '/' || pathname === '/dashboard'));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all duration-200 select-none',
              isActive
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground active:scale-95'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center w-9 h-7 rounded-full transition-colors duration-200',
                isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-105')} />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}
      </nav>
    </>
  );
}
