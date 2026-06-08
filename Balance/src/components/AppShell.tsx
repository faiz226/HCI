import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ToggleTheme } from "@/components/ToggleTheme";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { sessionStore, useSession } from "@/lib/session-store";
import { showItaleemConnectReminder } from "@/lib/italeem";
import { useSettings } from "@/lib/settings-store";
import { useTaskReminders } from "@/lib/task-reminders";

type NavItem = {
  to: "/" | "/tasks" | "/buddy" | "/balance" | "/rewards";
  label: string;
  icon: string;
};

const NAV: NavItem[] = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/tasks", label: "Tasks", icon: "checklist" },
  { to: "/buddy", label: "Buddy", icon: "smart_toy" },
  { to: "/balance", label: "Balance", icon: "monitor_heart" },
  { to: "/rewards", label: "Rewards", icon: "military_tech" },
];

type MenuLink = {
  label: string;
  icon: string;
  to: "/" | "/settings" | "/library" | "/help" | "/crisis";
  tab?: string;
};
const MENU_LINKS: MenuLink[] = [
  { label: "Settings", icon: "settings", to: "/settings", tab: "general" },
  { label: "Notifications", icon: "notifications", to: "/settings", tab: "notifications" },
  { label: "Wellness library", icon: "menu_book", to: "/library" },
  { label: "Privacy", icon: "lock", to: "/settings", tab: "privacy" },
  { label: "Help & support", icon: "help", to: "/help" },
  { label: "Crisis support", icon: "emergency_share", to: "/crisis" },
];

export function AppShell({
  title,
  children,
  showCrisisFab = false,
}: {
  title: string;
  children: ReactNode;
  showCrisisFab?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const session = useSession();
  const settings = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  useTaskReminders();

  useEffect(() => {
    if (!session.signedIn || settings.italeemConnected) return;
    const key = "soft-oasis-italeem-login-reminder";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    showItaleemConnectReminder(() => navigate({ to: "/settings", search: { tab: "integrations" } }));
  }, [session.signedIn, settings.italeemConnected, navigate]);

  const handleSignOut = () => {
    sessionStore.signOut();
    sessionStorage.removeItem("soft-oasis-italeem-login-reminder");
    setSignOutOpen(false);
    toast("Signed out. Take care, " + session.name.split(" ")[0] + ".");
    navigate({ to: "/profile" });
  };

  return (
    <div className="min-h-screen bg-background text-on-background pb-32">
      <header className="w-full sticky top-0 bg-background/95 backdrop-blur-sm flex justify-between items-center px-6 py-2 z-40 border-b border-outline-variant/30">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Menu"
              className="text-primary p-2 -ml-2 rounded-full transition hover:bg-surface-container active:scale-90"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-background border-outline-variant">
            <SheetHeader>
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Soft Oasis"
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <SheetTitle className="font-display text-2xl text-deep-forest">
                    Soft Oasis
                  </SheetTitle>
                  <SheetDescription className="text-on-surface-variant">
                    A gentle space for the journey.
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-6 px-2">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  className={
                    "flex items-center gap-3 px-3 py-3 rounded-full text-base transition " +
                    (pathname === n.to
                      ? "bg-primary-container/50 text-on-primary-container"
                      : "text-on-surface hover:bg-surface-container")
                  }
                >
                  <span className="material-symbols-outlined">{n.icon}</span>
                  {n.label}
                </Link>
              ))}
              <div className="my-3 h-px bg-outline-variant" />
              {MENU_LINKS.map((m) => (
                <Link
                  key={m.label}
                  to={m.to}
                  search={m.tab ? { tab: m.tab } : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-full text-base text-on-surface hover:bg-surface-container transition"
                >
                  <span className="material-symbols-outlined">{m.icon}</span>
                  {m.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Soft Oasis"
            className="w-7 h-7 rounded-lg object-cover"
          />
          <h1 className="font-display text-xl font-semibold text-primary">{title}</h1>
        </div>

        <div className="flex items-center gap-1">
          <ToggleTheme className="h-9 w-9 border-0 bg-transparent hover:bg-surface-container" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Account"
                className="text-primary p-2 -mr-2 rounded-full transition hover:bg-surface-container active:scale-90"
              >
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-on-surface">
                    {session.signedIn ? session.name : "Guest"}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {session.signedIn ? session.email : "Not signed in"}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                <span className="material-symbols-outlined mr-2 text-[18px]">person</span>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: "/settings", search: { tab: "preferences" } })}
              >
                <span className="material-symbols-outlined mr-2 text-[18px]">tune</span>
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {session.signedIn ? (
                <DropdownMenuItem onClick={() => setSignOutOpen(true)}>
                  <span className="material-symbols-outlined mr-2 text-[18px]">logout</span>
                  Sign out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    sessionStore.signIn();
                    toast("Welcome back");
                    navigate({ to: "/profile" });
                  }}
                >
                  <span className="material-symbols-outlined mr-2 text-[18px]">login</span>
                  Sign in
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="px-6 mt-2 animate-in fade-in duration-300">{children}</main>

      <BottomNav />

      {showCrisisFab && pathname !== "/crisis" && (
        <div className="fixed bottom-24 right-6 z-50">
          <button
            onClick={() => navigate({ to: "/crisis" })}
            title="Get help"
            aria-label="Get help"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-lg transition-transform hover:scale-105 active:scale-90"
          >
            <span className="material-symbols-outlined filled text-[28px]">emergency_share</span>
          </button>
        </div>
      )}

      <AlertDialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-deep-forest">
              Sign out?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your tasks and settings stay on this device. You can sign back in anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay signed in</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Sign out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}