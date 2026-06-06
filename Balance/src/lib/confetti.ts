type ConfettiOptions = {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
};

declare global {
  interface Window {
    confetti?: (options?: ConfettiOptions) => void;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadConfettiScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.confetti) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load confetti"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function fireConfetti(options: ConfettiOptions = {}) {
  try {
    await loadConfettiScript();
    window.confetti?.({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      ...options,
    });
  } catch {
    // Non-critical celebration effect
  }
}
