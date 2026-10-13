"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a CSS media query; `serverValue` is used during SSR/hydration. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

const noopSubscribe = () => () => {};

/** True on macOS/iOS — for showing ⌘ vs Ctrl. Defaults to ⌘ on the server. */
export function useIsMac() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /mac|iphone|ipad/i.test(navigator.userAgent),
    () => true,
  );
}
