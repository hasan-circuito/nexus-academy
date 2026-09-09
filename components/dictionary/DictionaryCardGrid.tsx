// components/dictionary/DictionaryCardGrid.tsx
// NEXUS Academy — Responsive Grid of Concept Cards
'use client';

import React from 'react';
import { Bookmark, AlertTriangle, ArrowUpRight, BookOpen, Lightbulb } from 'lucide-react';
import type { DictionaryEntry } from '@/types/dictionary.types';

interface DictionaryCardGridProps {
  entries: DictionaryEntry[];
  onSelectEntry: (entry: DictionaryEntry) => void;
  bookmarkedIds?: string[];
  onToggleBookmark: (termId: string) => void;
  viewedIds?: string[];
}

export const DictionaryCardGrid: React.FC<DictionaryCardGridProps> = ({
  entries,
  onSelectEntry,
  bookmarkedIds = [],
  onToggleBookmark,
  viewedIds = [],
}) => {
  if (entries.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-surface/80 border border-border mx-auto flex items-center justify-center text-muted-foreground">
          <BookOpen className="w-8 h-8 opacity-60" />
        </div>
        <h3 className="text-xl font-bold text-foreground font-bangla-ui">কোনো কনসেপ্ট পাওয়া যায়নি</h3>
        <p className="text-sm text-muted-foreground font-bangla">
          তুমি যা খুঁজছো তা এই বানানে বা ক্যাটাগরিতে মেলেনি। অন্য কোনো লক্ষণ বা কি-ওয়ার্ড দিয়ে সার্চ করে দেখো (যেমন: TypeError, quotes, joining)।
        </p>
      </div>
    );
  }

  const bookmarkedSet = new Set(bookmarkedIds);
  const viewedSet = new Set(viewedIds);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
      {entries.map((entry) => {
        const isSaved = bookmarkedSet.has(entry.id);
        const isRead = viewedSet.has(entry.id);
        const hasAntiPattern = !!entry.troubleshooting?.antiPattern;

        return (
          <div
            key={entry.id}
            onClick={() => onSelectEntry(entry)}
            className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
          >
            {/* Top Bar */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 font-sans">
                      {entry.term}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </h3>
                  </div>
                  <span className="text-xs font-bangla text-muted-foreground font-medium">
                    {entry.banglaTerm}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(entry.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-surface/80 text-muted-foreground hover:text-amber-400 transition-colors"
                  aria-label={isSaved ? 'Remove bookmark' : 'Bookmark term'}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`}
                  />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
                  {entry.category.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface text-muted-foreground border border-border">
                  Mission {entry.curriculum?.introducedInMissionId || entry.introducedInMissionId}
                </span>
                {hasAntiPattern && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>ফিক্স প্যাটার্ন</span>
                  </span>
                )}
                {isRead && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400">
                    দেখা হয়েছে
                  </span>
                )}
              </div>

              {/* Summary */}
              <p className="text-sm text-muted-foreground font-bangla line-clamp-2 leading-relaxed">
                {entry.summary || entry.banglaDefinition}
              </p>
            </div>

            {/* Bottom Key Insight Teaser */}
            {entry.mentalModel?.keyInsight && (
              <div className="mt-4 pt-3 border-t border-border/50 flex items-start gap-2 text-xs text-muted-foreground font-bangla bg-surface/30 p-2.5 rounded-xl">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{entry.mentalModel.keyInsight}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
