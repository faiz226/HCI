import { useSyncExternalStore } from "react";

export type BalanceHours = {
  study: number;
  personal: number;
  rest: number;
};

const STORAGE_KEY = "soft-oasis-balance";

const defaults: BalanceHours = {
  study: 14.5,
  personal: 8.2,
  rest: 52.4,
};

function readBalance(): BalanceHours {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

let balance = readBalance();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(balance));
  }
}

export function computeBalanceScore(hours: BalanceHours) {
  const total = hours.study + hours.personal + hours.rest;
  if (total <= 0) return { score: 0, label: "Set your week", studyPct: 0, personalPct: 0, restPct: 0 };

  const studyPct = (hours.study / total) * 100;
  const personalPct = (hours.personal / total) * 100;
  const restPct = (hours.rest / total) * 100;

  const hasMinStudy = hours.study >= 5;
  const hasMinPersonal = hours.personal >= 3;
  const hasMinRest = hours.rest >= 40;

  const minimumPenalty =
    (!hasMinStudy ? 20 : 0) +
    (!hasMinPersonal ? 15 : 0) +
    (!hasMinRest ? 25 : 0);

  const ideal = { study: 20, personal: 15, rest: 65 };
  const deviation =
    (Math.abs(studyPct - ideal.study) +
      Math.abs(personalPct - ideal.personal) +
      Math.abs(restPct - ideal.rest)) /
    3;

  const score = Math.round(
    Math.max(0, Math.min(100, 100 - deviation * 1.5 - minimumPenalty))
  );

  // Smart label based on what's actually missing
  let label: string;
  if (total <= 0) {
    label = "Set your week";
  } else if (!hasMinStudy && !hasMinPersonal) {
    label = "Add study & social time";
  } else if (!hasMinStudy) {
    label = "Add some study time";
  } else if (!hasMinPersonal) {
    label = "Add some social time";
  } else if (!hasMinRest) {
    label = "Needs more rest";
  } else if (score >= 75) {
    label = "Balanced";
  } else if (score >= 50) {
    label = "Finding rhythm";
  } else {
    label = "Almost there";
  }

  return { score, label, studyPct, personalPct, restPct };
}

export function balanceInsight(hours: BalanceHours) {
  const { score, restPct } = computeBalanceScore(hours);

  const hasMinStudy = hours.study >= 5;
  const hasMinPersonal = hours.personal >= 3;
  const hasMinRest = hours.rest >= 40;

  if (!hasMinStudy && !hasMinPersonal) {
    return "You have plenty of rest — now try adding some study and personal time to round out your week.";
  }
  if (!hasMinStudy) {
    return "Rest looks good! Try logging at least 5 hours of study time to balance things out.";
  }
  if (!hasMinPersonal) {
    return "Good on study and rest — don't forget to make time for yourself and the people around you.";
  }
  if (!hasMinRest) {
    return "Rest is running low — even short pauses can restore focus.";
  }
  if (hours.study >= 20) {
    return `You've logged ${hours.study.toFixed(1)} hours of study this week. Time for a break.`;
  }
  if (restPct < 55) {
    return "Rest is running a little low — try shifting some time toward sleep and recovery.";
  }
  if (score >= 75) {
    return "Your week looks steady. Keep listening to what your body needs.";
  }
  return "Small shifts in study, rest, or personal time can rebalance your week.";
}

export const balanceStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return balance;
  },
  update(partial: Partial<BalanceHours>) {
    balance = { ...balance, ...partial };
    persist();
    emit();
  },
  reset() {
    balance = { ...defaults };
    persist();
    emit();
  },
};

export function useBalance() {
  return useSyncExternalStore(
    balanceStore.subscribe,
    balanceStore.get,
    () => defaults,
  );
}