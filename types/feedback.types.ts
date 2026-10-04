// types/feedback.types.ts
// NEXUS Academy — Engineering Telemetry & Community Feedback Types
// Zero AI Emojis. Built around schematic codes and structured telemetry.

export type FeedbackCategory = 'improve' | 'problem' | 'feedback';

export type FeedbackStatus = 'open' | 'in_progress' | 'planned' | 'resolved';

export type FeedbackImpact = 'standard' | 'high_impact' | 'blocker';

export interface TelemetryContext {
  missionId?: string;
  missionTitle?: string;
  stepNumber?: number;
  theme?: string;
  learnerXp?: number;
  learnerLevel?: number;
}

export interface CreatorReply {
  id: string;
  authorName: string;
  authorRole: string;
  badgeCode: string;
  content: string;
  createdAt: string;
  statusUpdatedTo?: FeedbackStatus;
}

export interface FeedbackItem {
  id: string;
  code: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  impact: FeedbackImpact;
  authorName: string;
  title: string;
  message: string;
  createdAt: string;
  resonances: number;
  telemetry?: TelemetryContext;
  replies: CreatorReply[];
  githubIssueNumber?: number;
  githubIssueUrl?: string;
  syncOrigin: 'seed' | 'local' | 'github';
}

export interface RoadmapPollOption {
  id: string;
  code: string;
  labelBangla: string;
  labelEnglish: string;
  votes: number;
}

export interface RoadmapPoll {
  id: string;
  questionBangla: string;
  questionEnglish: string;
  options: RoadmapPollOption[];
}

export interface CreatorDirective {
  id: string;
  code: string;
  authorName: string;
  authorBadge: string;
  tag: string;
  title: string;
  content: string;
  createdAt: string;
  pinned: boolean;
  poll?: RoadmapPoll;
}

export interface FeedbackSyncStatus {
  cloudConfigured: boolean;
  repo: string;
  lastSyncedAt: string;
  mode: 'GITHUB_CLOUD_SYNC' | 'HYBRID_LOCAL_PERSISTENCE';
}

export interface FeedbackStorePayload {
  directives: CreatorDirective[];
  items: FeedbackItem[];
  syncStatus: FeedbackSyncStatus;
}

export interface CreateFeedbackInput {
  category: FeedbackCategory;
  impact: FeedbackImpact;
  authorName?: string;
  title: string;
  message: string;
  telemetry?: TelemetryContext;
}

export interface CreateReplyInput {
  feedbackId: string;
  content: string;
  newStatus?: FeedbackStatus;
  authorName?: string;
}

export interface CreateDirectiveInput {
  title: string;
  content: string;
  tag?: string;
  pinned?: boolean;
}

export const CREATOR_CONSOLE_PIN = '2441';

export const FEEDBACK_CATEGORY_META: Record<
  FeedbackCategory,
  {
    glyph: string;
    code: string;
    shortCode: string;
    labelBangla: string;
    labelEnglish: string;
    descriptionBangla: string;
  }
> = {
  improve: {
    glyph: '◈',
    code: '[SYS_IMPROVE]',
    shortCode: 'IMPROVE',
    labelBangla: 'কী কী ইমপ্রুভ করা যায়',
    labelEnglish: 'Improvement Proposal',
    descriptionBangla: 'নতুন ফিচার, মিশনের ব্যাখ্যা বা প্ল্যাটফর্ম আরও ভালো করার প্রস্তাব দিন',
  },
  problem: {
    glyph: '⌁',
    code: '[BUG_REPORT]',
    shortCode: 'PROBLEM',
    labelBangla: 'কোনো প্রবলেম বা বাগ',
    labelEnglish: 'Problem / Bug Report',
    descriptionBangla: 'কোনো মিশন, কোড এডিটর বা স্টেপে সমস্যা হলে সুনির্দিষ্টভাবে জানান',
  },
  feedback: {
    glyph: '⬡',
    code: '[TELEMETRY_FEEDBACK]',
    shortCode: 'FEEDBACK',
    labelBangla: 'সাধারণ মতামত',
    labelEnglish: 'General Feedback',
    descriptionBangla: 'তোমার শেখার অভিজ্ঞতা ও প্ল্যাটফর্ম সম্পর্কে যেকোনো মতামত শেয়ার করো',
  },
};

export const FEEDBACK_STATUS_META: Record<
  FeedbackStatus,
  {
    glyph: string;
    code: string;
    labelBangla: string;
    labelEnglish: string;
  }
> = {
  in_progress: {
    glyph: '⏣',
    code: '[STATUS // IN_PROGRESS]',
    labelBangla: 'কাজ চলছে',
    labelEnglish: 'In Progress',
  },
  planned: {
    glyph: '◈',
    code: '[STATUS // PLANNED]',
    labelBangla: 'পরিকল্পনায় আছে',
    labelEnglish: 'Planned',
  },
  resolved: {
    glyph: '⬢',
    code: '[STATUS // RESOLVED]',
    labelBangla: 'সমাধান হয়েছে',
    labelEnglish: 'Resolved',
  },
  open: {
    glyph: '▫',
    code: '[STATUS // OPEN]',
    labelBangla: 'নতুন প্রাপ্ত',
    labelEnglish: 'Open',
  },
};

export const FEEDBACK_IMPACT_META: Record<
  FeedbackImpact,
  {
    glyph: string;
    code: string;
    labelBangla: string;
    labelEnglish: string;
  }
> = {
  standard: {
    glyph: '▫',
    code: 'IMPACT // STANDARD',
    labelBangla: 'সাধারণ গুরুত্ব',
    labelEnglish: 'Standard',
  },
  high_impact: {
    glyph: '◈',
    code: 'IMPACT // HIGH',
    labelBangla: 'গুরুত্বপূর্ণ ইমপ্রুভমেন্ট',
    labelEnglish: 'High Impact',
  },
  blocker: {
    glyph: '⌁',
    code: 'IMPACT // BLOCKER',
    labelBangla: 'জরুরি সমস্যা / ব্লকার',
    labelEnglish: 'Blocker',
  },
};

export const CREATOR_QUICK_REPLIES: readonly string[] = [
  'ধন্যবাদ! আমরা এটি নিয়ে কাজ করতেছি, আপডেট চলমান।',
  'সমস্যাটি চিহ্নিত হয়েছে, পরবর্তী আপডেটে সমাধান আসছে।',
  'চমৎকার আইডিয়া! এটি আমাদের রোডম্যাপে যুক্ত করা হলো।',
] as const;
