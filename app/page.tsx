import { ContactSection } from "@/components/contact/contact-section";
import { AboutTeaser } from "@/components/home/about-teaser";
import { CredentialsPreview } from "@/components/home/credentials-preview";
import { ExperienceSection } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";
import { SelectedWork } from "@/components/home/selected-work";
import { SkillsSection } from "@/components/home/skills";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <SelectedWork />
      <ExperienceSection />
      <SkillsSection />
      <CredentialsPreview />
      <AboutTeaser />
      <ContactSection />
    </>
  );
}
