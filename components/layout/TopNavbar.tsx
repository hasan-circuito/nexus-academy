'use client';

import { usePathname } from 'next/navigation';
import { Volume2, VolumeX, Flame, Star } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useProgress } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

export function TopNavbar() {
  const pathname = usePathname();
  const { settings, updateSettings, isClient } = useSettings();
  const { progress } = useProgress();

  // Hide in mission pages to preserve focus mode (MissionHeader is used there instead)
  const isMission = pathname.startsWith('/mission');
  if (isMission) {
    return null;
  }

  // Get active section name
  const getPageTitle = () => {
    if (pathname === '/' || pathname === '/dashboard') return { title: 'Dashboard', bangla: 'ড্যাশবোর্ড' };
    if (pathname.startsWith('/progress')) return { title: 'Learning Journey', bangla: 'শেখার অগ্রগতি' };
    if (pathname.startsWith('/dictionary')) return { title: 'Problem Solving Hub', bangla: 'কনসেপ্ট ও প্রবলেম সলভিং' };
    if (pathname.startsWith('/settings')) return { title: 'Settings & Appearance', bangla: 'সেটিংস ও থিম' };
    if (pathname.startsWith('/about')) return { title: 'About NEXUS', bangla: 'সম্পর্কে' };
    if (pathname.startsWith('/debug')) return { title: 'Debug Lab', bangla: 'ডিবাগ ল্যাব' };
    if (pathname.startsWith('/mission')) return { title: 'Mission Overview', bangla: 'মিশন ওভারভিউ' };
    return { title: 'NEXUS Academy', bangla: 'নেক্সাস একাডেমি' };
  };

  const { title, bangla } = getPageTitle();

  const handleToggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  return (
    <header className="sticky top-0 z-30 w-full h-14 bg-surface/80 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 flex items-center justify-between transition-colors duration-300">
      {/* Left: Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground tracking-tight">{title}</span>
            <span className="hidden sm:inline-block text-xs text-muted-foreground font-bangla">
              ({bangla})
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Controls & Theme Switcher */}
      <div className="flex items-center gap-2.5">
        {/* XP / Streak Status badge */}
        {isClient && (
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-xs">
            <div className="flex items-center gap-1 text-xp font-medium">
              <Star className="w-3.5 h-3.5 fill-xp" />
              <span>{progress.xp} XP</span>
            </div>
            {progress?.streak?.current > 0 && (
              <>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1 text-amber-500 font-medium">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{progress.streak.current}d</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover border border-border/60 transition-colors"
          title={settings.soundEnabled ? 'Mute audio' : 'Enable audio'}
          aria-label={settings.soundEnabled ? 'Mute audio' : 'Enable audio'}
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-primary" />
          ) : (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </header>
  );
}
