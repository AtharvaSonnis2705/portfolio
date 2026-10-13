"use client";

import { X } from "lucide-react";
import { LayoutGroup, LazyMotion, domMax, m, useReducedMotion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Item = { slug: string; title: string; date: string; categories: string[]; skills: string[] };
type Filter = { id: string; label: string; count: number };
type Sort = "featured" | "newest" | "oldest" | "az";

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "az", label: "A–Z" },
];

export function WorkExplorer({
  items,
  cards,
  filters,
}: {
  items: Item[];
  cards: React.ReactNode[];
  filters: Filter[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const skill = params.get("skill");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [sort, setSort] = useState<Sort>("featured");

  const visible = useMemo(() => {
    const withCard = items.map((item, i) => ({ ...item, card: cards[i], index: i }));
    const list = withCard.filter(
      (p) =>
        (category === "all" || p.categories.includes(category)) &&
        (!skill || p.skills.includes(skill)),
    );
    switch (sort) {
      case "newest":
        return list.sort((a, b) => b.date.localeCompare(a.date));
      case "oldest":
        return list.sort((a, b) => a.date.localeCompare(b.date));
      case "az":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list.sort((a, b) => a.index - b.index);
    }
  }, [items, cards, category, sort, skill]);

  return (
    <LazyMotion features={domMax}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {filters
            .filter((f) => f.count > 0)
            .map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={category === f.id}
                onClick={() => setCategory(f.id)}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] transition-colors",
                  category === f.id
                    ? "border-fg/80 bg-fg text-bg"
                    : "border-border bg-bg-elevated text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    category === f.id ? "text-bg/70" : "text-fg-faint",
                  )}
                >
                  {f.count}
                </span>
              </button>
            ))}
        </div>
        <label className="flex items-center gap-3 text-sm text-fg-muted">
          <span className="eyebrow">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-9 rounded-full border border-border bg-bg-elevated px-3 text-[13px] text-fg outline-none focus-visible:border-accent"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {skill ? (
        <div className="mb-6 flex items-center gap-3 text-sm text-fg-muted">
          Projects using
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="chip text-fg hover:border-border-strong"
            aria-label={`Clear filter: ${skill}`}
          >
            {skill}
            <X className="size-3" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {visible.length} project{visible.length === 1 ? "" : "s"} shown
      </p>

      {visible.length ? (
        <LayoutGroup>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <m.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0"
              >
                {p.card}
              </m.li>
            ))}
          </ul>
        </LayoutGroup>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-fg-muted">
          No projects match these filters yet.
        </p>
      )}
    </LazyMotion>
  );
}
