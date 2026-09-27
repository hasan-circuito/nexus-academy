// services/StorageService.ts
// NEXUS Academy — Safe localStorage Wrapper
// Source of truth: ARCHITECTURE.md Section 5
//
// This wraps all localStorage access in try/catch.
// Private browsing, storage quota, and iOS restrictions can throw synchronously.
// All keys are namespaced to prevent collisions with other scripts or libraries.

const NAMESPACE = 'nexus_';

export const StorageKeys = {
  PROGRESS: `${NAMESPACE}progress`,
  MEMORY: `${NAMESPACE}memory`,
  REVIEW_SCHEDULE: `${NAMESPACE}review_schedule`,
  CURRENT_SESSION: `${NAMESPACE}current_session`,
  SETTINGS: `${NAMESPACE}settings`,
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

/**
 * Read a value from localStorage.
 * Returns null on any error (missing, parse failure, quota exception, etc.)
 */
export function storageGet<T>(key: StorageKey): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[StorageService] Failed to read "${key}"`);
    return null;
  }
}

/**
 * Write a value to localStorage.
 * Returns true on success, false on any error.
 */
export function storageSet<T>(key: StorageKey, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.warn(`[StorageService] Failed to write "${key}"`);
    return false;
  }
}

/**
 * Remove a key from localStorage.
 */
export function storageRemove(key: StorageKey): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    console.warn(`[StorageService] Failed to remove "${key}"`);
  }
}

/**
 * Back up a corrupt value before resetting it.
 * Creates a timestamped backup key — never silently discards data.
 * See ARCHITECTURE.md Section 5.3 & Section 9.3: localStorage corruption recovery.
 */
export function storageBackupAndClear(key: StorageKey): void {
  if (typeof window === 'undefined') return;
  try {
    const corrupt = window.localStorage.getItem(key);
    if (corrupt !== null) {
      const backupKey = `${key}_backup_${Date.now()}`;
      window.localStorage.setItem(backupKey, corrupt);
      window.localStorage.removeItem(key);
      console.warn(
        `[StorageService] Corrupt data at "${key}" backed up to "${backupKey}" and cleared.`
      );
    }
  } catch {
    console.error(`[StorageService] Failed to back up corrupt data at "${key}"`);
  }
}
