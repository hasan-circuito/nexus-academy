// app/dictionary/page.tsx
// NEXUS Academy — Interactive Problem-Solving & Knowledge Hub Page
'use client';

import React from 'react';
import { useDictionary } from '@/hooks/useDictionary';
import { useInSituDrawer } from '@/hooks/useInSituDrawer';
import { DictionaryHeader } from '@/components/dictionary/DictionaryHeader';
import { CategoryFilterPills } from '@/components/dictionary/CategoryFilterPills';
import { DictionaryCardGrid } from '@/components/dictionary/DictionaryCardGrid';
import type { DictionaryEntry } from '@/types/dictionary.types';

export default function DictionaryPage() {
  const {
    filteredEntries,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    bookmarks,
    viewedTerms,
    toggleBookmark,
    trackTermViewed,
  } = useDictionary();

  const { openConcept } = useInSituDrawer();

  const handleSelectEntry = (entry: DictionaryEntry) => {
    openConcept(entry.id);
    trackTermViewed(entry.id);
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header with Search & Suggestions */}
      <DictionaryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalResults={filteredEntries.length}
      />

      {/* Category Pills Bar */}
      <CategoryFilterPills
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        bookmarkCount={bookmarks.length}
      />

      {/* Results Count & Meta */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1 border-b border-border/40 pb-2">
        <span>
          দেখাচ্ছে: <strong className="text-foreground">{filteredEntries.length}</strong> টি কনসেপ্ট
        </span>
        {searchQuery && (
          <span>
            সার্চ কোয়েরি: &ldquo;<strong className="text-primary">{searchQuery}</strong>&rdquo;
          </span>
        )}
      </div>

      {/* Responsive Card Grid */}
      <DictionaryCardGrid
        entries={filteredEntries}
        onSelectEntry={handleSelectEntry}
        bookmarkedIds={bookmarks}
        onToggleBookmark={toggleBookmark}
        viewedIds={viewedTerms}
      />
    </div>
  );
}

