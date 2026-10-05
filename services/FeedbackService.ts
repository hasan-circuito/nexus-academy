// services/FeedbackService.ts
// NEXUS Academy — Hybrid Feedback & Telemetry Persistence Service
// Combines Seed Data + LocalStorage Instant Persistence + Next.js /api/feedback Cloud Sync.

import initialFeedbackData from '@/data/feedback/initial-feedback.json';
import {
  type CreateDirectiveInput,
  type CreateFeedbackInput,
  type CreateReplyInput,
  type CreatorDirective,
  type CreatorReply,
  type FeedbackCategory,
  type FeedbackImpact,
  type FeedbackItem,
  type FeedbackStatus,
  type FeedbackStorePayload,
  type FeedbackSyncStatus,
  CREATOR_CONSOLE_PIN,
} from '@/types/feedback.types';
import { DEV_MODE_PIN } from '@/types/settings.types';

const STORAGE_KEYS = {
  ITEMS: 'nexus_feedback_items_v1',
  DIRECTIVES: 'nexus_feedback_directives_v1',
  RESONATED_IDS: 'nexus_feedback_resonated_v1',
  POLL_VOTES: 'nexus_feedback_poll_votes_v1',
  CREATOR_UNLOCKED: 'nexus_creator_unlocked_v1',
} as const;

const VALID_CATEGORIES: FeedbackCategory[] = ['improve', 'problem', 'feedback'];
const VALID_STATUSES: FeedbackStatus[] = ['open', 'in_progress', 'planned', 'resolved'];
const VALID_IMPACTS: FeedbackImpact[] = ['standard', 'high_impact', 'blocker'];

function cloneSeedItems(): FeedbackItem[] {
  return JSON.parse(JSON.stringify(initialFeedbackData.items || [])) as FeedbackItem[];
}

function cloneSeedDirectives(): CreatorDirective[] {
  return JSON.parse(JSON.stringify(initialFeedbackData.directives || [])) as CreatorDirective[];
}

const MAX_STORED_ITEMS = 120;

export class FeedbackService {
  private memoryItems: FeedbackItem[] | null = null;
  private memoryDirectives: CreatorDirective[] | null = null;
  private memoryResonatedIds: string[] | null = null;
  private memoryPollVotes: Record<string, string> | null = null;
  private memoryCreatorUnlocked = false;

  /**
   * Returns merged FeedbackItems (local persistence + in-memory fallback + seed baseline).
   */
  public getItems(): FeedbackItem[] {
    const seedItems = cloneSeedItems();
    if (typeof window === 'undefined') {
      return this.memoryItems || seedItems;
    }

    let stored: FeedbackItem[] | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          stored = parsed.filter((i): i is FeedbackItem => Boolean(i && typeof i.id === 'string'));
        }
      }
    } catch {
      stored = null;
    }

    const baseList = stored ?? this.memoryItems;
    if (!baseList) return seedItems;

    // Merge stored/memory items with seed items so new seed items also appear
    // while preserving any local replies/status/resonance modifications on seed items.
    const storedMap = new Map<string, FeedbackItem>();
    for (const item of baseList) {
      storedMap.set(item.id, item);
    }

    const merged: FeedbackItem[] = [...baseList];
    for (const seed of seedItems) {
      if (!storedMap.has(seed.id)) {
        merged.push(seed);
      }
    }

    this.memoryItems = merged;
    return merged;
  }

  /**
   * Saves FeedbackItems to localStorage (with QuotaExceededError pruning + memory fallback) and dispatches update event.
   */
  public saveItems(items: FeedbackItem[]): void {
    this.memoryItems = items;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch {
      // If QuotaExceededError occurs, prune older non-seed items and retry
      try {
        const pruned = items.slice(0, MAX_STORED_ITEMS);
        localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(pruned));
      } catch {
        // Memory fallback (this.memoryItems) keeps session state intact
      }
    }
    try {
      window.dispatchEvent(new Event('nexus_feedback_update'));
    } catch {
      // Ignore event dispatch error in non-standard environments
    }
  }

  /**
   * Returns merged CreatorDirectives (local persistence + in-memory fallback + seed baseline).
   */
  public getDirectives(): CreatorDirective[] {
    const seedDirectives = cloneSeedDirectives();
    if (typeof window === 'undefined') {
      return this.memoryDirectives || seedDirectives;
    }

    let stored: CreatorDirective[] | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DIRECTIVES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          stored = parsed.filter((d): d is CreatorDirective => Boolean(d && typeof d.id === 'string'));
        }
      }
    } catch {
      stored = null;
    }

    const baseList = stored ?? this.memoryDirectives;
    if (!baseList) return seedDirectives;

    const storedMap = new Map<string, CreatorDirective>();
    for (const dir of baseList) {
      storedMap.set(dir.id, dir);
    }

    const merged: CreatorDirective[] = [...baseList];
    for (const seed of seedDirectives) {
      if (!storedMap.has(seed.id)) {
        merged.push(seed);
      }
    }

    this.memoryDirectives = merged;
    return merged;
  }

  /**
   * Saves CreatorDirectives to localStorage with in-memory fallback.
   */
  public saveDirectives(directives: CreatorDirective[]): void {
    this.memoryDirectives = directives;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.DIRECTIVES, JSON.stringify(directives));
    } catch {
      // Memory fallback keeps session state intact
    }
    try {
      window.dispatchEvent(new Event('nexus_feedback_update'));
    } catch {
      // Ignore
    }
  }

  /**
   * Gets list of feedback item IDs that the current learner has resonated (upvoted).
   */
  public getResonatedIds(): string[] {
    if (typeof window === 'undefined') return this.memoryResonatedIds || [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESONATED_IDS);
      if (!raw) return this.memoryResonatedIds || [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((id): id is string => typeof id === 'string');
        this.memoryResonatedIds = valid;
        return valid;
      }
      return this.memoryResonatedIds || [];
    } catch {
      return this.memoryResonatedIds || [];
    }
  }

  /**
   * Toggles resonance (▲ সহমত) on a feedback item.
   */
  public toggleResonance(feedbackId: string): { items: FeedbackItem[]; resonatedIds: string[]; active: boolean } {
    const items = this.getItems();
    const resonatedSet = new Set(this.getResonatedIds());
    const alreadyResonated = resonatedSet.has(feedbackId);

    const updatedItems = items.map((item) => {
      if (item.id !== feedbackId) return item;
      const delta = alreadyResonated ? -1 : 1;
      return {
        ...item,
        resonances: Math.max(0, (item.resonances || 0) + delta),
      };
    });

    if (alreadyResonated) {
      resonatedSet.delete(feedbackId);
    } else {
      resonatedSet.add(feedbackId);
    }

    const resonatedIds = Array.from(resonatedSet);
    this.memoryResonatedIds = resonatedIds;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.RESONATED_IDS, JSON.stringify(resonatedIds));
      } catch {
        // Ignore storage quota errors
      }
    }
    this.saveItems(updatedItems);

    return {
      items: updatedItems,
      resonatedIds,
      active: !alreadyResonated,
    };
  }

  /**
   * Gets the user's poll votes map: { [pollId]: optionId }
   */
  public getPollVotes(): Record<string, string> {
    if (typeof window === 'undefined') return this.memoryPollVotes || {};
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.POLL_VOTES);
      if (!raw) return this.memoryPollVotes || {};
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        this.memoryPollVotes = parsed as Record<string, string>;
        return this.memoryPollVotes;
      }
      return this.memoryPollVotes || {};
    } catch {
      return this.memoryPollVotes || {};
    }
  }

  /**
   * Votes on a Creator Directive Roadmap Poll option.
   */
  public voteOnPoll(
    directiveId: string,
    pollId: string,
    optionId: string
  ): { directives: CreatorDirective[]; pollVotes: Record<string, string> } {
    const directives = this.getDirectives();
    const pollVotes = this.getPollVotes();
    const previousOptionId = pollVotes[pollId];

    if (previousOptionId === optionId) {
      return { directives, pollVotes };
    }

    const updatedDirectives = directives.map((dir) => {
      if (dir.id !== directiveId || !dir.poll || dir.poll.id !== pollId) {
        return dir;
      }

      const updatedOptions = dir.poll.options.map((opt) => {
        let votes = opt.votes;
        if (opt.id === previousOptionId) {
          votes = Math.max(0, votes - 1);
        }
        if (opt.id === optionId) {
          votes += 1;
        }
        return { ...opt, votes };
      });

      return {
        ...dir,
        poll: {
          ...dir.poll,
          options: updatedOptions,
        },
      };
    });

    const updatedPollVotes = {
      ...pollVotes,
      [pollId]: optionId,
    };
    this.memoryPollVotes = updatedPollVotes;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.POLL_VOTES, JSON.stringify(updatedPollVotes));
      } catch {
        // Ignore
      }
    }

    this.saveDirectives(updatedDirectives);
    return { directives: updatedDirectives, pollVotes: updatedPollVotes };
  }

  /**
   * Creates a new FeedbackItem locally and syncs with /api/feedback.
   */
  public async submitFeedback(input: CreateFeedbackInput): Promise<FeedbackItem> {
    const cleanTitle = (input.title || '').trim();
    const cleanMessage = (input.message || '').trim();
    const cleanAuthor = (input.authorName || '').trim() || 'একজন শিক্ষার্থী (Learner)';
    const category: FeedbackCategory = VALID_CATEGORIES.includes(input.category)
      ? input.category
      : 'feedback';
    const impact: FeedbackImpact = VALID_IMPACTS.includes(input.impact)
      ? input.impact
      : 'standard';

    if (cleanTitle.length < 3) {
      throw new Error('শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে।');
    }
    if (cleanMessage.length < 5) {
      throw new Error('বিস্তারিত মতামত কমপক্ষে ৫ অক্ষরের হতে হবে।');
    }

    const items = this.getItems();
    const nextCodeNum = 100 + items.length + 1;

    let createdItem: FeedbackItem = {
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      code: `TLM-${String(nextCodeNum).padStart(4, '0')}`,
      category,
      status: 'open',
      impact,
      authorName: cleanAuthor,
      title: cleanTitle,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      resonances: 1,
      telemetry: input.telemetry,
      replies: [],
      syncOrigin: 'local',
    };

    // Try syncing with /api/feedback
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_feedback',
            payload: {
              id: createdItem.id,
              code: createdItem.code,
              category,
              impact,
              authorName: cleanAuthor,
              title: cleanTitle,
              message: cleanMessage,
              telemetry: input.telemetry,
            },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.item && typeof data.item.id === 'string') {
            createdItem = {
              ...createdItem,
              githubIssueNumber: data.item.githubIssueNumber,
              githubIssueUrl: data.item.githubIssueUrl,
              syncOrigin: data.item.syncOrigin || 'local',
            };
          }
        }
      } catch {
        // Offline or local-only fallback succeeds seamlessly
      }
    }

    const updatedItems = [createdItem, ...items];
    this.saveItems(updatedItems);

    // Auto-resonate own item
    const resonatedSet = new Set(this.getResonatedIds());
    resonatedSet.add(createdItem.id);
    const resonatedIds = Array.from(resonatedSet);
    this.memoryResonatedIds = resonatedIds;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.RESONATED_IDS, JSON.stringify(resonatedIds));
      } catch {
        // Ignore
      }
    }

    return createdItem;
  }

  /**
   * Adds an official Creator Reply and optionally updates the feedback item's status.
   */
  public async addCreatorReply(input: CreateReplyInput): Promise<{ items: FeedbackItem[]; reply: CreatorReply }> {
    const cleanContent = (input.content || '').trim();
    if (!input.feedbackId || !cleanContent) {
      throw new Error('রিপ্লাই মেসেজ খালি রাখা যাবে না।');
    }

    const newStatus =
      input.newStatus && VALID_STATUSES.includes(input.newStatus) ? input.newStatus : undefined;

    const reply: CreatorReply = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      authorName: (input.authorName || '').trim() || 'Hasan Mahmud',
      authorRole: 'Founder & Learner #0',
      badgeCode: 'FOUNDER // HASAN MAHMUD',
      content: cleanContent,
      createdAt: new Date().toISOString(),
      statusUpdatedTo: newStatus,
    };

    const items = this.getItems();
    const targetItem = items.find((i) => i.id === input.feedbackId);

    const updatedItems = items.map((item) => {
      if (item.id !== input.feedbackId) return item;
      return {
        ...item,
        status: newStatus || item.status,
        replies: [...(item.replies || []), reply],
      };
    });

    this.saveItems(updatedItems);

    // Sync with /api/feedback in background
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      try {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'creator_reply',
            payload: {
              replyId: reply.id,
              feedbackId: input.feedbackId,
              content: cleanContent,
              newStatus,
              authorName: reply.authorName,
              githubIssueNumber: targetItem?.githubIssueNumber,
            },
          }),
        });
      } catch {
        // Local persistence already succeeded
      }
    }

    return { items: updatedItems, reply };
  }

  /**
   * Updates the status of a feedback item directly (In-Card Creator Status Switcher).
   */
  public async updateItemStatus(feedbackId: string, status: FeedbackStatus): Promise<FeedbackItem[]> {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const items = this.getItems();
    const targetItem = items.find((i) => i.id === feedbackId);
    const updatedItems = items.map((item) =>
      item.id === feedbackId ? { ...item, status } : item
    );
    this.saveItems(updatedItems);

    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      try {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_status',
            payload: {
              feedbackId,
              status,
              githubIssueNumber: targetItem?.githubIssueNumber,
            },
          }),
        });
      } catch {
        // Local persistence already succeeded
      }
    }

    return updatedItems;
  }

  /**
   * Creates a new Creator Directive (Announcement / Roadmap Update).
   */
  public async createDirective(input: CreateDirectiveInput): Promise<CreatorDirective[]> {
    const cleanTitle = (input.title || '').trim();
    const cleanContent = (input.content || '').trim();
    if (!cleanTitle || !cleanContent) {
      throw new Error('নির্দেশনার শিরোনাম এবং বিস্তারিত বার্তা আবশ্যক।');
    }

    const directives = this.getDirectives();
    const newDirective: CreatorDirective = {
      id: `dir-${Date.now()}`,
      code: `DIR-2026.${String(directives.length + 3).padStart(2, '0')}`,
      authorName: 'Hasan Mahmud',
      authorBadge: 'FOUNDER // LEARNER #0',
      tag: (input.tag || '').trim() || '[DIRECTIVE // PLATFORM_UPDATE]',
      title: cleanTitle,
      content: cleanContent,
      createdAt: new Date().toISOString(),
      pinned: input.pinned ?? true,
    };

    const updatedDirectives = [newDirective, ...directives];
    this.saveDirectives(updatedDirectives);

    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      try {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_directive',
            payload: newDirective,
          }),
        });
      } catch {
        // Local persistence already succeeded
      }
    }

    return updatedDirectives;
  }

  /**
   * Syncs local store with /api/feedback GET endpoint to pull any new GitHub Cloud issues,
   * creator replies, status updates, and directives without losing local modifications.
   */
  public async syncWithCloud(): Promise<{
    items: FeedbackItem[];
    directives: CreatorDirective[];
    syncStatus: FeedbackSyncStatus;
  }> {
    const defaultStatus: FeedbackSyncStatus = {
      cloudConfigured: false,
      repo: 'hasan-circuito/nexus-academy',
      lastSyncedAt: new Date().toISOString(),
      mode: 'HYBRID_LOCAL_PERSISTENCE',
    };

    if (typeof window === 'undefined' || typeof fetch !== 'function') {
      return {
        items: this.getItems(),
        directives: this.getDirectives(),
        syncStatus: defaultStatus,
      };
    }

    try {
      const localItems = this.getItems();
      // Automatically upload any local items created before cloud sync was configured
      const unsyncedLocalItems = localItems.filter(
        (i) => !i.githubIssueNumber && !i.id.startsWith('fb-10') && i.syncOrigin === 'local'
      );
      if (unsyncedLocalItems.length > 0) {
        for (const unItem of unsyncedLocalItems) {
          try {
            await fetch('/api/feedback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'create_feedback',
                payload: {
                  id: unItem.id,
                  code: unItem.code,
                  category: unItem.category,
                  impact: unItem.impact,
                  authorName: unItem.authorName,
                  title: unItem.title,
                  message: unItem.message,
                  telemetry: unItem.telemetry,
                },
              }),
            });
          } catch {
            // Non-blocking fallback
          }
        }
      }

      const res = await fetch('/api/feedback', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (!res.ok) throw new Error('API request failed');

      const data = (await res.json()) as FeedbackStorePayload;
      const currentLocal = this.getItems();
      const seedStatusMap = new Map(cloneSeedItems().map((s) => [s.id, s.status]));

      // Deep-merge remote items with local items without losing local replies, resonances, or status updates
      const remoteItems = Array.isArray(data.items) ? data.items : [];
      const remoteMap = new Map(remoteItems.map((r) => [r.id, r]));

      const baseMerged: FeedbackItem[] = currentLocal.map((localItem) => {
        const remoteItem = remoteMap.get(localItem.id);
        if (!remoteItem) return localItem;

        // Merge replies by id without duplicates
        const replyMap = new Map<string, CreatorReply>();
        for (const rep of localItem.replies || []) {
          if (rep && rep.id) replyMap.set(rep.id, rep);
        }
        for (const rep of remoteItem.replies || []) {
          if (rep && rep.id && !replyMap.has(rep.id)) {
            replyMap.set(rep.id, rep);
          }
        }
        const mergedReplies = Array.from(replyMap.values());

        // Determine status: if local status is unchanged from seed (or 'open') and remote status changed, adopt remote status
        const seedStatus = seedStatusMap.get(localItem.id);
        const localStatusUnchanged = localItem.status === seedStatus || localItem.status === 'open';
        const resolvedStatus =
          localStatusUnchanged && remoteItem.status !== localItem.status
            ? remoteItem.status
            : localItem.status;

        return {
          ...localItem,
          status: resolvedStatus,
          resonances: Math.max(localItem.resonances || 0, remoteItem.resonances || 0),
          replies: mergedReplies,
          githubIssueNumber: localItem.githubIssueNumber ?? remoteItem.githubIssueNumber,
          githubIssueUrl: localItem.githubIssueUrl ?? remoteItem.githubIssueUrl,
          syncOrigin:
            remoteItem.syncOrigin === 'github' ? 'github' : localItem.syncOrigin,
        };
      });

      const localIds = new Set(currentLocal.map((i) => i.id));
      const freshRemoteItems: FeedbackItem[] = [];
      for (const rItem of remoteItems) {
        if (rItem && typeof rItem.id === 'string' && !localIds.has(rItem.id)) {
          freshRemoteItems.push(rItem);
        }
      }

      // Prepend fresh remote items so new submissions from other devices appear immediately at the top
      const mergedItems: FeedbackItem[] = [...freshRemoteItems, ...baseMerged];

      this.saveItems(mergedItems);

      // Merge remote directives with local directives while preserving local poll votes
      const localDirectives = this.getDirectives();
      const localDirIds = new Set(localDirectives.map((d) => d.id));
      const remoteDirectives = Array.isArray(data.directives) ? data.directives : [];
      const newRemoteDirectives = remoteDirectives.filter(
        (d) => d && typeof d.id === 'string' && !localDirIds.has(d.id)
      );
      const mergedDirectives =
        newRemoteDirectives.length > 0
          ? [...newRemoteDirectives, ...localDirectives]
          : localDirectives;

      if (newRemoteDirectives.length > 0) {
        this.saveDirectives(mergedDirectives);
      }

      return {
        items: mergedItems,
        directives: mergedDirectives,
        syncStatus: data.syncStatus || defaultStatus,
      };
    } catch {
      return {
        items: this.getItems(),
        directives: this.getDirectives(),
        syncStatus: defaultStatus,
      };
    }
  }

  /**
   * Creator Console Authentication (accepts Creator PIN '2441' or Dev Mode PIN 'nexus2026').
   */
  public isCreatorUnlocked(devModeUnlocked = false): boolean {
    if (devModeUnlocked || this.memoryCreatorUnlocked) return true;
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEYS.CREATOR_UNLOCKED) === 'true';
    } catch {
      return this.memoryCreatorUnlocked;
    }
  }

  public unlockCreatorConsole(pin: string): boolean {
    const trimmed = (pin || '').trim();
    if (trimmed === CREATOR_CONSOLE_PIN || trimmed === DEV_MODE_PIN) {
      this.memoryCreatorUnlocked = true;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.CREATOR_UNLOCKED, 'true');
        } catch {
          // Ignore
        }
        try {
          window.dispatchEvent(new Event('nexus_feedback_update'));
        } catch {
          // Ignore
        }
      }
      return true;
    }
    return false;
  }

  public lockCreatorConsole(): void {
    this.memoryCreatorUnlocked = false;
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.CREATOR_UNLOCKED);
    } catch {
      // Ignore
    }
    try {
      window.dispatchEvent(new Event('nexus_feedback_update'));
    } catch {
      // Ignore
    }
  }

  /**
   * Exports all feedback items & directives as a portable JSON snapshot.
   */
  public exportTelemetrySnapshot(): { filename: string; json: string } {
    const payload = {
      _app: 'NEXUS Academy Feedback & Telemetry Hub',
      version: 1,
      exportedAt: new Date().toISOString(),
      directives: this.getDirectives(),
      items: this.getItems(),
    };
    const dateStr = new Date().toISOString().slice(0, 10);
    return {
      filename: `nexus-feedback-telemetry-${dateStr}.json`,
      json: JSON.stringify(payload, null, 2),
    };
  }
}

export const feedbackService = new FeedbackService();
