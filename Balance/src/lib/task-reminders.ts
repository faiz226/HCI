import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { tasksStore, type ReminderOption } from "./tasks-store";

function parseTimeToday(timeStr: string): Date | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "AM") {
    if (hours === 12) hours = 0;
  } else {
    if (hours !== 12) hours += 12;
  }
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function extractTime(when: string): string | null {
  if (/tomorrow/i.test(when)) return null;
  const match = when.match(/\d{1,2}:\d{2}\s*(?:AM|PM)/i);
  return match ? match[0] : null;
}

function reminderOffsetMinutes(reminder: ReminderOption): number {
  switch (reminder) {
    case "at_time": return 0;
    case "5min":    return 5;
    case "15min":   return 15;
    case "30min":   return 30;
    case "1hr":     return 60;
    default:        return -1; // none
  }
}

function reminderLabel(reminder: ReminderOption): string {
  switch (reminder) {
    case "at_time": return "is due now";
    case "5min":    return "is due in 5 minutes";
    case "15min":   return "is due in 15 minutes";
    case "30min":   return "is due in 30 minutes";
    case "1hr":     return "is due in 1 hour";
    default:        return "";
  }
}

export function useTaskReminders() {
  const notifiedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const tasks = tasksStore.get();

      for (const task of tasks) {
        if (task.done) continue;
        if (task.reminder === "none") continue;
        if (task.bucket !== "Today") continue;
        if (notifiedIds.current.has(task.id)) continue;

        const timeStr = extractTime(task.when);
        if (!timeStr) continue;

        const dueAt = parseTimeToday(timeStr);
        if (!dueAt) continue;

        const offsetMinutes = reminderOffsetMinutes(task.reminder);
        if (offsetMinutes < 0) continue;

        // When should the reminder fire?
        const fireAt = new Date(dueAt.getTime() - offsetMinutes * 60_000);
        const diffMs = fireAt.getTime() - now.getTime();
        const diffMinutes = diffMs / 1000 / 60;

        // Fire if we're within a 1-minute window of the target fire time
        if (diffMinutes >= -1 && diffMinutes <= 1) {
          notifiedIds.current.add(task.id);
          toast(`⏰ "${task.title}" ${reminderLabel(task.reminder)}`, {
            description: task.category + " · " + task.when,
            duration: 10000,
          });
        }
      }
    };

    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, []);
}