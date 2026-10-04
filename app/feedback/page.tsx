// app/feedback/page.tsx
// NEXUS Academy — Engineering Telemetry & Community Feedback Hub Page

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FeedbackHub } from '@/components/feedback/FeedbackHub';

export const metadata: Metadata = {
  title: 'Feedback & Telemetry',
  description: 'Share improvement proposals, bug reports, and feedback for NEXUS Academy',
};

function FeedbackLoadingSkeleton() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-6">
      <div className="h-44 rounded-2xl border border-border bg-card animate-pulse p-6" />
      <div className="h-36 rounded-2xl border border-border bg-card animate-pulse p-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 h-96 rounded-2xl border border-border bg-card animate-pulse" />
        <div className="lg:col-span-7 h-96 rounded-2xl border border-border bg-card animate-pulse" />
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<FeedbackLoadingSkeleton />}>
      <FeedbackHub />
    </Suspense>
  );
}
