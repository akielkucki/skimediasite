import type { ReactNode } from "react";
import { RouteTracker } from "@/components/analytics/trackers";
import { AdSlot } from "@/components/ads/ad-slot";
import { AdsenseScript } from "@/components/ads/adsense";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { siteConfig } from "@/config/site";
import { organisationJsonLd, websiteJsonLd } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

/**
 * Everything around a public page: skip link, header (with the leaderboard),
 * the closing banner above the footer, and the footer itself.
 *
 * Lives outside the root layout so `/studio` can render full-screen with none
 * of it. Used by `app/(site)/layout.tsx` and by the root `not-found.tsx`
 * (unmatched URLs render outside every route group).
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:uppercase focus:tracking-widest focus:text-void"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        {children}
      </main>

      {/* The closing banner: every page, every viewport. Collapses to nothing
          when the slot is off or unfilled. */}
      <div className="gutter empty:hidden">
        <AdSlot placement="global-footer" className="pt-16" />
      </div>

      <SiteFooter />

      {siteConfig.monetization.analyticsProvider ? <RouteTracker /> : null}
      <AdsenseScript />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organisationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd()) }}
      />
    </>
  );
}
