// components/layout/MobileBottomNav.tsx
// NEXUS Academy — Sleek Mobile Bottom Navigation Bar
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Hide in mission pages to preserve focus mode
  if (pathname.startsWith('/mission')) {
    return null;
  }

  return (
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
  );
}
