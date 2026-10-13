import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getProjects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(process.env.NEXT_PUBLIC_LAST_UPDATED ?? Date.now());
  const pages = ["", "/work", "/credentials", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const projects = getProjects().map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));
  return [...pages, ...projects];
}
