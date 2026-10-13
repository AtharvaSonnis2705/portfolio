import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import headshot from "@/public/images/about/headshot.webp";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/content/site";
import { shownList } from "@/lib/utils";

export function NowBlock() {
  const building = shownList(site.now.building);
  const learning = shownList(site.now.learning);
  return (
    <dl className="grid gap-5 rounded-2xl border border-border bg-bg-elevated p-5 sm:grid-cols-2">
      {building.length ? (
        <div>
          <dt className="eyebrow mb-2 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            Currently building
          </dt>
          {building.map((b) => (
            <dd key={b} className="text-[15px] text-fg-muted">
              {b}
            </dd>
          ))}
        </div>
      ) : null}
      {learning.length ? (
        <div>
          <dt className="eyebrow mb-2">Currently learning</dt>
          {learning.map((l) => (
            <dd key={l} className="text-[15px] text-fg-muted">
              {l}
            </dd>
          ))}
        </div>
      ) : null}
    </dl>
  );
}

export function AboutTeaser() {
  return (
    <section id="about" aria-labelledby="about-title" className="section border-t border-border">
      <div className="container-page grid-12 gap-y-10">
        <div className="col-span-12 md:col-span-5 lg:col-span-4" data-reveal>
          <div className="duotone aspect-[4/5] rounded-2xl border border-border bg-bg-elevated">
            <Image
              src={headshot}
              alt={site.headshot.alt}
              placeholder="blur"
              sizes="(min-width: 1024px) 380px, (min-width: 768px) 40vw, 100vw"
              className="size-full object-cover object-top"
            />
          </div>
        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
          <SectionHeading
            index="05"
            eyebrow="About"
            id="about-title"
            title="Hi, I'm Atharva."
            className="md:mb-8"
          />
          <div className="max-w-prose space-y-4 text-fg-muted" data-reveal>
            {site.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8" data-reveal>
            <NowBlock />
          </div>
          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            data-reveal
          >
            More about me
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
