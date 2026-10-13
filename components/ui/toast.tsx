"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const EVENT = "app:toast";

/** Fire-and-forget toast from anywhere on the client. */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      setKey((k) => k + 1);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 2200);
    };
    window.addEventListener(EVENT, onToast);
    return () => {
      window.removeEventListener(EVENT, onToast);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4"
    >
      {message ? (
        <div
          key={key}
          className="flex [animation:fade-up_.4s_var(--ease-out-expo)_both] items-center gap-2 rounded-full border border-border-strong bg-bg-elevated/95 px-4 py-2 text-sm text-fg shadow-2xl backdrop-blur"
        >
          <Check className="size-4 text-success" aria-hidden="true" />
          {message}
        </div>
      ) : null}
    </div>
  );
}
