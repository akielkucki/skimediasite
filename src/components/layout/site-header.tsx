import { HeaderBar } from "./header-bar";
import { AdSlot } from "@/components/ads/ad-slot";

/**
 * Server wrapper around the header.
 *
 * Keeps the leaderboard on the server (it queries the CMS for a live
 * promotion) while the interactive nav stays a small Client Component. The
 * leaderboard sits directly below the primary navigation and disappears
 * completely — no gap — when the slot is disabled or unfilled.
 */
export function SiteHeader() {
  return (
    <>
      <HeaderBar />
      <div className="gutter empty:hidden">
        <AdSlot placement="global-leaderboard" className="py-3" />
      </div>
    </>
  );
}
