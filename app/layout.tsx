import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_Bengali, Hind_Siliguri, Geist } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
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
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", "dark", "theme-midnight", fontVars, "font-sans", geist.variable)}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var s = JSON.parse(localStorage.getItem('nexus_settings') || '{}');
                var t = s.theme || 'midnight';
                var isDark = true;
                var activeTheme = 'midnight';
                if (t === 'light') {
                  isDark = false;
                } else if (t === 'system') {
                  var prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
                  isDark = prefersDark;
                  activeTheme = prefersDark ? 'midnight' : 'light';
                } else if (t === 'warm-zen' || t === 'nordic' || t === 'cyber-oasis') {
                  isDark = true;
                  activeTheme = t;
                } else {
                  isDark = true;
                  activeTheme = 'midnight';
                }
                var root = document.documentElement;
                var themeClasses = ['theme-midnight', 'theme-warm-zen', 'theme-nordic', 'theme-cyber-oasis', 'light', 'dark'];
                themeClasses.forEach(function(c) { root.classList.remove(c); });
                if (isDark) {
                  root.classList.add('dark', 'theme-' + activeTheme);
                  root.setAttribute('data-theme', activeTheme);
                  root.style.colorScheme = 'dark';
                } else {
                  root.classList.add('light');
                  root.setAttribute('data-theme', 'light');
                  root.style.colorScheme = 'light';
                }
                if (s.fontSize === 'large') {
                  root.classList.add('font-large');
                  root.setAttribute('data-font-size', 'large');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar — persistent navigation shell */}
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            {/* Top Navbar */}
            <TopNavbar />

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>

          {/* Global In-Situ Slide-over Concept Drawer */}
          <QuickConceptDrawer />
        </div>
      </body>
    </html>
  );
}
