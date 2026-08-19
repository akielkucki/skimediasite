import { siteConfig } from "@/config/site";

/**
 * Environment gates and production configuration validation.
 *
 * The site runs in three honest modes:
 *
 *   development       — seed content, forms visible, everything permissive.
 *   production (demo) — NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true. Seed content is
 *                       allowed, but the operator has said so explicitly.
 *   production (real) — seed content is forbidden; content comes from the CMS
 *                       and the config must not contain placeholder values.
 *
 * `assertProductionConfig()` runs once per server process (imported from the
 * root layout) and fails the build/startup loudly instead of letting a
 * localhost canonical or a `.example` contact address ship silently.
 */

export const isProduction = process.env.NODE_ENV === "production";

/** True on staging/preview deployments that must never be indexed. */
export const isPreviewDeployment =
  process.env.VERCEL_ENV === "preview" ||
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "preview" ||
  process.env.NEXT_PUBLIC_DEPLOY_ENV === "staging" ||
  process.env.NEXT_PUBLIC_NOINDEX === "true";

/** Robots: index only real production, never previews/staging. */
export const isIndexable = isProduction && !isPreviewDeployment;

/**
 * Seed/demo content gate. Seed data renders in development always; in
 * production only behind the explicit flag.
 */
export const demoContentEnabled =
  !isProduction || process.env.NEXT_PUBLIC_ENABLE_DEMO_CONTENT === "true";

/** Contact/sponsor forms render only when a delivery provider is configured
 *  (or in development, for testing). Otherwise the UI falls back to mailto. */
export const contactFormEnabled = Boolean(process.env.CONTACT_FORM_ENDPOINT) || !isProduction;

/** Newsletter UI renders only with a real provider (or in development). */
export const newsletterEnabled =
  siteConfig.newsletter.enabled && (siteConfig.newsletter.provider !== null || !isProduction);

const PLACEHOLDER_EMAIL = /@(.+\.)?(example|test|invalid|localhost)(\.[a-z]+)?$/i;

/** A social URL is "generic" when it points at a platform root, not a profile. */
const GENERIC_SOCIAL =
  /^https?:\/\/(www\.)?(instagram|youtube|x|twitter|tiktok|facebook)\.com\/?$/i;

/**
 * Social links that actually point somewhere. Generic platform roots from the
 * seed config are dropped everywhere they would render (footer, drawer,
 * JSON-LD `sameAs`) rather than shipped as fake handles.
 */
export function realSocialLinks<T extends { href: string }>(links: readonly T[]): T[] {
  return links.filter((l) => !GENERIC_SOCIAL.test(l.href));
}

export function collectProductionConfigProblems(): string[] {
  const problems: string[] = [];

  const url = siteConfig.url;
  if (!process.env.NEXT_PUBLIC_SITE_URL || /localhost|127\.0\.0\.1/.test(url)) {
    problems.push(
      `NEXT_PUBLIC_SITE_URL is not set (canonical origin resolves to "${url}"). ` +
        "Set it to the real production origin.",
    );
  }

  if (!demoContentEnabled) {
    for (const [label, email] of [
      ["contactEmail", siteConfig.contactEmail],
      ["editorialEmail", siteConfig.editorialEmail],
      ["sponsorshipEmail", siteConfig.sponsorshipEmail],
    ] as const) {
      if (PLACEHOLDER_EMAIL.test(email)) {
        problems.push(
          `siteConfig.${label} is a placeholder ("${email}"). Replace it with a real address.`,
        );
      }
    }

    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      problems.push(
        "No CMS is configured and demo content is disabled, so every page would be empty. " +
          "Set NEXT_PUBLIC_SANITY_PROJECT_ID, or set NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true " +
          "to knowingly serve the fictional seed content.",
      );
    }
  }

  return problems;
}

let asserted = false;

/** Fails a production build/startup on placeholder configuration. */
export function assertProductionConfig() {
  if (asserted || !isProduction) return;
  asserted = true;
  const problems = collectProductionConfigProblems();
  if (problems.length > 0) {
    throw new Error(
      `Production configuration is incomplete:\n- ${problems.join("\n- ")}\n` +
        "(To run a demo deployment with fictional seed content, set NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true.)",
    );
  }
}
