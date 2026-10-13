"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

const MAX_TILT = 2; // degrees

function canTilt() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Card wrapper: cursor-following accent spotlight + subtle 2° tilt (desktop, motion-OK only). */
export function Spotlight({
  children,
  className,
  tilt = true,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--spot", "1");
    if (tilt && canTilt()) {
      const rx = ((y / r.height) * 2 - 1) * -MAX_TILT;
      const ry = ((x / r.width) * 2 - 1) * MAX_TILT;
      el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    }
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spot", "0");
    el.style.transform = "";
  }

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "spotlight transition-transform duration-500 ease-out-expo will-change-transform",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
