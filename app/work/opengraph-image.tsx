import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const alt = "Atharva Sonnis — Work";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: "Selected work",
    title: "Everything I've built.",
    subtitle: "AI/ML, full-stack, cloud and hackathon projects — each with a case study.",
  });
}
