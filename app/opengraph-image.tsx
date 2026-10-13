import { site } from "@/content/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const alt = `${site.name} — ${site.jobTitle}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: `${site.jobTitle} · AI & Full-stack`,
    title: site.headline,
    subtitle: site.subline,
  });
}
