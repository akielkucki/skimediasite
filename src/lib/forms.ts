import { emailRule, type Rule } from "./validation";

/**
 * Form definitions shared by the client components and the server actions.
 *
 * Keeping the intents and the rules here means the `<select>` options, the
 * routing address and the server-side validation can never disagree.
 */

export const CONTACT_INTENTS = [
  {
    value: "general",
    label: "General enquiry",
    description: "Anything that doesn't fit the categories below.",
    routesTo: "contactEmail",
  },
  {
    value: "editorial-tip",
    label: "Editorial tip",
    description: "A story, a document, or something we should be looking at.",
    routesTo: "editorialEmail",
  },
  {
    value: "video-submission",
    label: "Video submission",
    description: "A film, edit or series you'd like us to programme.",
    routesTo: "editorialEmail",
  },
  {
    value: "sponsorship",
    label: "Sponsorship or advertising",
    description: "Partnership formats, rates and availability.",
    routesTo: "sponsorshipEmail",
  },
  {
    value: "technical",
    label: "Technical issue",
    description: "Something on the site is broken.",
    routesTo: "contactEmail",
  },
] as const;

export type ContactIntent = (typeof CONTACT_INTENTS)[number]["value"];

export const CONTACT_INTENT_VALUES = CONTACT_INTENTS.map((i) => i.value);

export const contactRules: Record<string, Rule> = {
  name: { label: "Name", required: true, minLength: 2, maxLength: 120 },
  email: emailRule(),
  intent: { label: "Reason for contact", required: true, oneOf: CONTACT_INTENT_VALUES },
  organisation: { label: "Organisation", maxLength: 160 },
  subject: { label: "Subject", required: true, minLength: 3, maxLength: 160 },
  message: { label: "Message", required: true, minLength: 20, maxLength: 5000 },
};

export const contactFieldNames = [
  ...Object.keys(contactRules),
  // Honeypot — see `isSpam` below.
  "website",
];

export const sponsorRules: Record<string, Rule> = {
  name: { label: "Name", required: true, minLength: 2, maxLength: 120 },
  email: emailRule("Work email"),
  organisation: { label: "Company or brand", required: true, minLength: 2, maxLength: 160 },
  budget: { label: "Indicative budget", maxLength: 80 },
  formats: { label: "Formats of interest", maxLength: 400 },
  message: {
    label: "What you're trying to achieve",
    required: true,
    minLength: 20,
    maxLength: 5000,
  },
};

export const sponsorFieldNames = [...Object.keys(sponsorRules), "website"];

export const newsletterRules: Record<string, Rule> = {
  email: emailRule(),
};

export const newsletterFieldNames = ["email", "website"];

/**
 * Spam-protection hook.
 *
 * Ships with a honeypot field only (`website`, hidden from humans). Real
 * protection — Turnstile, hCaptcha, rate limiting — plugs in here; see
 * docs/INTEGRATIONS.md. Returning `true` makes the action report success
 * without doing anything, which is the standard honeypot behaviour.
 */
export function isSpam(values: Record<string, string>) {
  return Boolean(values.website?.trim());
}

export type FormStatus = "idle" | "success" | "error" | "unconfigured";

export type FormState = {
  status: FormStatus;
  message: string;
  fieldErrors: Record<string, string>;
  /** Echoed back so a failed submission doesn't lose the user's typing. */
  values: Record<string, string>;
};

export const initialFormState: FormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {},
};
