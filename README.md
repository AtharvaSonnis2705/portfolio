# atharvasonnis — portfolio

Personal site for **Atharva Sonnis**, Software Engineer building AI-powered products end to end.

Next.js 16 (App Router, RSC, fully static) · TypeScript strict · Tailwind CSS v4 · content-collections + Zod + MDX · Motion · cmdk · Resend · Vercel.

```
app/                 routes, OG images, sitemap/robots, contact server action
components/          UI — home sections, work, case-study, credentials, mdx, ui primitives
content/             ← everything you edit lives here
  site.ts            name, headline, availability, socials, education, skills, "now"
  projects/*.mdx     case studies
  experience/*.mdx   jobs / internships
  certifications/*.json
  achievements/*.md
  _templates/        commented copy-paste starters for each type
content-collections.ts   Zod schemas — the build fails with a readable error if content is wrong
public/images/…      images, videos, certificate PDFs
```

---

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in RESEND_API_KEY to make the contact form send
pnpm dev                     # http://localhost:3000
```

| Script                                         | What it does                                                                           |
| ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm dev`                                     | Dev server. `TODO(Atharva)` placeholders are **highlighted** in amber.                 |
| `pnpm build`                                   | Validates all content, builds every page statically. TODO placeholders are **hidden**. |
| `pnpm typecheck` / `pnpm lint` / `pnpm format` | Type-check, ESLint, Prettier (+ Tailwind class sorting).                               |
| `pnpm placeholders`                            | Generates an on-brand abstract `cover.webp` for any project that doesn't have one yet. |
| `pnpm linkcheck`                               | Crawls a running server (`pnpm start`) for broken internal links.                      |

### Environment variables

| Name                   | Purpose                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RESEND_API_KEY`       | From [resend.com/api-keys](https://resend.com/api-keys). Without it the form shows a friendly error + mailto fallback.                                                         |
| `CONTACT_TO_EMAIL`     | Where messages are delivered.                                                                                                                                                  |
| `CONTACT_FROM_EMAIL`   | Optional. Defaults to `Portfolio <onboarding@resend.dev>` — keep that until you verify a domain in Resend (the test sender can only deliver to your own Resend account email). |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, OG images and the sitemap.                                                                                                                         |

---

## How to add content

Nothing below needs a code change. Anything you add automatically appears on the home page (if `featured`), `/work` or `/credentials`, the ⌘K palette, skill cross-links, the sitemap and OG images.

If a field is wrong, `pnpm build` stops and tells you exactly which file and field, e.g.:

```
Validation failed on content/projects/my-agent.mdx:
- summary: summary must be 140 characters or fewer
- cover,alt: Alt text is required for every image (accessibility)
```

### A project

1. Copy `content/_templates/project.mdx` → `content/projects/<slug>.mdx` (the filename becomes `/work/<slug>`) and fill it in.
2. Drop images in `public/images/projects/<slug>/` — `cover.webp`, optional `01.webp`, `02.webp`, `demo.mp4` + `poster.webp`.
3. `git push`.

Set `featured: true` to show it in Selected Work. `order` controls position (lower first), then newest date. Stack names that match a skill in `content/site.ts` become clickable skill → project links.

In the MDX body you can use `<Architecture nodes={[…]} />`, `<Gallery />` (renders the frontmatter gallery with a lightbox), `<Callout type="info|warning|success">`, fenced code blocks (Shiki-highlighted at build time, with a copy button), and `<Todo>…</Todo>` for notes-to-self that never ship.

### An experience entry

1. Copy `content/_templates/experience.mdx` → `content/experience/<company>.mdx`.
2. Optional logo → `public/images/experience/<company>.webp` (square).
3. `git push`.

### A certification

1. Copy `content/_templates/certification.json` → `content/certifications/<slug>.json`.
2. Put the certificate image at `public/images/certifications/<slug>.webp` and the original at `<slug>.pdf` (optional).
3. `git push`.

### An achievement

1. Copy `content/_templates/achievement.md` → `content/achievements/<slug>.md`.
2. Optional photo → `public/images/achievements/<slug>.webp`.
3. `git push`.

### Image guide

| Asset          | Spec                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| Project cover  | **1600×1000 WebP** (16:10), < 300 KB                                                       |
| Gallery images | **1600px wide WebP**, any height                                                           |
| Demo video     | **MP4 (H.264), ≤ 8 MB**, muted, 5–20 s loop, with a `poster.webp` at the same aspect ratio |
| Certificates   | Export as **WebP** (~1600px wide) **plus the original PDF**                                |
| Headshot       | `public/images/about/headshot.webp`, square or 4:5, ≥ 800px                                |

Width, height and a blur placeholder are read from every image at build time, so pages never shift while loading. Convert with e.g. `npx sharp-cli -i shot.png -o cover.webp resize 1600 1000`.

---

## Deployment (keeps the URL on your résumé)

1. Create a new GitHub repo named `portfolio` and push this project to it.
2. In the **existing** Vercel project behind `atharvasonnisportfolio.vercel.app`: **Settings → Git → Disconnect** the old repo, then **Connect** the new one. The domain stays the same.
3. **Settings → Environment Variables**: add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL` (and optionally `CONTACT_FROM_EMAIL`). Redeploy.
4. Every pull request now gets a preview deployment, and GitHub Actions runs build → typecheck → lint → format check → link check.
5. Later: add a custom domain (e.g. `atharvasonnis.dev`) in Vercel → Domains, set it as primary, and Vercel will redirect the `vercel.app` URL. Update `NEXT_PUBLIC_SITE_URL`.

Enable **Analytics** and **Speed Insights** in the Vercel dashboard — the components are already installed (their `/_vercel/*` scripts 404 when running locally; that's expected).

---

## Design notes

- Tokens live in `app/globals.css` under `@theme` (colors, fluid type scale, easing). One accent (`--color-accent`, cyan), used sparingly.
- `--color-fg-faint` is `#748692` rather than the original `#5B6B77`: the original only reaches 3.6:1 on the background, which fails WCAG AA for the 12px mono labels it's used on. The new value is 5.3:1.
- Motion respects `prefers-reduced-motion` everywhere: no tilt, static mesh, instant reveals, no view transitions.
- Reveal-on-scroll content is visible without JavaScript.
- `cmdk` is lazy-loaded on first ⌘K, and `simple-icons` is server-only, so neither ships in the home page bundle.
