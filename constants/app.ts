// constants/app.ts
// NEXUS Academy — Application Constants
// No magic numbers. All literals defined here.

export const APP_NAME = 'NEXUS Academy';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-powered Python learning platform in Bangla';

// Layout
export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 64;
export const TOPBAR_HEIGHT = 56;

// Missions
export const TOTAL_MISSION_STEPS = 13;
export const MISSIONS_PER_PAGE = 10;

// Persistence — localStorage key namespace
export const STORAGE_NAMESPACE = 'nexus_';

// Session
export const SESSION_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
export const MAX_RECENT_SESSIONS = 30;

// Routes
export const ROUTES = {
  DASHBOARD: '/dashboard',
  MISSION: (id: string) => `/mission/${id}`,
  MISSION_STEP: (id: string, step: number) => `/mission/${id}/step/${step}`,
  DICTIONARY: '/dictionary',
  PROGRESS: '/progress',
  FEEDBACK: '/feedback',
  SETTINGS: '/settings',
  ABOUT: '/about',
} as const;

// Navigation items (for Sidebar)
export const NAV_ITEMS = [
  { label: 'Dashboard',  href: ROUTES.DASHBOARD,  icon: 'LayoutDashboard' },
  { label: 'Dictionary', href: ROUTES.DICTIONARY,  icon: 'BookOpen' },
  { label: 'Progress',   href: ROUTES.PROGRESS,    icon: 'BarChart3' },
  { label: 'Feedback',   href: ROUTES.FEEDBACK,    icon: 'MessageSquareCode' },
  { label: 'Settings',   href: ROUTES.SETTINGS,    icon: 'Settings' },
  { label: 'About',      href: ROUTES.ABOUT,       icon: 'Info' },
] as const;
