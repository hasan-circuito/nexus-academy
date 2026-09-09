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
    if (!rawQuery) {
      return candidates;
    }

    const cleanQuery = rawQuery.replace(/[^a-z0-9_ ]/g, ' ').replace(/\s+/g, ' ').trim();
    const queryTokens = Array.from(
      new Set([
        ...rawQuery.split(/\s+/).filter(Boolean),
        ...cleanQuery.split(/\s+/).filter(Boolean),
      ])
    );

    const scored: Array<{ entry: DictionaryEntry; score: number }> = [];

    for (const entry of candidates) {
      const score = this.calculateScore(entry, rawQuery, cleanQuery, queryTokens);
      if (score > 0) {
        scored.push({ entry, score });
      }
    }

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.entry);
  }

  private getWordVariants(word: string): string[] {
    const clean = word.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const variants = new Set<string>([clean, word.toLowerCase()]);
    if (clean.endsWith('ies') && clean.length > 4) {
      variants.add(clean.slice(0, -3) + 'y');
    } else if (clean.endsWith('es') && clean.length > 4) {
      variants.add(clean.slice(0, -2));
      variants.add(clean.slice(0, -1));
    } else if (clean.endsWith('s') && clean.length > 3) {
      variants.add(clean.slice(0, -1));
    }
    return Array.from(variants).filter(Boolean);
  }

  private calculateScore(
    entry: DictionaryEntry,
    rawQuery: string,
    cleanQuery: string,
    tokens: string[]
  ): number {
    let score = 0;

    const idLower = entry.id.toLowerCase();
    const idSpaced = idLower.replace(/_/g, ' ');
    const termLower = entry.term.toLowerCase();
    const summaryLower = (entry.summary || '').toLowerCase();
    const defLower = (entry.englishDefinition || '').toLowerCase();
    const insightLower = (entry.mentalModel?.keyInsight || '').toLowerCase();
    const tagsLower = (entry.curriculum?.tags || entry.tags || []).map((t) => t.toLowerCase());
    const errorsLower = (entry.troubleshooting?.associatedErrors || []).map((e) => e.toLowerCase());
    const symptomsLower = (entry.troubleshooting?.symptoms || []).map((s) => s.toLowerCase());

    // 1. Full Query Matching (Highest Priority)
    if (idLower === rawQuery || idSpaced === rawQuery || idSpaced === cleanQuery) {
      score += 150;
    } else if (idLower.includes(cleanQuery) || (cleanQuery.length > 3 && cleanQuery.includes(idLower))) {
      score += 60;
    }

    if (termLower === rawQuery || termLower === cleanQuery) {
      score += 120;
    } else if (termLower.includes(rawQuery) || termLower.includes(cleanQuery)) {
      score += 50;
    }

    let bestErrScore = 0;
    for (const err of errorsLower) {
      if (err === rawQuery || err === cleanQuery) bestErrScore = Math.max(bestErrScore, 100);
      else if (err.includes(cleanQuery) || (cleanQuery.length > 4 && cleanQuery.includes(err))) {
        bestErrScore = Math.max(bestErrScore, 60);
      }
    }
    score += bestErrScore;

    let bestSymScore = 0;
    for (const symptom of symptomsLower) {
      if (symptom === rawQuery || symptom === cleanQuery) bestSymScore = Math.max(bestSymScore, 90);
      else if (symptom.includes(rawQuery) || symptom.includes(cleanQuery)) bestSymScore = Math.max(bestSymScore, 70);
      else if (cleanQuery.length > 5 && cleanQuery.includes(symptom)) bestSymScore = Math.max(bestSymScore, 60);
    }
    score += bestSymScore;

    let bestTagScore = 0;
    for (const tag of tagsLower) {
      if (tag === rawQuery || tag === cleanQuery) bestTagScore = Math.max(bestTagScore, 60);
      else if (tag.includes(cleanQuery)) bestTagScore = Math.max(bestTagScore, 30);
    }
    score += bestTagScore;

    if (
      defLower.includes(cleanQuery) ||
      summaryLower.includes(cleanQuery) ||
      insightLower.includes(cleanQuery)
    ) {
      score += 25;
    }

    // 2. Token & Variant Matching
    for (const token of tokens) {
      const variants = this.getWordVariants(token);

      for (const variant of variants) {
        if (!variant || variant.length < 2) continue;

        // Exact match against ID or spaced ID
        if (idLower === variant || idSpaced === variant) {
          score += 60;
        } else if (variant.length >= 4 && (idLower.includes(variant) || variant.includes(idLower))) {
          score += 25;
        }

        // Match against term words
        const termWords = termLower.replace(/[^a-z0-9_ ]/g, ' ').split(/\s+/);
        if (termWords.includes(variant)) {
          score += 40;
        } else if (variant.length >= 4 && termLower.includes(variant)) {
          score += 20;
        }

        // Match against error types
        let tokenErrScore = 0;
        for (const err of errorsLower) {
          if (err === variant) tokenErrScore = Math.max(tokenErrScore, 40);
          else if (variant.length >= 4 && err.includes(variant)) tokenErrScore = Math.max(tokenErrScore, 20);
        }
        score += tokenErrScore;

        // Match against symptoms
        let tokenSymScore = 0;
        for (const symptom of symptomsLower) {
          if (symptom.includes(variant)) tokenSymScore = Math.max(tokenSymScore, 25);
        }
        score += tokenSymScore;

        // Match against tags
        let tokenTagScore = 0;
        for (const tag of tagsLower) {
          if (tag === variant) tokenTagScore = Math.max(tokenTagScore, 30);
          else if (variant.length >= 4 && tag.includes(variant)) tokenTagScore = Math.max(tokenTagScore, 15);
        }
        score += tokenTagScore;

        // Match against definition / summary
        if (
          defLower.includes(variant) ||
          summaryLower.includes(variant) ||
          insightLower.includes(variant)
        ) {
          score += 10;
        }
      }
    }

    return score;
  }
}

