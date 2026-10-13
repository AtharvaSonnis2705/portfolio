import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/GeistMono-Regular.ttf")),
]);

/** Shared dark/cyan OG card: eyebrow, page title, subtitle, name. */
export async function renderOg({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const [semibold, regular, mono] = await fonts;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#07090B",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(34,211,238,0.28), transparent 45%), radial-gradient(circle at 100% 90%, rgba(14,116,144,0.35), transparent 50%), radial-gradient(#1E272E 1.5px, transparent 1.5px)",
        backgroundSize: "100% 100%, 100% 100%, 32px 32px",
        color: "#E8EEF2",
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 999,
            border: "2px solid #2B3740",
            background: "#0D1114",
            fontFamily: "Geist Mono",
            fontSize: 24,
          }}
        >
          {site.initials}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 22,
            letterSpacing: 2,
            color: "#748692",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 40 ? 64 : 84,
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 1.02,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#8A9AA6",
              lineHeight: 1.35,
              maxWidth: 960,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 26,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#22D3EE" }} />
          {site.name}
        </div>
        <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, color: "#748692" }}>
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
