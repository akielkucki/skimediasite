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

| Placement key          | Where it renders                                 | Default |
| ---------------------- | ------------------------------------------------ | ------- |
| `global-leaderboard`   | Directly below the primary nav, every page (≥md) | on      |
| `global-footer`        | Above the footer, every page, every viewport     | on      |
| `editorial-rail-left`  | Left margin, ≥96rem viewports only               | **off** |
| `editorial-rail-right` | Right margin, ≥96rem viewports only              | on      |
| `home-inline`          | Homepage, between the video row and the stories  | on      |
| `index-inline`         | Foot of the news result list                     | on      |
| `article-inline`       | Inside the article body, ~⅓ down                 | on      |
| `tv-row-inline`        | Between TV rows, and on video detail pages       | on      |

Every page carries at least two separate banners (leaderboard + footer banner), plus the inline slot
for its page type. Any slot can also be switched on or off from the backend — **Site settings →
Ads** — without a redeploy; that switch wins over `site.ts`.

### What fills a slot

1. **A brand banner** — an active **Ad banner** in the backend (`promotion`) for that slot, inside
   its start/end dates. Paid banners link out with `rel="sponsored nofollow"`.
2. **Google AdSense** — when `NEXT_PUBLIC_ADSENSE_CLIENT` and an ad-unit id are set, and **Site
   settings → Ads → Show Google ads in empty slots** is on (the default).
3. **In development only**, a dashed "Ad space" placeholder with the slot's name and size, so the
   layout can be reviewed before any ads exist.
4. Otherwise **nothing at all** — no wrapper, no label, no reserved height.

So the plan is: switch AdSense on and every slot fills with Google ads. When a brand deal lands, add
an Ad banner for the slots they bought; it takes over those slots for the campaign dates, then hands
back to Google when it ends.

### Turning on Google AdSense

1. Apply at [adsense.google.com](https://adsense.google.com) with the production domain and wait
   for approval.
2. Create one responsive **Display ad** unit. Note the publisher id (`ca-pub-…`) and the unit's
   `data-ad-slot` number.
3. Set them on the host (and in `.env.local` to test):

   ```dotenv
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
   ADSENSE_SLOT_DEFAULT=1234567890
   ```

   Per-slot units are optional (`ADSENSE_SLOT_GLOBAL_FOOTER`, `ADSENSE_SLOT_HOME_INLINE`, … — see
   `.env.example`).

4. Redeploy. The AdSense script loads, `/ads.txt` is served, the CSP in `next.config.ts` opens to
   Google's ad hosts, and `/privacy` gains the Google advertising disclosure — all keyed off the
   publisher id.
5. **Consent (UK/EEA/Switzerland):** in AdSense → **Privacy & messaging**, publish the European
   regulations message. Google's certified consent banner is then served by the same script; no code
   change is needed.

### The collapse rules

An `<AdSlot />` renders **nothing at all** when `siteConfig.ads.enabled === false`, when the slot is
switched off, or (in production) when neither a brand banner nor AdSense can fill it. Spacing lives
on the slot markup, never on a container in the page, which is why a disabled slot leaves no gap
behind. To verify: set `ads.enabled: false` and reload — every page reflows cleanly with no holes.

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
3. Add it to `AD_PLACEMENTS` in `sanity/schemas/documents.ts` (used by Ad banners and the slot
   switches).
4. Drop `<AdSlot placement="your-key" />` where it should appear.

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
- Ad servers other than AdSense (e.g. Google Ad Manager)
