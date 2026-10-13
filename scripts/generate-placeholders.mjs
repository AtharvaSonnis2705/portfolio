/**
 * Generates abstract on-brand placeholder covers for projects that don't have one yet.
 * Run: pnpm placeholders        (never overwrites an existing cover.webp)
 *
 * Replace these with real screenshots when you have them — 1600×1000 WebP.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const W = 1600;
const H = 1000;
const root = path.resolve(import.meta.dirname, "..");
const projectsDir = path.join(root, "content/projects");

/** Deterministic PRNG so the same slug always produces the same cover. */
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const C = {
  bg: "#07090B",
  card: "#0D1114",
  line: "#1E272E",
  strong: "#2B3740",
  accent: "#22D3EE",
  teal: "#0E7490",
  fg: "#E8EEF2",
};

function frame(inner, seed) {
  const r = rng(seed);
  const gx = 300 + r() * 1000;
  const gy = 200 + r() * 600;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="${gx}" cy="${gy}" r="900" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${C.accent}" stop-opacity="0.22"/>
      <stop offset="0.45" stop-color="${C.teal}" stop-opacity="0.10"/>
      <stop offset="1" stop-color="${C.bg}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${C.strong}"/>
    </pattern>
    <radialGradient id="fade" cx="50%" cy="50%" r="70%">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="m"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
  </defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#m)" opacity="0.7"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${inner}
</svg>`;
}

const motifs = {
  // waveform → summary lines
  "scribe-ai": (r) => {
    let s = "";
    for (let i = 0; i < 46; i++) {
      const x = 180 + i * 14;
      const h = 30 + Math.abs(Math.sin(i * 0.45) * 220) * (0.4 + r() * 0.6);
      s += `<rect x="${x}" y="${500 - h / 2}" width="6" height="${h}" rx="3" fill="${C.accent}" opacity="${0.35 + (i / 46) * 0.5}"/>`;
    }
    s += `<path d="M 840 500 C 900 500 900 500 960 500" stroke="${C.strong}" stroke-width="2" fill="none"/>`;
    const widths = [520, 440, 480, 300, 0, 460, 380, 0, 420, 260];
    widths.forEach((w, i) => {
      if (!w) return;
      const y = 300 + i * 44;
      s += `<rect x="1000" y="${y}" width="${w * 0.8}" height="14" rx="7" fill="${i === 0 ? C.accent : C.strong}" opacity="${i === 0 ? 0.9 : 0.8}"/>`;
    });
    return s;
  },
  // calendar grid with booked slots
  "doctor-appointment-system": (r) => {
    let s = `<rect x="300" y="170" width="1000" height="660" rx="28" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>`;
    s += `<rect x="340" y="210" width="200" height="16" rx="8" fill="${C.strong}"/>`;
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 7; col++) {
        const x = 340 + col * 132;
        const y = 270 + row * 108;
        const booked = r() > 0.72;
        s += `<rect x="${x}" y="${y}" width="116" height="92" rx="14" fill="${booked ? C.accent : C.bg}" fill-opacity="${booked ? 0.18 : 1}" stroke="${booked ? C.accent : C.line}" stroke-opacity="${booked ? 0.8 : 1}" stroke-width="2"/>`;
        if (booked) s += `<circle cx="${x + 24}" cy="${y + 24}" r="6" fill="${C.accent}"/>`;
      }
    return s;
  },
  // invoice doc + QR → cloud nodes
  "invoice-generator-aws": (r) => {
    let s = `<rect x="260" y="160" width="520" height="680" rx="24" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>`;
    [0, 1, 2, 3, 4, 5].forEach((i) => {
      s += `<rect x="310" y="${230 + i * 50}" width="${[260, 420, 380, 420, 300, 200][i]}" height="14" rx="7" fill="${i === 0 ? C.fg : C.strong}" opacity="${i === 0 ? 0.8 : 1}"/>`;
    });
    for (let y = 0; y < 9; y++)
      for (let x = 0; x < 9; x++) {
        const corner = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
        if (corner || r() > 0.5)
          s += `<rect x="${560 + x * 20}" y="${620 + y * 20}" width="18" height="18" fill="${C.accent}" opacity="0.85"/>`;
      }
    const nodes = [
      [1080, 300],
      [1080, 500],
      [1080, 700],
    ];
    nodes.forEach(([x, y], i) => {
      s += `<path d="M 780 500 C 930 500 930 ${y} ${x - 90} ${y}" stroke="${C.accent}" stroke-opacity="0.5" stroke-width="2" fill="none"/>`;
      s += `<rect x="${x - 90}" y="${y - 50}" width="260" height="100" rx="20" fill="${C.card}" stroke="${i === 1 ? C.accent : C.line}" stroke-width="2"/>`;
      s += `<rect x="${x - 60}" y="${y - 8}" width="${[140, 180, 120][i]}" height="16" rx="8" fill="${C.strong}"/>`;
    });
    return s;
  },
  // chat bubbles → network
  "mental-health-chatbot": (r) => {
    let s = "";
    const bubbles = [
      [220, 260, 420, false],
      [360, 420, 380, true],
      [220, 580, 460, false],
    ];
    bubbles.forEach(([x, y, w, me]) => {
      s += `<rect x="${x}" y="${y}" width="${w}" height="110" rx="34" fill="${me ? C.accent : C.card}" fill-opacity="${me ? 0.16 : 1}" stroke="${me ? C.accent : C.line}" stroke-width="2"/>`;
      s += `<rect x="${x + 36}" y="${y + 38}" width="${w * 0.6}" height="14" rx="7" fill="${C.strong}"/><rect x="${x + 36}" y="${y + 64}" width="${w * 0.4}" height="14" rx="7" fill="${C.strong}"/>`;
    });
    const layers = [4, 6, 6, 3];
    const pts = layers.map((n, li) =>
      Array.from({ length: n }, (_, i) => [960 + li * 160, 500 + (i - (n - 1) / 2) * 92]),
    );
    for (let l = 0; l < pts.length - 1; l++)
      for (const a of pts[l])
        for (const b of pts[l + 1])
          s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${C.accent}" stroke-opacity="${0.06 + r() * 0.18}" stroke-width="1.5"/>`;
    pts.flat().forEach(([x, y], i) => {
      s += `<circle cx="${x}" cy="${y}" r="14" fill="${C.card}" stroke="${i % 5 === 0 ? C.accent : C.strong}" stroke-width="3"/>`;
    });
    return s;
  },
  // bar chart + scored comments
  "influence-ai": (r) => {
    let s = `<rect x="200" y="200" width="760" height="600" rx="28" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>`;
    for (let i = 0; i < 10; i++) {
      const h = 80 + r() * 360;
      s += `<rect x="${250 + i * 68}" y="${740 - h}" width="40" height="${h}" rx="8" fill="${i === 6 ? C.accent : C.strong}" opacity="${i === 6 ? 0.9 : 1}"/>`;
    }
    for (let i = 0; i < 5; i++) {
      const y = 220 + i * 120;
      const score = r();
      s += `<rect x="1020" y="${y}" width="380" height="88" rx="22" fill="${C.card}" stroke="${C.line}" stroke-width="2"/>`;
      s += `<rect x="1050" y="${y + 26}" width="${140 + r() * 120}" height="12" rx="6" fill="${C.strong}"/>`;
      s += `<rect x="1050" y="${y + 52}" width="200" height="8" rx="4" fill="${C.line}"/><rect x="1050" y="${y + 52}" width="${200 * score}" height="8" rx="4" fill="${C.accent}" opacity="${0.4 + score * 0.6}"/>`;
    }
    return s;
  },
};

function genericMotif(r) {
  let s = "";
  for (let i = 0; i < 7; i++) {
    const x = 260 + r() * 1000;
    const y = 200 + r() * 520;
    s += `<rect x="${x}" y="${y}" width="${120 + r() * 240}" height="${60 + r() * 120}" rx="20" fill="${C.card}" stroke="${i === 0 ? C.accent : C.line}" stroke-width="2"/>`;
  }
  return s;
}

const slugs = fs
  .readdirSync(projectsDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));

for (const slug of slugs) {
  const dir = path.join(root, "public/images/projects", slug);
  const out = path.join(dir, "cover.webp");
  if (fs.existsSync(out)) continue;
  fs.mkdirSync(dir, { recursive: true });
  const r = rng(slug);
  const svg = frame((motifs[slug] ?? genericMotif)(r), slug);
  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(out);
  console.log("generated", path.relative(root, out));
}
