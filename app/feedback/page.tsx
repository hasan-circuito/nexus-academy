// app/feedback/page.tsx
// NEXUS Academy — Engineering Telemetry & Community Feedback Hub Page

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FeedbackHubV2 } from '@/components/feedback/FeedbackHubV2';

export const metadata: Metadata = {
  title: 'Community Discussion & Feedback',
  description: 'Share improvement proposals, questions, and feedback for NEXUS Academy',
};

function FeedbackLoadingSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
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

export default function FeedbackPage() {
  return (
    <Suspense fallback={<FeedbackLoadingSkeleton />}>
      <FeedbackHubV2 />
    </Suspense>
  );
}
