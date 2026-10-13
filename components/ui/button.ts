import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out-expo select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary:
    "bg-accent text-bg hover:shadow-[0_0_0_4px_var(--color-accent-soft),0_8px_32px_-8px_var(--color-accent-glow)] h-11 px-5",
  secondary:
    "border border-border-strong bg-bg-elevated text-fg hover:border-fg-faint hover:bg-bg-subtle h-11 px-5",
  ghost: "text-fg-muted hover:text-fg hover:bg-bg-subtle h-9 px-3",
  icon: "size-11 border border-border bg-bg-elevated text-fg-muted hover:text-fg hover:border-border-strong",
  small:
    "border border-border bg-bg-elevated text-fg-muted hover:text-fg hover:border-border-strong h-9 px-3.5 text-[13px]",
} as const;

export type ButtonVariant = keyof typeof variants;

export function buttonClass(variant: ButtonVariant = "secondary", className?: string) {
  return cn(base, variants[variant], className);
}
