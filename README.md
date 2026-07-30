# North Aspect

An editorial ski publication and streaming-style TV platform, built with Next.js 16 (App Router),
TypeScript, Tailwind CSS v4 and Motion.

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
npm run placeholders # regenerate the local placeholder artwork
npm run studio       # Sanity Studio on :3333 (needs credentials)
```

## What's here

| Route              | What it is                                                               |
| ------------------ | ------------------------------------------------------------------------ |
| `/`                | Editorial homepage — cinematic hero, news, features, columns, TV band    |
| `/news`            | News index: featured story, category filters, tags, search, load-more    |
| `/blog`            | Blog & opinion index — same machinery, looser magazine layout            |
| `/articles/[slug]` | Article template (all four content types live here)                      |
| `/tv`              | Streaming-style TV landing page with programmed content rows             |
| `/tv/[slug]`       | Video/show detail — player, credits, ownership disclosure, more episodes |
| `/sponsors`        | Partnership formats, current partners, enquiry form                      |
| `/contact`         | Five contact intents, routed to different desks                          |
| `/about`           | Publication, standards, newsroom                                         |
| `/rss.xml`         | Feed (sponsored items are labelled in the feed too)                      |
| `/sitemap.xml`     | Generated from the content layer                                         |
| `/robots.txt`      | Generated                                                                |

## Architecture

```
src/
  config/site.ts        ← the ONLY place the brand is defined
  types/content.ts      ← the app's content contract
  lib/
    cms/                ← Sanity client, GROQ, mappers + local fallback
    motion.ts           ← the shared motion vocabulary
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
interaction: the header (drawer, search, scroll state), the media player, the TV rows, the forms,
the share controls, and the motion primitives.

### Rendering

- `/`, `/about`, `/sponsors` — static
- `/articles/[slug]`, `/tv/[slug]` — statically generated from `generateStaticParams`, ISR at 300s
- `/news`, `/blog`, `/tv`, `/contact` — dynamic (they read `searchParams` for filters and search)

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

`/public/placeholders` contains 30 procedurally-drawn alpine compositions (layered ridgelines,
contour intervals, carved tracks, weather-map banding) generated by
`scripts/generate-placeholders.mjs`. They exist so the design can be reviewed with no third-party
photography and no licensing questions. Regenerate with `npm run placeholders`; replace by
publishing real images through the CMS.

`/public/media/ridge-line-loop.mp4` is a 12-second locally generated clip that backs the
first-party (`hosted`) player path so it works with no network access. The runtimes shown in the
seed data are editorial metadata and don't match this placeholder file.

## Accessibility & performance notes

- Above-the-fold reveals are **CSS-only** (`src/components/motion/on-load.tsx`) so headlines paint
  with the first frame rather than waiting for hydration. Scroll-triggered reveals use Motion and
  have a `<noscript>` backstop in the root layout.
- All motion honours `prefers-reduced-motion`, in the components and again in `globals.css`.
- Hero and TV-hero text contrast is measured against the actual rendered backdrop, not estimated —
  the eyebrow labels carry their own scrim chips because a bright snow crop otherwise drops them to
  ~1.4:1. `--color-steel` was lightened from `#6b7a8a` to `#7f8e9b` for the same reason.
- Video players are click-to-load facades: no YouTube/Vimeo code is fetched until the viewer asks
  for it. Nothing autoplays; nothing autoplays with sound.
- Ad slots reserve their box up front (aspect ratio on desktop, a fixed height on mobile where a
  leaderboard ratio would collapse to ~32px), so a creative loading in can't shift the page.
