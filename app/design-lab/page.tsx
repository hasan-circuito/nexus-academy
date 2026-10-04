// app/design-lab/page.tsx
// NEXUS Academy — $6,000 High-Ticket Design Engineering Experimental Showcase

import type { Metadata } from 'next';
import { DesignEngineeringLab } from '@/components/showcase/DesignEngineeringLab';

export const metadata: Metadata = {
  title: 'Design Engineering Lab — Experimental Showcase',
  description: 'Interactive demonstration of Silicon-Valley tier Aceternity UI, Magic UI, and shadcn/ui components',
};

export default function DesignLabPage() {
  return <DesignEngineeringLab />;
}
