import { Link, useRouterState } from "@tanstack/react-router";

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

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-outline-variant/30 bg-surface-white/95 px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-soft-up backdrop-blur-sm">
      <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
        {NAV.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex flex-col items-center justify-center rounded-2xl px-1 py-1.5 transition-colors duration-200 active:scale-95 " +
                (active
                  ? "bg-primary-container/60 text-on-primary-container"
                  : "text-on-surface-variant hover:text-on-surface")
              }
            >
              <span className={"material-symbols-outlined text-[22px] " + (active ? "filled" : "")}>
                {item.icon}
              </span>
              <span className="mt-0.5 text-[10px] font-medium leading-none tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
