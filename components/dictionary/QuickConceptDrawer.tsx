// components/dictionary/QuickConceptDrawer.tsx
// NEXUS Academy — In-Situ Slide-Over Concept Modal triggered from errors & terminals
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useInSituDrawer } from '@/hooks/useInSituDrawer';
import { storage } from '@/services/LocalStorageDataService';
import type { DictionaryEntry } from '@/types/dictionary.types';
import { DictionaryDetailDrawer } from './DictionaryDetailDrawer';

export const QuickConceptDrawer: React.FC = () => {
  const { isOpen, activeTermId, closeDrawer, openConcept } = useInSituDrawer();
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    // Load entries on mount
    setEntries(storage.getDictionaryEntries());
    setBookmarkedIds(storage.getDictionaryProgress().bookmarks || []);

    const handleStorageUpdate = () => {
      setBookmarkedIds(storage.getDictionaryProgress().bookmarks || []);
    };

    window.addEventListener('nexus_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('nexus_storage_update', handleStorageUpdate);
  }, []);

  const activeEntry = useMemo(() => {
    if (!activeTermId || entries.length === 0) return null;
    return (
      entries.find(
        (e) =>
          e.id.toLowerCase() === activeTermId.toLowerCase() ||
          e.term.toLowerCase() === activeTermId.toLowerCase() ||
          (e.troubleshooting?.associatedErrors || []).some(
            (err) => err.toLowerCase() === activeTermId.toLowerCase()
          )
      ) || null
    );
  }, [activeTermId, entries]);

  const isBookmarked = activeEntry ? bookmarkedIds.includes(activeEntry.id) : false;

  const handleToggleBookmark = (termId: string) => {
    const currentProgress = storage.getDictionaryProgress();
    const set = new Set(currentProgress.bookmarks || []);
    if (set.has(termId)) {
      set.delete(termId);
    } else {
      set.add(termId);
    }
    const updated = {
      ...currentProgress,
      bookmarks: Array.from(set),
      updatedAt: new Date().toISOString(),
    };
    storage.saveDictionaryProgress(updated);
    setBookmarkedIds(updated.bookmarks);
  };

  if (!isOpen || !activeEntry) return null;

  return (
    <DictionaryDetailDrawer
      entry={activeEntry}
      isOpen={isOpen}
      onClose={closeDrawer}
      isBookmarked={isBookmarked}
      onToggleBookmark={handleToggleBookmark}
      onSelectRelatedTerm={(termId) => openConcept(termId)}
    />
  );
};
