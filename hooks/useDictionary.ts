// hooks/useDictionary.ts
// NEXUS Academy — Interactive Dictionary & Problem Solving Hook
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from '@/services/LocalStorageDataService';
import { DictionarySearchEngine } from '@/engines/dictionary/DictionarySearchEngine';
import type { DictionaryEntry, LearnerDictionaryProgress } from '@/types/dictionary.types';

export const DICTIONARY_CATEGORIES = [
  { id: 'all', label: 'সকল কনসেপ্ট (All)' },
  { id: 'python_core', label: 'পাইথন কোর (Core)' },
  { id: 'data_types', label: 'ডেটা টাইপস (Data Types)' },
  { id: 'control_flow', label: 'কন্ট্রোল ফ্লো (Flow)' },
  { id: 'tools', label: 'টুলস ও ফাংশন (Tools)' },
  { id: 'bookmarked', label: 'বুকমার্ক করা (Saved)' },
] as const;

export function useDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [progress, setProgress] = useState<LearnerDictionaryProgress>({
    viewedTermIds: [],
    bookmarks: [],
    updatedAt: new Date().toISOString(),
  });

  // Load entries and progress on mount & on storage update
  useEffect(() => {
    const loadedEntries = storage.getDictionaryEntries();
    setEntries(loadedEntries);

    const loadProgress = () => {
      const p = storage.getDictionaryProgress();
      setProgress(p);
    };

    loadProgress();

    window.addEventListener('nexus_storage_update', loadProgress);
    return () => {
      window.removeEventListener('nexus_storage_update', loadProgress);
    };
  }, []);

  const searchEngine = useMemo(() => {
    return new DictionarySearchEngine(entries);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (selectedCategory === 'bookmarked') {
      return searchEngine.search(searchQuery, {
        bookmarksOnly: true,
        bookmarkedIds: progress.bookmarks,
      });
    }

    return searchEngine.search(searchQuery, {
      category: selectedCategory,
    });
  }, [searchEngine, searchQuery, selectedCategory, progress.bookmarks]);

  const toggleBookmark = useCallback((termId: string) => {
    const currentProgress = storage.getDictionaryProgress();
    const bookmarks = new Set(currentProgress.bookmarks || []);

    if (bookmarks.has(termId)) {
      bookmarks.delete(termId);
    } else {
      bookmarks.add(termId);
    }

    const updated: LearnerDictionaryProgress = {
      ...currentProgress,
      bookmarks: Array.from(bookmarks),
      updatedAt: new Date().toISOString(),
    };

    storage.saveDictionaryProgress(updated);
    setProgress(updated);
  }, []);

  const trackTermViewed = useCallback((termId: string) => {
    const currentProgress = storage.getDictionaryProgress();
    const viewed = new Set(currentProgress.viewedTermIds || []);
    viewed.add(termId);

    const updated: LearnerDictionaryProgress = {
      ...currentProgress,
      viewedTermIds: Array.from(viewed),
      lastAccessedTermId: termId,
      updatedAt: new Date().toISOString(),
    };

    storage.saveDictionaryProgress(updated);
    setProgress(updated);
  }, []);

  const isBookmarked = useCallback((termId: string) => {
    return (progress.bookmarks || []).includes(termId);
  }, [progress.bookmarks]);

  const isViewed = useCallback((termId: string) => {
    return (progress.viewedTermIds || []).includes(termId);
  }, [progress.viewedTermIds]);

  return {
    entries,
    filteredEntries,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories: DICTIONARY_CATEGORIES,
    bookmarks: progress.bookmarks,
    viewedTerms: progress.viewedTermIds,
    toggleBookmark,
    trackTermViewed,
    isBookmarked,
    isViewed,
  };
}