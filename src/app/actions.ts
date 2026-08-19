"use server";

import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import {
  CONTACT_INTENTS,
  contactFieldNames,
  contactRules,
  initialFormState,
  isSpam,
  newsletterFieldNames,
  newsletterRules,
  sponsorFieldNames,
  sponsorRules,
  type FormState,
} from "@/lib/forms";
import { reportError, reportWarning } from "@/lib/monitoring";
import { isRateLimited } from "@/lib/rate-limit";
import { formValues, validate } from "@/lib/validation";

/**
 * Server actions for the site's three forms.
 *
 * ── Honesty rule ─────────────────────────────────────────────────────────
 * When no delivery provider is configured, the public UI hides these forms
 * behind mailto fallbacks (see lib/env.ts). If a submission still arrives,
 * the action validates it and says exactly what happened — it never claims a
 * message was delivered to a human when it wasn't.
 *
 * ── Privacy rule ─────────────────────────────────────────────────────────
 * Full form payloads and email addresses are never logged or reported to
 * monitoring. Logs carry the form kind, a result and counts only.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Connecting a real provider is a change to `deliver()` below and nothing
 * else. See docs/INTEGRATIONS.md.
 */

type Delivery = { delivered: boolean; detail: string };

const DELIVERY_TIMEOUT_MS = 10_000;

async function deliver(kind: string, payload: Record<string, string>): Promise<Delivery> {
  const endpoint = process.env.CONTACT_FORM_ENDPOINT;
  const apiKey = process.env.CONTACT_FORM_API_KEY;

  if (!endpoint) {
    // Nothing to send to. Record that it happened (not what it said) and
    // report the truth back to the user.
    reportWarning("forms", "submission received with no provider configured", { kind });
    return { delivered: false, detail: "no-provider" };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ kind, ...payload }),
      cache: "no-store",
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
    });
    if (!response.ok) {
      reportWarning("forms", "provider rejected submission", { kind, status: response.status });
      return { delivered: false, detail: `provider responded ${response.status}` };
    }
    return { delivered: true, detail: "ok" };
  } catch (error) {
    // The error may embed request details — report only its class.
    reportError("forms", error instanceof Error ? error.name : "delivery-failure", { kind });
    return { delivered: false, detail: "network-error" };
  }
}

/** Coarse client identifier for rate limiting. Hashed before storage. */
async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
}

const RATE_LIMITED_STATE: FormState = {
  status: "error",
  message: "Too many submissions in a short time. Please wait a minute and try again.",
  fieldErrors: {},
  values: {},
};

const UNCONFIGURED_MESSAGE =
  "Your message passed validation, but this site has no email provider connected yet — so it has not been sent to anyone. Nothing has been delivered. Please email us directly in the meantime.";

/* ── General contact ───────────────────────────────────────────────────── */

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, contactFieldNames);

  if (isSpam(values)) {
    // Honeypot tripped: behave as though it succeeded, do nothing.
    return { ...initialFormState, status: "success", message: "Thanks — your message is with us." };
  }

  if (isRateLimited(`contact:${await clientKey()}`)) return RATE_LIMITED_STATE;

  const fieldErrors = validate(values, contactRules);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
      values,
    };
  }

  const intent = CONTACT_INTENTS.find((i) => i.value === values.intent);
  const routesTo = intent ? siteConfig[intent.routesTo] : siteConfig.contactEmail;

  const result = await deliver("contact", { ...values, routedTo: routesTo });

  if (!result.delivered && result.detail === "no-provider") {
    return {
      status: "unconfigured",
      message: `${UNCONFIGURED_MESSAGE} For a ${intent?.label.toLowerCase() ?? "general"} enquiry that address is ${routesTo}.`,
      fieldErrors: {},
      values,
    };
  }

  if (!result.delivered) {
    return {
      status: "error",
      message: `We couldn't send that (${result.detail}). Please try again, or email ${routesTo} directly.`,
      fieldErrors: {},
      values,
    };
  }

  return {
    status: "success",
    message: `Thanks — your message is with the ${intent?.label.toLowerCase() ?? "team"} desk. We reply to most enquiries within two working days.`,
    fieldErrors: {},
    values: {},
  };
}

/* ── Sponsorship enquiry ───────────────────────────────────────────────── */

export async function submitSponsorEnquiry(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData, sponsorFieldNames);

  if (isSpam(values)) {
    return { ...initialFormState, status: "success", message: "Thanks — we'll be in touch." };
  }

  if (isRateLimited(`sponsor:${await clientKey()}`)) return RATE_LIMITED_STATE;

  const fieldErrors = validate(values, sponsorRules);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
      values,
    };
  }

  const result = await deliver("sponsorship", {
    ...values,
    routedTo: siteConfig.sponsorshipEmail,
  });

  if (!result.delivered && result.detail === "no-provider") {
    return {
      status: "unconfigured",
      message: `${UNCONFIGURED_MESSAGE} Partnership enquiries go to ${siteConfig.sponsorshipEmail}.`,
      fieldErrors: {},
      values,
    };
  }

  if (!result.delivered) {
    return {
      status: "error",
      message: `We couldn't send that (${result.detail}). Please email ${siteConfig.sponsorshipEmail} directly.`,
      fieldErrors: {},
      values,
    };
  }

  return {
    status: "success",
    message:
      "Thanks — the partnerships desk has your enquiry and will follow up with rates and availability.",
    fieldErrors: {},
    values: {},
  };
}

/* ── Newsletter ────────────────────────────────────────────────────────── */

export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = formValues(formData, newsletterFieldNames);

  if (isSpam(values)) {
    return { ...initialFormState, status: "success", message: "Thanks — you're on the list." };
  }

  if (isRateLimited(`newsletter:${await clientKey()}`)) return RATE_LIMITED_STATE;

  const fieldErrors = validate(values, newsletterRules);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "",
      fieldErrors,
      values,
    };
  }

  if (!siteConfig.newsletter.provider) {
    reportWarning("forms", "newsletter signup received with no provider configured", {
      kind: "newsletter",
    });
    return {
      status: "unconfigured",
      message:
        "Address looks good — but no mailing-list provider is connected yet, so you have not been subscribed to anything.",
      fieldErrors: {},
      values,
    };
  }

  const result = await deliver("newsletter", values);
  return result.delivered
    ? {
        status: "success",
        message: "You're on the list. Check your inbox for a confirmation.",
        fieldErrors: {},
        values: {},
      }
    : {
        status: "error",
        message: `We couldn't complete that (${result.detail}). Please try again shortly.`,
        fieldErrors: {},
        values,
      };
}
