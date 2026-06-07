import { useSyncExternalStore } from "react";

export type Category = "Kuliyyah" | "Personal";
export type Bucket = "Today" | "Tomorrow" | "Later";

export type Task = {
  id: string;
  title: string;
  category: Category;
  when: string;
  bucket: Bucket;
  done: boolean;
};

const STORAGE_KEY = "soft-oasis-tasks";

const defaultTasks: Task[] = [
  { id: "1", title: "Read Islamic Ethics Ch. 4", category: "Kuliyyah", when: "2:00 PM", bucket: "Today", done: false },
  { id: "2", title: "Call Mom", category: "Personal", when: "5:30 PM", bucket: "Today", done: false },
  { id: "3", title: "Draft FYP Proposal", category: "Kuliyyah", when: "11:59 PM", bucket: "Tomorrow", done: false },
  { id: "4", title: "Renew Library Books", category: "Kuliyyah", when: "Friday", bucket: "Later", done: false },
];

function readTasks(): Task[] {
  if (typeof window === "undefined") return defaultTasks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTasks;
    return JSON.parse(raw) as Task[];
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