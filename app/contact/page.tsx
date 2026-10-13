import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/contact-section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Atharva Sonnis about SDE and AI Engineer roles, or a product that needs LLMs done properly.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-16 md:pt-20">
      <ContactSection index={null} as="h1" />
    </div>
  );
}
