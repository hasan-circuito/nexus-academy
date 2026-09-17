'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/constants/app';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Info,
  Zap,
  Menu,
  X,
  Play,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useProgress } from '@/hooks/useProgress';

// ============================================================
// Icon registry — maps icon string names to Lucide components.
// Avoids dynamic imports. Scales fine for <20 nav items.
// ============================================================

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Info,
};

// ============================================================
// Sidebar Component
// ============================================================

export function Sidebar() {
  const pathname = usePathname();
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lastActiveMission, isClient } = useProgress();

  // Focus Mode: collapse desktop when inside a mission step
  const isMissionStep = /^\/mission\/\w+\/step\/\d+/.test(pathname);
  const isEffectivelyCollapsedDesktop = desktopCollapsed || isMissionStep;

  // Listen to mobile toggle events from TopNavbar or other components
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleOpen = () => setMobileOpen(true);
    const handleClose = () => setMobileOpen(false);

    window.addEventListener('nexus_toggle_sidebar', handleToggle);
    window.addEventListener('nexus_open_sidebar', handleOpen);
    window.addEventListener('nexus_close_sidebar', handleClose);

    return () => {
      window.removeEventListener('nexus_toggle_sidebar', handleToggle);
      window.removeEventListener('nexus_open_sidebar', handleOpen);
      window.removeEventListener('nexus_close_sidebar', handleClose);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'flex flex-col h-screen bg-sidebar-bg border-r border-sidebar-border',
          'transition-all duration-300 ease-out z-50',
          // Position: fixed drawer on mobile, relative flow on desktop
          'fixed top-0 bottom-0 left-0 lg:relative',
          // Mobile open/close transition:
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0',
          // Width: 280px on mobile drawer, responsive width on desktop
          isEffectivelyCollapsedDesktop
            ? 'w-[280px] lg:w-16'
            : 'w-[280px] lg:w-[260px]',
        )}
      >
        {/* Header / Logo area */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            {/* Show title on mobile OR when desktop is expanded */}
            <span
              className={cn(
                'text-sm font-semibold text-foreground tracking-tight',
                isEffectivelyCollapsedDesktop ? 'block lg:hidden' : 'block'
              )}
            >
              NEXUS Academy
            </span>
          </div>

          {/* Mobile close button (X) */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-foreground-faint hover:text-foreground hover:bg-sidebar-hover lg:hidden transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
          {isClient && lastActiveMission && (
            <Link
              href={lastActiveMission.url}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 mb-2 shadow-sm"
              title={`Resume Mission ${lastActiveMission.missionId}: Step ${lastActiveMission.stepIndex + 1}`}
            >
              <Play className="w-[18px] h-[18px] shrink-0 fill-primary text-primary" />
              <div className={cn(isEffectivelyCollapsedDesktop ? 'inline lg:hidden' : 'inline', 'flex flex-col min-w-0')}>
                <span className="truncate">Resume Mission {lastActiveMission.missionId}</span>
                <span className="text-[10px] font-normal text-muted-foreground truncate">
                  Step {lastActiveMission.stepIndex + 1} of {lastActiveMission.totalSteps}
                </span>
              </div>
            </Link>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-colors duration-200',
                  isActive
                    ? 'bg-sidebar-active text-primary'
                    : 'text-foreground-muted hover:bg-sidebar-hover hover:text-foreground',
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'w-[18px] h-[18px] shrink-0',
                      isActive ? 'text-primary' : 'text-foreground-faint',
                    )}
                  />
                )}
                {/* Always show label on mobile drawer, hide only when desktop is collapsed */}
                <span
                  className={cn(
                    isEffectivelyCollapsedDesktop ? 'inline lg:hidden' : 'inline'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex items-center justify-center p-3 border-t border-sidebar-border">
          <button
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="p-2 rounded-lg text-foreground-faint hover:text-foreground hover:bg-sidebar-hover transition-colors"
            aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {desktopCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
