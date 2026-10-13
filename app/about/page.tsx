import { ArrowDown } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import headshot from "@/public/images/about/headshot.webp";
import { NowBlock } from "@/components/home/about-teaser";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/content/site";
import { getAchievements, getExperience } from "@/lib/content";
import { formatMonth, formatRange, shownList } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story so far — education, experience and what Atharva Sonnis is building and learning now.",
  alternates: { canonical: "/about" },
};

type Entry = {
  when: string;
  sort: string;
  title: string;
  org: string;
  note?: string;
  kind: string;
};

export default function AboutPage() {
  const timeline: Entry[] = [
    ...getExperience().map((e) => ({
      when: formatRange(e.start, e.end),
      sort: e.start,
      title: e.role,
      org: e.client ? `${e.company} · Client: ${e.client}` : e.company,
      kind: "Work",
    })),
    ...getAchievements().map((a) => ({
      when: formatMonth(a.date),
      sort: a.date,
      title: a.title,
      org: a.event,
      kind: a.type === "hackathon" ? "Hackathon" : "Achievement",
    })),
    ...site.education.map((e) => ({
      when: `${e.start} — ${e.end}`,
      sort: e.start,
      title: e.degree,
      org: e.school,
      note: e.grade,
      kind: "Education",
    })),
  ].sort((a, b) => b.sort.localeCompare(a.sort));

  return (
    <div className="container-page pt-32 pb-[var(--section-y)] md:pt-40">
      <div className="grid-12 gap-y-12">
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <div className="duotone aspect-[4/5] rounded-2xl border border-border bg-bg-elevated md:sticky md:top-28">
            <Image
              src={headshot}
              alt={site.headshot.alt}
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 380px, (min-width: 768px) 40vw, 100vw"
              className="size-full object-cover object-top"
            />
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
          <p className="eyebrow mb-4">About</p>
          <h1 className="text-display text-balance">The story so far.</h1>
          <div className="mt-8 max-w-prose space-y-5 text-lg leading-relaxed text-fg-muted">
            {shownList(site.about).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={site.resume} download className={buttonClass("primary")}>
              Download résumé <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className={buttonClass("secondary")}
            >
              <GitHubIcon className="size-4" /> GitHub
            </a>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className={buttonClass("secondary")}
            >
              <LinkedInIcon className="size-4" /> LinkedIn
            </a>
          </div>

          <section aria-labelledby="now-title" className="mt-16">
            <h2 id="now-title" className="eyebrow mb-4">
              Now
            </h2>
            <NowBlock />
          </section>

          <section aria-labelledby="timeline-title" className="mt-16">
            <h2 id="timeline-title" className="text-h2 font-semibold">
              Timeline
            </h2>
            <ol className="mt-8 border-l border-border">
              {timeline.map((t) => (
                <li
                  key={`${t.kind}-${t.title}`}
                  className="relative pb-10 pl-7 last:pb-0"
                  data-reveal
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-2 -left-[6px] size-[11px] rounded-full border-2 border-bg bg-fg-faint"
                  />
                  <p className="mono-label text-xs">
                    {t.when} · {t.kind}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{t.title}</h3>
                  <p className="text-fg-muted">
                    {t.org}
                    {t.note ? <span className="text-fg-faint"> · {t.note}</span> : null}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <p className="mt-16 text-fg-muted">
            Want the details?{" "}
            <Link
              href="/work"
              className="text-accent underline decoration-accent-glow underline-offset-4 hover:decoration-accent"
            >
              See the case studies
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="text-accent underline decoration-accent-glow underline-offset-4 hover:decoration-accent"
            >
              get in touch
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
