import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CardMedia } from "@/components/work/card-media";
import { Spotlight } from "@/components/ui/spotlight";
import { StackChips } from "@/components/ui/stack-chips";
import { CATEGORY_LABELS, type Project } from "@/lib/content";
import { cn, formatMonth } from "@/lib/utils";

/** "bento" adapts to its tile via container queries (tiles change size when filtering). */
export type CardVariant = "bento" | "grid";

const SIZES: Record<CardVariant, string> = {
  bento: "(min-width: 1024px) 700px, 100vw",
  grid: "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw",
};

export function ProjectCard({
  project,
  variant = "grid",
  priority,
  headingLevel = "h3",
}: {
  project: Project;
  variant?: CardVariant;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const bento = variant === "bento";
  return (
    <Spotlight
      as="article"
      className="group @container h-full overflow-hidden rounded-2xl border border-border bg-bg-elevated transition-colors hover:border-border-strong"
    >
      <Link
        href={`/work/${project.slug}`}
        className="flex h-full flex-col rounded-2xl focus-visible:outline-offset-[-2px]"
      >
        <div
          className={cn(
            "relative overflow-hidden border-b border-border bg-bg-subtle",
            bento ? "aspect-[16/10] lg:aspect-auto lg:min-h-[160px] lg:flex-1" : "aspect-[16/10]",
          )}
        >
          <CardMedia
            cover={project.cover}
            video={project.video}
            sizes={SIZES[variant]}
            priority={priority}
          />
          <span className="absolute top-3 right-3 z-[3] flex size-8 items-center justify-center rounded-full border border-border-strong bg-bg/70 text-fg-muted opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div className={cn("flex flex-col gap-3 p-5", bento && "@[600px]:p-7")}>
          <div className="flex items-center justify-between gap-3">
            <p className="eyebrow truncate">
              {project.categories.map((c) => CATEGORY_LABELS[c]).join(" · ")}
            </p>
            <p className="mono-label shrink-0 text-xs">
              {project.status === "in-progress" ? "In progress" : formatMonth(project.date)}
            </p>
          </div>
          <Heading
            className={cn(
              "text-h3 font-semibold tracking-tight text-fg",
              bento && "@[600px]:text-h2",
            )}
          >
            {project.title}
          </Heading>
          <p
            className={cn(
              "text-[15px] leading-relaxed text-fg-muted",
              bento && "@[600px]:text-body",
            )}
          >
            {project.outcome}
          </p>
          <StackChips stack={project.stack} max={4} className="mt-1" />
        </div>
      </Link>
    </Spotlight>
  );
}
