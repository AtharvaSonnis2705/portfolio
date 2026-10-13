import { ArrowDown, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { HeroMesh } from "@/components/home/hero-mesh";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { site } from "@/content/site";

function Headline({ text }: { text: string }) {
  // "I build AI-powered products, end to end." → last clause dimmed for rhythm
  const [lead, tail] = text.split(/,\s*/);
  const words = [
    ...lead
      .split(" ")
      .map((w, i, a) => ({ w: i === a.length - 1 && tail ? `${w},` : w, dim: false })),
    ...(tail ? tail.split(" ").map((w) => ({ w, dim: true })) : []),
  ];
  return (
    <h1 className="max-w-[13ch] text-display text-balance">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map(({ w, dim }, i) => (
          <span key={i}>
            <span className="word-mask">
              <span
                style={{ "--i": i } as React.CSSProperties}
                className={dim ? "text-fg-muted" : undefined}
              >
                {w}
              </span>
            </span>{" "}
          </span>
        ))}
      </span>
    </h1>
  );
}

export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-20 pb-10 md:pt-28 md:pb-20"
    >
      <div className="absolute inset-0 -z-10">
        <HeroMesh />
        <div className="bg-dots absolute inset-0 opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="container-page">
        {site.availability.open ? (
          <p className="inline-flex max-w-full [animation:fade-up_.6s_var(--ease-out-expo)_both] items-center gap-2.5 rounded-full border border-border bg-bg-elevated/70 px-3 py-1.5 font-mono text-[11px] leading-snug text-fg-muted backdrop-blur sm:text-xs">
            <span
              className="relative flex size-2 shrink-0 animate-pulse-dot rounded-full bg-success"
              aria-hidden="true"
            />
            {site.availability.label}
          </p>
        ) : null}

        <div className="mt-6 md:mt-8">
          <Headline text={site.headline} />
        </div>

        <p className="mt-5 max-w-[54ch] [animation:fade-up_.7s_var(--ease-out-expo)_.45s_both] text-[17px] leading-relaxed text-fg-muted md:mt-7 md:text-xl">
          {site.subline}
        </p>

        <div className="mt-8 flex [animation:fade-up_.7s_var(--ease-out-expo)_.55s_both] flex-wrap items-center gap-3 md:mt-10">
          <Link href="/#work" className={buttonClass("primary")}>
            View work
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <a href={site.resume} download className={buttonClass("secondary")}>
            Download résumé
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
          <CopyEmailButton email={site.email} />
        </div>

        <ul
          className="mt-7 flex [animation:fade-up_.7s_var(--ease-out-expo)_.65s_both] items-center gap-5 text-fg-muted md:mt-10"
          aria-label="Elsewhere"
        >
          <li>
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm transition-colors hover:text-fg"
            >
              <GitHubIcon className="size-4" />
              <span className="sr-only sm:not-sr-only">GitHub</span>
            </a>
          </li>
          <li>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm transition-colors hover:text-fg"
            >
              <LinkedInIcon className="size-4" />
              <span className="sr-only sm:not-sr-only">LinkedIn</span>
            </a>
          </li>
          <li>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-2 text-sm transition-colors hover:text-fg"
            >
              <Mail className="size-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Email</span>
            </a>
          </li>
        </ul>
      </div>

      <div
        className="container-page absolute inset-x-0 bottom-6 hidden justify-between md:flex"
        aria-hidden="true"
      >
        <span className="mono-label">Mumbai · IST (UTC+5:30)</span>
        <span className="mono-label">Press ⌘K to explore</span>
      </div>
    </section>
  );
}
