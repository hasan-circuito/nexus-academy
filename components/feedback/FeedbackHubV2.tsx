'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Send,
  Lock,
  Unlock,
  Activity,
  Filter,
  Search,
  CornerDownRight,
  Sparkles,
  Download,
  X,
  ExternalLink,
  Wrench,
  CheckCircle2,
  Clock,
  Compass,
  Sliders,
  Crosshair,
  MessageSquareCode,
  Shield,
  Pin,
  ChevronRight,
  GitPullRequest,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { useProgress } from '@/hooks/useProgress';
import { feedbackService } from '@/services/FeedbackService';
import { getMissionStepCount } from '@/services/ContentService';
import { BorderBeam } from '@/components/ui/border-beam';
import missionsIndex from '@/data/missions/index.json';
import {
  type FeedbackCategory,
  type FeedbackImpact,
  type FeedbackItem,
  type FeedbackStatus,
  type FeedbackSyncStatus,
  CREATOR_QUICK_REPLIES,
  FEEDBACK_CATEGORY_META,
  FEEDBACK_STATUS_META,
} from '@/types/feedback.types';

// ============================================================
// Zero-AI-Emoji Micro Components (Clean Vectors & Status Dots)
// ============================================================

function StatusPulse({ status }: { status: FeedbackStatus }) {
  const styles: Record<FeedbackStatus, { dot: string; ping: string }> = {
    in_progress: { dot: 'bg-warning', ping: 'bg-warning/40' },
    resolved: { dot: 'bg-success', ping: 'bg-success/40' },
    planned: { dot: 'bg-info', ping: 'bg-info/40' },
    open: { dot: 'bg-primary', ping: 'bg-primary/40' },
  };
  const color = styles[status] || styles.open;

  return (
    <span className="relative inline-flex h-2 w-2 shrink-0" aria-hidden="true">
      <span
        className={cn(
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          color.ping
        )}
      />
      <span className={cn('relative inline-flex rounded-full h-2 w-2', color.dot)} />
    </span>
  );
}

function CategoryIcon({
  category,
  className,
}: {
  category: FeedbackCategory;
  className?: string;
}) {
  if (category === 'improve') return <Sliders className={cn('w-3.5 h-3.5', className)} />;
  if (category === 'problem') return <Crosshair className={cn('w-3.5 h-3.5', className)} />;
  return <MessageSquareCode className={cn('w-3.5 h-3.5', className)} />;
}

function StatusIcon({ status, className }: { status: FeedbackStatus; className?: string }) {
  if (status === 'in_progress') return <Wrench className={cn('w-3.5 h-3.5', className)} />;
  if (status === 'resolved') return <CheckCircle2 className={cn('w-3.5 h-3.5', className)} />;
  if (status === 'planned') return <Compass className={cn('w-3.5 h-3.5', className)} />;
  return <Clock className={cn('w-3.5 h-3.5', className)} />;
}

function formatPrettyDate(isoDate: string): string {
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
// Main FeedbackHubV2 Component (Clean, Effortless, Immersive)
// ============================================================

export function FeedbackHubV2() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const { progress, isClient } = useProgress();

  // URL Query Context
  const initialMissionParam = searchParams.get('mission');
  const initialStepParam = searchParams.get('step');
  const initialCategoryParam = searchParams.get('category');

  const resolvedMissionId = useMemo(() => {
    if (!initialMissionParam) return '';
    const norm = initialMissionParam.replace(/^mission-/i, '').padStart(3, '0');
    return missionsIndex.some((m) => m.id === norm) ? norm : '';
  }, [initialMissionParam]);

  const resolvedStepNumber = useMemo(() => {
    if (!initialStepParam) return '';
    const num = parseInt(initialStepParam, 10);
    const max = resolvedMissionId ? getMissionStepCount(resolvedMissionId) : 20;
    return !isNaN(num) && num >= 1 && num <= max ? String(num) : '';
  }, [initialStepParam, resolvedMissionId]);

  const resolvedCategory = useMemo<FeedbackCategory>(() => {
    if (
      initialCategoryParam === 'improve' ||
      initialCategoryParam === 'problem' ||
      initialCategoryParam === 'feedback'
    ) {
      return initialCategoryParam;
    }
    return resolvedMissionId ? 'problem' : 'improve';
  }, [initialCategoryParam, resolvedMissionId]);

  // Core State
  const [items, setItems] = useState<FeedbackItem[]>(() => feedbackService.getItems());
  const [resonatedIds, setResonatedIds] = useState<string[]>(() =>
    feedbackService.getResonatedIds()
  );
  const [, setSyncStatus] = useState<FeedbackSyncStatus>({
    cloudConfigured: false,
    repo: 'hasan-circuito/nexus-academy',
    lastSyncedAt: new Date().toISOString(),
    mode: 'HYBRID_LOCAL_PERSISTENCE',
  });

  // Creator Mode State
  const [creatorUnlockedFlag, setCreatorUnlockedFlag] = useState<boolean>(() =>
    feedbackService.isCreatorUnlocked(false)
  );
  const creatorUnlocked = creatorUnlockedFlag || settings.devModeUnlocked;
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Composer State (One-Box Form)
  const [category, setCategory] = useState<FeedbackCategory>(resolvedCategory);
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedMissionId, setSelectedMissionId] = useState(resolvedMissionId);
  const [selectedStepNumber, setSelectedStepNumber] = useState(resolvedStepNumber);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'idle' | 'submitting' | 'success' | 'error';
    text: string;
  }>({ type: 'idle', text: '' });

  // Stream Filters
  const [filterCategory, setFilterCategory] = useState<'all' | FeedbackCategory>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | FeedbackStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'resonances' | 'newest'>('resonances');

  // Creator Reply in-Card State
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyStatusMap, setReplyStatusMap] = useState<Record<string, FeedbackStatus>>({});

  // Sync with cloud on mount
  const refreshLocal = useCallback(() => {
    setItems(feedbackService.getItems());
    setResonatedIds(feedbackService.getResonatedIds());
    setCreatorUnlockedFlag(feedbackService.isCreatorUnlocked(false));
  }, []);

  useEffect(() => {
    let active = true;
    feedbackService.syncWithCloud().then((res) => {
      if (!active) return;
      setItems(res.items);
      setSyncStatus(res.syncStatus);
      setResonatedIds(feedbackService.getResonatedIds());
      setCreatorUnlockedFlag(feedbackService.isCreatorUnlocked(false));
    });

    const handleUpdate = () => refreshLocal();
    window.addEventListener('nexus_feedback_update', handleUpdate);
    return () => {
      active = false;
      window.removeEventListener('nexus_feedback_update', handleUpdate);
    };
  }, [refreshLocal]);

  // Derived filtered items
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
          const matchMission = item.telemetry?.missionId?.toLowerCase().includes(q);
          return matchTitle || matchMsg || matchAuthor || matchMission;
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
    if (feedbackService.unlockCreatorConsole(pinInput)) {
      setCreatorUnlockedFlag(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('ভুল পিন কোড। নির্মাতা পিন (2441) দিন।');
    }
  };

  const handleLockCreator = () => {
    feedbackService.lockCreatorConsole();
    setCreatorUnlockedFlag(false);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (trimmed.length < 5) {
      setSubmitStatus({
        type: 'error',
        text: 'তোমার মতামত বা প্রশ্ন কমপক্ষে ৫ অক্ষরের হতে হবে।',
      });
      return;
    }

    setSubmitStatus({ type: 'submitting', text: 'মতামত পোস্ট হচ্ছে...' });

    try {
      // First sentence/line becomes clean title, full text becomes message
      const firstLine = trimmed.split('\n')[0].slice(0, 90);
      const computedTitle =
        firstLine.length >= 3
          ? firstLine
          : category === 'problem'
          ? 'মিশন বা কোড সংক্রান্ত সমস্যা'
          : category === 'improve'
          ? 'নতুন ফিচার বা ইমপ্রুভমেন্ট প্রস্তাব'
          : 'প্ল্যাটফর্ম ফিডব্যাক ও মতামত';

      const missionObj = missionsIndex.find((m) => m.id === selectedMissionId);
      const stepNum = selectedStepNumber ? parseInt(selectedStepNumber, 10) : undefined;

      const created = await feedbackService.submitFeedback({
        category,
        impact: category === 'problem' ? 'high_impact' : 'standard',
        authorName: authorName.trim() || undefined,
        title: computedTitle,
        message: trimmed,
        telemetry: selectedMissionId
          ? {
              missionId: selectedMissionId,
              missionTitle: missionObj?.title,
              stepNumber: stepNum && !isNaN(stepNum) ? stepNum : undefined,
              theme: settings.theme,
              learnerXp: isClient ? progress.xp : undefined,
              learnerLevel: isClient ? progress.level : undefined,
            }
          : undefined,
      });

      setItems(feedbackService.getItems());
      setResonatedIds(feedbackService.getResonatedIds());
      setCommentText('');
      setSubmitStatus({
        type: 'success',
        text: 'তোমার মতামত সফলভাবে বোর্ডে যুক্ত হয়েছে! ধন্যবাদ।',
      });

      setTimeout(() => {
        setSubmitStatus((prev) => (prev.type === 'success' ? { type: 'idle', text: '' } : prev));
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'মতামত পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করো।';
      setSubmitStatus({ type: 'error', text: msg });
    }
  };

  const handleToggleResonance = (id: string) => {
    const res = feedbackService.toggleResonance(id);
    setItems(res.items);
    setResonatedIds(res.resonatedIds);
  };

  const handleStatusQuickChange = async (id: string, st: FeedbackStatus) => {
    const updated = await feedbackService.updateItemStatus(id, st);
    setItems(updated);
  };

  const handleSendReply = async (id: string, overrideText?: string) => {
    const textToUse = (overrideText ?? replyTextMap[id] ?? '').trim();
    if (!textToUse) return;

    const res = await feedbackService.addCreatorReply({
      feedbackId: id,
      content: textToUse,
      newStatus: replyStatusMap[id],
    });

    setItems(res.items);
    setReplyTextMap((prev) => ({ ...prev, [id]: '' }));
    setActiveReplyId(null);
  };

  const handleExportBackup = () => {
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

  const placeholderText: Record<FeedbackCategory, string> = {
    improve:
      'NEXUS Academy-তে কী নতুন ফিচার বা ইমপ্রুভমেন্ট দেখতে চাও? (যেমন: ভিজ্যুয়াল মেমোরি ট্রেসার, কোনো টপিকের বাড়তি প্র্যাকটিস... বিস্তারিত লেখো)',
    problem:
      'কোন মিশনে বা ধাপে কোড রান করতে কী সমস্যা হচ্ছে? (তোমার কোড বা এরর মেসেজটি বাংলায় বা ইংরেজিতে লিখো)',
    feedback:
      'প্ল্যাটফর্মে তোমার শেখার অভিজ্ঞতা কেমন হচ্ছে? কোনো বিষয় ভালো লাগলে বা কিছু অপছন্দ হলে নির্দ্বিধায় জানাও...',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 pb-28">
      {/* ============================================================
       * 1. VERSION COMPARISON BAR (Discussion 1 vs Discussion 2)
       * ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-surface-elevated/70 border border-border">
        <div className="flex items-center gap-1.5">
          <Link
            href="/feedback"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors font-bangla-ui"
          >
            Discussion 1 (v1 ক্লাসিক্যাল)
          </Link>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bangla-ui flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discussion 2 (v2 ক্লিন ও আধুনিক)</span>
          </span>
          <Link
            href="/design-lab"
            className="text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center gap-1"
            title="Explore $6,000 Design Engineering Showcase Lab"
          >
            <Sparkles className="w-3 h-3" />
            <span>$6,000 DESIGN_LAB</span>
          </Link>
        </div>
        <span className="text-[11px] text-muted-foreground font-bangla hidden sm:inline">
          সহজ, পরিষ্কার ও হিজিবিজি-মুক্ত ডেমো ভিউয়ার
        </span>
      </div>

      {/* ============================================================
       * 2. ELEGANT IMMERSIVE HEADER & CREATOR AUTH
       * ============================================================ */}
      <header className="relative rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-4 shadow-sm overflow-hidden">
        {/* Soft background glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-mono font-medium">
              <Sparkles className="w-3 h-3" />
              <span>COMMUNITY_LAB // v2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-bangla-ui">
              মতামত, আইডিয়া ও সমস্যা সমাধান
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-bangla leading-relaxed">
              কোনো মিশনে সমস্যা হচ্ছে, নাকি নতুন কোনো ফিচারের আইডিয়া আছে? তোমার কথা সরাসরি এখানে
              জানাও—আমরা প্রতিটি মতামত গুরুত্ব দিয়ে পড়ি।
            </p>
          </div>

          {/* Right Header Action: Creator Login & Backup */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {creatorUnlocked ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border text-xs font-mono text-foreground transition-colors"
                  title="Export JSON backup"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">BACKUP</span>
                </button>
                <button
                  type="button"
                  onClick={handleLockCreator}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/15 text-success border border-success/30 text-xs font-mono font-semibold hover:bg-success/25 transition-colors"
                  title="Lock Founder Console"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>FOUNDER_ACTIVE</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPinModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-hover text-muted-foreground hover:text-foreground border border-border text-xs font-bangla-ui transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>নির্মাতা মোড</span>
              </button>
            )}
          </div>
        </div>

        {/* Creator PIN Modal Dropdown */}
        {showPinModal && !creatorUnlocked && (
          <form
            onSubmit={handleUnlockCreator}
            className="p-3.5 rounded-xl bg-surface-elevated border border-primary/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in"
          >
            <div className="flex items-center gap-2 text-xs font-bangla text-foreground">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <span>অফিশিয়াল রিপ্লাই ও স্ট্যাটাস আপডেট করতে নির্মাতা পিন (`2441`) দিন:</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN"
                className="px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-mono w-24 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold font-bangla-ui hover:bg-primary-hover"
              >
                আনলক
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPinError('');
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {pinError && <p className="w-full text-xs text-destructive font-bangla">{pinError}</p>}
          </form>
        )}
      </header>

      {/* ============================================================
       * 3. PINNED FOUNDER UPDATE (Friendly 1-line note)
       * ============================================================ */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/25 flex items-start gap-3 shadow-sm">
        <Pin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs font-bangla leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="font-bangla-ui">নির্মাতার বার্তা:</span>
            <span className="text-[11px] font-mono text-primary px-1.5 py-0.2 rounded bg-primary/20">
              HASAN MAHMUD
            </span>
          </div>
          <p className="text-foreground-muted">
            তোমাদের মতামতের ভিত্তিতেই পরবর্তী আপডেটে মিশন ১৫ এবং ভিজ্যুয়াল মেমোরি ট্রেসার নিয়ে কাজ
            চলছে। কোনো পরামর্শ বা সমস্যা থাকলে নির্দ্বিধায় নিচে লিখে ফেলো—আমরা সরাসরি রিপ্লাই দেব।
          </p>
        </div>
      </div>

      {/* ============================================================
       * 4. ONE-BOX IMMERSIVE COMMENT COMPOSER (Easy & Clean)
       * ============================================================ */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-sm">
        <BorderBeam duration={9} colorFrom="#10b981" colorTo="#06b6d4" />
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'improve', label: 'পরামর্শ ও ইমপ্রুভমেন্ট', glyph: '◈' },
              { id: 'problem', label: 'সমস্যা বা বাগ রিপোর্ট', glyph: '⌁' },
              { id: 'feedback', label: 'মতামত ও অভিজ্ঞতা', glyph: '⬡' },
            ] as const
          ).map((tab) => {
            const active = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bangla-ui font-semibold border transition-all',
                  active
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:border-border-hover'
                )}
              >
                <CategoryIcon category={tab.id} />
                <span>
                  {tab.glyph} {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Text Area */}
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="relative">
            <textarea
              rows={4}
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={placeholderText[category]}
              className="w-full p-4 rounded-xl bg-surface border border-border text-sm font-bangla text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all leading-relaxed"
            />
          </div>

          {/* Bottom Bar: Mission (Optional) + Author Name (Optional) + Submit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Optional Mission Picker */}
              <select
                value={selectedMissionId}
                onChange={(e) => {
                  setSelectedMissionId(e.target.value);
                  setSelectedStepNumber('');
                }}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-bangla text-muted-foreground focus:outline-none focus:border-primary"
                aria-label="Mission context (optional)"
              >
                <option value="">মিশন নির্বাচন (ঐচ্ছিক)</option>
                {missionsIndex.map((m) => (
                  <option key={m.id} value={m.id}>
                    Mission {m.id}: {m.banglaTitle}
                  </option>
                ))}
              </select>

              {/* Optional Step Picker (if mission selected) */}
              {selectedMissionId && (
                <select
                  value={selectedStepNumber}
                  onChange={(e) => setSelectedStepNumber(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-mono text-muted-foreground focus:outline-none focus:border-primary"
                  aria-label="Step number (optional)"
                >
                  <option value="">ধাপ (ঐচ্ছিক)</option>
                  {Array.from(
                    { length: getMissionStepCount(selectedMissionId) },
                    (_, i) => i + 1
                  ).map((s) => (
                    <option key={s} value={String(s)}>
                      Step {s}
                    </option>
                  ))}
                </select>
              )}

              {/* Optional Author Name */}
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="তোমার নাম (ঐচ্ছিক)"
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-bangla text-foreground placeholder:text-muted-foreground/60 w-36 sm:w-44 focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={submitStatus.type === 'submitting'}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs font-bangla-ui shadow-sm transition-all disabled:opacity-50 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>মতামত পোস্ট করুন</span>
            </button>
          </div>

          {/* Status Message Banner */}
          {submitStatus.type !== 'idle' && (
            <div
              className={cn(
                'p-3 rounded-xl border text-xs font-bangla flex items-center gap-2 animate-in fade-in',
                submitStatus.type === 'success'
                  ? 'bg-success/15 border-success/30 text-success'
                  : submitStatus.type === 'error'
                  ? 'bg-destructive/15 border-destructive/30 text-destructive'
                  : 'bg-primary/15 border-primary/30 text-primary'
              )}
            >
              {submitStatus.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <Activity className="w-4 h-4 shrink-0" />
              )}
              <span>{submitStatus.text}</span>
            </div>
          )}
        </form>
      </section>

      {/* ============================================================
       * 5. CLEAN DISCUSSION STREAM & LIVE REPLIES
       * ============================================================ */}
      <section className="space-y-4">
        {/* Stream Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-card border border-border">
          {/* Status / Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: 'সবগুলো', kind: 'all' },
                { id: 'in_progress', label: 'কাজ চলছে', kind: 'status', val: 'in_progress' },
                { id: 'resolved', label: 'সমাধান হয়েছে', kind: 'status', val: 'resolved' },
                { id: 'improve', label: 'পরামর্শ', kind: 'category', val: 'improve' },
                { id: 'problem', label: 'সমস্যা', kind: 'category', val: 'problem' },
              ] as const
            ).map((chip) => {
              const active =
                chip.kind === 'all'
                  ? filterCategory === 'all' && filterStatus === 'all'
                  : chip.kind === 'status'
                  ? filterStatus === chip.val
                  : filterCategory === chip.val;

              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    if (chip.kind === 'all') {
                      setFilterCategory('all');
                      setFilterStatus('all');
                    } else if (chip.kind === 'status') {
                      setFilterStatus(chip.val as FeedbackStatus);
                      setFilterCategory('all');
                    } else {
                      setFilterCategory(chip.val as FeedbackCategory);
                      setFilterStatus('all');
                    }
                  }}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-bangla-ui border transition-colors flex items-center gap-1.5',
                    active
                      ? 'bg-primary/15 border-primary text-primary font-semibold'
                      : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  {chip.kind === 'status' && <StatusPulse status={chip.val as FeedbackStatus} />}
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="খুঁজুন..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-bangla text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Discussion Cards */}
        {filteredItems.length === 0 ? (
          <div className="p-8 rounded-2xl bg-card border border-border text-center space-y-2">
            <MessageSquareCode className="w-8 h-8 text-muted-foreground mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-foreground font-bangla-ui">
              কোনো মতামত খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-xs text-muted-foreground font-bangla">
              ফিল্টার পরিবর্তন করো অথবা উপরের বক্স থেকে নতুন মতামত পোস্ট করো।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const catMeta = FEEDBACK_CATEGORY_META[item.category] || FEEDBACK_CATEGORY_META.feedback;
              const statusMeta = FEEDBACK_STATUS_META[item.status] || FEEDBACK_STATUS_META.open;
              const hasResonated = resonatedIds.includes(item.id);
              const isReplying = activeReplyId === item.id;

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3.5 shadow-sm hover:border-border-hover transition-all"
                >
                  {/* Top Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Author */}
                      <span className="font-semibold text-xs text-foreground font-bangla">
                        {item.authorName}
                      </span>

                      {/* Category Badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-[11px] font-bangla-ui text-muted-foreground">
                        <CategoryIcon category={item.category} />
                        <span>{catMeta.labelBangla}</span>
                      </span>

                      {/* Status Badge */}
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bangla-ui font-semibold border',
                          item.status === 'in_progress' &&
                            'bg-warning/15 text-warning border-warning/30',
                          item.status === 'resolved' &&
                            'bg-success/15 text-success border-success/30',
                          item.status === 'planned' && 'bg-info/15 text-info border-info/30',
                          item.status === 'open' &&
                            'bg-surface-elevated text-foreground-muted border-border'
                        )}
                      >
                        <StatusPulse status={item.status} />
                        <StatusIcon status={item.status} />
                        <span>{statusMeta.labelBangla}</span>
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-muted-foreground">
                      {formatPrettyDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Main Comment Text */}
                  <div className="space-y-1">
                    {item.title && item.title !== item.message && (
                      <h3 className="text-sm font-bold text-foreground font-bangla-ui leading-snug">
                        {item.title}
                      </h3>
                    )}
                    <p className="text-sm text-foreground-muted font-bangla leading-relaxed whitespace-pre-line">
                      {item.message}
                    </p>
                  </div>

                  {/* Bottom Context & Interactions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      {/* Mission context tag (if available) */}
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
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface hover:bg-surface-elevated border border-border text-[11px] font-mono text-primary transition-colors"
                        >
                          <GitPullRequest className="w-3 h-3" />
                          <span>
                            Mission {item.telemetry.missionId}
                            {item.telemetry.stepNumber ? ` (Step ${item.telemetry.stepNumber})` : ''}
                          </span>
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Creator Reply Toggle (Creator Mode Only) */}
                      {creatorUnlocked && (
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(isReplying ? null : item.id)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-bangla-ui font-semibold border transition-colors',
                            isReplying
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-surface hover:bg-surface-hover text-foreground border-border'
                          )}
                        >
                          ⎎ রিপ্লাই ও স্ট্যাটাস
                        </button>
                      )}

                      {/* Resonance (▲ সহমত) Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleResonance(item.id)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all active:scale-95',
                          hasResonated
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-surface hover:bg-surface-hover text-foreground border-border'
                        )}
                      >
                        <span>▲</span>
                        <span className="font-bangla-ui font-medium">সহমত</span>
                        <span className="text-[11px]">{item.resonances || 0}</span>
                      </button>
                    </div>
                  </div>

                  {/* Nested Creator Replies Thread */}
                  {item.replies && item.replies.length > 0 && (
                    <div className="mt-3 pt-2 space-y-2">
                      {item.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className="pl-3.5 sm:pl-4 border-l-2 border-primary/70 bg-primary/5 rounded-r-xl p-3.5 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <CornerDownRight className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="text-xs font-bold text-foreground font-bangla-ui">
                                {rep.authorName}
                              </span>
                              <span className="text-[10px] font-mono text-primary font-bold px-1.5 py-0.2 rounded bg-primary/20">
                                FOUNDER
                              </span>
                              {rep.statusUpdatedTo && (
                                <span className="text-[10px] font-bangla text-muted-foreground">
                                  ▸ স্ট্যাটাস: {FEEDBACK_STATUS_META[rep.statusUpdatedTo]?.labelBangla}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {formatPrettyDate(rep.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-foreground font-bangla leading-relaxed">
                            {rep.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Creator Action Console (In-Card) */}
                  {creatorUnlocked && isReplying && (
                    <div className="mt-3 p-3.5 rounded-xl bg-surface-elevated border border-primary/40 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-primary">
                          [CREATOR_ACTION_CONSOLE]
                        </span>
                        <span className="text-[11px] font-bangla text-muted-foreground">
                          স্ট্যাটাস পরিবর্তন বা অফিশিয়াল রিপ্লাই দিন
                        </span>
                      </div>

                      {/* 1-Click Status Switcher */}
                      <div className="flex flex-wrap gap-1.5">
                        {(['in_progress', 'resolved', 'planned', 'open'] as FeedbackStatus[]).map(
                          (st) => {
                            const isCurrent = item.status === st;
                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => {
                                  handleStatusQuickChange(item.id, st);
                                  setReplyStatusMap((prev) => ({ ...prev, [item.id]: st }));
                                }}
                                className={cn(
                                  'px-2.5 py-1 rounded-md text-xs font-bangla-ui border transition-colors flex items-center gap-1',
                                  isCurrent
                                    ? 'bg-primary text-primary-foreground border-primary font-semibold'
                                    : 'bg-background hover:bg-surface text-foreground border-border'
                                )}
                              >
                                <StatusPulse status={st} />
                                <span>{FEEDBACK_STATUS_META[st].labelBangla}</span>
                              </button>
                            );
                          }
                        )}
                      </div>

                      {/* Quick Reply Presets */}
                      <div className="flex flex-col gap-1">
                        {CREATOR_QUICK_REPLIES.slice(0, 3).map((preset, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setReplyTextMap((prev) => ({ ...prev, [item.id]: preset }))
                              }
                              className="flex-1 text-left px-2.5 py-1.5 rounded-md bg-background hover:bg-surface border border-border text-xs font-bangla text-foreground truncate"
                            >
                              ▸ {preset}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendReply(item.id, preset)}
                              className="px-2.5 py-1.5 rounded-md bg-primary/15 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bangla-ui font-semibold shrink-0 transition-colors"
                            >
                              পাঠান
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Custom Reply */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyTextMap[item.id] || ''}
                          onChange={(e) =>
                            setReplyTextMap((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          placeholder="কাস্টম রিপ্লাই লিখুন..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-bangla text-foreground focus:outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(item.id)}
                          className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold font-bangla-ui hover:bg-primary-hover flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>রিপ্লাই</span>
                        </button>
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
  );
}
