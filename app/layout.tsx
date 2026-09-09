import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_Bengali, Hind_Siliguri, Geist } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { QuickConceptDrawer } from '@/components/dictionary/QuickConceptDrawer';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// ============================================================
// Font Configuration — UI_UX_SYSTEM.md
// ============================================================

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: '--font-noto-sans-bengali',
  subsets: ['bengali'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const hindSiliguri = Hind_Siliguri({
  variable: '--font-hind-siliguri',
  subsets: ['bengali'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// ============================================================
// Metadata — SEO
// ============================================================

export const metadata: Metadata = {
  title: {
    template: '%s | NEXUS Academy',
    default: 'NEXUS Academy — Python Learning in Bangla',
  },
  description:
    'AI-powered Python learning platform in Bangla. Understand deeply, not memorize.',
};

// ============================================================
// Root Layout
// ============================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    inter.variable,
    jetbrainsMono.variable,
    notoSansBengali.variable,
    hindSiliguri.variable,
  ].join(' ');

  return (
    <html lang="en" className={cn("h-full", "antialiased", "dark", fontVars, "font-sans", geist.variable)}>
      <body className="min-h-full bg-background text-foreground">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar — persistent navigation shell */}
          <Sidebar />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* Global In-Situ Slide-over Concept Drawer */}
          <QuickConceptDrawer />
        </div>
      </body>
    </html>
  );
}
