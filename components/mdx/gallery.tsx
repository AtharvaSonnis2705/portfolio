"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxItem } from "@/components/ui/lightbox";

/** Thumbnail grid; click/Enter opens the lightbox (swipe on mobile, arrows on desktop). */
export function Gallery({ items }: { items: LightboxItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (!items.length) return null;

  return (
    <div className="not-prose my-10">
      <ul className={items.length === 1 ? "grid" : "grid grid-cols-1 gap-3 sm:grid-cols-2"}>
        {items.map((item, i) => (
          <li key={item.src}>
            <figure>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden rounded-xl border border-border bg-bg-subtle"
                aria-label={`Open image: ${item.alt}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  placeholder={item.blurDataURL ? "blur" : "empty"}
                  blurDataURL={item.blurDataURL}
                  sizes="(min-width: 768px) 400px, 100vw"
                  className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                />
              </button>
              {item.caption ? (
                <figcaption className="mt-2 text-sm text-fg-faint">{item.caption}</figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </div>
  );
}
