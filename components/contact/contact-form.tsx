"use client";

import { ArrowRight, LoaderCircle, Mail, TriangleAlert } from "lucide-react";
import { useActionState, useState } from "react";
import { sendContact } from "@/app/actions/contact";
import { buttonClass } from "@/components/ui/button";
import type { ContactState } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle" };

const field =
  "w-full rounded-xl border bg-bg-subtle px-4 py-3 text-[15px] text-fg placeholder:text-fg-faint transition-[border-color,box-shadow] outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)]";

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-baseline justify-between text-sm text-fg">
        {label}
        {optional ? <span className="mono-label text-xs">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="[animation:fade-up_.3s_var(--ease-out-expo)_both] text-sm text-danger"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SuccessCheck() {
  return (
    <svg viewBox="0 0 52 52" className="size-14" aria-hidden="true">
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--color-success)"
        strokeOpacity=".25"
        strokeWidth="2"
      />
      <path
        d="M15 27 l7 7 l15 -16"
        fill="none"
        stroke="var(--color-success)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="40"
        strokeDashoffset="40"
        className="[animation:draw_.6s_var(--ease-out-expo)_.15s_forwards]"
      />
    </svg>
  );
}

export function ContactForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(sendContact, initial);
  // Timestamp of first interaction — the server rejects sends faster than a human could type.
  // Held in state so React's post-action form reset doesn't clear it.
  const [startedAt, setStartedAt] = useState("");
  const markStart = () => {
    if (!startedAt) setStartedAt(String(Date.now()));
  };

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex min-h-[420px] [animation:fade-up_.5s_var(--ease-out-expo)_both] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-bg-elevated p-8 text-center"
      >
        <SuccessCheck />
        <h3 className="text-h3 font-semibold">Message sent.</h3>
        <p className="max-w-sm text-fg-muted">
          Thanks for reaching out — I&apos;ll reply within 48h.
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};
  const describedBy = (k: string) => (errors[k as keyof typeof errors] ? `${k}-error` : undefined);

  return (
    <form
      action={action}
      noValidate
      onFocusCapture={markStart}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-bg-elevated p-5 md:p-7"
    >
      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} readOnly />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            defaultValue={values.name}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            className={cn(field, errors.name ? "border-danger" : "border-border")}
            placeholder="Ada Lovelace"
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values.email}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={cn(field, errors.email ? "border-danger" : "border-border")}
            placeholder="ada@company.com"
          />
        </Field>
      </div>
      <Field id="company" label="Company" optional error={errors.company}>
        <input
          id="company"
          name="company"
          autoComplete="organization"
          maxLength={120}
          defaultValue={values.company}
          className={cn(field, "border-border")}
          placeholder="Where you're hiring for"
        />
      </Field>
      <Field id="message" label="Message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={5}
          defaultValue={values.message}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
          className={cn(field, "resize-y", errors.message ? "border-danger" : "border-border")}
          placeholder="What are you building, and how can I help?"
        />
      </Field>

      {state.status === "error" && !Object.keys(errors).length ? (
        <div
          role="alert"
          className="flex [animation:fade-up_.3s_var(--ease-out-expo)_both] gap-3 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-fg"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
          <p>
            {state.message} Your message is still here — or{" "}
            <a
              className="text-accent underline underline-offset-2"
              href={`mailto:${email}?subject=${encodeURIComponent("Hello from your portfolio")}`}
            >
              email me directly
            </a>
            .
          </p>
        </div>
      ) : state.status === "error" ? (
        <p role="alert" className="sr-only">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-sm text-fg-faint">
          <Mail className="size-4" aria-hidden="true" /> Usually replies within 48h
        </p>
        <button type="submit" disabled={pending} className={buttonClass("primary", "min-w-40")}>
          {pending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
