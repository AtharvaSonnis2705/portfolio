"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";

/** Wraps Shiki's <pre> (highlighted at build time) with a copy button. */
export function CodeBlock(props: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const lang = (props as { "data-language"?: string })["data-language"];

  async function copy() {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div className="group relative my-8">
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-2">
        {lang ? (
          <span className="font-mono text-[11px] text-fg-faint uppercase">{lang}</span>
        ) : null}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="flex size-8 items-center justify-center rounded-md border border-border bg-bg-subtle text-fg-muted transition-colors hover:text-fg"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <pre ref={ref} {...props} tabIndex={0} />
    </div>
  );
}
