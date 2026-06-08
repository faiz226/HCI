import { createFileRoute } from "@tanstack/react-router";
import { format, isToday, isTomorrow, differenceInCalendarDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  tasksStore,
  useTasks,
  type Bucket,
  type Category,
  type ReminderOption,
  type Task,
} from "@/lib/tasks-store";
import { fireConfetti } from "@/lib/confetti";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks · Soft Oasis" },
      { name: "description", content: "A gentle list of what's ahead — Kuliyyah and personal, grouped by when." },
    ],
  }),
  component: TasksPage,
});

const FILTERS: Array<"All" | Category> = ["All", "Kuliyyah", "Personal"];
const BUCKETS: Bucket[] = ["Today", "Tomorrow", "Later"];

// ─── Date / time helpers ──────────────────────────────────────────────────────

function formatTimeLabel(value: string) {
  const [hoursRaw, minutes] = value.split(":");
  const hours24 = Number(hoursRaw);
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
}

function formatWhenLabel(date?: Date, time?: string) {
  if (!date && !time) return "Anytime";

  const timeLabel = time ? formatTimeLabel(time) : "";

  if (!date) return timeLabel || "Anytime";

  const daysFromNow = differenceInCalendarDays(date, new Date());

  if (daysFromNow >= 0 && daysFromNow <= 6) {
    const dayLabel = isToday(date)
      ? "Today"
      : isTomorrow(date)
        ? "Tomorrow"
        : format(date, "EEEE");
    return timeLabel ? `${dayLabel} at ${timeLabel}` : dayLabel;
  }

  const dateLabel = format(date, "EEE, MMM d");
  return timeLabel ? `${dateLabel} at ${timeLabel}` : dateLabel;
}

function bucketFromDate(date?: Date): Bucket {
  if (!date) return "Later";
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return "Later";
}

function completeTask(id: string, wasDone: boolean) {
  tasksStore.toggle(id);
  if (!wasDone) {
    void fireConfetti();
    toast("Task completed", {
      description: "Nice work — take a breath before the next one.",
    });
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function TasksPage() {
  const tasks = useTasks();
  const [filter, setFilter] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (filter === "All" || t.category === filter) &&
          (!query || t.title.toLowerCase().includes(query.toLowerCase())),
      ),
    [tasks, filter, query],
  );

  return (
    <AppShell title="Tasks">
      <div className="flex items-center justify-end -mt-2 mb-2">
        <button
          aria-label="Search"
          onClick={() => setSearchOpen((v) => !v)}
          className="w-10 h-10 rounded-full bg-surface-white border border-outline-variant text-on-surface flex items-center justify-center active:scale-90 transition"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
      </div>

      {searchOpen && (
        <div className="mb-4">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="bg-surface-white"
          />
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition " +
                  (active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-white text-on-surface border border-outline-variant")
                }
              >
                {f}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-on-surface-variant text-center py-8">
            No tasks here. A clear page is also a kind of progress.
          </p>
        )}

        {BUCKETS.map((bucket) => {
          const items = filtered.filter((t) => t.bucket === bucket);
          if (items.length === 0) return null;
          return (
            <section key={bucket} className="flex flex-col gap-2">
              <h2 className="text-xs uppercase tracking-[0.12em] text-on-surface-variant pl-1">
                {bucket}
              </h2>
              <ul className="flex flex-col gap-2">
                {items.map((t) => {
                  const tone = t.category === "Kuliyyah" ? "sage" : "clay";
                  return (
                    <li
                      key={t.id}
                      className="bg-surface-white rounded-xl border border-dusty-olive/20 shadow-soft flex items-stretch overflow-hidden"
                    >
                      <span className={"w-1.5 " + (tone === "sage" ? "bg-sage" : "bg-clay")} />
                      <div className="flex items-center gap-3 p-4 flex-1">
                        <button
                          aria-label={t.done ? "Mark not done" : "Mark done"}
                          onClick={() => completeTask(t.id, t.done)}
                          className={
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition shrink-0 " +
                            (tone === "sage" ? "border-sage" : "border-clay") +
                            (t.done ? (tone === "sage" ? " bg-sage" : " bg-clay") : "")
                          }
                        >
                          {t.done && (
                            <span className="material-symbols-outlined text-white text-[16px]">
                              check
                            </span>
                          )}
                        </button>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span
                            className={
                              "font-display text-lg text-on-surface break-words " +
                              (t.done ? "line-through opacity-60" : "")
                            }
                          >
                            {t.title}
                          </span>
                          <span className="text-xs text-on-surface-variant flex items-center gap-1">
                            {t.category} · {t.when}
                            {t.reminder !== "none" && (
                              <span className="material-symbols-outlined text-[13px] text-primary">
                                notifications
                              </span>
                            )}
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              aria-label="More"
                              className="text-on-surface-variant p-1 rounded-full hover:bg-surface-container shrink-0"
                            >
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => completeTask(t.id, t.done)}>
                              <span className="material-symbols-outlined mr-2 text-[18px]">
                                {t.done ? "undo" : "check"}
                              </span>
                              {t.done ? "Mark as open" : "Mark as done"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditTask(t)}>
                              <span className="material-symbols-outlined mr-2 text-[18px]">
                                edit
                              </span>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                tasksStore.remove(t.id);
                                toast("Task removed", {
                                  description: `"${t.title}" was deleted.`,
                                });
                              }}
                              className="text-destructive"
                            >
                              <span className="material-symbols-outlined mr-2 text-[18px]">
                                delete
                              </span>
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <button
        aria-label="Add task"
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      <AddTaskDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditTaskDialog task={editTask} onClose={() => setEditTask(null)} />
    </AppShell>
  );
}

// ─── Add dialog ───────────────────────────────────────────────────────────────

function AddTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [category, setCategory] = useState<Category>("Kuliyyah");
  const [bucket, setBucket] = useState<Bucket>("Today");
  const [reminder, setReminder] = useState<ReminderOption>("none");

  useEffect(() => {
    if (date) setBucket(bucketFromDate(date));
  }, [date]);

  const reset = () => {
    setTitle("");
    setDate(undefined);
    setTime(undefined);
    setCategory("Kuliyyah");
    setBucket("Today");
    setReminder("none");
  };

  const submit = () => {
    if (!title.trim()) return;
    const when = formatWhenLabel(date, time);
    const resolvedBucket = date ? bucketFromDate(date) : bucket;
    tasksStore.add({
      title: title.trim(),
      when,
      category,
      bucket: resolvedBucket,
      reminder,
    });
    toast("Task added", { description: when });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-white">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-deep-forest">New task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="t-title">Title</Label>
            <Input
              id="t-title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="bg-surface-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <DatePicker date={date} onDateChange={setDate} placeholder="Pick a date" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Time</Label>
              <TimePicker value={time} onValueChange={setTime} placeholder="Pick a time" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="bg-surface-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kuliyyah">Kuliyyah</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Bucket</Label>
              <Select
                value={bucket}
                onValueChange={(v) => setBucket(v as Bucket)}
                disabled={Boolean(date)}
              >
                <SelectTrigger className="bg-surface-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="Later">Later</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Alert</Label>
            <Select value={reminder} onValueChange={(v) => setReminder(v as ReminderOption)}>
              <SelectTrigger className="bg-surface-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="at_time">At time of task</SelectItem>
                <SelectItem value="5min">5 minutes before</SelectItem>
                <SelectItem value="15min">15 minutes before</SelectItem>
                <SelectItem value="30min">30 minutes before</SelectItem>
                <SelectItem value="1hr">1 hour before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-full text-sm text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90"
            >
              Add
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit dialog ──────────────────────────────────────────────────────────────

function EditTaskDialog({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [category, setCategory] = useState<Category>("Kuliyyah");
  const [bucket, setBucket] = useState<Bucket>("Today");
  const [reminder, setReminder] = useState<ReminderOption>("none");

  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setCategory(task.category);
    setBucket(task.bucket);
    setReminder(task.reminder ?? "none");
    setDate(undefined);
    setTime(undefined);
  }, [task]);

  useEffect(() => {
    if (date) setBucket(bucketFromDate(date));
  }, [date]);

  const submit = () => {
    if (!title.trim() || !task) return;
    const newWhen = formatWhenLabel(date, time);
    const when = newWhen !== "Anytime" ? newWhen : task.when;
    const resolvedBucket = date ? bucketFromDate(date) : bucket;
    tasksStore.update(task.id, {
      title: title.trim(),
      when,
      category,
      bucket: resolvedBucket,
      reminder,
    });
    toast("Task updated", { description: title.trim() });
    onClose();
  };

  return (
    <Dialog open={Boolean(task)} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="bg-surface-white">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-deep-forest">Edit task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="e-title">Title</Label>
            <Input
              id="e-title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="bg-surface-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <DatePicker date={date} onDateChange={setDate} placeholder="Keep current" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Time</Label>
              <TimePicker value={time} onValueChange={setTime} placeholder="Keep current" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="bg-surface-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kuliyyah">Kuliyyah</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Bucket</Label>
              <Select
                value={bucket}
                onValueChange={(v) => setBucket(v as Bucket)}
                disabled={Boolean(date)}
              >
                <SelectTrigger className="bg-surface-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="Later">Later</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Alert</Label>
            <Select value={reminder} onValueChange={(v) => setReminder(v as ReminderOption)}>
              <SelectTrigger className="bg-surface-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="at_time">At time of task</SelectItem>
                <SelectItem value="5min">5 minutes before</SelectItem>
                <SelectItem value="15min">15 minutes before</SelectItem>
                <SelectItem value="30min">30 minutes before</SelectItem>
                <SelectItem value="1hr">1 hour before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90"
            >
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}