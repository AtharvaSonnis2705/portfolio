"use client";

import { ArrowUpRight, Award, FileText, Maximize2, Trophy } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Lightbox, type LightboxItem } from "@/components/ui/lightbox";
import type { Achievement, Certification } from "@/lib/content";
import { cn, formatMonth } from "@/lib/utils";

type Tab = "certifications" | "achievements";

export function CredentialsTabs({
  certifications,
  achievements,
}: {
  certifications: Certification[];
  achievements: Achievement[];
}) {
  const params = useSearchParams();
  const tabs = (
    [
      { id: "certifications", label: "Certifications", count: certifications.length },
      { id: "achievements", label: "Achievements", count: achievements.length },
    ] as const
  ).filter((t) => t.count > 0);
  const requested = params.get("tab") as Tab | null;
  const [tab, setTab] = useState<Tab>(
    tabs.some((t) => t.id === requested) ? requested! : (tabs[0]?.id ?? "achievements"),
  );
  const [lightbox, setLightbox] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    setTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  const certItems: LightboxItem[] = certifications.map((c) => ({
    ...c.image,
    caption: `${c.title} — ${c.issuer}`,
    pdf: c.pdf,
  }));
  const achWithImages = achievements.filter((a) => a.image);
  const achItems: LightboxItem[] = achWithImages.map((a) => ({ ...a.image!, caption: a.title }));

  return (
    <>
      {tabs.length > 1 ? (
        <div
          role="tablist"
          aria-label="Credentials"
          className="mb-8 inline-flex rounded-full border border-border bg-bg-elevated p-1"
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={cn(
                "flex h-9 items-center gap-2 rounded-full px-4 text-sm transition-colors",
                tab === t.id ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "font-mono text-[11px]",
                  tab === t.id ? "text-bg/70" : "text-fg-faint",
                )}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {tab === "certifications" ? (
        <ul
          id="panel-certifications"
          role={tabs.length > 1 ? "tabpanel" : undefined}
          aria-labelledby={tabs.length > 1 ? "tab-certifications" : undefined}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {certifications.map((c, i) => (
            <li
              key={c.slug}
              id={c.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated"
            >
              <button
                type="button"
                onClick={() => setLightbox({ items: certItems, index: i })}
                className="group relative aspect-[4/3] overflow-hidden border-b border-border bg-bg-subtle"
                aria-label={`View certificate: ${c.title}`}
              >
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                  placeholder="blur"
                  blurDataURL={c.image.blurDataURL}
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                />
                <span className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full border border-border-strong bg-bg/70 text-fg-muted backdrop-blur">
                  <Maximize2 className="size-3.5" aria-hidden="true" />
                </span>
              </button>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="eyebrow flex items-center gap-2">
                  <Award className="size-3.5" aria-hidden="true" /> {c.issuer}
                </p>
                <h2 className="text-lg leading-snug font-semibold">{c.title}</h2>
                {c.skills.length ? (
                  <p className="text-sm text-fg-muted">{c.skills.join(" · ")}</p>
                ) : null}
                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  <span className="mono-label text-xs">
                    {formatMonth(c.date)}
                    {c.credentialId ? ` · ID ${c.credentialId}` : ""}
                  </span>
                  <span className="flex items-center gap-3">
                    {c.pdf ? (
                      <a
                        href={c.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
                      >
                        <FileText className="size-3.5" aria-hidden="true" /> PDF
                      </a>
                    ) : null}
                    {c.verifyUrl ? (
                      <a
                        href={c.verifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-accent"
                      >
                        Verify <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : null}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul
          id="panel-achievements"
          role={tabs.length > 1 ? "tabpanel" : undefined}
          aria-labelledby={tabs.length > 1 ? "tab-achievements" : undefined}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {achievements.map((a) => (
            <li
              key={a.slug}
              id={a.slug}
              className="flex flex-col gap-5 rounded-2xl border border-border bg-bg-elevated p-5 sm:flex-row"
            >
              {a.image ? (
                <button
                  type="button"
                  onClick={() => setLightbox({ items: achItems, index: achWithImages.indexOf(a) })}
                  className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-border sm:w-40"
                  aria-label={`View image: ${a.title}`}
                >
                  <Image
                    src={a.image.src}
                    alt={a.image.alt}
                    fill
                    sizes="160px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={a.image.blurDataURL}
                  />
                </button>
              ) : (
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-bg-subtle">
                  <Trophy className="size-5 text-fg-muted" aria-hidden="true" />
                </span>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <p className="eyebrow">
                  {a.type} · {formatMonth(a.date)}
                </p>
                <h2 className="text-lg leading-snug font-semibold">{a.title}</h2>
                <p className="text-[15px] text-fg-muted">{a.description}</p>
                {a.link ? (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-fg-muted hover:text-accent"
                  >
                    View <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        items={lightbox?.items ?? []}
        index={lightbox?.index ?? null}
        onClose={() => setLightbox(null)}
        onIndex={(index) => setLightbox((l) => (l ? { ...l, index } : l))}
      />
    </>
  );
}
