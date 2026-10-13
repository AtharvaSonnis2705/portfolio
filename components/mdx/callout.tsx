import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = {
  info: { icon: Info, cls: "border-border-strong bg-bg-elevated", iconCls: "text-accent" },
  warning: {
    icon: TriangleAlert,
    cls: "border-warning/30 bg-warning/[0.06]",
    iconCls: "text-warning",
  },
  success: {
    icon: CircleCheck,
    cls: "border-success/30 bg-success/[0.06]",
    iconCls: "text-success",
  },
} as const;

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof STYLES;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, cls, iconCls } = STYLES[type];
  return (
    <aside className={cn("my-8 flex gap-4 rounded-xl border p-5", cls)}>
      <Icon className={cn("mt-1 size-5 shrink-0", iconCls)} aria-hidden="true" />
      <div className="text-[15px] leading-relaxed text-fg-muted [&>p+p]:mt-3">
        {title ? <p className="mb-1 font-semibold text-fg">{title}</p> : null}
        {children}
      </div>
    </aside>
  );
}
