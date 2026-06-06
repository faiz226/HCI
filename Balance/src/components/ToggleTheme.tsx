"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { applyTheme } from "@/lib/theme";
import { settingsStore, useSettings } from "@/lib/settings-store";

type AnimationType = "swipe-left" | "swipe-right";

type ToggleThemeProps = React.ComponentPropsWithoutRef<"button"> & {
  duration?: number;
};

export function ToggleTheme({ className, duration = 400, ...props }: ToggleThemeProps) {
  const settings = useSettings();
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sync = () => setIsDark(document.documentElement.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;
    const nextDark = !isDark;
    const animationType: AnimationType = nextDark ? "swipe-left" : "swipe-right";
    const nextTheme = nextDark ? "dark" : "light";

    const run = () => {
      flushSync(() => {
        setIsDark(nextDark);
        settingsStore.update({ theme: nextTheme });
        applyTheme(nextTheme);
      });
    };

    if (typeof document.startViewTransition === "function") {
      await document.startViewTransition(run).ready;
    } else {
      run();
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (typeof document.startViewTransition !== "function") return;

    if (animationType === "swipe-left") {
      document.documentElement.animate(
        {
          clipPath: [`inset(0 0 0 ${viewportWidth}px)`, "inset(0 0 0 0)"],
        },
        {
          duration,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    } else {
      document.documentElement.animate(
        {
          clipPath: [`inset(0 ${viewportWidth}px 0 0)`, "inset(0 0 0 0)"],
        },
        {
          duration,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }

    void viewportHeight;
  }, [duration, isDark]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-white text-on-surface transition hover:bg-surface-container",
          className,
        )}
        {...props}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            ::view-transition-old(root),
            ::view-transition-new(root) {
              animation: none;
              mix-blend-mode: normal;
            }
          `,
        }}
      />
    </>
  );
}
