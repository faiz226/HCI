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

let tasks: Task[] = [
  { id: "1", title: "Read Islamic Ethics Ch. 4", category: "Kuliyyah", when: "2:00 PM", bucket: "Today", done: false },
  { id: "2", title: "Call Mom", category: "Personal", when: "5:30 PM", bucket: "Today", done: false },
  { id: "3", title: "Draft FYP Proposal", category: "Kuliyyah", when: "11:59 PM", bucket: "Tomorrow", done: false },
  { id: "4", title: "Renew Library Books", category: "Kuliyyah", when: "Friday", bucket: "Later", done: false },
];

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
    emit();
  },
  add(task: Omit<Task, "id" | "done">) {
    tasks = [...tasks, { ...task, id: String(Date.now()), done: false }];
    emit();
  },
  remove(id: string) {
    tasks = tasks.filter((t) => t.id !== id);
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
