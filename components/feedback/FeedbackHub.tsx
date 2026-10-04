'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Terminal,
  Cpu,
  Database,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Send,
  Lock,
  Unlock,
  GitPullRequest,
  Activity,
  Filter,
  Search,
  CornerDownRight,
  Radio,
  MessageSquareCode,
  Download,
  Plus,
  X,
  ExternalLink,
  Crosshair,
  Wrench,
  Shield,
  Sliders,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { useProgress } from '@/hooks/useProgress';
import { feedbackService } from '@/services/FeedbackService';
import { getMissionStepCount } from '@/services/ContentService';
import missionsIndex from '@/data/missions/index.json';
import {
  type CreatorDirective,
  type FeedbackCategory,
  type FeedbackImpact,
  type FeedbackItem,
  type FeedbackStatus,
  type FeedbackSyncStatus,
  CREATOR_QUICK_REPLIES,
  FEEDBACK_CATEGORY_META,
  FEEDBACK_IMPACT_META,
  FEEDBACK_STATUS_META,
} from '@/types/feedback.types';

// ============================================================
// Custom Zero-Emoji SVG Signal & Schematic Components
// ============================================================

function SignalWaveSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-14 h-4 text-primary', className)}
      aria-hidden="true"
    >
      <path
        d="M2 10H12L16 3L22 17L28 6L33 14L37 10H46L50 4L55 15L59 10H62"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusPulseDot({ status }: { status: FeedbackStatus }) {
  const colorMap: Record<FeedbackStatus, { dot: string; ring: string }> = {
    in_progress: {
      dot: 'bg-warning',
      ring: 'bg-warning/40',
    },
    resolved: {
      dot: 'bg-success',
      ring: 'bg-success/40',
    },
    planned: {
      dot: 'bg-info',
      ring: 'bg-info/40',
    },
    open: {
      dot: 'bg-primary',
      ring: 'bg-primary/40',
    },
  };

  const colors = colorMap[status] || colorMap.open;

  return (
    <span className="relative inline-flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
      <span
        className={cn(
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          colors.ring
        )}
      />
      <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', colors.dot)} />
    </span>
  );
}

function CategoryVectorIcon({
  category,
  className,
}: {
  category: FeedbackCategory;
  className?: string;
}) {
  if (category === 'improve') return <Sliders className={cn('w-4 h-4', className)} />;
  if (category === 'problem') return <Crosshair className={cn('w-4 h-4', className)} />;
  return <MessageSquareCode className={cn('w-4 h-4', className)} />;
}

function StatusVectorIcon({
  status,
  className,
}: {
  status: FeedbackStatus;
  className?: string;
}) {
  if (status === 'in_progress') return <Wrench className={cn('w-3.5 h-3.5', className)} />;
  if (status === 'resolved') return <CheckCircle2 className={cn('w-3.5 h-3.5', className)} />;
  if (status === 'planned') return <Compass className={cn('w-3.5 h-3.5', className)} />;
  return <Clock className={cn('w-3.5 h-3.5', className)} />;
}

function formatRelativeDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

// ============================================================
// Main Feedback & Telemetry Hub Component
// ============================================================

export function FeedbackHub() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const { progress, isClient } = useProgress();

  // Parse initial URL query params for Mission & Step context
  const initialMissionParam = searchParams.get('mission');
  const initialStepParam = searchParams.get('step');
  const initialCategoryParam = searchParams.get('category');

  const resolvedInitialMissionId = useMemo(() => {
    if (!initialMissionParam) return '';
    const normalized = initialMissionParam.replace(/^mission-/i, '').padStart(3, '0');
    return missionsIndex.some((m) => m.id === normalized) ? normalized : '';
  }, [initialMissionParam]);

  const resolvedInitialStepNumber = useMemo(() => {
    if (!initialStepParam) return '';
    const num = parseInt(initialStepParam, 10);
    const maxForMission = resolvedInitialMissionId
      ? getMissionStepCount(resolvedInitialMissionId)
      : 20;
    return !isNaN(num) && num >= 1 && num <= maxForMission ? String(num) : '';
  }, [initialStepParam, resolvedInitialMissionId]);

  const resolvedInitialCategory = useMemo<FeedbackCategory>(() => {
    if (
      initialCategoryParam === 'improve' ||
      initialCategoryParam === 'problem' ||
      initialCategoryParam === 'feedback'
    ) {
      return initialCategoryParam;
    }
    return resolvedInitialMissionId ? 'problem' : 'improve';
  }, [initialCategoryParam, resolvedInitialMissionId]);

  // Core Data State
  const [items, setItems] = useState<FeedbackItem[]>(() => feedbackService.getItems());
  const [directives, setDirectives] = useState<CreatorDirective[]>(() =>
    feedbackService.getDirectives()
  );
  const [resonatedIds, setResonatedIds] = useState<string[]>(() =>
    feedbackService.getResonatedIds()
  );
  const [pollVotes, setPollVotes] = useState<Record<string, string>>(() =>
    feedbackService.getPollVotes()
  );
  const [syncStatus, setSyncStatus] = useState<FeedbackSyncStatus>({
    cloudConfigured: false,
    repo: 'hasan-circuito/nexus-academy',
    lastSyncedAt: new Date().toISOString(),
    mode: 'HYBRID_LOCAL_PERSISTENCE',
  });

  // Creator Console State
  const [creatorUnlockedFlag, setCreatorUnlockedFlag] = useState<boolean>(() =>
    feedbackService.isCreatorUnlocked(false)
  );
  const creatorUnlocked = creatorUnlockedFlag || settings.devModeUnlocked;
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // New Directive Composer State (Creator Mode)
  const [showDirectiveComposer, setShowDirectiveComposer] = useState(false);
  const [dirTitle, setDirTitle] = useState('');
  const [dirContent, setDirContent] = useState('');
  const [dirTag, setDirTag] = useState('[DIRECTIVE // PLATFORM_UPDATE]');

  // Feedback Composer State
  const [category, setCategory] = useState<FeedbackCategory>(resolvedInitialCategory);
  const [impact, setImpact] = useState<FeedbackImpact>('standard');
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedMissionId, setSelectedMissionId] = useState<string>(resolvedInitialMissionId);
  const [selectedStepNumber, setSelectedStepNumber] = useState<string>(resolvedInitialStepNumber);
  const [attachTelemetry, setAttachTelemetry] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'idle' | 'submitting' | 'success' | 'error';
    text: string;
  }>({ type: 'idle', text: '' });

  // Sync composer state if URL query params change via client navigation
  const searchContextKey = `${resolvedInitialMissionId}:${resolvedInitialStepNumber}:${initialCategoryParam || ''}`;
  const [prevSearchContextKey, setPrevSearchContextKey] = useState(searchContextKey);
  if (prevSearchContextKey !== searchContextKey) {
    setPrevSearchContextKey(searchContextKey);
    setSelectedMissionId(resolvedInitialMissionId);
    setSelectedStepNumber(resolvedInitialStepNumber);
    setCategory(resolvedInitialCategory);
  }

  const availableStepCount = useMemo(
    () => (selectedMissionId ? getMissionStepCount(selectedMissionId) : 20),
    [selectedMissionId]
  );

  // Board Filter & Sort State
  const [filterCategory, setFilterCategory] = useState<'all' | FeedbackCategory>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | FeedbackStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'resonances' | 'newest'>('resonances');

  // In-Card Creator Reply State: { [feedbackId]: { open, text, status } }
  const [activeReplyCardId, setActiveReplyCardId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyStatusMap, setReplyStatusMap] = useState<Record<string, FeedbackStatus>>({});

  // Hydrate client data on external storage events & sync with API
  const refreshAll = useCallback(() => {
    setItems(feedbackService.getItems());
    setDirectives(feedbackService.getDirectives());
    setResonatedIds(feedbackService.getResonatedIds());
    setPollVotes(feedbackService.getPollVotes());
    setCreatorUnlockedFlag(feedbackService.isCreatorUnlocked(false));
  }, []);

  useEffect(() => {
    let active = true;
    feedbackService.syncWithCloud().then((res) => {
      if (!active) return;
      setItems(res.items);
      setDirectives(res.directives);
      setSyncStatus(res.syncStatus);
      setResonatedIds(feedbackService.getResonatedIds());
      setPollVotes(feedbackService.getPollVotes());
      setCreatorUnlockedFlag(feedbackService.isCreatorUnlocked(false));
    });

    const handleUpdate = () => refreshAll();
    window.addEventListener('nexus_feedback_update', handleUpdate);
    return () => {
      active = false;
      window.removeEventListener('nexus_feedback_update', handleUpdate);
    };
  }, [refreshAll]);

  // Telemetry Summary Counters
  const metrics = useMemo(() => {
    const total = items.length;
    const inProgress = items.filter((i) => i.status === 'in_progress').length;
    const resolved = items.filter((i) => i.status === 'resolved').length;
    const planned = items.filter((i) => i.status === 'planned').length;
    const totalResonances = items.reduce((acc, i) => acc + (i.resonances || 0), 0);
    return { total, inProgress, resolved, planned, totalResonances };
  }, [items]);

  // Filtered and Sorted Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (filterCategory !== 'all' && item.category !== filterCategory) return false;
        if (filterStatus !== 'all' && item.status !== filterStatus) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchMsg = item.message.toLowerCase().includes(q);
          const matchAuthor = item.authorName.toLowerCase().includes(q);
          const matchCode = item.code.toLowerCase().includes(q);
          const matchMission = item.telemetry?.missionId?.toLowerCase().includes(q);
          return matchTitle || matchMsg || matchAuthor || matchCode || matchMission;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'resonances') {
          if (b.resonances !== a.resonances) return b.resonances - a.resonances;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [items, filterCategory, filterStatus, searchQuery, sortBy]);

  // Handlers
  const handleUnlockCreator = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = feedbackService.unlockCreatorConsole(pinInput);
    if (ok) {
      setCreatorUnlockedFlag(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('ভুল পিন কোড। নির্মাতা পিন (2441) অথবা ডেভেলপার পিন দিন।');
    }
  };

  const handleLockCreator = () => {
    feedbackService.lockCreatorConsole();
    setCreatorUnlockedFlag(false);
  };

  const handleVotePoll = (directiveId: string, pollId: string, optionId: string) => {
    const res = feedbackService.voteOnPoll(directiveId, pollId, optionId);
    setDirectives(res.directives);
    setPollVotes(res.pollVotes);
  };

  const handleCreateDirective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirTitle.trim() || !dirContent.trim()) return;
    const updated = await feedbackService.createDirective({
      title: dirTitle,
      content: dirContent,
      tag: dirTag,
      pinned: true,
    });
    setDirectives(updated);
    setDirTitle('');
    setDirContent('');
    setShowDirectiveComposer(false);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: 'submitting', text: 'টেলিমেট্রি ডেটা সংরক্ষণ করা হচ্ছে...' });

    try {
      const missionObj = missionsIndex.find((m) => m.id === selectedMissionId);
      const stepNum = selectedStepNumber ? parseInt(selectedStepNumber, 10) : undefined;

      const telemetry =
        attachTelemetry || selectedMissionId
          ? {
              missionId: selectedMissionId || undefined,
              missionTitle: missionObj ? missionObj.title : undefined,
              stepNumber: stepNum && !isNaN(stepNum) ? stepNum : undefined,
              theme: settings.theme,
              learnerXp: isClient ? progress.xp : undefined,
              learnerLevel: isClient ? progress.level : undefined,
            }
          : undefined;

      const created = await feedbackService.submitFeedback({
        category,
        impact,
        authorName,
        title,
        message,
        telemetry,
      });

      setItems(feedbackService.getItems());
      setResonatedIds(feedbackService.getResonatedIds());
      setTitle('');
      setMessage('');
      setSubmitStatus({
        type: 'success',
        text: `[${created.code}] তোমার মতামত সফলভাবে ফিডব্যাক বোর্ডে যুক্ত হয়েছে!`,
      });

      setTimeout(() => {
        setSubmitStatus((prev) => (prev.type === 'success' ? { type: 'idle', text: '' } : prev));
      }, 5000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'মতামত পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করো।';
      setSubmitStatus({ type: 'error', text: errorMessage });
    }
  };

  const handleToggleResonance = (feedbackId: string) => {
    const res = feedbackService.toggleResonance(feedbackId);
    setItems(res.items);
    setResonatedIds(res.resonatedIds);
  };

  const handleQuickStatusChange = async (feedbackId: string, status: FeedbackStatus) => {
    const updated = await feedbackService.updateItemStatus(feedbackId, status);
    setItems(updated);
  };

  const handleSendCreatorReply = async (feedbackId: string, overrideText?: string) => {
    const textToUse = (overrideText ?? replyTextMap[feedbackId] ?? '').trim();
    if (!textToUse) return;

    const statusToSet = replyStatusMap[feedbackId];
    const res = await feedbackService.addCreatorReply({
      feedbackId,
      content: textToUse,
      newStatus: statusToSet,
    });

    setItems(res.items);
    setReplyTextMap((prev) => ({ ...prev, [feedbackId]: '' }));
    setActiveReplyCardId(null);
  };

  const handleExportSnapshot = () => {
    const { filename, json } = feedbackService.exportTelemetrySnapshot();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-8 pb-28">
      {/* ============================================================
       * 1. TELEMETRY COMMAND HEADER & ARCHITECTURE INSPECTOR
       * ============================================================ */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-md">
        {/* Subtle schematic grid lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/15 border border-primary/30 text-primary font-mono text-xs font-semibold tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>TELEMETRY_HUB // v1.4</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-border text-xs font-mono text-muted-foreground">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span>
                  {syncStatus.cloudConfigured
                    ? 'STATUS // CLOUD_SYNC_ACTIVE'
                    : 'STATUS // TELEMETRY_ONLINE'}
                </span>
              </span>
              <SignalWaveSvg />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight font-bangla-ui">
              মতামত, ইমপ্রুভমেন্ট ও সমস্যা সমাধান ল্যাব
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-bangla leading-relaxed">
              NEXUS Academy-তে তোমার শেখার অভিজ্ঞতা কেমন হচ্ছে, কী কী নতুন ফিচার বা ইমপ্রুভমেন্ট প্রয়োজন এবং কোনো মিশনে সমস্যা হচ্ছে কিনা—সবকিছু এখানে সরাসরি জানাও। আমরা প্রতিটি ফিডব্যাক ট্র্যাক করি এবং অফিশিয়াল আপডেটসহ রিপ্লাই দিই।
            </p>
          </div>

          {/* Right Controls: Export Backup & Creator Console Toggle */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportSnapshot}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-border text-xs font-mono font-semibold text-foreground shrink-0 transition-colors"
                title="Download JSON backup of all feedback & telemetry"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>EXPORT_JSON_BACKUP</span>
              </button>

              {creatorUnlocked ? (
                <button
                  type="button"
                  onClick={handleLockCreator}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-success/15 text-success border border-success/40 hover:bg-success/25 transition-all"
                  title="Creator Mode Active — Click to Lock"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>FOUNDER_CONSOLE // ACTIVE</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPinModal((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-surface-elevated hover:bg-surface-hover text-muted-foreground hover:text-foreground border border-border transition-all"
                  title="Unlock Creator Console to post official replies & status updates"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>CREATOR_LOGIN</span>
                </button>
              )}
            </div>

            <span className="text-[11px] font-bangla text-muted-foreground lg:text-right">
              ◈ কোনো অ্যাকাউন্ট বা লগইন ছাড়াই সরাসরি মতামত জমা দেওয়া যাবে
            </span>
          </div>
        </div>

        {/* Creator PIN Verification Bar */}
        {showPinModal && !creatorUnlocked && (
          <form
            onSubmit={handleUnlockCreator}
            className="relative z-10 mt-6 p-4 rounded-xl bg-surface-elevated border border-primary/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 animate-in fade-in duration-200"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary">
                <Shield className="w-4 h-4" />
                <span>AUTHENTICATE // FOUNDER & CREATOR CONSOLE</span>
              </div>
              <p className="text-xs text-muted-foreground font-bangla">
                ইউজারদের কমেন্টে অফিশিয়াল রিপ্লাই দিতে এবং স্ট্যাটাস (`কাজ চলছে` / `সমাধান হয়েছে`) আপডেট করতে নির্মাতা পিন (`2441`) দিন:
              </p>
              {pinError && <p className="text-xs text-destructive font-bangla">{pinError}</p>}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN (2441)"
                aria-label="Creator Console PIN"
                className="px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono w-36 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
              >
                আনলক করুন
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPinError('');
                }}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface"
                aria-label="Close PIN prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Live Telemetry Counters */}
        <div className="relative z-10 mt-6 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                TOTAL // TELEMETRY
              </span>
              <span className="text-xl font-bold font-mono text-foreground">{metrics.total}</span>
              <span className="text-xs text-muted-foreground font-bangla ml-1.5">টি মতামত</span>
            </div>
            <Terminal className="w-5 h-5 text-primary opacity-80" />
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-warning/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-warning block">
                STATUS // IN_PROGRESS
              </span>
              <span className="text-xl font-bold font-mono text-foreground">
                {metrics.inProgress}
              </span>
              <span className="text-xs text-muted-foreground font-bangla ml-1.5">কাজ চলছে</span>
            </div>
            <Wrench className="w-5 h-5 text-warning opacity-80" />
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-success/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-success block">
                STATUS // RESOLVED
              </span>
              <span className="text-xl font-bold font-mono text-foreground">{metrics.resolved}</span>
              <span className="text-xs text-muted-foreground font-bangla ml-1.5">সমাধান হয়েছে</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-success opacity-80" />
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-info/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-info block">
                SIGNAL // RESONANCE
              </span>
              <span className="text-xl font-bold font-mono text-foreground">
                {metrics.totalResonances}
              </span>
              <span className="text-xs text-muted-foreground font-bangla ml-1.5">▲ সহমত</span>
            </div>
            <Activity className="w-5 h-5 text-info opacity-80" />
          </div>
        </div>
      </section>

      {/* ============================================================
       * 2. CREATOR'S DIRECTIVE & ROADMAP PULSE (নির্মাতার বার্তা ও প্ল্যাটফর্ম আপডেট)
       * ============================================================ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded bg-primary/15 text-primary font-mono text-xs font-bold">
              ⎎ DIRECTIVE_CHANNEL
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-foreground font-bangla-ui">
              নির্মাতার বার্তা ও প্ল্যাটফর্ম রোডম্যাপ পালস
            </h2>
          </div>

          {creatorUnlocked && (
            <button
              type="button"
              onClick={() => setShowDirectiveComposer((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="font-bangla-ui">নতুন অফিশিয়াল আপডেট পোস্ট করুন</span>
            </button>
          )}
        </div>

        {/* Creator Console: New Directive Composer */}
        {creatorUnlocked && showDirectiveComposer && (
          <form
            onSubmit={handleCreateDirective}
            className="p-5 rounded-2xl bg-card border-2 border-primary/40 space-y-4 shadow-lg animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary">
                [CREATOR_BROADCAST // NEW OFFICIAL DIRECTIVE]
              </span>
              <button
                type="button"
                onClick={() => setShowDirectiveComposer(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bangla text-muted-foreground mb-1">
                  আপডেট বা বার্তার শিরোনাম
                </label>
                <input
                  type="text"
                  required
                  value={dirTitle}
                  onChange={(e) => setDirTitle(e.target.value)}
                  placeholder="যেমন: মিশন ১৫ ও নতুন ডিবাগার আপডেট চলমান..."
                  className="w-full px-3.5 py-2 rounded-lg bg-surface border border-border text-sm font-bangla focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">
                  SCHEMATIC_TAG
                </label>
                <input
                  type="text"
                  value={dirTag}
                  onChange={(e) => setDirTag(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-surface border border-border text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bangla text-muted-foreground mb-1">
                বিস্তারিত বার্তা (শিক্ষার্থীদের উদ্দেশ্যে)
              </label>
              <textarea
                rows={3}
                required
                value={dirContent}
                onChange={(e) => setDirContent(e.target.value)}
                placeholder="আমরা বর্তমানে কোন ফিচার বা ইমপ্রুভমেন্ট নিয়ে কাজ করছি তা বিস্তারিত লিখুন..."
                className="w-full px-3.5 py-2 rounded-lg bg-surface border border-border text-sm font-bangla focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDirectiveComposer(false)}
                className="px-4 py-2 rounded-lg bg-surface text-xs font-bangla text-muted-foreground hover:text-foreground"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold font-bangla-ui hover:bg-primary-hover"
              >
                বার্তা প্রকাশ করুন
              </button>
            </div>
          </form>
        )}

        {/* Directives List */}
        <div className="grid grid-cols-1 gap-4">
          {directives.map((dir) => {
            const totalPollVotes = dir.poll
              ? dir.poll.options.reduce((sum, o) => sum + o.votes, 0)
              : 0;
            const userVotedOptionId = dir.poll ? pollVotes[dir.poll.id] : undefined;

            return (
              <div
                key={dir.id}
                className={cn(
                  'rounded-2xl border p-5 sm:p-6 transition-all',
                  dir.pinned
                    ? 'bg-card border-primary/40 shadow-md'
                    : 'bg-surface/70 border-border'
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-mono text-[11px] font-bold">
                      {dir.authorBadge}
                    </span>
                    <span className="font-semibold text-xs text-foreground">{dir.authorName}</span>
                    <span className="text-xs font-mono text-muted-foreground">{dir.tag}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span>{dir.code}</span>
                    <span>•</span>
                    <span>{formatRelativeDate(dir.createdAt)}</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-foreground font-bangla-ui mb-2">
                  {dir.title}
                </h3>
                <p className="text-sm text-foreground-muted font-bangla leading-relaxed">
                  {dir.content}
                </p>

                {/* Interactive Community Roadmap Poll inside Directive */}
                {dir.poll && (
                  <div className="mt-5 pt-5 border-t border-border/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <span className="text-[11px] font-mono text-primary font-semibold block">
                          {dir.poll.questionEnglish}
                        </span>
                        <h4 className="text-sm font-bold text-foreground font-bangla-ui">
                          {dir.poll.questionBangla}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        TOTAL_SIGNAL // {totalPollVotes} VOTES
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {dir.poll.options.map((opt) => {
                        const pct =
                          totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                        const isSelected = userVotedOptionId === opt.id;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleVotePoll(dir.id, dir.poll!.id, opt.id)}
                            className={cn(
                              'relative overflow-hidden text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 group',
                              isSelected
                                ? 'border-primary bg-primary/10 shadow-sm'
                                : 'border-border bg-surface hover:border-primary/40'
                            )}
                          >
                            <div className="space-y-1.5 relative z-10">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[11px] font-bold text-primary">
                                  [{opt.code}]
                                </span>
                                <span
                                  className={cn(
                                    'text-[11px] font-mono px-2 py-0.5 rounded border',
                                    isSelected
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-surface-elevated text-muted-foreground border-border group-hover:text-foreground'
                                  )}
                                >
                                  {isSelected ? '▲ VOTED' : '▲ VOTE'}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-foreground font-bangla leading-snug">
                                {opt.labelBangla}
                              </p>
                              <p className="text-[11px] text-muted-foreground font-mono">
                                {opt.labelEnglish}
                              </p>
                            </div>

                            <div className="space-y-1 relative z-10 w-full">
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="text-muted-foreground">{opt.votes} signals</span>
                                <span className="font-bold text-primary">{pct}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
       * 3. MAIN WORKSPACE GRID: TELEMETRY COMPOSER + LIVE BOARD
       * ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (5 cols): INTERACTIVE TELEMETRY FEEDBACK COMPOSER */}
        <section className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5 lg:sticky lg:top-20 shadow-sm">
          <div className="space-y-1 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary">
                ⏛ SUBMIT_TELEMETRY_PACKET
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">NO_AUTH_REQUIRED</span>
            </div>
            <h2 className="text-lg font-bold text-foreground font-bangla-ui">
              মতামত, ইমপ্রুভমেন্ট বা সমস্যা জানান
            </h2>
            <p className="text-xs text-muted-foreground font-bangla">
              তোমার ফিডব্যাক সরাসরি বোর্ডে যুক্ত হবে এবং আমরা কাজ শুরু করলে স্ট্যাটাস আপডেট দেখতে পাবে।
            </p>
          </div>

          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            {/* Category Selector (Zero AI Emojis — Schematic Glyphs + Lucide Icons) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground font-bangla-ui">
                ১. ফিডব্যাকের ধরন নির্বাচন করো
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(['improve', 'problem', 'feedback'] as FeedbackCategory[]).map((cat) => {
                  const meta = FEEDBACK_CATEGORY_META[cat];
                  const active = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                        active
                          ? 'bg-primary/12 border-primary text-foreground shadow-sm'
                          : 'bg-surface border-border text-muted-foreground hover:border-border-hover hover:text-foreground'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-mono text-sm font-bold border',
                          active
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-surface-elevated text-foreground-muted border-border'
                        )}
                      >
                        <CategoryVectorIcon category={cat} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold font-bangla-ui text-foreground">
                            {meta.glyph} {meta.labelBangla}
                          </span>
                          <span className="text-[10px] font-mono text-primary font-semibold">
                            {meta.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-bangla mt-0.5 leading-snug">
                          {meta.descriptionBangla}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mission & Step Context Selector */}
            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground font-bangla-ui">
                  ২. নির্দিষ্ট মিশন বা ধাপ (ঐচ্ছিক / সমস্যার জন্য প্রস্তাবিত)
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">CONTEXT_LINK</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="feedback-mission-select"
                    className="block text-[11px] font-bangla text-muted-foreground mb-1"
                  >
                    মিশন নির্বাচন (Mission 001–014)
                  </label>
                  <select
                    id="feedback-mission-select"
                    value={selectedMissionId}
                    onChange={(e) => {
                      const nextMissionId = e.target.value;
                      setSelectedMissionId(nextMissionId);
                      if (nextMissionId && selectedStepNumber) {
                        const maxSteps = getMissionStepCount(nextMissionId);
                        if (parseInt(selectedStepNumber, 10) > maxSteps) {
                          setSelectedStepNumber('');
                        }
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs font-bangla text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="">— সাধারণ প্ল্যাটফর্ম ( সব মিশন ) —</option>
                    {missionsIndex.map((m) => (
                      <option key={m.id} value={m.id}>
                        Mission {m.id}: {m.banglaTitle} ({m.title})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="feedback-step-select"
                    className="block text-[11px] font-bangla text-muted-foreground mb-1"
                  >
                    ধাপ নং (Step)
                  </label>
                  <select
                    id="feedback-step-select"
                    value={selectedStepNumber}
                    onChange={(e) => setSelectedStepNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="">All Steps</option>
                    {Array.from({ length: availableStepCount }, (_, idx) => idx + 1).map((step) => (
                      <option key={step} value={String(step)}>
                        Step {String(step).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Priority / Impact Level */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground font-bangla-ui">
                ৩. গুরুত্বের মাত্রা (Impact Level)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['standard', 'high_impact', 'blocker'] as FeedbackImpact[]).map((imp) => {
                  const meta = FEEDBACK_IMPACT_META[imp];
                  const active = impact === imp;
                  return (
                    <button
                      key={imp}
                      type="button"
                      onClick={() => setImpact(imp)}
                      className={cn(
                        'px-2.5 py-2 rounded-lg border text-center transition-all',
                        active
                          ? 'bg-primary/15 border-primary text-primary font-semibold'
                          : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <span className="block text-[10px] font-mono">{meta.glyph}</span>
                      <span className="block text-xs font-bangla-ui">{meta.labelBangla}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Detailed Message */}
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="feedback-title-input"
                  className="block text-xs font-semibold text-foreground font-bangla-ui mb-1"
                >
                  ৪. সংক্ষিপ্ত শিরোনাম <span className="text-destructive">*</span>
                </label>
                <input
                  id="feedback-title-input"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: মিশন ০০৬-এ ভিজ্যুয়াল মেমোরি বক্সে আরেকটি উদাহরণ যোগ করা..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm font-bangla text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-message-input"
                  className="block text-xs font-semibold text-foreground font-bangla-ui mb-1"
                >
                  ৫. বিস্তারিত বর্ণনা (কী ইমপ্রুভ করা যায় বা কী সমস্যা হচ্ছে) <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="feedback-message-input"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="তোমার পরামর্শ, আইডিয়া বা সমস্যার কথা বিস্তারিত বাংলায় বা ইংরেজিতে লেখো..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm font-bangla text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-author-input"
                  className="block text-xs font-semibold text-foreground font-bangla-ui mb-1"
                >
                  ৬. তোমার নাম বা পরিচয় (ঐচ্ছিক)
                </label>
                <input
                  id="feedback-author-input"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="একজন শিক্ষার্থী (খালি রাখলে নাম ছাড়াই পোস্ট হবে)"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-bangla text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Diagnostic Telemetry Toggle */}
            <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-elevated border border-border cursor-pointer select-none">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-foreground font-bangla-ui block">
                    ডায়াগনস্টিক টেলিমেট্রি সংযুক্ত করো
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    THEME: {settings.theme.toUpperCase()} · LVL: {isClient ? progress.level : 1} · XP:{' '}
                    {isClient ? progress.xp : 0}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={attachTelemetry}
                onChange={(e) => setAttachTelemetry(e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
            </label>

            {/* Status Feedback Banner */}
            {submitStatus.type !== 'idle' && (
              <div
                className={cn(
                  'p-3 rounded-xl border text-xs font-bangla flex items-center gap-2',
                  submitStatus.type === 'success'
                    ? 'bg-success/15 border-success/40 text-success'
                    : submitStatus.type === 'error'
                    ? 'bg-destructive/15 border-destructive/40 text-destructive'
                    : 'bg-primary/15 border-primary/40 text-primary'
                )}
              >
                {submitStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{submitStatus.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitStatus.type === 'submitting'}
              className="w-full py-3 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm font-bangla-ui flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>মতামত ও টেলিমেট্রি জমা দিন</span>
            </button>
          </form>
        </section>

        {/* RIGHT COLUMN (7 cols): LIVE FEEDBACK BOARD & NESTED CREATOR REPLIES */}
        <section className="lg:col-span-7 space-y-5">
          {/* Filter & Search Bar */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-primary block">
                  ⏚ LIVE_COMMUNITY_BOARD // {filteredItems.length} ENTRIES
                </span>
                <h2 className="text-lg font-bold text-foreground font-bangla-ui">
                  ফিডব্যাক বোর্ড ও অফিশিয়াল রিপ্লাই
                </h2>
              </div>

              {/* Sort Toggle */}
              <div className="flex items-center gap-1.5 bg-surface p-1 rounded-xl border border-border self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSortBy('resonances')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bangla-ui transition-colors',
                    sortBy === 'resonances'
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  ▲ সবচেয়ে বেশি সহমত
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bangla-ui transition-colors',
                    sortBy === 'newest'
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  ▸ সর্বশেষ প্রাপ্ত
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> TYPE:
              </span>
              {(
                [
                  { id: 'all', label: 'All (সবগুলো)' },
                  { id: 'improve', label: '◈ Improve (ইমপ্রুভমেন্ট)' },
                  { id: 'problem', label: '⌁ Problem (সমস্যা/বাগ)' },
                  { id: 'feedback', label: '⬡ Feedback (মতামত)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterCategory(tab.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bangla-ui border transition-all',
                    filterCategory === tab.id
                      ? 'bg-primary/15 border-primary text-primary font-semibold'
                      : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter Pills + Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'all', label: 'সব স্ট্যাটাস' },
                    { id: 'in_progress', label: '⏣ কাজ চলছে' },
                    { id: 'planned', label: '◈ পরিকল্পনায় আছে' },
                    { id: 'resolved', label: '⬢ সমাধান হয়েছে' },
                    { id: 'open', label: '▫ নতুন' },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setFilterStatus(st.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-bangla-ui border transition-colors',
                      filterStatus === st.id
                        ? 'bg-surface-elevated border-primary text-foreground font-semibold'
                        : 'bg-transparent border-transparent text-muted-foreground hover:bg-surface'
                    )}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="মিশন বা বিষয় খুঁজুন..."
                  aria-label="Search feedback items"
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-bangla text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Feedback Items List */}
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center space-y-3">
              <Terminal className="w-8 h-8 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground font-bangla-ui">
                এই ফিল্টারে কোনো মতামত পাওয়া যায়নি
              </h3>
              <p className="text-xs text-muted-foreground font-bangla">
                ফিল্টার পরিবর্তন করে দেখো অথবা বাম পাশের ফর্ম থেকে নতুন মতামত যুক্ত করো।
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const catMeta = FEEDBACK_CATEGORY_META[item.category] || FEEDBACK_CATEGORY_META.feedback;
                const statusMeta = FEEDBACK_STATUS_META[item.status] || FEEDBACK_STATUS_META.open;
                const impactMeta = FEEDBACK_IMPACT_META[item.impact] || FEEDBACK_IMPACT_META.standard;
                const hasResonated = resonatedIds.includes(item.id);
                const isReplying = activeReplyCardId === item.id;

                const statusBadgeStyle: Record<FeedbackStatus, string> = {
                  in_progress: 'bg-warning/15 text-warning border-warning/30',
                  resolved: 'bg-success/15 text-success border-success/30',
                  planned: 'bg-info/15 text-info border-info/30',
                  open: 'bg-surface-elevated text-foreground-muted border-border',
                };

                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm hover:border-border-hover transition-all"
                  >
                    {/* Top Metadata Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category Badge */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/12 border border-primary/25 text-primary text-xs font-mono font-semibold">
                          <CategoryVectorIcon category={item.category} className="w-3.5 h-3.5" />
                          <span>
                            {catMeta.glyph} {catMeta.code}
                          </span>
                        </span>

                        {/* Status Badge with Animated Pulse */}
                        <span
                          className={cn(
                            'inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-bangla-ui font-semibold',
                            statusBadgeStyle[item.status]
                          )}
                        >
                          <StatusPulseDot status={item.status} />
                          <StatusVectorIcon status={item.status} />
                          <span>{statusMeta.labelBangla}</span>
                          <span className="font-mono text-[10px] opacity-80 hidden sm:inline">
                            ({statusMeta.labelEnglish})
                          </span>
                        </span>

                        {/* Impact Badge (if high_impact or blocker) */}
                        {item.impact !== 'standard' && (
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-mono font-bold border',
                              item.impact === 'blocker'
                                ? 'bg-destructive/15 text-destructive border-destructive/30'
                                : 'bg-warning/15 text-warning border-warning/30'
                            )}
                          >
                            {impactMeta.code}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span>{item.code}</span>
                        <span>•</span>
                        <span>{formatRelativeDate(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Title & Message */}
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-foreground font-bangla-ui leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-foreground-muted font-bangla leading-relaxed whitespace-pre-line">
                        {item.message}
                      </p>
                    </div>

                    {/* Telemetry Context & Author Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/70">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-foreground font-bangla">
                          ▸ {item.authorName}
                        </span>

                        {item.telemetry?.missionId && (
                          <Link
                            href={
                              item.telemetry.stepNumber
                                ? `/mission/mission-${item.telemetry.missionId}/step/${Math.max(
                                    0,
                                    item.telemetry.stepNumber - 1
                                  )}`
                                : `/mission/mission-${item.telemetry.missionId}`
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-elevated hover:bg-surface-hover border border-border text-[11px] font-mono text-primary transition-colors"
                          >
                            <GitPullRequest className="w-3 h-3" />
                            <span>
                              MISSION-{item.telemetry.missionId}
                              {item.telemetry.stepNumber
                                ? ` // STEP ${String(item.telemetry.stepNumber).padStart(2, '0')}`
                                : ''}
                            </span>
                          </Link>
                        )}

                        {item.githubIssueUrl && (
                          <a
                            href={item.githubIssueUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface text-[11px] font-mono text-muted-foreground hover:text-primary"
                          >
                            <span>GH #{item.githubIssueNumber}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Resonance (▲ সহমত) & Creator Action Buttons */}
                      <div className="flex items-center gap-2">
                        {creatorUnlocked && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveReplyCardId(isReplying ? null : item.id)
                            }
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-xs font-bangla-ui font-semibold border transition-colors',
                              isReplying
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-surface-elevated hover:bg-surface-hover text-foreground border-border'
                            )}
                          >
                            ⎎ রিপ্লাই ও স্ট্যাটাস আপডেট
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleResonance(item.id)}
                          aria-pressed={hasResonated}
                          className={cn(
                            'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all active:scale-95',
                            hasResonated
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-surface hover:bg-surface-hover text-foreground border-border'
                          )}
                        >
                          <span>▲</span>
                          <span className="font-bangla-ui">সহমত</span>
                          <span className="px-1.5 py-0.2 rounded bg-black/20 text-[11px]">
                            {item.resonances}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* ============================================================
                     * OFFICIAL CREATOR REPLIES THREAD (Nested below feedback card)
                     * ============================================================ */}
                    {item.replies && item.replies.length > 0 && (
                      <div className="mt-4 pt-3 space-y-3">
                        {item.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="relative pl-4 sm:pl-5 border-l-2 border-primary/60 bg-primary/5 rounded-r-xl p-4 space-y-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <CornerDownRight className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-mono text-[10px] font-bold tracking-wider">
                                  {rep.badgeCode || 'FOUNDER // HASAN MAHMUD'}
                                </span>
                                <span className="text-xs font-semibold text-foreground">
                                  {rep.authorName}
                                </span>
                                {rep.statusUpdatedTo && (
                                  <span className="text-[10px] font-mono text-muted-foreground">
                                    ▸ STATUS_SET //{' '}
                                    {FEEDBACK_STATUS_META[rep.statusUpdatedTo]?.labelBangla}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] font-mono text-muted-foreground">
                                {formatRelativeDate(rep.createdAt)}
                              </span>
                            </div>

                            <p className="text-sm text-foreground font-bangla leading-relaxed">
                              {rep.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ============================================================
                     * IN-CARD CREATOR REPLY & STATUS CONTROLLER (Creator Mode)
                     * ============================================================ */}
                    {creatorUnlocked && isReplying && (
                      <div className="mt-4 p-4 rounded-xl bg-surface-elevated border border-primary/40 space-y-4 animate-in fade-in duration-200">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-primary">
                            [CREATOR_RESPONSE_CONTROLLER // {item.code}]
                          </span>
                          <span className="text-[11px] font-bangla text-muted-foreground">
                            ১-ক্লিকে স্ট্যাটাস পরিবর্তন অথবা অফিশিয়াল রিপ্লাই দিন
                          </span>
                        </div>

                        {/* One-Click Status Switcher */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-foreground font-bangla-ui block">
                            বর্তমান কাজের অগ্রগতি (Status Switcher):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {(['in_progress', 'resolved', 'planned', 'open'] as FeedbackStatus[]).map(
                              (st) => {
                                const meta = FEEDBACK_STATUS_META[st];
                                const isCurrent = item.status === st;
                                return (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => {
                                      handleQuickStatusChange(item.id, st);
                                      setReplyStatusMap((prev) => ({ ...prev, [item.id]: st }));
                                    }}
                                    className={cn(
                                      'px-3 py-1.5 rounded-lg text-xs font-bangla-ui border transition-all flex items-center gap-1.5',
                                      isCurrent
                                        ? 'bg-primary text-primary-foreground border-primary font-bold'
                                        : 'bg-background hover:bg-surface text-foreground border-border'
                                    )}
                                  >
                                    <StatusPulseDot status={st} />
                                    <span>{meta.labelBangla}</span>
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* Quick Reply Presets */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-foreground font-bangla-ui block">
                            কুইক রিপ্লাই টেমপ্লেট (১-ক্লিকে সিলেক্ট বা সেন্ড করুন):
                          </span>
                          <div className="flex flex-col gap-1.5">
                            {CREATOR_QUICK_REPLIES.map((preset, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setReplyTextMap((prev) => ({ ...prev, [item.id]: preset }))
                                  }
                                  className="flex-1 text-left px-3 py-2 rounded-lg bg-background hover:bg-surface border border-border text-xs font-bangla text-foreground transition-colors"
                                >
                                  ▸ {preset}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSendCreatorReply(item.id, preset)}
                                  className="px-3 py-2 rounded-lg bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bangla-ui font-semibold shrink-0 transition-colors"
                                >
                                  সরাসরি পাঠান
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Custom Reply Input */}
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={replyTextMap[item.id] || ''}
                            onChange={(e) =>
                              setReplyTextMap((prev) => ({ ...prev, [item.id]: e.target.value }))
                            }
                            placeholder="কাস্টম অফিশিয়াল রিপ্লাই লিখুন (যেমন: আমরা এটি নিয়ে কাজ করতেছি, আপডেট চলমান...)"
                            className="w-full px-3.5 py-2 rounded-lg bg-background border border-border text-xs font-bangla text-foreground focus:outline-none focus:border-primary"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveReplyCardId(null)}
                              className="px-3 py-1.5 rounded-lg bg-background text-xs font-bangla text-muted-foreground hover:text-foreground"
                            >
                              বন্ধ করুন
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendCreatorReply(item.id)}
                              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold font-bangla-ui hover:bg-primary-hover flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>অফিশিয়াল রিপ্লাই পোস্ট করুন</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
