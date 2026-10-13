import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectCard } from "@/components/work/project-card";
import { WorkExplorer } from "@/components/work/work-explorer";
import {
  CATEGORY_LABELS,
  getCategoryCounts,
  getProjects,
  getSkillProjectMap,
  type Category,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Every project Atharva Sonnis has shipped — AI/ML, full-stack, cloud and hackathon builds, each with a case study.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const projects = getProjects();
  const counts = getCategoryCounts(projects);
  const filters = [
    { id: "all", label: "All", count: counts.all },
    ...(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => ({
      id: c,
      label: CATEGORY_LABELS[c],
      count: counts[c],
    })),
  ];
  // invert skill → projects so the ?skill= filter uses the same matching as the home page chips
  const skillsBySlug = new Map<string, string[]>();
  for (const [skill, list] of getSkillProjectMap()) {
    for (const p of list) skillsBySlug.set(p.slug, [...(skillsBySlug.get(p.slug) ?? []), skill]);
  }
  const cards = projects.map((p, i) => (
    <ProjectCard key={p.slug} project={p} priority={i < 3} headingLevel="h2" />
  ));

  return (
    <div className="container-page pt-32 pb-[var(--section-y)] md:pt-40">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">Work / {projects.length} projects</p>
        <h1 className="text-display text-balance">Everything I&apos;ve built.</h1>
        <p className="mt-6 text-lg text-fg-muted">
          Filter by area or sort by date. Each project opens a case study with the problem, the
          decisions and what I&apos;d do next.
        </p>
      </header>
      <Suspense
        fallback={
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <li key={projects[i].slug}>{c}</li>
            ))}
          </ul>
        }
      >
        <WorkExplorer
          filters={filters}
          cards={cards}
          items={projects.map((p) => ({
            slug: p.slug,
            title: p.title,
            date: p.date,
            categories: p.categories,
            skills: skillsBySlug.get(p.slug) ?? [],
          }))}
        />
      </Suspense>
    </div>
  );
}
