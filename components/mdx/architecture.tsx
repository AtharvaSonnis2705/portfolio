import { ArrowDown, ArrowRight } from "lucide-react";
import { Fragment } from "react";

/**
 * Build-time architecture diagram: a left-to-right pipeline of nodes (top-to-bottom
 * on mobile). Pure server-rendered HTML — themable, accessible, zero JS.
 */
export function Architecture({
  nodes,
  caption,
}: {
  nodes: { label: string; detail?: string }[];
  caption?: string;
}) {
  return (
    <figure className="not-prose my-10 rounded-2xl border border-border bg-bg-elevated p-4 md:p-6">
      <ol
        className="flex flex-col items-stretch gap-2 md:flex-row md:items-center"
        aria-label="Architecture, in request order"
      >
        {nodes.map((n, i) => (
          <Fragment key={n.label}>
            <li className="relative flex-1 rounded-xl border border-border-strong bg-bg-subtle px-4 py-3 md:min-w-0">
              <span className="font-mono text-[11px] text-fg-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-medium text-fg">{n.label}</p>
              {n.detail ? (
                <p className="mt-0.5 text-[13px] leading-snug text-fg-muted">{n.detail}</p>
              ) : null}
            </li>
            {i < nodes.length - 1 ? (
              <li aria-hidden="true" className="flex justify-center text-fg-faint">
                <ArrowDown className="size-4 md:hidden" />
                <ArrowRight className="hidden size-4 md:block" />
              </li>
            ) : null}
          </Fragment>
        ))}
      </ol>
      {caption ? <figcaption className="mt-4 text-sm text-fg-faint">{caption}</figcaption> : null}
    </figure>
  );
}
