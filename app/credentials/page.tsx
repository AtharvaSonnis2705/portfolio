import type { Metadata } from "next";
import { Suspense } from "react";
import { CredentialsTabs } from "@/components/credentials/credentials-tabs";
import { getAchievements, getCertifications } from "@/lib/content";

export const metadata: Metadata = {
  title: "Credentials",
  description:
    "Certifications and achievements — hackathons, awards and publications — with verification links.",
  alternates: { canonical: "/credentials" },
};

export default function CredentialsPage() {
  const certifications = getCertifications();
  const achievements = getAchievements();
  return (
    <div className="container-page pt-32 pb-[var(--section-y)] md:pt-40">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">Credentials</p>
        <h1 className="text-display text-balance">Proof, on paper.</h1>
        <p className="mt-6 text-lg text-fg-muted">
          {certifications.length ? "Certifications with verification links, plus " : ""}hackathons,
          awards and other milestones.
        </p>
      </header>
      <Suspense>
        <CredentialsTabs certifications={certifications} achievements={achievements} />
      </Suspense>
    </div>
  );
}
