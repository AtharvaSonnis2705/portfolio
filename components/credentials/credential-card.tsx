import { ArrowUpRight, Award, Trophy } from "lucide-react";
import Image from "next/image";
import { Spotlight } from "@/components/ui/spotlight";
import type { Achievement, Certification } from "@/lib/content";
import { formatMonth } from "@/lib/utils";

export type CredentialItem =
  { kind: "certification"; item: Certification } | { kind: "achievement"; item: Achievement };

/** Compact horizontal card used on the home preview. */
export function CredentialCard({ entry }: { entry: CredentialItem }) {
  const isCert = entry.kind === "certification";
  const title = entry.item.title;
  const by = isCert ? entry.item.issuer : entry.item.event;
  const image = isCert ? entry.item.image : entry.item.image;
  const verify = isCert ? entry.item.verifyUrl : entry.item.link;
  const Icon = isCert ? Award : Trophy;

  return (
    <Spotlight
      as="article"
      tilt={false}
      className="flex h-full gap-4 rounded-2xl border border-border bg-bg-elevated p-4"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-bg-subtle">
        {image ? (
          <Image
            src={image.src}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
            placeholder="blur"
            blurDataURL={image.blurDataURL}
          />
        ) : (
          <span className="flex size-full items-center justify-center">
            <Icon className="size-5 text-fg-muted" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="eyebrow">{isCert ? "Certification" : entry.item.type}</p>
        <h3 className="mt-1 leading-snug font-semibold text-fg">{title}</h3>
        <p className="mt-0.5 truncate text-sm text-fg-muted">{by}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <time className="mono-label text-xs" dateTime={entry.item.date}>
            {formatMonth(entry.item.date)}
          </time>
          {verify ? (
            <a
              href={verify}
              target="_blank"
              rel="noreferrer"
              className="relative z-[3] inline-flex items-center gap-1 text-sm text-fg-muted transition-colors hover:text-accent"
            >
              {isCert ? "Verify" : "View"}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
              <span className="sr-only">{title}</span>
            </a>
          ) : null}
        </div>
      </div>
    </Spotlight>
  );
}
