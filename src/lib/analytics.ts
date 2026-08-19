import { siteConfig } from "@/config/site";

/**
 * Analytics event hooks.
 *
 * No provider is wired up (`siteConfig.monetization.analyticsProvider` is
 * null), so events are a no-op in production and a console trace in dev. The
 * point is that the call sites already exist and are named — connecting
 * Plausible / GA4 / Vercel Analytics later is a change to this file only.
 */

export type AnalyticsEvent =
  | { name: "page_view"; path: string }
  | { name: "article_view"; slug: string; kind: string; sponsored: boolean }
  | { name: "video_play"; slug: string; provider: string; ownership: string }
  | { name: "video_view"; slug: string; provider: string }
  | { name: "tv_row_scroll"; collection: string; direction: "prev" | "next" }
  | { name: "ad_slot_render"; placement: string; creative: string }
  | { name: "ad_slot_click"; placement: string; sponsor?: string }
  | { name: "sponsor_click"; sponsor: string; surface: string }
  | { name: "newsletter_submit"; result: "ok" | "error" | "unconfigured" }
  | { name: "contact_submit"; intent: string; result: "ok" | "error" | "unconfigured" }
  | { name: "search"; query: string; scope: string; results?: number };

export function track(event: AnalyticsEvent) {
  const provider = siteConfig.monetization.analyticsProvider;

  if (!provider) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event.name, event);
    }
    return;
  }

  // Connect a real sink here — see docs/INTEGRATIONS.md.
  if (typeof window === "undefined") return;
  const { name, ...props } = event;
  const w = window as unknown as {
    plausible?: (n: string, o?: { props: Record<string, unknown> }) => void;
    gtag?: (c: string, n: string, o?: Record<string, unknown>) => void;
  };
  if (provider === "plausible") w.plausible?.(name, { props });
  if (provider === "ga4") w.gtag?.("event", name, props);
}
