import { site } from "@/content/site";
import type { Project } from "@/lib/content";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.jobTitle,
    url: site.url,
    email: `mailto:${site.email}`,
    image: `${site.url}${site.headshot.src}`,
    address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
    sameAs: [site.socials.github, site.socials.linkedin],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Vidyalankar Institute of Technology",
    },
    knowsAbout: [
      "Large language models",
      "Retrieval-augmented generation",
      "AI agents",
      "React",
      "Node.js",
      "AWS",
    ],
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.outcome,
    description: project.summary,
    url: `${site.url}/work/${project.slug}`,
    image: `${site.url}${project.cover.src}`,
    dateCreated: project.date,
    keywords: project.stack.join(", "),
    creator: { "@type": "Person", name: site.name, url: site.url },
    ...(project.links.github ? { codeRepository: project.links.github } : {}),
    ...(project.links.live ? { sameAs: project.links.live } : {}),
  };
}

/** Escapes `<` so JSON-LD can't break out of its <script> tag. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
