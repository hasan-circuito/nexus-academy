'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/services/SettingsService';
import { type NexusSettings, DEFAULT_SETTINGS } from '@/types/settings.types';

export function useSettings() {
  const [settings, setSettings] = useState<NexusSettings>(DEFAULT_SETTINGS);
  const [isClient, setIsClient] = useState(false);

  const refreshSettings = useCallback(() => {
    const current = settingsService.getSettings();
    setSettings(current);
    settingsService.applyThemeAndFont(current);
  }, []);

  useEffect(() => {
    setIsClient(true);
    refreshSettings();

    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<NexusSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        refreshSettings();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nexus_settings' || !e.key) {
        refreshSettings();
      }
    };

    window.addEventListener('nexus_settings_update', handleSettingsUpdate);
    window.addEventListener('nexus_storage_update', refreshSettings);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('nexus_settings_update', handleSettingsUpdate);
      window.removeEventListener('nexus_storage_update', refreshSettings);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshSettings]);

  const updateSettings = useCallback((partial: Partial<NexusSettings>) => {
    const updated = settingsService.updateSettings(partial);
    setSettings(updated);
    return updated;
  }, []);

  const resetSettings = useCallback(() => {
    const defaults = settingsService.resetSettings();
    setSettings(defaults);
    return defaults;
  }, []);

  const verifyAndUnlockDevMode = useCallback((pin: string) => {
    const success = settingsService.verifyAndUnlockDevMode(pin);
    if (success) {
      refreshSettings();
    }
    return success;
  }, [refreshSettings]);

  const lockDevMode = useCallback(() => {
    const updated = settingsService.lockDevMode();
    setSettings(updated);
    return updated;
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    verifyAndUnlockDevMode,
    lockDevMode,
    exportBackup: settingsService.exportBackup.bind(settingsService),
    importBackup: settingsService.importBackup.bind(settingsService),
    resetAllProgress: settingsService.resetAllProgress.bind(settingsService),
    isClient,
  };
}
