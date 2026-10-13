import { isDev } from "@/lib/utils";

/**
 * Placeholder for content Atharva still needs to fill in.
 * Highlighted in `pnpm dev`; renders nothing in production builds.
 */
export function Todo({ children }: { children?: React.ReactNode }) {
  if (!isDev) return null;
  return (
    <span className="rounded border border-dashed border-warning/60 bg-warning/10 px-1.5 py-0.5 font-mono text-[0.8em] text-warning">
      TODO(Atharva): {children}
    </span>
  );
}
