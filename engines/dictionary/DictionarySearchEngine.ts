// engines/dictionary/DictionarySearchEngine.ts
// NEXUS Academy — High-speed English Search Engine for Problem-Solving Hub

import type { DictionaryEntry } from '@/types/dictionary.types';

export interface SearchOptions {
  category?: string;
  bookmarksOnly?: boolean;
  bookmarkedIds?: string[];
}

export class DictionarySearchEngine {
  private entries: DictionaryEntry[];

  constructor(entries: DictionaryEntry[]) {
    this.entries = entries;
  }

  public search(query: string, options: SearchOptions = {}): DictionaryEntry[] {
    const rawQuery = (query || '').trim().toLowerCase();
    const queryTokens = rawQuery.split(/\s+/).filter(Boolean);

    let candidates = this.entries;

    // Filter by category
    if (options.category && options.category !== 'all') {
      candidates = candidates.filter((e) => e.category === options.category);
    }

    // Filter by bookmarks
    if (options.bookmarksOnly && options.bookmarkedIds) {
      const bookmarkedSet = new Set(options.bookmarkedIds);
      candidates = candidates.filter((e) => bookmarkedSet.has(e.id));
    }

    // If query is empty, return candidate list in original order
    if (queryTokens.length === 0) {
      return candidates;
    }

    const scored: Array<{ entry: DictionaryEntry; score: number }> = [];

    for (const entry of candidates) {
      const score = this.calculateScore(entry, rawQuery, queryTokens);
      if (score > 0) {
        scored.push({ entry, score });
      }
    }

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.entry);
  }

  private calculateScore(entry: DictionaryEntry, rawQuery: string, tokens: string[]): number {
    let score = 0;

    const idLower = entry.id.toLowerCase();
    const termLower = entry.term.toLowerCase();
    const summaryLower = (entry.summary || '').toLowerCase();
    const defLower = (entry.englishDefinition || '').toLowerCase();
    const insightLower = (entry.mentalModel?.keyInsight || '').toLowerCase();
    const tagsLower = (entry.curriculum?.tags || entry.tags || []).map((t) => t.toLowerCase());
    const errorsLower = (entry.troubleshooting?.associatedErrors || []).map((e) => e.toLowerCase());
    const symptomsLower = (entry.troubleshooting?.symptoms || []).map((s) => s.toLowerCase());

    // 1. Full Query Matching (Highest Priority)
    if (idLower === rawQuery) score += 100;
    else if (idLower.includes(rawQuery)) score += 60;

    if (termLower === rawQuery) score += 90;
    else if (termLower.includes(rawQuery)) score += 50;

    for (const err of errorsLower) {
      if (err === rawQuery) score += 80;
      else if (err.includes(rawQuery)) score += 50;
    }

    for (const symptom of symptomsLower) {
      if (symptom === rawQuery || symptom.includes(rawQuery)) score += 70;
    }

    for (const tag of tagsLower) {
      if (tag === rawQuery) score += 50;
      else if (tag.includes(rawQuery)) score += 30;
    }

    if (defLower.includes(rawQuery) || summaryLower.includes(rawQuery) || insightLower.includes(rawQuery)) {
      score += 30;
    }

    // 2. Token Matching (For Multi-word queries like "numbers joining", "input conversion", "name error")
    for (const token of tokens) {
      if (idLower.includes(token)) score += 25;
      if (termLower.includes(token)) score += 20;

      for (const err of errorsLower) {
        if (err.includes(token)) score += 20;
      }

      for (const symptom of symptomsLower) {
        if (symptom.includes(token)) score += 20;
      }

      for (const tag of tagsLower) {
        if (tag.includes(token)) score += 15;
      }

      if (defLower.includes(token) || summaryLower.includes(token) || insightLower.includes(token)) {
        score += 10;
      }
    }

    return score;
  }
}
