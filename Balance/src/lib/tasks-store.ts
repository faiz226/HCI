import { useSyncExternalStore } from "react";

export type Category = "Kuliyyah" | "Personal";
export type Bucket = "Today" | "Tomorrow" | "Later";
export type ReminderOption = "none" | "at_time" | "5min" | "15min" | "30min" | "1hr";

export type Task = {
  id: string;
  title: string;
  category: Category;
  when: string;
  bucket: Bucket;
  done: boolean;
  reminder: ReminderOption;
};

const STORAGE_KEY = "soft-oasis-tasks";

const defaultTasks: Task[] = [
  { id: "1", title: "Read Islamic Ethics Ch. 4", category: "Kuliyyah", when: "2:00 PM", bucket: "Today", done: false, reminder: "none" },
  { id: "2", title: "Call Mom", category: "Personal", when: "5:30 PM", bucket: "Today", done: false, reminder: "none" },
  { id: "3", title: "Draft FYP Proposal", category: "Kuliyyah", when: "11:59 PM", bucket: "Tomorrow", done: false, reminder: "none" },
  { id: "4", title: "Renew Library Books", category: "Kuliyyah", when: "Friday", bucket: "Later", done: false, reminder: "none" },
];

function readTasks(): Task[] {
  if (typeof window === "undefined") return defaultTasks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTasks;
    const parsed = JSON.parse(raw) as Task[];
    // backfill reminder field for old tasks that don't have it
    return parsed.map((t) => ({ reminder: "none", ...t }));
  } catch {
    return defaultTasks;
  }
}

function persist(tasks: Task[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}

let tasks: Task[] = readTasks();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const tasksStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return tasks;
  },
  toggle(id: string) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    persist(tasks);
    emit();
  },
  add(task: Omit<Task, "id" | "done">) {
    tasks = [...tasks, { ...task, id: String(Date.now()), done: false }];
    persist(tasks);
    emit();
  },
  update(id: string, changes: Partial<Omit<Task, "id" | "done">>) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...changes } : t));
    persist(tasks);
    emit();
  },
  remove(id: string) {
    tasks = tasks.filter((t) => t.id !== id);
    persist(tasks);
    emit();
  },
};

export function useTasks() {
  return useSyncExternalStore(
    tasksStore.subscribe,
    tasksStore.get,
    tasksStore.get,
  );
}