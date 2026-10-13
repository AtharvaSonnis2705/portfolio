# TODO(Atharva)

Everything marked `TODO(Atharva)` shows highlighted in `pnpm dev` and is **hidden in production**, so the site is shippable today. Run `grep -rn "TODO(Atharva)\|<Todo>" content` to see them in place.

## Before launch (5 minutes)

- [ ] **Résumé phone number.** `public/Atharva_Sonnis_Resume.pdf` is a copy of the one on your Desktop and includes your phone number. The site never shows it, but the PDF is public. Re-export without it if you'd rather not publish it.
- [ ] **Résumé headline.** Change "Web Developer" to match the site, e.g. "Software Engineer — AI & Full-stack". Replace "Current CGPA" with your final CGPA and add your LinkedIn URL.
- [ ] `content/site.ts`: confirm "Open to remote/relocation" in the availability badge.
- [ ] `content/site.ts`: confirm the LinkedIn URL (taken from your old portfolio's navbar).
- [ ] `content/site.ts`: final CGPA (currently 8.58).
- [x] `CONTACT_TO_EMAIL` and `NEXT_PUBLIC_SITE_URL` set in Vercel (Production).
- [ ] Add `RESEND_API_KEY` in Vercel → Settings → Environment Variables (type **Secret**, Production), then redeploy. Until then the form shows a friendly error with a mailto fallback.

## Content facts to confirm

These came from GitHub upload dates or my best reading of your repos, so please verify them:

- [ ] Project dates: ScribeAI `2026-08`, SAANS `2025-11`, Invoice Generator `2025-06`, Mental Health Chatbot `2025-01`, Influence AI `2025-03`.
- [ ] Auraflix Tech-AI Hackathon date (`2025-03`) and your **result/placement**.
- [ ] ScribeAI: `teamSize: 1` (solo?).
- [ ] Influence AI: your role on the team, team size, and how toxicity/sponsorships were detected.
- [ ] SAANS: the "Approach" section describes the 3-app split (seen in the repo), JWT + bcrypt role auth and Cloudinary (from your résumé). Check it matches your code.
- [ ] Mental Health Chatbot: "bag-of-words" features is my assumption from the NLTK + DNN pipeline. Confirm it.
- [ ] **Mental Health Chatbot attribution.** Your repo README is copied from `Rogendo/Mental-health-Chatbot`. If you built on that project, add one line of credit to the case study. Engineers will notice the README.

## Missing links & media

- [ ] Invoice Generator: GitHub + live URLs (`links:` in frontmatter), a demo video, and what the QR code encodes.
- [ ] Influence AI: GitHub / demo links.
- [ ] SAANS: screenshots for the gallery (patient booking, doctor dashboard, admin).
- [ ] Replace the generated abstract covers in `public/images/projects/*/cover.webp` with real screenshots (1600×1000 WebP). They're on-brand placeholders, not product shots.
- [ ] Optional: `demo.mp4` + `poster.webp` for ScribeAI. Bento cards play it on hover.

## Case-study sections waiting on you

Shown only in dev as amber notes:

- [ ] ScribeAI: one more real challenge; any real usage numbers or feedback.
- [ ] SAANS: slot availability / double-booking approach; payment provider.
- [ ] Invoice Generator: "Challenges" and "Results" sections.
- [ ] Mental Health Chatbot: "Challenges" and "Results" (real accuracy only); confidence-threshold fallback.
- [ ] Influence AI: "Challenges" section; hackathon placement.
- [ ] Experience: where the nominee-entry component is used; title/link of the research publication.

## About page

- [ ] `content/site.ts` → `about`: one personal line (what you do outside code).
- [ ] `content/site.ts` → `now.building` / `now.learning`: what you're working on and learning right now.

## Certifications

- [ ] None yet, so the Certifications tab and preview hide themselves. Add any you have with `content/_templates/certification.json`.

## Optional

- [ ] Custom domain (e.g. `atharvasonnis.dev`). Then update `NEXT_PUBLIC_SITE_URL`.
- [ ] Verify a domain in Resend and set `CONTACT_FROM_EMAIL` so the form can send from your own address.
