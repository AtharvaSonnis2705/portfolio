"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Img = { src: string; alt: string; width: number; height: number; blurDataURL: string };

/**
 * Cover image; if the project has a demo video, a muted loop plays on hover on
 * desktop (poster only on touch / reduced motion) and pauses when off-screen.
 */
export function CardMedia({
  cover,
  video,
  sizes,
  priority,
}: {
  cover: Img;
  video: { src: string; poster: string } | null;
  sizes: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const canPlay = !!video && finePointer && !reducedMotion;

  useEffect(() => {
    const el = ref.current;
    if (!el || !canPlay) return;
    const card = el.closest(".group");
    const play = () => {
      el.preload = "auto";
      void el.play().catch(() => {});
    };
    const pause = () => el.pause();
    card?.addEventListener("pointerenter", play);
    card?.addEventListener("pointerleave", pause);
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && pause());
    io.observe(el);
    return () => {
      card?.removeEventListener("pointerenter", play);
      card?.removeEventListener("pointerleave", pause);
      io.disconnect();
    };
  }, [canPlay]);

  return (
    <>
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={cover.blurDataURL}
        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
      />
      {video && canPlay ? (
        <video
          ref={ref}
          src={video.src}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={cn(
            "absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          )}
        />
      ) : null}
    </>
  );
}
