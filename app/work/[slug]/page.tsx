import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseVideo } from "@/components/case-study/case-video";
import { Toc } from "@/components/case-study/toc";
import { CaseStudyBody } from "@/components/mdx/mdx-content";
import { GitHubIcon } from "@/components/ui/brand-icons";
import { buttonClass } from "@/components/ui/button";
import { StackChips } from "@/components/ui/stack-chips";
import { CATEGORY_LABELS, getNextProject, getProject, getProjects } from "@/lib/content";
import { jsonLdScript, projectJsonLd } from "@/lib/seo";
import { formatMonth, shown } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.outcome,
      url: `/work/${project.slug}`,
    },
  };
}

const TLDR_LABELS = ["What it is", "What I did", "Result"];
const STATUS = { shipped: "Shipped", "in-progress": "In progress", archived: "Archived" } as const;

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(project.slug);

  const meta = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: shown(project.timeline) },
    {
      label: "Team",
      value: project.teamSize
        ? project.teamSize === 1
          ? "Solo"
          : `${project.teamSize} people`
        : null,
    },
    { label: "Date", value: formatMonth(project.date) },
  ].filter((m): m is { label: string; value: string } => !!m.value);

  return (
    <article className="pt-28 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(projectJsonLd(project))}
      />

      {/* Header */}
      <header className="container-page">
        <Link
          href="/work"
          className="group mb-10 inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          All work
        </Link>
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <p className="eyebrow mb-5">
              {project.categories.map((c) => CATEGORY_LABELS[c]).join(" · ")}{" "}
              <span aria-hidden="true">/</span> {STATUS[project.status]}
            </p>
            <h1 className="text-display text-balance">{project.title}</h1>
            <p className="mt-6 max-w-[48ch] text-xl leading-relaxed text-fg-muted">
              {project.outcome}
            </p>
          </div>
          <dl className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-5 self-end sm:grid-cols-4 lg:col-span-4 lg:grid-cols-2">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="eyebrow mb-1">{m.label}</dt>
                <dd className="text-[15px] text-fg">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <StackChips stack={project.stack} />
          <div className="flex flex-wrap gap-2">
            {project.links.live ? (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className={buttonClass("primary")}
              >
                Live demo <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : null}
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className={buttonClass("secondary")}
              >
                <GitHubIcon className="size-4" /> GitHub{" "}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : null}
            {project.links.demo ? (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className={buttonClass("secondary")}
              >
                <Play className="size-4" aria-hidden="true" /> Video
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {/* Hero media */}
      <div className="container-page mt-12">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-bg-elevated">
          {project.video ? (
            <CaseVideo
              src={project.video.src}
              poster={project.video.poster}
              label={`${project.title} demo video`}
            />
          ) : (
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              priority
              sizes="(min-width: 1248px) 1200px, 100vw"
              placeholder="blur"
              blurDataURL={project.cover.blurDataURL}
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* TL;DR + metrics */}
      <div className="container-page mt-8">
        <section
          aria-labelledby="tldr"
          className="rounded-2xl border border-border bg-bg-elevated p-6 md:p-8"
        >
          <h2 id="tldr" className="eyebrow mb-6 text-accent">
            TL;DR for recruiters
          </h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {project.tldr.map((line, i) => (
              <li key={i}>
                <p className="mono-label mb-2 text-xs">{TLDR_LABELS[i]}</p>
                <p className="text-[15px] leading-relaxed text-fg">{line}</p>
              </li>
            ))}
          </ol>
          {project.metrics.length ? (
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 md:grid-cols-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-sm text-fg-muted">{m.label}</dt>
                  <dd className="font-mono text-2xl text-accent">{m.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
      </div>

      {/* Body */}
      <div className="container-page grid-12 section pt-16 md:pt-20">
        <aside className="col-span-3 hidden lg:block">
          <Toc headings={project.headings} />
        </aside>
        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <CaseStudyBody project={project} />
        </div>
      </div>

      {/* Next project */}
      {next ? (
        <nav aria-label="Next project" className="border-t border-border">
          <Link
            href={`/work/${next.slug}`}
            className="group container-page flex items-center justify-between gap-6 py-14 md:py-20"
          >
            <div>
              <p className="eyebrow mb-3">Next project</p>
              <p className="text-h2 font-semibold transition-colors group-hover:text-accent">
                {next.title}
              </p>
              <p className="mt-2 max-w-xl text-fg-muted">{next.outcome}</p>
            </div>
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border-strong transition-[transform,border-color] duration-500 ease-out-expo group-hover:translate-x-1 group-hover:border-accent">
              <ArrowRight className="size-5" aria-hidden="true" />
            </span>
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
