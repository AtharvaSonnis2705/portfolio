"use client";

import { Copy } from "lucide-react";
import { buttonClass, type ButtonVariant } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export async function copyEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email);
    toast("Copied");
  } catch {
    window.location.href = `mailto:${email}`;
  }
}

export function CopyEmailButton({
  email,
  variant = "icon",
  label,
  className,
}: {
  email: string;
  variant?: ButtonVariant;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => copyEmail(email)}
      className={buttonClass(variant, className)}
      aria-label={label ? undefined : `Copy email address ${email}`}
      title="Copy email"
    >
      <Copy className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
