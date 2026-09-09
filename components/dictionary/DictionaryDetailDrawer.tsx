// components/dictionary/DictionaryDetailDrawer.tsx
// NEXUS Academy — 4-Layer Problem Solving Detail Drawer with On-Demand Micro-Sandbox
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Bookmark,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  ExternalLink,
  BookOpen,
  Terminal,
  ArrowRight,
} from 'lucide-react';
import type { DictionaryEntry } from '@/types/dictionary.types';
import { PythonEditor } from '@/components/editor/PythonEditor';
import { ExecutionOutput } from '@/components/shared/ExecutionOutput';
import { usePythonEngine } from '@/hooks/usePythonEngine';

interface DictionaryDetailDrawerProps {
  entry: DictionaryEntry | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (termId: string) => void;
  onSelectRelatedTerm?: (termId: string) => void;
}

export const DictionaryDetailDrawer: React.FC<DictionaryDetailDrawerProps> = ({
  entry,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSelectRelatedTerm,
}) => {
  const [sandboxCode, setSandboxCode] = useState('');
  const [isSandboxOpen, setIsSandboxOpen] = useState(true);

  const { runCode, isRunning, lastResult, error: engineError } = usePythonEngine();

  // Synchronize starter code when entry changes
  useEffect(() => {
    if (entry) {
      setSandboxCode(entry.sandbox?.starterCode || entry.exampleCode || '');
    }
  }, [entry?.id]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !entry) return null;

  const handleRunSandbox = () => {
    if (sandboxCode.trim()) {
      runCode(sandboxCode);
    }
  };

  const handleResetSandbox = () => {
    setSandboxCode(entry.sandbox?.starterCode || entry.exampleCode || '');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-card border-l border-border shadow-2xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-border/80 bg-surface/80 backdrop-blur flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {entry.category.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-muted-foreground border border-border">
                Mission {entry.curriculum?.introducedInMissionId || entry.introducedInMissionId}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground font-sans">
              {entry.term}
            </h2>
            <p className="text-sm text-primary font-bangla font-semibold mt-0.5">
              {entry.banglaTerm}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleBookmark(entry.id)}
              className="p-2 rounded-xl border border-border hover:bg-surface text-muted-foreground hover:text-amber-400 transition-colors"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark concept'}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-border hover:bg-surface text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 font-sans">
          
          {/* Definition Banner */}
          <div className="p-4 rounded-2xl bg-surface/50 border border-border/70 space-y-2">
            <p className="text-sm md:text-base font-bangla text-foreground leading-relaxed">
              {entry.banglaDefinition}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              &ldquo;{entry.englishDefinition}&rdquo;
            </p>
          </div>

          {/* Layer 1: Mental Model & Analogy */}
          {entry.mentalModel && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-base font-bangla-ui">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>লেয়ার ১: মেন্টাল মডেল ও বাস্তব তুলনা</span>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-sm font-bangla text-foreground leading-relaxed">
                    <strong className="text-primary font-semibold">বাস্তব তুলনা: </strong>
                    {entry.mentalModel.analogy}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 shrink-0" />
                  <p className="text-sm font-bangla text-muted-foreground leading-relaxed">
                    {entry.mentalModel.explanation}
                  </p>
                </div>

                {entry.mentalModel.keyInsight && (
                  <div className="p-3 rounded-xl bg-card border border-primary/30 text-xs font-bangla text-primary font-medium flex items-center gap-2">
                    <span>💡 মূল শিক্ষা:</span>
                    <span>{entry.mentalModel.keyInsight}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Layer 2: Troubleshooting (Anti-Pattern vs Fix Pattern) */}
          {entry.troubleshooting && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-bold text-base font-bangla-ui">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span>লেয়ার ২: ট্রাবলশুটিং ও ফিক্স প্যাটার্ন</span>
                </div>
                {entry.troubleshooting.associatedErrors?.length > 0 && (
                  <div className="flex gap-1.5">
                    {entry.troubleshooting.associatedErrors.map((err) => (
                      <span key={err} className="text-[11px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-mono border border-red-500/20">
                        {err}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Symptoms */}
              {entry.troubleshooting.symptoms?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground font-bangla">
                  <span className="font-semibold text-foreground">লক্ষণ (Symptoms):</span>
                  {entry.troubleshooting.symptoms.map((sym, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-surface border border-border text-[11px]">
                      &bull; {sym}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {/* Red Anti-Pattern */}
                {entry.troubleshooting.antiPattern && (
                  <div className="rounded-xl border border-red-500/40 bg-red-950/15 overflow-hidden">
                    <div className="px-3.5 py-2 bg-red-950/40 border-b border-red-500/30 flex items-center justify-between text-xs text-red-400 font-semibold font-bangla">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span>ভুল প্যাটার্ন (Anti-pattern)</span>
                      </div>
                    </div>
                    <pre className="p-3.5 font-mono text-xs text-red-300 overflow-x-auto whitespace-pre-wrap">
                      {entry.troubleshooting.antiPattern.code}
                    </pre>
                    <div className="p-3 bg-red-950/30 border-t border-red-500/20 text-xs text-red-300 font-bangla">
                      <strong>কেন সমস্যা? </strong>
                      {entry.troubleshooting.antiPattern.explanation}
                    </div>
                  </div>
                )}

                {/* Green Fix Pattern */}
                {entry.troubleshooting.fixPattern && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/15 overflow-hidden">
                    <div className="px-3.5 py-2 bg-emerald-950/40 border-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400 font-semibold font-bangla">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>সঠিক সমাধান (Fix pattern)</span>
                      </div>
                    </div>
                    <pre className="p-3.5 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                      {entry.troubleshooting.fixPattern.code}
                    </pre>
                    <div className="p-3 bg-emerald-950/30 border-t border-emerald-500/20 text-xs text-emerald-300 font-bangla">
                      <strong>কীভাবে ঠিক হলো? </strong>
                      {entry.troubleshooting.fixPattern.explanation}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Layer 3: On-Demand Live Micro-Sandbox */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold text-base font-bangla-ui">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span>লেয়ার ৩: লাইভ মাইক্রো-স্যান্ডবক্স</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSandboxOpen(!isSandboxOpen)}
                className="text-xs text-primary hover:underline font-bangla font-semibold cursor-pointer"
              >
                {isSandboxOpen ? 'লুকিয়ে রাখো' : 'স্যান্ডবক্স খোলো'}
              </button>
            </div>

            {isSandboxOpen && (
              <div className="rounded-2xl border border-border bg-[#0d1117] p-4 space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/50 pb-2">
                  <span className="font-mono">sandbox.py</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetSandbox}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-card border border-border text-xs transition-colors"
                      title="Reset starter code"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>রিসেট</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRunSandbox}
                      disabled={isRunning}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>{isRunning ? 'চলছে...' : 'রান করো'}</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-border/60">
                  <PythonEditor
                    value={sandboxCode}
                    onChange={setSandboxCode}
                    height="180px"
                    filename="sandbox.py"
                  />
                </div>

                {/* Execution Output */}
                <ExecutionOutput
                  result={lastResult}
                  isRunning={isRunning}
                />

                {/* Experiment Prompts */}
                {entry.sandbox?.experimentPrompts?.length > 0 && (
                  <div className="p-3 bg-surface/40 rounded-xl border border-border/40 text-xs font-bangla space-y-1">
                    <span className="font-semibold text-foreground">💡 কী পরিবর্তন করে পরীক্ষা করবে:</span>
                    <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                      {entry.sandbox.experimentPrompts.map((prompt, i) => (
                        <li key={i}>{prompt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Layer 4: Curricular Connections */}
          <section className="space-y-3 pt-2 border-t border-border/60">
            <div className="flex items-center gap-2 text-foreground font-bold text-base font-bangla-ui">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>লেয়ার ৪: পাঠ্যক্রম ও সংশ্লিষ্ট মিশন</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface/50 border border-border">
              <div>
                <p className="text-xs text-muted-foreground font-bangla">এই কনসেপ্টটি বিস্তারিত শেখানো হয়েছে:</p>
                <h4 className="text-sm font-bold text-foreground font-bangla mt-0.5">
                  মিশন {entry.curriculum?.introducedInMissionId || entry.introducedInMissionId}
                </h4>
              </div>
              <Link
                href={`/mission/mission-${(entry.curriculum?.introducedInMissionId || entry.introducedInMissionId || '001').padStart(3, '0')}/step/1`}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bangla font-semibold text-xs hover:bg-primary/90 transition-colors shadow"
              >
                <span>মিশনে যাও</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Related Terms Chips */}
            {(entry.curriculum?.relatedTermIds || entry.relatedTermIds)?.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs text-muted-foreground font-bangla font-semibold">
                  সম্পর্কিত অন্যান্য কনসেপ্ট:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(entry.curriculum?.relatedTermIds || entry.relatedTermIds).map((relId) => (
                    <button
                      key={relId}
                      type="button"
                      onClick={() => onSelectRelatedTerm?.(relId)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      <span>{relId}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};
