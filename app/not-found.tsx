import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[80svh] flex-col items-start justify-center pt-28">
      <p className="eyebrow mb-4">404 / Not found</p>
      <h1 className="text-display text-balance">This page doesn&apos;t exist.</h1>
      <p className="mt-6 max-w-md text-lg text-fg-muted">
        It may have moved. Press{" "}
        <kbd className="rounded border border-border-strong bg-bg-elevated px-1.5 py-0.5 font-mono text-sm text-fg">
          ⌘K
        </kbd>{" "}
        (or{" "}
        <kbd className="rounded border border-border-strong bg-bg-elevated px-1.5 py-0.5 font-mono text-sm text-fg">
          /
        </kbd>
        ) to search projects and pages.
      </p>
      <Link href="/" className={buttonClass("secondary", "mt-10")}>
        <ArrowLeft className="size-4" aria-hidden="true" /> Back home
      </Link>
    </div>
  );
}
