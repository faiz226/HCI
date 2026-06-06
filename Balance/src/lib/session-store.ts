import { useSyncExternalStore } from "react";
import { showItaleemConnectReminder } from "@/lib/italeem";

const STORAGE_KEY = "soft-oasis-session";

type Session = {
  signedIn: boolean;
  name: string;
  email: string;
};

const defaultSession: Session = {
  signedIn: true,
  name: "Aisyah",
  email: "aisyah@oasis.app",
};

function readSession(): Session {
  if (typeof window === "undefined") return defaultSession;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSession;
    return { ...defaultSession, ...JSON.parse(raw) };
  } catch {
    return defaultSession;
  }
}

let session = readSession();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export const sessionStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return session;
  },
  signOut() {
    session = { ...session, signedIn: false };
    persist();
    emit();
  },
  signIn() {
    session = { ...session, signedIn: true };
    persist();
    emit();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("soft-oasis-italeem-login-reminder");
      queueMicrotask(() => showItaleemConnectReminder());
    }
  },
  updateProfile(partial: Pick<Session, "name" | "email">) {
    session = { ...session, ...partial };
    persist();
    emit();
  },
};

export function useSession() {
  return useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.get,
    () => defaultSession,
  );
}
