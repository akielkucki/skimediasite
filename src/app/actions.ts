"use server";

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
import { formValues, validate } from "@/lib/validation";

/**
 * Server actions for the site's three forms.
 *
 * ── Honesty rule ─────────────────────────────────────────────────────────
 * No email or form provider is configured in this project. These actions
 * therefore validate properly, log the submission server-side, and then say
 * *exactly that* — they never claim a message was delivered to a human.
 *
 * Connecting a real provider is a change to `deliver()` below and nothing
 * else. See docs/INTEGRATIONS.md.
 * ─────────────────────────────────────────────────────────────────────────
 */

type Delivery = { delivered: boolean; detail: string };

async function deliver(kind: string, payload: Record<string, string>): Promise<Delivery> {
  const endpoint = process.env.CONTACT_FORM_ENDPOINT;
  const apiKey = process.env.CONTACT_FORM_API_KEY;

  if (!endpoint) {
    // Nothing to send to. Record it so the submission isn't silently lost in
    // development, and report the truth back to the user.
    console.info(`[forms] ${kind} submission received (no provider configured):`, payload);
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
    });
    if (!response.ok) {
      return { delivered: false, detail: `provider responded ${response.status}` };
    }
    return { delivered: true, detail: "ok" };
  } catch (error) {
    console.error(`[forms] ${kind} delivery failed`, error);
    return { delivered: false, detail: "network-error" };
  }
}

const UNCONFIGURED_MESSAGE =
  "Your message passed validation, but this site has no email provider connected yet — so it has not been sent to anyone. Nothing has been delivered. Please email us directly in the meantime.";

/* ── General contact ───────────────────────────────────────────────────── */

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, contactFieldNames);

  if (isSpam(values)) {
    // Honeypot tripped: behave as though it succeeded, do nothing.
    return { ...initialFormState, status: "success", message: "Thanks — your message is with us." };
  }

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
    console.info("[forms] newsletter signup received (no provider configured):", values.email);
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
