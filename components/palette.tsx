"use client";

import { Command } from "cmdk";
import {
  ArrowRight,
  Award,
  Clock,
  CodeXml,
  Copy,
  FileDown,
  FolderGit2,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { copyEmail } from "@/components/ui/copy-email-button";
import type { PaletteData } from "@/lib/content";

type Item = {
  id: string;
  label: string;
  hint?: string;
  keywords?: string[];
  group: "Navigate" | "Projects" | "Credentials" | "Actions";
  icon: LucideIcon | typeof GitHubIcon;
  run: () => void;
};

const RECENT_KEY = "palette:recent";

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function pushRecent(id: string) {
  try {
    const next = [id, ...readRecent().filter((r) => r !== id)].slice(0, 4);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — recents are a convenience only */
  }
}

export function Palette({
  open,
  onOpenChange,
  data,
  email,
  resume,
  github,
  linkedin,
  source,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PaletteData;
  email: string;
  resume: string;
  github: string;
  linkedin: string;
  source: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState<string[]>(readRecent);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => router.push(href);
    const ext = (href: string) => () => window.open(href, "_blank", "noopener,noreferrer");
    return [
      { id: "nav-home", label: "Home", group: "Navigate", icon: Hash, run: go("/") },
      {
        id: "nav-work",
        label: "Selected work",
        group: "Navigate",
        icon: Hash,
        run: go("/#work"),
        keywords: ["projects"],
      },
      {
        id: "nav-all-work",
        label: "All projects",
        hint: "/work",
        group: "Navigate",
        icon: ArrowRight,
        run: go("/work"),
      },
      {
        id: "nav-experience",
        label: "Experience",
        group: "Navigate",
        icon: Hash,
        run: go("/#experience"),
        keywords: ["jobs", "internship"],
      },
      {
        id: "nav-skills",
        label: "Skills",
        group: "Navigate",
        icon: Hash,
        run: go("/#skills"),
        keywords: ["stack", "tech"],
      },
      {
        id: "nav-credentials",
        label: "Credentials",
        hint: "/credentials",
        group: "Navigate",
        icon: ArrowRight,
        run: go("/credentials"),
        keywords: ["certifications", "achievements", "hackathon"],
      },
      {
        id: "nav-about",
        label: "About",
        hint: "/about",
        group: "Navigate",
        icon: ArrowRight,
        run: go("/about"),
        keywords: ["bio", "education"],
      },
      {
        id: "nav-contact",
        label: "Contact",
        hint: "/contact",
        group: "Navigate",
        icon: ArrowRight,
        run: go("/contact"),
        keywords: ["hire", "email", "message"],
      },
      ...data.projects.map<Item>((p) => ({
        id: `project-${p.slug}`,
        label: p.title,
        hint: p.summary,
        keywords: p.keywords,
        group: "Projects",
        icon: FolderGit2,
        run: go(`/work/${p.slug}`),
      })),
      ...data.credentials.map<Item>((c) => ({
        id: c.id,
        label: c.title,
        hint: c.meta,
        group: "Credentials",
        icon: Award,
        run: c.href.startsWith("/") ? go(c.href) : ext(c.href),
      })),
      {
        id: "act-copy-email",
        label: "Copy email",
        hint: email,
        group: "Actions",
        icon: Copy,
        run: () => copyEmail(email),
      },
      {
        id: "act-resume",
        label: "Download résumé",
        hint: "PDF",
        group: "Actions",
        icon: FileDown,
        keywords: ["cv", "resume"],
        run: () => {
          const a = document.createElement("a");
          a.href = resume;
          a.download = "";
          a.click();
        },
      },
      {
        id: "act-github",
        label: "Open GitHub",
        group: "Actions",
        icon: GitHubIcon,
        run: ext(github),
      },
      {
        id: "act-linkedin",
        label: "Open LinkedIn",
        group: "Actions",
        icon: LinkedInIcon,
        run: ext(linkedin),
      },
      {
        id: "act-source",
        label: "View source",
        hint: "this site",
        group: "Actions",
        icon: CodeXml,
        run: ext(source),
      },
    ];
  }, [data, email, resume, github, linkedin, source, router]);

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const recentItems = recent.map((id) => byId.get(id)).filter((i): i is Item => !!i);

  const select = (item: Item) => {
    pushRecent(item.id);
    setRecent(readRecent());
    onOpenChange(false);
    setSearch("");
    item.run();
  };

  const groups = ["Navigate", "Projects", "Credentials", "Actions"] as const;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      loop
      overlayClassName="fixed inset-0 z-[80] bg-bg/60 backdrop-blur-sm [animation:fade-up_.2s_ease-out_both]"
      contentClassName="fixed left-1/2 top-[12vh] z-[90] w-[min(640px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border-strong bg-bg-elevated shadow-[0_24px_80px_-12px_rgb(0_0_0/0.9)]"
    >
      <div className="flex items-center gap-3 border-b border-border px-4">
        <span className="font-mono text-xs text-accent" aria-hidden="true">
          ⌘K
        </span>
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search projects, pages, actions…"
          className="h-14 w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-faint"
        />
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-fg-faint sm:block">
          ESC
        </kbd>
      </div>
      <Command.List className="max-h-[min(60vh,440px)] scroll-py-2 overflow-y-auto overscroll-contain p-2">
        <Command.Empty className="px-3 py-10 text-center text-sm text-fg-muted">
          No results. Try “AI”, “AWS” or “résumé”.
        </Command.Empty>

        {!search && recentItems.length > 0 ? (
          <Command.Group heading="Recent" className="palette-group">
            {recentItems.map((item) => (
              <PaletteRow
                key={`recent-${item.id}`}
                item={item}
                value={`${item.label}\u200brecent`}
                recent
                onSelect={select}
              />
            ))}
          </Command.Group>
        ) : null}

        {groups.map((g) => {
          const list = items.filter((i) => i.group === g);
          if (!list.length) return null;
          return (
            <Command.Group key={g} heading={g} className="palette-group">
              {list.map((item) => (
                <PaletteRow key={item.id} item={item} onSelect={select} />
              ))}
            </Command.Group>
          );
        })}
      </Command.List>
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[11px] text-fg-faint">
        <span>↑↓ navigate · ↵ select</span>
        <span>Atharva Sonnis</span>
      </div>
    </Command.Dialog>
  );
}

function PaletteRow({
  item,
  value,
  recent,
  onSelect,
}: {
  item: Item;
  value?: string;
  recent?: boolean;
  onSelect: (item: Item) => void;
}) {
  const Icon = recent ? Clock : item.icon;
  return (
    <Command.Item
      // value is what cmdk fuzzy-matches: label only, so group names/ids never cause false hits
      value={value ?? item.label}
      keywords={[...(item.keywords ?? []), item.hint ?? ""].filter(Boolean)}
      onSelect={() => onSelect(item)}
      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-fg-muted data-[selected=true]:bg-bg-subtle data-[selected=true]:text-fg"
    >
      <Icon
        className="size-4 shrink-0 text-fg-faint group-data-[selected=true]:text-accent"
        aria-hidden="true"
      />
      <span className="shrink-0">{item.label}</span>
      {item.hint ? <span className="truncate text-xs text-fg-faint">{item.hint}</span> : null}
    </Command.Item>
  );
}
