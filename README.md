# North Aspect

An editorial ski publication and streaming-style TV platform, built with Next.js 16 (App Router),
TypeScript and Tailwind CSS v4. All motion is CSS + a shared IntersectionObserver — no animation
library ships to the client.

> **North Aspect is a placeholder brand.** The publication, its journalists, its sponsors and every
> story in `src/data/` are invented. See [Changing the brand](#changing-the-brand).

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

**No environment variables are required.** With no CMS credentials the site serves the seed content
in `src/data/` — 19 articles, 21 videos, sponsors, promotions — so every page, filter, row and empty
state is exercisable immediately.

```bash
npm run build        # production build
npm start            # serve the production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run format       # prettier --write
npm run check        # format check + lint + typecheck, in one go
npm run placeholders # regenerate the procedural artwork (brand motif / empty states)
npm run studio       # Sanity Studio on :3333 (needs credentials)
npm run test:e2e     # Playwright smoke, a11y (axe), drawer, forms, sitemap crawl
node scripts/import-pexels.mjs  # re-import the curated Pexels photo set
```

**Production builds are guarded.** `next build` with `NODE_ENV=production` fails loudly if the
canonical origin is unset/localhost, contact addresses are placeholders, or no content source is
configured. To knowingly deploy the fictional demo content, set
`NEXT_PUBLIC_ENABLE_DEMO_CONTENT=true` (see `.env.example`). Preview/staging deployments
(`VERCEL_ENV=preview` or `NEXT_PUBLIC_DEPLOY_ENV=preview|staging`) are automatically `noindex`.

## What's here

| Route                    | What it is                                                               |
| ------------------------ | ------------------------------------------------------------------------ |
| `/`                      | Editorial homepage — cinematic hero, news, features, columns, TV band    |
| `/news`                  | News index: featured story, category filters, tags, search, load-more    |
| `/blog`                  | Blog & opinion index — same machinery, looser magazine layout            |
| `/articles/[slug]`       | Article template (all four content types live here)                      |
| `/tv`                    | Streaming-style TV landing page with programmed content rows             |
| `/tv/collections/[slug]` | Full collection view (static) — deep browsing behind the capped rows     |
| `/tv/search`             | TV search results (the only dynamic TV route)                            |
| `/tv/[slug]`             | Video/show detail — player, credits, ownership disclosure, more episodes |
| `/sponsors`              | Partnership formats, current partners, enquiry form                      |
| `/contact`               | Five contact intents, routed to different desks (static)                 |
| `/privacy`               | Privacy & terms — kept true to what the codebase actually does           |
| `/about`                 | Publication, standards, newsroom                                         |
| `/rss.xml`               | Feed (sponsored items are labelled in the feed too)                      |
| `/sitemap.xml`           | Generated from the content layer                                         |
| `/robots.txt`            | Generated                                                                |

## Architecture

```
src/
  config/site.ts        ← the ONLY place the brand is defined
  types/content.ts      ← the app's content contract
  lib/
    cms/                ← Sanity client, GROQ, mappers + local fallback
    env.ts              ← production guardrails, demo/seed gating, indexability
    monitoring.ts       ← server-side error reporting hook
    rate-limit.ts       ← form abuse-control extension point
    video.ts            ← provider-aware embed URL builders
    seo.ts              ← metadata + JSON-LD helpers
    access.ts           ← dormant monetization gate (always grants)
    analytics.ts        ← named event hooks, no provider attached
    forms.ts            ← form definitions shared by client and server
  data/                 ← local seed content (used when no CMS is configured)
  components/
    layout/ editorial/ tv/ ads/ sponsors/ forms/ motion/ ui/ home/
  app/                  ← routes; Server Components unless noted
sanity/schemas/         ← CMS schemas (used by the Studio, not by the site)
scripts/                ← placeholder artwork generator
```

**Everything reads content through `src/lib/cms`.** No page imports Sanity or the seed data
directly, which is what makes the CMS swappable and the no-credentials path reliable.

### Server vs client

Server Components by default. The only Client Components are the ones that genuinely need
interaction: the header (drawer, search, scroll state), the media player, the tiny TV row
scroller (the row markup and cards themselves are Server Components), the forms, the share
controls, and the reveal primitives.

### Rendering

- `/`, `/about`, `/sponsors`, `/contact`, `/privacy`, `/tv` — static
- `/articles/[slug]`, `/tv/[slug]`, `/tv/collections/[slug]` — statically generated, ISR at 300s
- `/news`, `/blog`, `/tv/search` — dynamic (they read `searchParams` for filters and search).
  When Sanity is configured, filtering/search/pagination run inside GROQ, not in app memory.
  (Cache Components were evaluated for these routes and deliberately not enabled in this pass —
  the searchParams-driven pages are already thin, and the model change touches every route.)

## Changing the brand

Open **`src/config/site.ts`** and change `name`, `shortName`, `wordmark.lines` and `description`.
That is the whole job — the header lockup, mobile drawer, footer, `<title>` template, Open Graph
tags, JSON-LD organisation, RSS channel, sitemap, the "Watch on … TV" button and the generated
social card all read from it.

To verify:

```bash
# the only matches outside the config are seed prose and sanity.config.ts
grep -rn "North Aspect" src/ sanity.config.ts --include="*.tsx" --include="*.ts" \
  | grep -v "src/config/site.ts" | grep -v "src/data/"
```

For a real logo, set `wordmark.image` to a path in `/public`; the header switches automatically.

## Content

- **[docs/CMS.md](docs/CMS.md)** — connecting Sanity, the content models, publishing articles and
  videos, how YouTube/Vimeo embeds are configured, preview/draft mode.
- **[docs/INTEGRATIONS.md](docs/INTEGRATIONS.md)** — the forms, the newsletter, analytics, spam
  protection: what's stubbed and exactly where to connect a real service.
- **[docs/MONETIZATION.md](docs/MONETIZATION.md)** — where ads and sponsorship are controlled, and
  the extension points for subscriptions.

## Imagery

`/public/photos` holds the curated editorial photo set: 21 photographs from Pexels, downloaded and
optimised by `scripts/import-pexels.mjs` (no runtime hotlinking, no API key required). The typed
manifest `src/data/photos.generated.ts` records, for every asset: Pexels photo id, source page
URL, photographer name + profile URL, local file, intrinsic size, alt text, credit line, focal
point and intended surfaces. Photographer credits render in editorial figcaptions. No photograph
of an identifiable person is attached to a fictional byline or presented as endorsing a seed
sponsor.

`/public/placeholders` contains the procedurally-drawn alpine compositions
(`scripts/generate-placeholders.mjs`), retained as a brand motif for empty states and texture —
not as editorial photography.

`/public/media/ridge-line-loop.mp4` is a 12-second locally generated clip that backs the
first-party (`hosted`) player path so it works with no network access. The runtimes shown in the
seed data are editorial metadata and don't match this placeholder file.

## Accessibility & performance notes

- Above-the-fold reveals are **CSS-only** (`src/components/motion/on-load.tsx`) so headlines paint
  with the first frame rather than waiting for hydration; hero copy is fully readable in well under
  half a second. Scroll-triggered reveals use one shared IntersectionObserver + CSS transitions and
  have a `<noscript>` backstop in the root layout.
- Fonts are vendored in `src/fonts` (with their OFL license texts) and served via
  `next/font/local`; the long-form serif loads only on the article route.
- The mobile drawer is a native `<dialog>`: focus trap, inert background, Escape, focus restore.
- Exactly one intentional image preload per route (the LCP hero); nothing below the fold preloads.
- All motion honours `prefers-reduced-motion`, in the components and again in `globals.css`.
- Hero and TV-hero text contrast is measured against the actual rendered backdrop, not estimated —
  the eyebrow labels carry their own scrim chips because a bright snow crop otherwise drops them to
  ~1.4:1. `--color-steel` was lightened from `#6b7a8a` to `#7f8e9b` for the same reason.
- Video players are click-to-load facades: no YouTube/Vimeo code is fetched until the viewer asks
  for it. Nothing autoplays; nothing autoplays with sound.
- Ad slots reserve their box up front (aspect ratio on desktop, a fixed height on mobile where a
  leaderboard ratio would collapse to ~32px), so a creative loading in can't shift the page.
