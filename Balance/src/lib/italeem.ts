import { toast } from "sonner";
import { settingsStore } from "@/lib/settings-store";

export function showItaleemConnectReminder(onConnect?: () => void) {
  const { italeemConnected } = settingsStore.get();
  if (italeemConnected) return;

  toast("Connect i-Taleem", {
    description:
      "Link your IIUM student account to sync classes, deadlines, and academic tasks.",
    duration: 8000,
    action: {
      label: "Connect",
      onClick: () => {
        onConnect?.();
        if (typeof window !== "undefined") {
          window.location.assign("/settings?tab=integrations");
        }
      },
    },
  });

  if (typeof window !== "undefined") {
    sessionStorage.setItem("soft-oasis-italeem-login-reminder", "1");
  }
}

export function connectItaleem(studentId: string) {
  settingsStore.update({
    italeemConnected: true,
    italeemStudentId: studentId.trim(),
  });
  if (typeof window !== "undefined") {
    sessionStorage.setItem("soft-oasis-italeem-login-reminder", "1");
  }
}

export function disconnectItaleem() {
  settingsStore.update({
    italeemConnected: false,
    italeemStudentId: "",
  });
}
