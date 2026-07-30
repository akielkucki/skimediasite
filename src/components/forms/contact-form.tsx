"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FormResult, Honeypot, SelectField, TextArea, TextField } from "./fields";
import { submitContact } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { CONTACT_INTENTS, initialFormState, type ContactIntent } from "@/lib/forms";
import { useEffect, useState } from "react";

/**
 * General contact form.
 *
 * Progressive by construction: it is a real `<form action={...}>` bound to a
 * Server Action, so it works before hydration. `useActionState` adds the
 * pending/success/error states on top.
 */
export function ContactForm({ defaultIntent }: { defaultIntent?: ContactIntent }) {
  const [state, formAction] = useActionState(submitContact, initialFormState);
  const [intent, setIntent] = useState<string>(defaultIntent ?? "general");

  useEffect(() => {
    if (state.status === "idle") return;
    track({
      name: "contact_submit",
      intent,
      result:
        state.status === "success"
          ? "ok"
          : state.status === "unconfigured"
            ? "unconfigured"
            : "error",
    });
    // Only fire when the submission result changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const active = CONTACT_INTENTS.find((i) => i.value === intent);

  return (
    <form action={formAction} className="relative flex flex-col gap-6" noValidate>
      <Honeypot />

      <SelectField
        name="intent"
        label="Reason for contact"
        required
        hint={active?.description}
        defaultValue={state.values.intent ?? defaultIntent ?? "general"}
        error={state.fieldErrors.intent}
        onValueChange={setIntent}
        options={CONTACT_INTENTS.map((i) => ({ value: i.value, label: i.label }))}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="name"
          label="Your name"
          required
          autoComplete="name"
          defaultValue={state.values.name}
          error={state.fieldErrors.name}
        />
        <TextField
          name="email"
          label="Email address"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.values.email}
          error={state.fieldErrors.email}
        />
      </div>

      <TextField
        name="organisation"
        label="Organisation"
        autoComplete="organization"
        defaultValue={state.values.organisation}
        error={state.fieldErrors.organisation}
      />

      <TextField
        name="subject"
        label="Subject"
        required
        defaultValue={state.values.subject}
        error={state.fieldErrors.subject}
      />

      <TextArea
        name="message"
        label="Message"
        required
        rows={8}
        hint="At least 20 characters. For editorial tips, include what you have and how we can verify it."
        defaultValue={state.values.message}
        error={state.fieldErrors.message}
      />

      <FormResult state={state} />

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton label="Send message" />
        <p className="text-xs text-steel">
          Fields marked <span className="text-accent">*</span> are required.
        </p>
      </div>
    </form>
  );
}

/** Shared submit button — reads pending state from the enclosing form. */
export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} aria-disabled={pending}>
      {pending ? "Sending…" : label}
      {pending ? <span className="sr-only">Please wait</span> : null}
    </Button>
  );
}
