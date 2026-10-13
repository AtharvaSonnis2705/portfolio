import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og";

export const alt = "Atharva Sonnis — Credentials";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOg({
    eyebrow: "Credentials",
    title: "Proof, on paper.",
    subtitle: "Certifications, hackathons and achievements.",
  });
}
