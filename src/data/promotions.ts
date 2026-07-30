import { img } from "./media";
import { sponsor } from "./sponsors";
import type { Promotion } from "@/types/content";

/**
 * Development seed data for ad / promotional placements.
 *
 * `placement` matches an `AdPlacementKey` from `src/config/site.ts`. An
 * `<AdSlot />` renders the first promotion that (a) matches its placement,
 * (b) is `active`, and (c) is inside its date window. If nothing matches, the
 * slot renders nothing at all — no empty box, no reserved gap.
 *
 * These are house/sponsor promos, not paid display creative. Real display
 * would arrive as `creativeType: "script"` from an ad server.
 */
export const promotions: Promotion[] = [
  {
    _id: "promo-leaderboard-fjellhaus",
    label: "Fjellhaus — season leaderboard",
    placement: "global-leaderboard",
    creativeType: "house",
    headline: "Built for four days of continuous rain",
    body: "Fjellhaus maritime shell programme — read the materials story.",
    href: "/articles/building-a-shell-for-continuous-rain",
    sponsor: sponsor("fjellhaus"),
    startDate: "2026-01-01",
    endDate: "2027-06-30",
    active: true,
  },
  {
    _id: "promo-rail-corniche",
    label: "Corniche Labs — right rail",
    placement: "editorial-rail-right",
    creativeType: "image",
    image: img("poster-04", "Promotional artwork for Corniche Labs"),
    headline: "Corniche Labs",
    body: "Transceiver recall: check your serial.",
    href: "/articles/corniche-labs-transceiver-recall",
    sponsor: sponsor("corniche-labs"),
    active: true,
  },
  {
    _id: "promo-home-inline-newsletter",
    label: "House — Dawn Patrol newsletter",
    placement: "home-inline",
    creativeType: "house",
    headline: "The Dawn Patrol",
    body: "One dispatch a week. Snowfall, stories and film worth your morning coffee.",
    href: "/contact",
    active: true,
  },
  {
    _id: "promo-index-inline-tv",
    label: "House — TV cross-promotion",
    placement: "index-inline",
    creativeType: "house",
    headline: "Now streaming: The Last Cold Aspect",
    body: "A season on one north-facing couloir. Free to watch.",
    href: "/tv/the-last-cold-aspect",
    active: true,
  },
  {
    _id: "promo-article-inline-vertic",
    label: "Vertic Skis — in-article",
    placement: "article-inline",
    creativeType: "house",
    headline: "Vertic Skis",
    body: "Small-batch skis, pressed by four people. Watch the workshop film.",
    href: "/tv/inside-a-small-ski-press",
    sponsor: sponsor("vertic-skis"),
    active: true,
  },
  {
    _id: "promo-expired-example",
    label: "Expired campaign (kept to prove date filtering works)",
    placement: "home-inline",
    creativeType: "house",
    headline: "Last season's campaign",
    body: "This promotion is outside its date window and must never render.",
    href: "/",
    startDate: "2024-01-01",
    endDate: "2024-04-30",
    active: true,
  },
];
