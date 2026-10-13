import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CredentialCard, type CredentialItem } from "@/components/credentials/credential-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAchievements, getCertifications } from "@/lib/content";

export function CredentialsPreview() {
  const certs = getCertifications();
  const achievements = getAchievements();
  const entries: CredentialItem[] = [
    ...certs.map((item) => ({ kind: "certification" as const, item })),
    ...achievements.map((item) => ({ kind: "achievement" as const, item })),
  ].slice(0, 3);
  if (!entries.length) return null;

  const title =
    certs.length && achievements.length
      ? "Certifications & achievements"
      : certs.length
        ? "Certifications"
        : "Achievements";

  return (
    <section
      id="credentials"
      aria-labelledby="credentials-title"
      className="section border-t border-border"
    >
      <div className="container-page">
        <SectionHeading index="04" eyebrow={title} id="credentials-title" title="Proof, on paper.">
          <Link
            href="/credentials"
            className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
          >
            View all
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </SectionHeading>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry, i) => (
            <li
              key={`${entry.kind}-${entry.item.slug}`}
              data-reveal
              style={{ "--stagger": i } as React.CSSProperties}
            >
              <CredentialCard entry={entry} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
