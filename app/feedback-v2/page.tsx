// app/feedback-v2/page.tsx
// NEXUS Academy — Discussion 2 (v2 Clean & Immersive Community Feedback Hub Page)

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FeedbackHubV2 } from '@/components/feedback/FeedbackHubV2';

export const metadata: Metadata = {
  title: 'Discussion 2 — Community Feedback Lab',
  description: 'Share improvement proposals, questions, and feedback for NEXUS Academy (v2 Experimental)',
};

function FeedbackV2LoadingSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="h-10 rounded-xl border border-border bg-card animate-pulse" />
      <div className="h-36 rounded-2xl border border-border bg-card animate-pulse p-6" />
      <div className="h-16 rounded-xl border border-border bg-card animate-pulse p-4" />
      <div className="h-56 rounded-2xl border border-border bg-card animate-pulse p-6" />
      <div className="space-y-4">
        <div className="h-32 rounded-2xl border border-border bg-card animate-pulse" />
        <div className="h-32 rounded-2xl border border-border bg-card animate-pulse" />
      </div>
    </div>
  );
}

export default function FeedbackV2Page() {
  return (
    <Suspense fallback={<FeedbackV2LoadingSkeleton />}>
      <FeedbackHubV2 />
    </Suspense>
  );
}
