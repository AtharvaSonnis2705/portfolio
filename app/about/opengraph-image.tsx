import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const alt = "About Atharva Sonnis";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: "About",
    title: "The story so far.",
    subtitle: "Education, experience and what I'm building now.",
  });
}
