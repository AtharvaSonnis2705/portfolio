import { site } from "@/content/site";
import { getShippedCount } from "@/lib/content";

export function ProofStrip() {
  const count = getShippedCount();
  return (
    <section aria-label="Highlights" className="border-y border-border bg-bg-elevated/40">
      <ul className="container-page flex flex-col divide-y divide-border font-mono text-[13px] text-fg-muted md:flex-row md:flex-wrap md:items-center md:justify-between md:divide-y-0">
        {site.proof.map((fact) => (
          <li key={fact} className="py-3.5 md:py-5">
            {fact}
          </li>
        ))}
        <li className="py-3.5 md:py-5">
          <span className="text-accent">{count}</span> projects shipped
        </li>
      </ul>
    </section>
  );
}
