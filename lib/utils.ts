import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-07" | "2025-07-14" → "Jul 2025". Parsed manually to avoid timezone drift. */
export function formatMonth(date: string) {
  const [y, m] = date.split("-");
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

export function formatRange(start: string, end: string) {
  return `${formatMonth(start)} — ${end === "present" ? "Present" : formatMonth(end)}`;
}

/** Case/punctuation-insensitive key used to match project stack names to skill chips. */
export function normalizeSkill(name: string) {
  return name
    .toLowerCase()
    .replace(/\.js$/, "js")
    .replace(/[^a-z0-9+#()]+/g, " ")
    .trim();
}

export const isDev = process.env.NODE_ENV !== "production";

/** Strings starting with TODO(Atharva) are placeholders: visible in dev, dropped in production. */
export function isTodo(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trimStart().startsWith("TODO(Atharva)");
}

/** Returns the value unless it's an unfinished TODO in a production build. */
export function shown<T extends string | null | undefined>(value: T): T | null {
  if (isTodo(value) && !isDev) return null;
  return value;
}

export function shownList(values: readonly string[]): string[] {
  return values.filter((v) => !isTodo(v) || isDev);
}

export function absoluteUrl(path: string, base: string) {
  return new URL(path, base).toString();
}
