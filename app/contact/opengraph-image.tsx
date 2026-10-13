import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const alt = "Contact Atharva Sonnis";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: "Contact",
    title: "Let's build something.",
    subtitle: "Open to SDE and AI Engineer roles.",
  });
}
