/**
 * A very small validation helper.
 *
 * Deliberately dependency-free: the site has exactly two forms and their rules
 * fit in this file. The same `Rule` objects are used by the server action and
 * by the client for inline hints, so the two can never drift apart.
 */

export type Rule = {
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  /** Message shown when `pattern` fails. */
  patternMessage?: string;
  oneOf?: readonly string[];
};

export type FieldErrors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const emailRule = (label = "Email address"): Rule => ({
  label,
  required: true,
  maxLength: 254,
  pattern: EMAIL,
  patternMessage: "Enter a valid email address, for example name@example.com.",
});

export function validate(values: Record<string, string>, rules: Record<string, Rule>): FieldErrors {
  const errors: FieldErrors = {};

  for (const [name, rule] of Object.entries(rules)) {
    const value = (values[name] ?? "").trim();

    if (rule.required && !value) {
      errors[name] = `${rule.label} is required.`;
      continue;
    }
    if (!value) continue;

    if (rule.minLength && value.length < rule.minLength) {
      errors[name] = `${rule.label} must be at least ${rule.minLength} characters.`;
      continue;
    }
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[name] = `${rule.label} must be ${rule.maxLength} characters or fewer.`;
      continue;
    }
    if (rule.oneOf && !rule.oneOf.includes(value)) {
      errors[name] = `Choose a valid ${rule.label.toLowerCase()}.`;
      continue;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[name] = rule.patternMessage ?? `${rule.label} is not valid.`;
    }
  }

  return errors;
}

/** Reads a `FormData` into a plain string record, ignoring files. */
export function formValues(formData: FormData, names: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const name of names) {
    const value = formData.get(name);
    out[name] = typeof value === "string" ? value : "";
  }
  return out;
}
