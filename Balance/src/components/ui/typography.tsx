import { cn } from "@/lib/utils";

export function TypographyH1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn("font-display text-4xl font-semibold tracking-tight text-deep-forest", className)}
      {...props}
    />
  );
}

export function TypographyH2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("font-display text-2xl font-semibold tracking-tight text-deep-forest", className)}
      {...props}
    />
  );
}

export function TypographyH3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3 className={cn("font-display text-xl font-medium text-deep-forest", className)} {...props} />
  );
}

export function TypographyLead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-lg text-on-surface-variant leading-relaxed", className)} {...props} />
  );
}

export function TypographyMuted({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-on-surface-variant leading-relaxed", className)} {...props} />
  );
}

export function TypographyEyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant",
        className,
      )}
      {...props}
    />
  );
}
