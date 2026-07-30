"use client";

import { useActionState, useEffect } from "react";
import { FormResult, Honeypot, TextArea, TextField } from "./fields";
import { SubmitButton } from "./contact-form";
import { submitSponsorEnquiry } from "@/app/actions";
import { track } from "@/lib/analytics";
import { initialFormState } from "@/lib/forms";

/** Partnership / advertising enquiry form used on /sponsors. */
export function SponsorForm() {
  const [state, formAction] = useActionState(submitSponsorEnquiry, initialFormState);

  useEffect(() => {
    if (state.status === "idle") return;
    track({
      name: "contact_submit",
      intent: "sponsorship",
      result:
        state.status === "success"
          ? "ok"
          : state.status === "unconfigured"
            ? "unconfigured"
            : "error",
    });
  }, [state]);

  return (
    <form action={formAction} className="relative flex flex-col gap-6" noValidate>
      <Honeypot />

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
          label="Work email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.values.email}
          error={state.fieldErrors.email}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="organisation"
          label="Company or brand"
          required
          autoComplete="organization"
          defaultValue={state.values.organisation}
          error={state.fieldErrors.organisation}
        />
        <TextField
          name="budget"
          label="Indicative budget"
          hint="A range is fine. It helps us suggest formats that actually fit."
          defaultValue={state.values.budget}
          error={state.fieldErrors.budget}
        />
      </div>

      <TextField
        name="formats"
        label="Formats of interest"
        hint="E.g. presenting sponsorship, sponsored editorial, film co-production, display."
        defaultValue={state.values.formats}
        error={state.fieldErrors.formats}
      />

      <TextArea
        name="message"
        label="What you're trying to achieve"
        required
        rows={7}
        hint="Timings, audience and any campaign the partnership needs to sit alongside."
        defaultValue={state.values.message}
        error={state.fieldErrors.message}
      />

      <FormResult state={state} />

      <SubmitButton label="Send enquiry" />
    </form>
  );
}
