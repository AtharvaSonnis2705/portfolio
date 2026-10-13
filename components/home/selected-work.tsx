import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Bento } from "@/components/work/bento";
import { ProjectCard } from "@/components/work/project-card";
import {
  CATEGORY_LABELS,
  getCategoryCounts,
  getFeaturedProjects,
  type Category,
} from "@/lib/content";

export function SelectedWork() {
  const featured = getFeaturedProjects();
  if (!featured.length) return null;
  const counts = getCategoryCounts(featured);
  const filters = [
    { id: "all", label: "All", count: counts.all },
    ...(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => ({
      id: c,
      label: CATEGORY_LABELS[c],
      count: counts[c],
    })),
  ];

  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <div className="container-page">
        <SectionHeading
          index="01"
          eyebrow="Selected work"
          id="work-title"
          title="Things I've designed, built and shipped."
          description="From LLM-powered tools to serverless backends — each one links to a short case study with the decisions behind it."
        >
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            See all work
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </SectionHeading>
        <Bento
          filters={filters}
          items={featured.map((p) => ({ slug: p.slug, categories: p.categories }))}
          cards={featured.map((p) => (
            <ProjectCard key={p.slug} project={p} variant="bento" />
          ))}
        />
      </div>
    </section>
  );
}
