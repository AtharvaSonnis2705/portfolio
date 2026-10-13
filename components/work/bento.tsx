"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Filter = { id: string; label: string; count: number };

/**
 * Bento layout for featured work: first visible tile large (2×2), next two medium,
 * the rest small — recomputed whenever the category filter changes.
 */
function placement(index: number, total: number): string {
  if (total === 1) return "md:col-span-2 lg:col-span-12";
  if (total === 2) return index === 0 ? "lg:col-span-7" : "lg:col-span-5";
  if (index === 0) return "md:col-span-2 lg:col-span-7 lg:row-span-2";
  if (index < 3) return "lg:col-span-5";
  // small tiles: rows of three; a short final row stretches to fill
  const smalls = total - 3;
  const pos = index - 3;
  const lastRowStart = smalls - (smalls % 3 || 3);
  const inLastRow = pos >= lastRowStart;
  const lastRowCount = smalls % 3 || 3;
  const md = smalls % 2 === 1 && pos === smalls - 1 ? "md:col-span-2" : "";
  if (!inLastRow || lastRowCount === 3) return cn("lg:col-span-4", md);
  return cn(lastRowCount === 2 ? "lg:col-span-6" : "lg:col-span-12", md);
}

export function Bento({
  items,
  cards,
  filters,
}: {
  items: { slug: string; categories: string[] }[];
  cards: React.ReactNode[];
  filters: Filter[];
}) {
  const [active, setActive] = useState("all");
  const visible = items
    .map((item, i) => ({ ...item, card: cards[i] }))
    .filter((item) => active === "all" || item.categories.includes(active));

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by category"
        className="mb-6 flex flex-wrap gap-2"
        data-reveal
      >
        {filters
          .filter((f) => f.count > 0)
          .map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
              className={cn(
                "flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] transition-colors",
                active === f.id
                  ? "border-fg/80 bg-fg text-bg"
                  : "border-border bg-bg-elevated text-fg-muted hover:border-border-strong hover:text-fg",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "font-mono text-[11px]",
                  active === f.id ? "text-bg/70" : "text-fg-faint",
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
      </div>

      <ul
        key={active}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[minmax(330px,auto)] lg:grid-cols-12"
        aria-live="polite"
      >
        {visible.map((item, i) => (
          <li
            key={item.slug}
            className={cn(
              "min-w-0 [animation:fade-up_.5s_var(--ease-out-expo)_both]",
              placement(i, visible.length),
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {item.card}
          </li>
        ))}
      </ul>
    </div>
  );
}
