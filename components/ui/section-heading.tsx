import { cn } from "@/lib/utils";

/** Eyebrow pattern: `01 / SELECTED WORK` in mono, then a large sans heading. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  id,
  className,
  children,
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl" data-reveal>
        <p className="eyebrow mb-4">
          {index ? <span aria-hidden="true">{index} / </span> : null}
          {eyebrow}
        </p>
        <h2 id={id} className="text-h2 font-semibold text-balance">
          {title}
        </h2>
        {description ? <p className="mt-4 max-w-prose text-fg-muted">{description}</p> : null}
      </div>
      {children ? (
        <div data-reveal style={{ "--stagger": 1 } as React.CSSProperties}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
