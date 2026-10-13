import { TechIcon } from "@/components/ui/tech-icon";
import { cn } from "@/lib/utils";

export function StackChips({
  stack,
  max,
  className,
}: {
  stack: readonly string[];
  max?: number;
  className?: string;
}) {
  const visible = max ? stack.slice(0, max) : stack;
  const rest = stack.length - visible.length;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Tech stack">
      {visible.map((s) => (
        <li key={s} className="chip">
          <TechIcon name={s} className="size-3 opacity-80" />
          {s}
        </li>
      ))}
      {rest > 0 ? (
        <li className="chip" aria-label={`and ${rest} more`}>
          +{rest}
        </li>
      ) : null}
    </ul>
  );
}
