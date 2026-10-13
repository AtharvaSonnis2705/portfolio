"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { PaletteData } from "@/lib/content";

const OPEN_EVENT = "app:open-palette";

export function openPalette() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

// cmdk (+ its dialog) is only downloaded the first time the palette opens.
const Palette = dynamic(() => import("./palette").then((m) => m.Palette), { ssr: false });

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/** Global ⌘K / Ctrl+K / "/" listener. */
export function CommandMenu(props: {
  data: PaletteData;
  email: string;
  resume: string;
  github: string;
  linkedin: string;
  source: string;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const show = () => {
      setLoaded(true);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
        setOpen((o) => !o);
      } else if (e.key === "/" && !isTyping(e.target) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, []);

  return loaded ? <Palette open={open} onOpenChange={setOpen} {...props} /> : null;
}
