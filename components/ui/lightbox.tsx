"use client";

import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type LightboxItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  caption?: string | null;
  pdf?: string | null;
};

/** Accessible modal viewer: Esc closes, ←/→ navigate, swipe on touch, focus is trapped + restored. */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;
  const many = items.length > 1;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && many) onIndex((index! + 1) % items.length);
      else if (e.key === "ArrowLeft" && many) onIndex((index! - 1 + items.length) % items.length);
      else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, many, onClose, onIndex]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {item ? (
          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={item.alt}
            className="fixed inset-0 z-[90] flex flex-col bg-bg/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="flex items-center justify-between gap-3 p-3 md:p-5">
              <p className="mono-label">{many ? `${index! + 1} / ${items.length}` : ""}</p>
              <div className="flex items-center gap-2">
                {item.pdf ? (
                  <a
                    href={item.pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 items-center gap-2 rounded-full border border-border-strong bg-bg-elevated px-4 text-sm text-fg hover:border-fg-faint"
                  >
                    Open PDF <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                ) : null}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex size-10 items-center justify-center rounded-full border border-border-strong bg-bg-elevated text-fg hover:border-fg-faint"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-3 md:px-20"
              onClick={(e) => e.target === e.currentTarget && onClose()}
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.figure
                  key={item.src}
                  className="flex max-h-full w-full max-w-6xl flex-col items-center"
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  drag={many && !reduce ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) onIndex((index! + 1) % items.length);
                    else if (info.offset.x > 80)
                      onIndex((index! - 1 + items.length) % items.length);
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    placeholder={item.blurDataURL ? "blur" : "empty"}
                    blurDataURL={item.blurDataURL}
                    sizes="(min-width: 1200px) 1152px, 100vw"
                    className="max-h-[calc(100svh-180px)] w-auto rounded-xl border border-border object-contain"
                    draggable={false}
                  />
                  {item.caption ? (
                    <figcaption className="mt-4 max-w-2xl text-center text-sm text-fg-muted">
                      {item.caption}
                    </figcaption>
                  ) : null}
                </m.figure>
              </AnimatePresence>

              {many ? (
                <>
                  <button
                    type="button"
                    onClick={() => onIndex((index! - 1 + items.length) % items.length)}
                    aria-label="Previous image"
                    className="absolute left-3 hidden size-11 items-center justify-center rounded-full border border-border-strong bg-bg-elevated text-fg hover:border-fg-faint md:flex"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onIndex((index! + 1) % items.length)}
                    aria-label="Next image"
                    className="absolute right-3 hidden size-11 items-center justify-center rounded-full border border-border-strong bg-bg-elevated text-fg hover:border-fg-faint md:flex"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              ) : null}
            </div>
            <div className="h-6 md:h-10" />
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>,
    document.body,
  );
}
