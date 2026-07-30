"use client";

import { useActionState, useEffect, useId } from "react";
import { useFormStatus } from "react-dom";
import { Honeypot } from "./fields";
import { subscribeNewsletter } from "@/app/actions";
import { track } from "@/lib/analytics";
import { initialFormState } from "@/lib/forms";
import { cn } from "@/lib/utils";

/**
 * Newsletter signup.
 *
 * No mailing-list provider is connected, so a valid address returns an
 * explicit "you have not been subscribed" notice rather than a fake success.
 */
export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction] = useActionState(subscribeNewsletter, initialFormState);
  const id = useId();

  useEffect(() => {
    if (state.status === "idle") return;
    track({
      name: "newsletter_submit",
      result:
        state.status === "success"
          ? "ok"
          : state.status === "unconfigured"
            ? "unconfigured"
            : "error",
    });
  }, [state]);

  const error = state.fieldErrors.email;

  return (
    <form action={formAction} className={cn("relative flex flex-col gap-3", className)} noValidate>
      <Honeypot />
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.values.email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : `${id}-status`}
          className="min-w-0 flex-1 border border-steel/40 bg-void/40 px-4 py-3.5 text-ice placeholder:text-steel focus:border-accent focus:outline-none aria-[invalid=true]:border-accent"
        />
        <SubscribeButton />
      </div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-accent">
          {error}
        </p>
      ) : null}

      {state.message ? (
        <p
          id={`${id}-status`}
          role="status"
          aria-live="polite"
          className={cn(
            "text-xs leading-relaxed",
            state.status === "success" ? "text-[#5ad19a]" : "text-[#e9c46a]",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function SubscribeButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-[3.25rem] shrink-0 bg-ice px-7 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-void transition-colors hover:bg-accent disabled:opacity-60"
    >
      {pending ? "Signing up…" : "Subscribe"}
    </button>
  );
}
