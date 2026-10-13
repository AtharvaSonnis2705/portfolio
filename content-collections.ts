/**
 * Content schema for the whole site.
 *
 * Every file in content/ is validated here at build time. If a field is missing or
 * malformed the build fails and prints the file path plus the offending field, so
 * fixing content never requires reading component code.
 */
import fs from "node:fs";
import path from "node:path";
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeShiki from "@shikijs/rehype";
import GithubSlugger from "github-slugger";
import rehypeSlug from "rehype-slug";
import sharp from "sharp";
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Shared field types                                                  */
/* ------------------------------------------------------------------ */

/** Accepts "2025-07", "2025-07-14" or an unquoted YAML date; always outputs a string. */
const dateField = z
  .union([
    z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'Dates must look like "2025-07" or "2025-07-14"'),
    z.date(),
  ])
  .transform((v) => (typeof v === "string" ? v : v.toISOString().slice(0, 10)));

const publicPath = z
  .string()
  .startsWith("/", 'Paths are relative to /public and must start with "/" (e.g. "/images/…")');

const imageField = z.object({
  src: publicPath,
  alt: z.string().min(1, "Alt text is required for every image (accessibility)"),
});

const url = z.url("Must be a full URL including https://");

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export type ImageMeta = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
};

/** Reads intrinsic size + a tiny blur placeholder so every image renders with zero layout shift. */
async function imageMeta(
  cache: (
    input: string,
    fn: (input: string) => Promise<Omit<ImageMeta, "alt">>,
  ) => Promise<Omit<ImageMeta, "alt">>,
  image: { src: string; alt: string },
  owner: string,
): Promise<ImageMeta> {
  const file = path.join(process.cwd(), "public", image.src);
  if (!fs.existsSync(file)) {
    throw new Error(`[${owner}] Image not found: public${image.src}`);
  }
  const stat = fs.statSync(file);
  // mtime in the key so replacing an image with the same name regenerates its placeholder
  const meta = await cache(`${image.src}:${stat.size}:${stat.mtimeMs}`, async () => {
    const img = sharp(file);
    const { width = 1600, height = 1000 } = await img.metadata();
    const blur = await img.resize(16).webp({ quality: 40 }).toBuffer();
    return {
      src: image.src,
      width,
      height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
  });
  return { ...meta, alt: image.alt };
}

function assertFile(src: string | undefined, owner: string) {
  if (src && !fs.existsSync(path.join(process.cwd(), "public", src))) {
    throw new Error(`[${owner}] File not found: public${src}`);
  }
}

/** h2/h3 headings for the case-study table of contents (ids match rehype-slug). */
function extractHeadings(markdown: string) {
  const slugger = new GithubSlugger();
  const headings: { depth: 2 | 3; text: string; id: string }[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/[`*_]/g, "");
    headings.push({ depth: match[1].length as 2 | 3, text, id: slugger.slug(text) });
  }
  return headings;
}

const mdxOptions = {
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeShiki,
      {
        theme: "github-dark-default",
        addLanguageClass: true,
        transformers: [
          {
            pre(node: { properties: Record<string, unknown> }) {
              // exposes the language to <CodeBlock> for its label
              node.properties["data-language"] = (
                this as unknown as { options: { lang: string } }
              ).options.lang;
            },
          },
        ],
      },
    ],
  ],
} satisfies Parameters<typeof compileMDX>[2];

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["ai", "fullstack", "cloud", "hackathon"] as const;

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "*.mdx",
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().max(140, "summary must be 140 characters or fewer"),
    outcome: z.string().min(1).max(160, "outcome should be a single line (≤160 chars)"),
    date: dateField,
    role: z.string(),
    teamSize: z.number().int().positive().optional(),
    timeline: z.string().optional(),
    status: z.enum(["shipped", "in-progress", "archived"]),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    categories: z.array(z.enum(CATEGORIES)).min(1),
    stack: z.array(z.string()).min(1),
    cover: imageField,
    gallery: z.array(imageField.extend({ caption: z.string().optional() })).optional(),
    video: z.object({ src: publicPath, poster: publicPath }).optional(),
    links: z
      .object({ github: url.optional(), live: url.optional(), demo: url.optional() })
      .default({}),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    tldr: z
      .array(z.string())
      .length(3, "tldr needs exactly 3 bullets: what it is, what I did, the result"),
    content: z.string(),
  }),
  transform: async (doc, ctx) => {
    const owner = doc._meta.filePath;
    const [cover, gallery, mdx] = await Promise.all([
      imageMeta(ctx.cache, doc.cover, owner),
      Promise.all(
        (doc.gallery ?? []).map(async (g) => ({
          ...(await imageMeta(ctx.cache, g, owner)),
          caption: g.caption ?? null,
        })),
      ),
      compileMDX(ctx, doc, mdxOptions),
    ]);
    assertFile(doc.video?.src, owner);
    assertFile(doc.video?.poster, owner);
    return {
      ...doc,
      slug: doc._meta.path,
      cover,
      gallery,
      video: doc.video ?? null,
      teamSize: doc.teamSize ?? null,
      timeline: doc.timeline ?? null,
      order: doc.order ?? null,
      metrics: doc.metrics ?? [],
      headings: extractHeadings(doc.content),
      mdx,
    };
  },
});

const experience = defineCollection({
  name: "experience",
  directory: "content/experience",
  include: "*.mdx",
  schema: z.object({
    company: z.string(),
    client: z.string().optional(),
    role: z.string(),
    type: z.enum(["internship", "full-time", "part-time", "freelance", "contract"]),
    location: z.string(),
    start: dateField,
    end: z.union([dateField, z.literal("present")]),
    bullets: z.array(z.string()).min(1),
    stack: z.array(z.string()).default([]),
    logo: imageField.optional(),
    content: z.string(),
  }),
  transform: async (doc, ctx) => ({
    ...doc,
    slug: doc._meta.path,
    client: doc.client ?? null,
    logo: doc.logo ? await imageMeta(ctx.cache, doc.logo, doc._meta.filePath) : null,
  }),
});

const certifications = defineCollection({
  name: "certifications",
  directory: "content/certifications",
  include: "*.json",
  parser: "json",
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: dateField,
    credentialId: z.string().optional(),
    verifyUrl: url.optional(),
    image: imageField,
    pdf: publicPath.optional(),
    skills: z.array(z.string()).default([]),
  }),
  transform: async (doc, ctx) => {
    assertFile(doc.pdf, doc._meta.filePath);
    return {
      ...doc,
      slug: doc._meta.path,
      credentialId: doc.credentialId ?? null,
      verifyUrl: doc.verifyUrl ?? null,
      pdf: doc.pdf ?? null,
      image: await imageMeta(ctx.cache, doc.image, doc._meta.filePath),
    };
  },
});

const achievements = defineCollection({
  name: "achievements",
  directory: "content/achievements",
  include: "*.md",
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: dateField,
    type: z.enum(["hackathon", "award", "publication", "other"]),
    description: z.string(),
    image: imageField.optional(),
    link: url.optional(),
    content: z.string(),
  }),
  transform: async (doc, ctx) => ({
    ...doc,
    slug: doc._meta.path,
    link: doc.link ?? null,
    image: doc.image ? await imageMeta(ctx.cache, doc.image, doc._meta.filePath) : null,
  }),
});

export default defineConfig({
  content: [projects, experience, certifications, achievements],
});
