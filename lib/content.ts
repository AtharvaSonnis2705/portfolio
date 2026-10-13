import "server-only";
import {
  allAchievements,
  allCertifications,
  allExperiences,
  allProjects,
} from "content-collections";
import { site } from "@/content/site";
import { normalizeSkill } from "@/lib/utils";

export type Project = (typeof allProjects)[number];
export type Experience = (typeof allExperiences)[number];
export type Certification = (typeof allCertifications)[number];
export type Achievement = (typeof allAchievements)[number];
export type Category = Project["categories"][number];

export const CATEGORY_LABELS: Record<Category, string> = {
  ai: "AI/ML",
  fullstack: "Full-stack",
  cloud: "Cloud",
  hackathon: "Hackathon",
};

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

/** Sort by explicit `order` (ascending), then newest first. */
export function getProjects(): Project[] {
  return [...allProjects].sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    return ao !== bo ? ao - bo : byDateDesc(a, b);
  });
}

export function getFeaturedProjects() {
  return getProjects().filter((p) => p.featured);
}

export function getProject(slug: string) {
  return allProjects.find((p) => p.slug === slug);
}

/** Wraps around so the last case study links back to the first. */
export function getNextProject(slug: string) {
  const list = getProjects();
  const i = list.findIndex((p) => p.slug === slug);
  return list.length > 1 ? list[(i + 1) % list.length] : undefined;
}

export function getCategoryCounts(projects: Project[] = getProjects()) {
  const counts = { all: projects.length } as Record<Category | "all", number>;
  for (const key of Object.keys(CATEGORY_LABELS) as Category[]) {
    counts[key] = projects.filter((p) => p.categories.includes(key)).length;
  }
  return counts;
}

/** Shipped + archived projects (in-progress ones aren't "shipped" yet). */
export function getShippedCount() {
  return allProjects.filter((p) => p.status !== "in-progress").length;
}

export function getExperience(): Experience[] {
  return [...allExperiences].sort((a, b) => {
    if (a.end === "present" && b.end !== "present") return -1;
    if (b.end === "present" && a.end !== "present") return 1;
    return b.start.localeCompare(a.start);
  });
}

export function getCertifications(): Certification[] {
  return [...allCertifications].sort(byDateDesc);
}

export function getAchievements(): Achievement[] {
  return [...allAchievements].sort(byDateDesc);
}

/** skill chip name → projects that list it (or an alias of it) in `stack`. */
export function getSkillProjectMap() {
  const aliases = site.skillAliases;
  const map = new Map<string, { slug: string; title: string }[]>();
  const index = new Map<string, string>();
  for (const group of site.skills) {
    for (const skill of group.items) {
      index.set(normalizeSkill(skill), skill);
      map.set(skill, []);
    }
  }
  for (const project of getProjects()) {
    for (const tech of project.stack) {
      const key = normalizeSkill(tech);
      const skill = index.get(aliases[key] ?? key);
      if (skill) map.get(skill)!.push({ slug: project.slug, title: project.title });
    }
  }
  return map;
}

/** Lightweight lists for the ⌘K palette (kept small — it's serialized to the client). */
export function getPaletteData() {
  return {
    projects: getProjects().map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      keywords: [...p.stack, ...p.categories.map((c) => CATEGORY_LABELS[c])],
    })),
    credentials: [
      ...getCertifications().map((c) => ({
        id: `cert-${c.slug}`,
        title: c.title,
        meta: c.issuer,
        href: c.verifyUrl ?? `/credentials#${c.slug}`,
      })),
      ...getAchievements().map((a) => ({
        id: `ach-${a.slug}`,
        title: a.title,
        meta: a.event,
        href: a.link ?? `/credentials?tab=achievements#${a.slug}`,
      })),
    ],
  };
}
export type PaletteData = ReturnType<typeof getPaletteData>;
