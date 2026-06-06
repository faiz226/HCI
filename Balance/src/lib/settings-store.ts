import { useSyncExternalStore } from "react";

const STORAGE_KEY = "soft-oasis-settings";

export type AppSettings = {
  dailyReminders: boolean;
  taskNudges: boolean;
  buddyCheckIns: boolean;
  weeklyDigest: boolean;
  shareAnalytics: boolean;
  publicProfile: boolean;
  reduceMotion: boolean;
  theme: "light" | "dark" | "system";
  language: "en" | "ms";
  italeemConnected: boolean;
  italeemStudentId: string;
};

const defaults: AppSettings = {
  dailyReminders: true,
  taskNudges: true,
  buddyCheckIns: false,
  weeklyDigest: true,
  shareAnalytics: false,
  publicProfile: false,
  reduceMotion: false,
  theme: "light",
  language: "en",
  italeemConnected: false,
  italeemStudentId: "",
};

function readSettings(): AppSettings {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

let settings = readSettings();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}

export const settingsStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return settings;
  },
  update(partial: Partial<AppSettings>) {
    settings = { ...settings, ...partial };
    persist();
    emit();
  },
  reset() {
    settings = { ...defaults };
    persist();
    emit();
  },
};

export function useSettings() {
  return useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.get,
    () => defaults,
  );
}
