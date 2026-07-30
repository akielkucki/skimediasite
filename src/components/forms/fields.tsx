"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { FormState } from "@/lib/forms";

/**
 * Accessible form field wrappers.
 *
 * Every field: a real `<label>` bound by id, `aria-invalid` and
 * `aria-describedby` pointing at the error, and the error text rendered in the
 * DOM next to the input (not only as colour).
 */

type BaseProps = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  className?: string;
};

function FieldShell({
  id,
  label,
  hint,
  required,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="kicker text-mist">
        {label}
        {required ? (
          <span className="ml-1 text-accent" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 font-normal tracking-normal text-steel normal-case">
            (optional)
          </span>
        )}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-steel">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-2 text-xs text-accent">
          <span aria-hidden="true">▲</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

const CONTROL =
  "w-full border border-steel/40 bg-charcoal/60 px-4 py-3 text-ice placeholder:text-steel " +
  "transition-colors focus:border-accent focus:outline-none aria-[invalid=true]:border-accent";

export function TextField({
  type = "text",
  autoComplete,
  placeholder,
  ...props
}: BaseProps & { type?: string; autoComplete?: string; placeholder?: string }) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <input
        id={id}
        name={props.name}
        type={type}
        required={props.required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={props.defaultValue}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={
          [props.hint ? `${id}-hint` : null, props.error ? `${id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={CONTROL}
      />
    </FieldShell>
  );
}

export function TextArea({
  rows = 6,
  placeholder,
  ...props
}: BaseProps & { rows?: number; placeholder?: string }) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <textarea
        id={id}
        name={props.name}
        rows={rows}
        required={props.required}
        placeholder={placeholder}
        defaultValue={props.defaultValue}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={
          [props.hint ? `${id}-hint` : null, props.error ? `${id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(CONTROL, "resize-y")}
      />
    </FieldShell>
  );
}

export function SelectField({
  options,
  onValueChange,
  ...props
}: BaseProps & {
  options: readonly { value: string; label: string }[];
  onValueChange?: (value: string) => void;
}) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <select
        id={id}
        name={props.name}
        required={props.required}
        defaultValue={props.defaultValue}
        onChange={(e) => onValueChange?.(e.target.value)}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={
          [props.hint ? `${id}-hint` : null, props.error ? `${id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(CONTROL, "appearance-none bg-[length:12px] pr-10")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%239dadbd' stroke-width='1.6'%3E%3Cpath d='M1 1.5 6 6.5l5-5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-charcoal text-ice">
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Hidden honeypot. Real users never see or focus it; bots fill it in. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="website-field">Leave this field empty</label>
      <input id="website-field" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

/* ── Result banner ─────────────────────────────────────────────────────── */

const TONE: Record<FormState["status"], string> = {
  idle: "",
  success: "border-l-2 border-[#5ad19a] bg-[#5ad19a]/10 text-ice",
  // "unconfigured" is a *warning*, not a success — the message must not read
  // as though anything was delivered.
  unconfigured: "border-l-2 border-[#e9c46a] bg-[#e9c46a]/10 text-ice",
  error: "border-l-2 border-accent bg-accent/10 text-ice",
};

const HEADING: Record<FormState["status"], string> = {
  idle: "",
  success: "Sent",
  unconfigured: "Not sent — no provider connected",
  error: "Something went wrong",
};

export function FormResult({ state }: { state: FormState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <div
      role={state.status === "error" ? "alert" : "status"}
      aria-live="polite"
      className={cn("p-4 text-sm leading-relaxed", TONE[state.status])}
    >
      <p className="kicker mb-1.5">{HEADING[state.status]}</p>
      <p>{state.message}</p>
    </div>
  );
}
