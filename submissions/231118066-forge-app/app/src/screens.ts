/**
 * screens.ts
 *
 * Central registry of all screens in the app.
 * FORGE agent edits this file; `npm run typecheck` validates each cycle.
 */

export type ScreenName = 'Home' | 'Tasks' | 'Settings';

export interface ScreenConfig {
  name: ScreenName;
  title: string;
  icon: string;
  /** Whether this screen has the AuditWidget mounted */
  hasAudit: boolean;
}

export const SCREENS: Record<ScreenName, ScreenConfig> = {
  Home: {
    name: 'Home',
    title: '🏠 Home',
    icon: '🏠',
    hasAudit: true,
  },
  Tasks: {
    name: 'Tasks',
    title: '📋 Tasks',
    icon: '📋',
    hasAudit: true,
  },
  Settings: {
    name: 'Settings',
    title: '⚙️ Settings',
    icon: '⚙️',
    hasAudit: true,
  },
};

/** Returns true if every screen has the audit widget mounted */
export function auditCoverage(): boolean {
  return Object.values(SCREENS).every((s) => s.hasAudit);
}
