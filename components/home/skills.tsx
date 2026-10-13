import { Brain, Cloud, Layers, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Spotlight } from "@/components/ui/spotlight";
import { site } from "@/content/site";
import { getSkillProjectMap } from "@/lib/content";

const ICONS: LucideIcon[] = [Sparkles, Brain, Layers, Cloud, Wrench];

export function SkillsSection() {
  const map = getSkillProjectMap();

  return (
    <section id="skills" aria-labelledby="skills-title" className="section border-t border-border">
      <div className="container-page">
        <SectionHeading
          index="03"
          eyebrow="Capabilities"
          id="skills-title"
          title="What I work with."
          description="Grouped by what they let me build. Chips with a project count link to the work that uses them."
        />
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          {site.skills.map((group, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li
                key={group.group}
                className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}
                data-reveal
                style={{ "--stagger": i } as React.CSSProperties}
              >
                <Spotlight
                  tilt={false}
                  className="h-full rounded-2xl border border-border bg-bg-elevated p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg border border-border-strong bg-bg-subtle">
                      <Icon className="size-4 text-fg-muted" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight">{group.group}</h3>
                  </div>
                  <p className="mt-3 text-[15px] text-fg-muted">{group.blurb}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {group.items.map((skill) => {
                      const projects = map.get(skill) ?? [];
                      if (!projects.length) {
                        return (
                          <li key={skill} className="chip">
                            {skill}
                          </li>
                        );
                      }
                      const href =
                        projects.length === 1
                          ? `/work/${projects[0].slug}`
                          : `/work?skill=${encodeURIComponent(skill)}`;
                      return (
                        <li key={skill}>
                          <Link
                            href={href}
                            className="chip relative z-[3] text-fg transition-colors hover:border-accent/50 hover:bg-accent-soft"
                            title={`Used in: ${projects.map((p) => p.title).join(", ")}`}
                          >
                            {skill}
                            <span
                              className="text-fg-faint"
                              aria-label={`${projects.length} project${projects.length > 1 ? "s" : ""}`}
                            >
                              {projects.length}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </Spotlight>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
