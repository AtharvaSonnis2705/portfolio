"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { contactSchema, type ContactState } from "@/lib/contact-schema";

const MIN_FILL_MS = 3000;
const LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000;

/**
 * Simple in-memory per-IP rate limit (3/hour). On serverless this is per-instance,
 * which is enough to stop casual abuse; swap for Vercel KV/Upstash for a hard limit.
 */
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: real users never see or fill this field. Pretend success so bots move on.
  if (String(formData.get("website") ?? "").length > 0) return { status: "success" };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
      values: raw,
    };
  }

  // Submissions faster than a human can type are bots.
  const startedAt = Number(formData.get("startedAt"));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return {
      status: "error",
      message: "That was quick — please wait a moment and try again.",
      values: raw,
    };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "Too many messages from your network in the last hour.",
      values: raw,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return { status: "error", message: "The form isn't configured yet.", values: raw };
  }

  const { name, email, company, message } = parsed.data;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
    to: [to],
    replyTo: email,
    subject: `Portfolio: ${name}${company ? ` (${company})` : ""}`,
    text: `${message}\n\n— ${name} <${email}>${company ? `\n${company}` : ""}`,
    html: `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><hr/><p>${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;${company ? `<br/>${escapeHtml(company)}` : ""}</p>`,
  });

  if (error) {
    console.error("[contact] Resend error", error);
    return { status: "error", message: "Something went wrong sending your message.", values: raw };
  }
  return { status: "success" };
}
