"use client";

import { ArrowDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { openPalette } from "@/components/command-menu";
import { useIsMac } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "work", label: "Work", home: "/#work", page: "/work" },
  { id: "experience", label: "Experience", home: "/#experience", page: "/#experience" },
  { id: "about", label: "About", home: "/#about", page: "/about" },
  { id: "contact", label: "Contact", home: "/#contact", page: "/contact" },
] as const;

export function Nav({ initials, resume }: { initials: string; resume: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const isMac = useIsMac();
  const [lastPath, setLastPath] = useState(pathname);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Frosted pill after 40px + scroll progress bar (direct DOM write — no re-render per frame)
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Active section on the home page
  useEffect(() => {
    if (!isHome) return;
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  // Close the mobile menu on navigation (adjusting state during render, per React docs)…
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  // …and on Escape / outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  const isActive = (l: (typeof LINKS)[number]) =>
    isHome ? active === l.id : l.page !== "/#experience" && pathname.startsWith(l.page);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:px-4">
      <div
        ref={menuRef}
        className={cn(
          "relative w-full transition-[max-width,background-color,border-color,box-shadow,padding] duration-500 ease-out-expo",
          scrolled
            ? "max-w-[880px] rounded-full border border-border bg-bg/70 py-1.5 pr-1.5 pl-2 shadow-[0_8px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl backdrop-saturate-150"
            : "max-w-[calc(1200px+2*var(--gutter))] border border-transparent px-[calc(var(--gutter)-12px)] py-2",
        )}
      >
        <nav aria-label="Primary" className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="group flex size-9 items-center justify-center rounded-full border border-border-strong bg-bg-elevated font-mono text-[13px] font-semibold tracking-tight text-fg transition-colors hover:border-accent/60"
            aria-label="Atharva Sonnis — home"
          >
            {initials}
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l, i) => (
              <li key={l.id}>
                <Link
                  href={isHome ? l.home : l.page}
                  aria-current={isActive(l) ? (isHome ? "location" : "page") : undefined}
                  className={cn(
                    "group flex items-center gap-1.5 rounded-full px-3 py-2 text-sm transition-colors",
                    isActive(l) ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[11px] transition-colors",
                      isActive(l) ? "text-accent" : "text-fg-faint group-hover:text-fg-muted",
                    )}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openPalette}
              className={buttonClass("small", "hidden gap-2 md:inline-flex")}
              aria-label="Open command palette"
              aria-keyshortcuts="Meta+K Control+K"
            >
              <Search className="size-3.5" aria-hidden="true" />
              <kbd className="font-mono text-[11px] text-fg-faint">{isMac ? "⌘K" : "Ctrl K"}</kbd>
            </button>
            <button
              type="button"
              onClick={openPalette}
              className={buttonClass("ghost", "size-9 px-0 md:hidden")}
              aria-label="Search"
            >
              <Search className="size-4" aria-hidden="true" />
            </button>
            <a href={resume} download className={buttonClass("small", "text-fg")}>
              Résumé
              <ArrowDown className="size-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              className={buttonClass("ghost", "size-9 px-0 md:hidden")}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {/* Scroll / section progress */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-6 -bottom-px h-px overflow-hidden transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        >
          <div
            ref={progressRef}
            className="h-full origin-left bg-gradient-to-r from-transparent via-accent to-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {open ? (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-[calc(100%+8px)] [animation:fade-up_.3s_var(--ease-out-expo)_both] rounded-2xl border border-border bg-bg-elevated/95 p-2 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <ul>
              {LINKS.map((l, i) => (
                <li key={l.id}>
                  <Link
                    href={isHome ? l.home : l.page}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-fg hover:bg-bg-subtle"
                  >
                    <span className="font-mono text-xs text-fg-faint">0{i + 1}</span>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/credentials"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-fg hover:bg-bg-subtle"
                >
                  <span className="font-mono text-xs text-fg-faint">05</span>
                  Credentials
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
