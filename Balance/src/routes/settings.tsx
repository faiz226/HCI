import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ToggleTheme } from "@/components/ToggleTheme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypographyEyebrow, TypographyMuted } from "@/components/ui/typography";
import { applyTheme } from "@/lib/theme";
import { settingsStore, useSettings } from "@/lib/settings-store";
import { connectItaleem, disconnectItaleem } from "@/lib/italeem";
import { toast } from "sonner";

type SettingsSearch = { tab?: string };

export const Route = createFileRoute("/settings")({
  validateSearch: (search: Record<string, unknown>): SettingsSearch => ({
    tab: typeof search.tab === "string" ? search.tab : "general",
  }),
  head: () => ({
    meta: [
      { title: "Settings · Soft Oasis" },
      { name: "description", content: "Tune reminders, privacy, and how Soft Oasis feels for you." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { tab = "general" } = Route.useSearch();
  const settings = useSettings();
  const navigate = useNavigate({ from: Route.fullPath });
  const [studentId, setStudentId] = useState(settings.italeemStudentId);

  const setTab = (value: string) => {
    navigate({ search: { tab: value } });
  };

  return (
    <AppShell title="Settings">
      <div className="flex flex-col gap-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-primary font-medium w-fit -mt-1"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Link>

        <Tabs value={tab} onValueChange={setTab} className="flex flex-col gap-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-1 bg-surface-container p-1 rounded-xl">
            <TabsTrigger value="general" className="rounded-lg text-xs sm:text-sm">
              General
            </TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-lg text-xs sm:text-sm">
              Integrations
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg text-xs sm:text-sm">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-lg text-xs sm:text-sm">
              Privacy
            </TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-lg text-xs sm:text-sm">
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="flex flex-col gap-3 mt-0">
            <SettingsCard title="Appearance" description="How Soft Oasis looks on your device.">
              <SettingRow label="Theme">
                <div className="flex items-center gap-2">
                  <ToggleTheme />
                  <TypographyMuted className="text-xs">
                    
                  </TypographyMuted>
                </div>
              </SettingRow>
              <SettingRow label="Follow system">
                <Switch
                  checked={settings.theme === "system"}
                  onCheckedChange={(on) => {
                    const theme = on ? "system" : "light";
                    settingsStore.update({ theme });
                    applyTheme(theme);
                    toast("Theme updated", {
                      description: on ? "Matching your device setting." : "Using light mode.",
                    });
                  }}
                />
              </SettingRow>
              <SettingRow label="Reduce motion">
                <Switch
                  checked={settings.reduceMotion}
                  onCheckedChange={(v) => settingsStore.update({ reduceMotion: v })}
                />
              </SettingRow>
            </SettingsCard>
            <button
              onClick={() => {
                settingsStore.reset();
                toast("Settings reset to defaults");
              }}
              className="text-sm text-on-surface-variant hover:text-secondary transition text-left px-1"
            >
              Reset all settings
            </button>
          </TabsContent>

          <TabsContent value="integrations" className="flex flex-col gap-3 mt-0">
            <SettingsCard
              title="i-Taleem"
              description="Connect your IIUM student portal to pull classes, deadlines, and academic tasks into Soft Oasis."
            >
              {settings.italeemConnected ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl bg-primary-container/30 px-3 py-3">
                    <span className="material-symbols-outlined text-primary">link</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-on-surface">Connected</span>
                      <span className="text-xs text-on-surface-variant">
                        Student ID: {settings.italeemStudentId || "—"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      disconnectItaleem();
                      setStudentId("");
                      toast("i-Taleem disconnected", {
                        description: "Academic sync is paused until you connect again.",
                      });
                    }}
                    className="self-start text-sm text-secondary hover:underline px-1"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="italeem-id" className="text-sm text-on-surface-variant">
                      IIUM student ID
                    </Label>
                    <Input
                      id="italeem-id"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. 1234567"
                      className="bg-surface-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!studentId.trim()) {
                        toast("Enter your student ID", {
                          description: "Use the ID from your i-Taleem account.",
                        });
                        return;
                      }
                      connectItaleem(studentId);
                      toast("i-Taleem connected", {
                        description: "Your timetable and deadlines will sync shortly.",
                      });
                    }}
                    className="self-start px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition active:scale-95"
                  >
                    Connect i-Taleem
                  </button>
                </>
              )}
            </SettingsCard>
            <p className="text-xs text-on-surface-variant px-1 leading-relaxed">
              i-Taleem is IIUM&apos;s student portal. Connecting lets Buddy and Tasks stay aligned
              with your real academic schedule.
            </p>
          </TabsContent>

          <TabsContent value="notifications" className="flex flex-col gap-3 mt-0">
            <SettingsCard title="Gentle nudges" description="Choose what reaches you and when.">
              <SettingRow label="Daily wellbeing reminders">
                <Switch
                  checked={settings.dailyReminders}
                  onCheckedChange={(v) => settingsStore.update({ dailyReminders: v })}
                />
              </SettingRow>
              <SettingRow label="Task nudges">
                <Switch
                  checked={settings.taskNudges}
                  onCheckedChange={(v) => settingsStore.update({ taskNudges: v })}
                />
              </SettingRow>
              <SettingRow label="Buddy check-ins">
                <Switch
                  checked={settings.buddyCheckIns}
                  onCheckedChange={(v) => settingsStore.update({ buddyCheckIns: v })}
                />
              </SettingRow>
              <SettingRow label="Weekly digest email">
                <Switch
                  checked={settings.weeklyDigest}
                  onCheckedChange={(v) => settingsStore.update({ weeklyDigest: v })}
                />
              </SettingRow>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="privacy" className="flex flex-col gap-3 mt-0">
            <SettingsCard title="Your data" description="You're in control of what stays private.">
              <SettingRow label="Share anonymous analytics">
                <Switch
                  checked={settings.shareAnalytics}
                  onCheckedChange={(v) => settingsStore.update({ shareAnalytics: v })}
                />
              </SettingRow>
              <SettingRow label="Public profile on rewards">
                <Switch
                  checked={settings.publicProfile}
                  onCheckedChange={(v) => settingsStore.update({ publicProfile: v })}
                />
              </SettingRow>
            </SettingsCard>
            <p className="text-xs text-on-surface-variant px-1 leading-relaxed">
              Soft Oasis stores your preferences locally on this device. Nothing leaves without
              your consent.
            </p>
          </TabsContent>

          <TabsContent value="preferences" className="flex flex-col gap-3 mt-0">
            <SettingsCard title="Language & tone" description="Make the app feel like home.">
              <SettingRow label="Language">
                <Select
                  value={settings.language}
                  onValueChange={(v) => {
                    settingsStore.update({ language: v as typeof settings.language });
                    toast("Language updated");
                  }}
                >
                  <SelectTrigger className="w-[140px] bg-surface-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ms">Bahasa Melayu</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </SettingsCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-surface-white rounded-xl border border-dusty-olive/20 shadow-soft p-4 flex flex-col gap-4">
      <div>
        <TypographyEyebrow>{title}</TypographyEyebrow>
        <TypographyMuted className="mt-1">{description}</TypographyMuted>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label className="text-sm text-on-surface font-normal">{label}</Label>
      {children}
    </div>
  );
}
