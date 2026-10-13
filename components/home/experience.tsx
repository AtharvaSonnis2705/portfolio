import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { StackChips } from "@/components/ui/stack-chips";
import { site } from "@/content/site";
import { getExperience } from "@/lib/content";
import { formatRange } from "@/lib/utils";

const TYPE_LABEL = {
  internship: "Internship",
  "full-time": "Full-time",
  "part-time": "Part-time",
  freelance: "Freelance",
  contract: "Contract",
} as const;

export function ExperienceSection() {
  const jobs = getExperience();
  const education = site.education.filter((e) => e.showOnHome);

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="section border-t border-border"
    >
      <div className="container-page grid-12 gap-y-10">
        <div className="col-span-12 lg:col-span-4">
          <SectionHeading
            index="02"
            eyebrow="Experience"
            id="experience-title"
            title="Where I've shipped."
            className="lg:sticky lg:top-28 lg:mb-0"
          />
        </div>

        <ol className="relative col-span-12 lg:col-span-8">
          {/* timeline rail */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-border-strong via-border to-transparent"
          />
          {jobs.map((job, i) => (
            <li
              key={job.slug}
              className="relative pb-12 pl-9 last:pb-0"
              data-reveal
              style={{ "--stagger": i } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className="absolute top-2 left-0 size-[11px] rounded-full border-2 border-bg bg-fg-faint ring-1 ring-border-strong"
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="mono-label">
                  {formatRange(job.start, job.end)} · {TYPE_LABEL[job.type]}
                </p>
                <p className="mono-label">{job.location}</p>
              </div>
              <h3 className="mt-3 text-h3 font-semibold">{job.role}</h3>
              <p className="mt-1 flex items-center gap-2 text-fg-muted">
                {job.logo ? (
                  <Image
                    src={job.logo.src}
                    alt={job.logo.alt}
                    width={20}
                    height={20}
                    className="rounded"
                  />
                ) : null}
                {job.company}
                {job.client ? <span className="text-fg-faint">· Client: {job.client}</span> : null}
              </p>
              <ul className="mt-5 space-y-2.5 text-fg-muted">
                {job.bullets.map((b) => (
                  <li
                    key={b}
                    className="relative pl-5 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-2.5 before:bg-fg-faint"
                  >
                    {b}
                  </li>
                ))}
              </ul>
              {job.stack.length ? <StackChips stack={job.stack} className="mt-5" /> : null}
            </li>
          ))}

          {education.map((e) => (
            <li key={e.school} className="relative pt-12 pl-9" data-reveal>
              <span
                aria-hidden="true"
                className="absolute top-14 left-0 size-[11px] rounded-full border-2 border-bg bg-bg ring-1 ring-border-strong"
              />
              <p className="mono-label">
                {e.start} — {e.end} · Education
              </p>
              <h3 className="mt-3 text-h3 font-semibold">{e.degree}</h3>
              <p className="mt-1 text-fg-muted">
                {e.school} <span className="text-fg-faint">· {e.grade}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
