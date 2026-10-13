import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { site } from "@/content/site";

const updated = new Date(process.env.NEXT_PUBLIC_LAST_UPDATED ?? Date.now());

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-fg">
            {site.name} <span className="text-fg-faint">·</span>{" "}
            <span className="text-fg-muted">{site.jobTitle}</span>
          </p>
          <p className="mono-label">
            Built with Next.js, deployed on Vercel · Last updated{" "}
            <time dateTime={updated.toISOString()}>
              {updated.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-fg-muted">
          <Link href="/work" className="hover:text-fg">
            Work
          </Link>
          <Link href="/credentials" className="hover:text-fg">
            Credentials
          </Link>
          <Link href="/about" className="hover:text-fg">
            About
          </Link>
          <a href={site.sourceUrl} className="hover:text-fg" target="_blank" rel="noreferrer">
            Source
          </a>
          <span className="flex items-center gap-3">
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-fg"
            >
              <GitHubIcon className="size-4" />
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-fg"
            >
              <LinkedInIcon className="size-4" />
            </a>
          </span>
          <span className="mono-label hidden md:inline">
            Press <kbd className="rounded border border-border px-1 text-fg-muted">⌘K</kbd>
          </span>
        </div>
      </div>
    </footer>
  );
}
