// app/api/feedback/route.ts
// NEXUS Academy — Hybrid Cloud Telemetry & Community Feedback API Route
// Zero-Cost Architecture: Syncs with GitHub Issues/Comments API when GITHUB_FEEDBACK_TOKEN is set,
// and seamlessly falls back to local seed + client persistence when offline or unconfigured.

import { NextRequest, NextResponse } from 'next/server';
import initialFeedbackData from '@/data/feedback/initial-feedback.json';
import type {
  CreatorDirective,
  CreatorReply,
  FeedbackCategory,
  FeedbackImpact,
  FeedbackItem,
  FeedbackStatus,
  FeedbackStorePayload,
} from '@/types/feedback.types';

const DEFAULT_GITHUB_REPO = 'hasan-circuito/nexus-academy';

const VALID_CATEGORIES: FeedbackCategory[] = ['improve', 'problem', 'feedback'];
const VALID_STATUSES: FeedbackStatus[] = ['open', 'in_progress', 'planned', 'resolved'];
const VALID_IMPACTS: FeedbackImpact[] = ['standard', 'high_impact', 'blocker'];

// Server-side runtime store initialized from seed data so POST mutations persist across GET calls
const serverRuntimeStore: {
  directives: CreatorDirective[];
  items: FeedbackItem[];
} = {
  directives: JSON.parse(JSON.stringify(initialFeedbackData.directives || [])) as CreatorDirective[],
  items: JSON.parse(JSON.stringify(initialFeedbackData.items || [])) as FeedbackItem[],
};

function getCloudConfig() {
  const token = process.env.GITHUB_FEEDBACK_TOKEN?.trim() || '';
  const repo = process.env.GITHUB_FEEDBACK_REPO?.trim() || DEFAULT_GITHUB_REPO;
  return {
    token,
    repo,
    cloudConfigured: Boolean(token && token.length > 10),
  };
}

function parseIssueToFeedbackItem(issue: Record<string, unknown>, index: number): FeedbackItem {
  const labels = Array.isArray(issue.labels)
    ? issue.labels.map((l: unknown) => (typeof l === 'string' ? l : (l as { name?: string })?.name || ''))
    : [];

  let category: FeedbackCategory = 'feedback';
  if (labels.some((l) => l.includes('improve'))) category = 'improve';
  else if (labels.some((l) => l.includes('problem') || l.includes('bug'))) category = 'problem';

  let status: FeedbackStatus = issue.state === 'closed' ? 'resolved' : 'open';
  if (labels.some((l) => l.includes('in_progress'))) status = 'in_progress';
  else if (labels.some((l) => l.includes('planned'))) status = 'planned';
  else if (labels.some((l) => l.includes('resolved'))) status = 'resolved';

  let impact: FeedbackImpact = 'standard';
  if (labels.some((l) => l.includes('blocker'))) impact = 'blocker';
  else if (labels.some((l) => l.includes('high_impact'))) impact = 'high_impact';

  const rawBody = typeof issue.body === 'string' ? issue.body : '';
  const authorMatch = rawBody.match(/^AUTHOR:\s*(.+)$/im);
  const missionMatch = rawBody.match(/^MISSION:\s*([0-9]{3})$/im);
  const missionTitleMatch = rawBody.match(/^MISSION_TITLE:\s*(.+)$/im);
  const stepMatch = rawBody.match(/^STEP:\s*([0-9]+)$/im);
  const themeMatch = rawBody.match(/^THEME:\s*(.+)$/im);
  const xpMatch = rawBody.match(/^XP:\s*([0-9]+)$/im);
  const levelMatch = rawBody.match(/^LEVEL:\s*([0-9]+)$/im);

  const cleanMessage = rawBody
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  const issueNumber = typeof issue.number === 'number' ? issue.number : 200 + index;
  const hasTelemetry = Boolean(missionMatch || themeMatch || xpMatch || levelMatch);

  const existingRuntimeItem = serverRuntimeStore.items.find(
    (item) => item.githubIssueNumber === issueNumber || item.id === `gh-${issueNumber}`
  );

  return {
    id: existingRuntimeItem?.id || `gh-${issueNumber}`,
    code: existingRuntimeItem?.code || `TLM-${String(issueNumber).padStart(4, '0')}`,
    category,
    status: existingRuntimeItem?.status || status,
    impact,
    authorName: authorMatch ? authorMatch[1].trim() : 'একজন শিক্ষার্থী (Learner)',
    title: typeof issue.title === 'string' ? issue.title.replace(/^\[.*?\]\s*/, '') : 'Feedback Submission',
    message: cleanMessage || 'Submitted via NEXUS Telemetry Hub.',
    createdAt: typeof issue.created_at === 'string' ? issue.created_at : new Date().toISOString(),
    resonances: typeof (issue.reactions as { '+1'?: number } | undefined)?.['+1'] === 'number'
      ? Math.max(1, (issue.reactions as { '+1': number })['+1'])
      : existingRuntimeItem?.resonances || 1,
    telemetry: hasTelemetry
      ? {
          missionId: missionMatch ? missionMatch[1].trim() : undefined,
          missionTitle: missionTitleMatch ? missionTitleMatch[1].trim() : undefined,
          stepNumber: stepMatch ? parseInt(stepMatch[1], 10) : undefined,
          theme: themeMatch ? themeMatch[1].trim() : undefined,
          learnerXp: xpMatch ? parseInt(xpMatch[1], 10) : undefined,
          learnerLevel: levelMatch ? parseInt(levelMatch[1], 10) : undefined,
        }
      : existingRuntimeItem?.telemetry,
    replies: existingRuntimeItem?.replies || [],
    githubIssueNumber: issueNumber,
    githubIssueUrl: typeof issue.html_url === 'string' ? issue.html_url : undefined,
    syncOrigin: 'github',
  };
}

export async function GET() {
  const { token, repo, cloudConfigured } = getCloudConfig();

  if (!cloudConfigured) {
    const payload: FeedbackStorePayload = {
      directives: serverRuntimeStore.directives,
      items: serverRuntimeStore.items,
      syncStatus: {
        cloudConfigured: false,
        repo,
        lastSyncedAt: new Date().toISOString(),
        mode: 'HYBRID_LOCAL_PERSISTENCE',
      },
    };
    return NextResponse.json(payload, { status: 200 });
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/issues?labels=nexus-feedback&state=all&per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const rawIssues = await response.json();
    const githubItems: FeedbackItem[] = Array.isArray(rawIssues)
      ? rawIssues
          .filter((issue) => issue && typeof issue === 'object' && !('pull_request' in issue))
          .map((issue, idx) => parseIssueToFeedbackItem(issue as Record<string, unknown>, idx))
      : [];

    // Merge GitHub items with runtime/seed items without duplicating IDs or issue numbers
    const seenIds = new Set(githubItems.map((i) => i.id));
    const seenIssueNums = new Set(
      githubItems.map((i) => i.githubIssueNumber).filter((n): n is number => typeof n === 'number')
    );

    const mergedItems = [
      ...githubItems,
      ...serverRuntimeStore.items.filter(
        (s) =>
          !seenIds.has(s.id) &&
          (typeof s.githubIssueNumber !== 'number' || !seenIssueNums.has(s.githubIssueNumber))
      ),
    ];

    serverRuntimeStore.items = mergedItems;

    const payload: FeedbackStorePayload = {
      directives: serverRuntimeStore.directives,
      items: mergedItems,
      syncStatus: {
        cloudConfigured: true,
        repo,
        lastSyncedAt: new Date().toISOString(),
        mode: 'GITHUB_CLOUD_SYNC',
      },
    };
    return NextResponse.json(payload, { status: 200 });
  } catch {
    // Graceful fallback to runtime/seed data if network, token, or rate-limit fails
    const fallbackPayload: FeedbackStorePayload = {
      directives: serverRuntimeStore.directives,
      items: serverRuntimeStore.items,
      syncStatus: {
        cloudConfigured: false,
        repo,
        lastSyncedAt: new Date().toISOString(),
        mode: 'HYBRID_LOCAL_PERSISTENCE',
      },
    };
    return NextResponse.json(fallbackPayload, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request payload: expected JSON object' },
        { status: 400 }
      );
    }

    const { action, payload } = body as {
      action?: string;
      payload?: Record<string, unknown>;
    };

    if (!action || !payload || typeof payload !== 'object') {
      return NextResponse.json(
        { error: 'Missing required action or payload object' },
        { status: 400 }
      );
    }

    const { token, repo, cloudConfigured } = getCloudConfig();

    if (action === 'create_feedback') {
      const rawTitle = typeof payload.title === 'string' ? payload.title.trim() : '';
      const rawMessage = typeof payload.message === 'string' ? payload.message.trim() : '';
      const rawAuthor = typeof payload.authorName === 'string' && payload.authorName.trim()
        ? payload.authorName.trim().slice(0, 60)
        : 'একজন শিক্ষার্থী (Learner)';

      const category: FeedbackCategory = VALID_CATEGORIES.includes(payload.category as FeedbackCategory)
        ? (payload.category as FeedbackCategory)
        : 'feedback';

      const impact: FeedbackImpact = VALID_IMPACTS.includes(payload.impact as FeedbackImpact)
        ? (payload.impact as FeedbackImpact)
        : 'standard';

      if (!rawTitle || rawTitle.length < 3) {
        return NextResponse.json(
          { error: 'শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে (Title must be at least 3 characters).' },
          { status: 400 }
        );
      }

      if (!rawMessage || rawMessage.length < 5) {
        return NextResponse.json(
          { error: 'বিস্তারিত মতামত কমপক্ষে ৫ অক্ষরের হতে হবে (Message must be at least 5 characters).' },
          { status: 400 }
        );
      }

      const telemetry =
        payload.telemetry && typeof payload.telemetry === 'object'
          ? (payload.telemetry as FeedbackItem['telemetry'])
          : undefined;

      const nextCodeNum = 100 + serverRuntimeStore.items.length + 1;
      const newItem: FeedbackItem = {
        id:
          typeof payload.id === 'string' && payload.id.trim()
            ? payload.id.trim()
            : `fb-${Date.now()}`,
        code:
          typeof payload.code === 'string' && payload.code.trim()
            ? payload.code.trim()
            : `TLM-${String(nextCodeNum).padStart(4, '0')}`,
        category,
        status: 'open',
        impact,
        authorName: rawAuthor,
        title: rawTitle.slice(0, 160),
        message: rawMessage.slice(0, 3000),
        createdAt: new Date().toISOString(),
        resonances: 1,
        telemetry,
        replies: [],
        syncOrigin: 'local',
      };

      // If GitHub Cloud Sync is configured, also create a GitHub Issue
      if (cloudConfigured) {
        try {
          const telemetryMeta = [
            `<!-- NEXUS_TELEMETRY`,
            `AUTHOR: ${newItem.authorName}`,
            `CATEGORY: ${newItem.category}`,
            `IMPACT: ${newItem.impact}`,
            telemetry?.missionId ? `MISSION: ${telemetry.missionId}` : '',
            telemetry?.missionTitle ? `MISSION_TITLE: ${telemetry.missionTitle}` : '',
            telemetry?.stepNumber ? `STEP: ${telemetry.stepNumber}` : '',
            telemetry?.theme ? `THEME: ${telemetry.theme}` : '',
            typeof telemetry?.learnerXp === 'number' ? `XP: ${telemetry.learnerXp}` : '',
            typeof telemetry?.learnerLevel === 'number' ? `LEVEL: ${telemetry.learnerLevel}` : '',
            `-->`,
          ]
            .filter(Boolean)
            .join('\n');

          const ghResponse = await fetch(`https://api.github.com/repos/${repo}/issues`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
              'Content-Type': 'application/json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
            body: JSON.stringify({
              title: `[${category.toUpperCase()}] ${newItem.title}`,
              body: `${newItem.message}\n\n${telemetryMeta}`,
              labels: [
                'nexus-feedback',
                `category:${category}`,
                `impact:${impact}`,
                'status:open',
              ],
            }),
          });

          if (ghResponse.ok) {
            const ghIssue = await ghResponse.json();
            newItem.githubIssueNumber = ghIssue.number;
            newItem.githubIssueUrl = ghIssue.html_url;
            newItem.syncOrigin = 'github';
          }
        } catch {
          // Keep local item if GitHub sync fails
        }
      }

      serverRuntimeStore.items = [
        newItem,
        ...serverRuntimeStore.items.filter((i) => i.id !== newItem.id),
      ];

      return NextResponse.json({ success: true, item: newItem }, { status: 201 });
    }

    if (action === 'creator_reply') {
      const feedbackId = typeof payload.feedbackId === 'string' ? payload.feedbackId.trim() : '';
      const content = typeof payload.content === 'string' ? payload.content.trim() : '';
      const newStatus = VALID_STATUSES.includes(payload.newStatus as FeedbackStatus)
        ? (payload.newStatus as FeedbackStatus)
        : undefined;

      if (!feedbackId || !content) {
        return NextResponse.json(
          { error: 'feedbackId and reply content are required.' },
          { status: 400 }
        );
      }

      const reply: CreatorReply = {
        id:
          typeof payload.replyId === 'string' && payload.replyId.trim()
            ? payload.replyId.trim()
            : `rep-${Date.now()}`,
        authorName: typeof payload.authorName === 'string' && payload.authorName.trim()
          ? payload.authorName.trim()
          : 'Hasan Mahmud',
        authorRole: 'Founder & Learner #0',
        badgeCode: 'FOUNDER // HASAN MAHMUD',
        content: content.slice(0, 2000),
        createdAt: new Date().toISOString(),
        statusUpdatedTo: newStatus,
      };

      const targetItem = serverRuntimeStore.items.find((i) => i.id === feedbackId);
      const githubIssueNumber =
        typeof payload.githubIssueNumber === 'number'
          ? payload.githubIssueNumber
          : targetItem?.githubIssueNumber;

      serverRuntimeStore.items = serverRuntimeStore.items.map((item) => {
        if (item.id !== feedbackId) return item;
        const hasReply = item.replies.some((r) => r.id === reply.id);
        return {
          ...item,
          status: newStatus || item.status,
          replies: hasReply ? item.replies : [...item.replies, reply],
        };
      });

      if (cloudConfigured && githubIssueNumber) {
        try {
          await fetch(
            `https://api.github.com/repos/${repo}/issues/${githubIssueNumber}/comments`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28',
              },
              body: JSON.stringify({
                body: `**[FOUNDER // HASAN MAHMUD]**${newStatus ? ` · \`[STATUS // ${newStatus.toUpperCase()}]\`` : ''}\n\n${reply.content}`,
              }),
            }
          );

          if (newStatus) {
            await fetch(`https://api.github.com/repos/${repo}/issues/${githubIssueNumber}`, {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28',
              },
              body: JSON.stringify({
                state: newStatus === 'resolved' ? 'closed' : 'open',
              }),
            });
          }
        } catch {
          // Non-blocking fallback
        }
      }

      return NextResponse.json({ success: true, reply, newStatus }, { status: 201 });
    }

    if (action === 'update_status') {
      const feedbackId = typeof payload.feedbackId === 'string' ? payload.feedbackId.trim() : '';
      const status = payload.status as FeedbackStatus;
      if (!feedbackId || !VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: 'Valid feedbackId and status are required.' },
          { status: 400 }
        );
      }

      const targetItem = serverRuntimeStore.items.find((i) => i.id === feedbackId);
      const githubIssueNumber =
        typeof payload.githubIssueNumber === 'number'
          ? payload.githubIssueNumber
          : targetItem?.githubIssueNumber;

      serverRuntimeStore.items = serverRuntimeStore.items.map((item) =>
        item.id === feedbackId ? { ...item, status } : item
      );

      if (cloudConfigured && githubIssueNumber) {
        try {
          await fetch(`https://api.github.com/repos/${repo}/issues/${githubIssueNumber}`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
              'Content-Type': 'application/json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
            body: JSON.stringify({
              state: status === 'resolved' ? 'closed' : 'open',
            }),
          });
        } catch {
          // Non-blocking fallback
        }
      }

      return NextResponse.json({ success: true, feedbackId, status }, { status: 200 });
    }

    if (action === 'create_directive') {
      const title = typeof payload.title === 'string' ? payload.title.trim() : '';
      const content = typeof payload.content === 'string' ? payload.content.trim() : '';
      const tag = typeof payload.tag === 'string' && payload.tag.trim()
        ? payload.tag.trim()
        : '[DIRECTIVE // PLATFORM_UPDATE]';
      const pinned = typeof payload.pinned === 'boolean' ? payload.pinned : true;

      if (!title || !content) {
        return NextResponse.json(
          { error: 'Directive title and content are required.' },
          { status: 400 }
        );
      }

      const directive: CreatorDirective = {
        id:
          typeof payload.id === 'string' && payload.id.trim()
            ? payload.id.trim()
            : `dir-${Date.now()}`,
        code:
          typeof payload.code === 'string' && payload.code.trim()
            ? payload.code.trim()
            : `DIR-${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        authorName: 'Hasan Mahmud',
        authorBadge: 'FOUNDER // LEARNER #0',
        tag,
        title: title.slice(0, 180),
        content: content.slice(0, 3000),
        createdAt: new Date().toISOString(),
        pinned,
      };

      serverRuntimeStore.directives = [
        directive,
        ...serverRuntimeStore.directives.filter((d) => d.id !== directive.id),
      ];

      return NextResponse.json({ success: true, directive }, { status: 201 });
    }

    return NextResponse.json(
      { error: `Unsupported action: ${action}` },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to process feedback telemetry request.' },
      { status: 500 }
    );
  }
}
