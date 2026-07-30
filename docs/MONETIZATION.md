# Advertising, sponsorship & future subscriptions

All content is free at launch. Nothing is gated, and no locked-content UI is shown anywhere. This
document covers what _is_ live (ads and sponsorship) and the dormant foundations for what isn't
(subscriptions).

---

## Part 1 — What's live

### Ad placements

Everything is controlled from `siteConfig.ads` in **`src/config/site.ts`**.

```ts
ads: {
  enabled: true,                      // master switch for the whole site
  disclosureLabel: "Advertisement",
  promoDisclosureLabel: "Promotional placement",
  slots: AD_SLOTS,                    // per-placement config
}
```

| Placement key          | Where it renders                           | Default |
| ---------------------- | ------------------------------------------ | ------- |
| `global-leaderboard`   | Directly below the primary nav, every page | on      |
| `editorial-rail-left`  | Left margin, ≥96rem viewports only         | **off** |
| `editorial-rail-right` | Right margin, ≥96rem viewports only        | on      |
| `home-inline`          | Between homepage sections                  | on      |
| `index-inline`         | Foot of the news/blog result list          | on      |
| `article-inline`       | Inside the article body, ~⅓ down           | on      |
| `tv-row-inline`        | Between TV rows, and on video detail pages | **off** |

`editorial-rail-left` and `tv-row-inline` ship disabled on purpose — they're there to prove the
collapse behaviour, and to be turned on when there's inventory.

### The collapse rules

An `<AdSlot />` renders **nothing at all** — no wrapper, no label, no reserved height — when any of
these is true:

1. `siteConfig.ads.enabled === false`
2. That slot's `enabled === false`
3. No promotion matches the placement
4. The matching promotion is outside its start/end dates

Spacing lives on the promotion markup, never on a container in the page, which is why a disabled
slot leaves no gap behind. To verify: set `ads.enabled: false` and reload — every page reflows
cleanly with no holes.

`src/data/promotions.ts` ships a deliberately expired campaign (`promo-expired-example`) so date
filtering is testable without editing anything.

### Layout shift

Each slot reserves its box before the creative arrives:

- **≥`sm`** — the configured `width / height` as a CSS aspect ratio.
- **<`sm`** — a fixed `mobileHeight` instead. A 970×90 leaderboard at phone width would otherwise be
  ~32px tall and clip its own creative.

### Adding a placement

1. Add the key to `AdPlacementKey` in `src/config/site.ts`.
2. Add its config to `AD_SLOTS` (the record is exhaustively typed — a missing key is a compile
   error).
3. Add the option to the `promotion` schema's placement list in `sanity/schemas/documents.ts`.
4. Drop `<AdSlot placement="your-key" />` where it should appear.

### Third-party ad servers

`creativeType: "script"` exists in the model but is not implemented — nothing executes vendor
JavaScript today. To add GAM or similar, extend `AdCreative` in `src/components/ads/ad-slot.tsx`
with a client sub-component that renders the slot div and calls the vendor SDK on mount. Keep the
reserved box; that's what protects CLS.

### Sponsorship

| Surface                             | Component                                |
| ----------------------------------- | ---------------------------------------- |
| Homepage / footer logo strips       | `<SponsorLogoCloud />`                   |
| "Presented by …" attribution        | `<SponsorAttribution />`                 |
| Sponsored-content badge on cards    | `<SponsoredBadge />`                     |
| Full disclosure block on articles   | `<SponsorDisclosure />`                  |
| Production ownership label on video | `OWNERSHIP_LABELS` in `src/lib/video.ts` |

Config lives in `siteConfig.sponsors`: the strip label and limit, the badge text, the disclosure
copy, and the tier list.

Sponsors carry `activeFrom` / `activeUntil`; `getFeaturedSponsors()` filters on them, so a partner
drops out of the strips when their season ends without anyone editing a page.

### Disclosure guarantees

These hold everywhere, by construction rather than by convention:

- A sponsored article shows a badge on **every** card, a disclosure block on the page, `sponsor` in
  its JSON-LD, and a `Sponsored` category in the RSS feed.
- Paid placements get `rel="sponsored nofollow"`; house promos don't.
- Every ad slot is labelled "Advertisement" or "Promotional placement" above the creative and via
  `aria-label` on the `<aside>`.
- Every video states what we made and what we didn't — original, co-production, partner, licensed
  or embedded — on the card _and_ in full prose on the detail page.
- The CMS **refuses to publish** a sponsored article with no sponsor named.

---

## Part 2 — Dormant foundations

None of this is active. It exists so subscriptions can be added without a rewrite.

### Access levels

Articles, videos and their CMS schemas all carry:

```ts
accessLevel: "free" | "registered" | "subscriber";
```

Editors can set it today. The app ignores it, because `resolveAccess()` in `src/lib/access.ts`
short-circuits:

```ts
if (!siteConfig.monetization.gatingEnabled) return { status: "granted" };
```

`gatingEnabled` is `false`. Everything resolves as free.

### Turning gating on later

1. **Add authentication.** There is none. `Viewer` in `src/lib/access.ts` is the shape the rest of
   the system expects: `{ isAuthenticated, entitlements }`.
2. **Resolve the viewer per request** — from a session cookie in a Server Component, or in
   `proxy.ts` (Next 16's rename of middleware).
3. **Pass it to `resolveAccess(level, viewer)`.** Call sites don't exist yet, but the function's
   contract does, and it already returns the three cases you need:
   `granted` / `requires-registration` / `requires-subscription`.
4. **Flip `gatingEnabled` to `true`.**
5. **Build the paywall UI.** Deliberately absent — showing a fake lock to users on a free site would
   be dishonest. Render it against the non-`granted` branches when it's real.
6. **Update the metadata.** `articleJsonLd()` and `videoJsonLd()` in `src/lib/seo.ts` hard-code
   `isAccessibleForFree: true`. That must become conditional, or you'll be misrepresenting gated
   content to search engines.

### Analytics hooks

`AnalyticsEvent` in `src/lib/analytics.ts` already types the events a monetized site needs
(`ad_slot_render`, `ad_slot_click`, `sponsor_click`, `video_play`). See
[INTEGRATIONS.md](INTEGRATIONS.md#analytics).

### What's genuinely not started

- Authentication and accounts
- Payments, checkout, entitlement storage
- Paywall / metering UI
- Subscriber-only content routing
- Third-party ad-server integration
