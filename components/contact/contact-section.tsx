import { ArrowUpRight, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { LinkedInIcon } from "@/components/ui/brand-icons";
import { CopyEmailButton } from "@/components/ui/copy-email-button";
import { site } from "@/content/site";

export function ContactSection({
  index = "06",
  as = "h2",
}: {
  index?: string | null;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="section relative isolate overflow-hidden border-t border-border"
    >
      <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10 opacity-50" />
      <div className="container-page grid-12 gap-y-10">
        <div className="col-span-12 lg:col-span-5" data-reveal>
          <p className="eyebrow mb-4">
            {index ? <span aria-hidden="true">{index} / </span> : null}Contact
          </p>
          <Heading id="contact-title" className="text-display text-balance">
            Let&apos;s build something.
          </Heading>
          <p className="mt-6 max-w-md text-fg-muted">
            Hiring for an SDE or AI Engineer role, or have a product idea that needs an LLM done
            properly? Send a note — or reach me directly.
          </p>
          <ul className="mt-8 space-y-3">
            <li className="flex items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-3 text-fg transition-colors hover:text-accent"
              >
                <span className="flex size-10 items-center justify-center rounded-full border border-border bg-bg-elevated">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                <span className="break-all">{site.email}</span>
              </a>
              <CopyEmailButton email={site.email} variant="ghost" className="size-9 px-0" />
            </li>
            <li>
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 text-fg transition-colors hover:text-accent"
              >
                <span className="flex size-10 items-center justify-center rounded-full border border-border bg-bg-elevated">
                  <LinkedInIcon className="size-4" />
                </span>
                LinkedIn
                <ArrowUpRight className="size-4 text-fg-faint" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
        <div
          className="col-span-12 lg:col-span-6 lg:col-start-7"
          data-reveal
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          <ContactForm email={site.email} />
        </div>
      </div>
    </section>
  );
}
