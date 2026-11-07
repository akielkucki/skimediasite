# CMS setup — Sanity

The site runs without a CMS. This document is about switching it on.

## How the content layer decides where to read from

`src/lib/cms/index.ts` picks a source per call:

1. No `NEXT_PUBLIC_SANITY_PROJECT_ID` → **local seed data** in `src/data/`.
2. CMS configured but the query throws → **local seed data**, with a `console.warn`.
3. CMS configured and returns an **empty** result → **local seed data**, with a warning.

Rule 3 is deliberate: a fresh, unseeded dataset almost always means "not populated yet" rather than
"this publication has no articles", so `npm run dev` stays useful the moment you add credentials and
before you've published anything.

Once real documents exist, they take over automatically. Nothing is cached across the boundary — the
switch is per request, subject to the ISR window.

## 1. Create the project

```bash
npx sanity@latest login
npx sanity@latest projects create   # or use https://sanity.io/manage
```

Note the **project ID**. The default dataset is `production`.

## 2. Add credentials

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

Restart `npm run dev`.

## 3. Allow the backend to talk to Sanity

In [sanity.io/manage](https://sanity.io/manage) → your project → **API** → **CORS origins**, add
every address the backend is opened from — `http://localhost:3000` and your production domain — with
**Allow credentials** ticked.

## 4. Open the backend

The backend panel is Sanity Studio, mounted inside the site at **`/studio`**
(`src/app/studio/[[...tool]]/page.tsx`):

```bash
npm run dev         # then open http://localhost:3000/studio
```

Sign in with the Google/GitHub/email account that owns the Sanity project. Invite other editors from
the project's **Members** tab on sanity.io/manage — only members can sign in.

- Until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, `/studio` shows these setup steps instead of the
  Studio, so a build never fails because of CMS configuration.
- `/studio` sits outside the `(site)` route group: no header, footer or ads, `noindex`, its own CSP
  (`next.config.ts`). The Studio bundle is code-split to that route, so public pages don't load it.
- `npm run studio` still runs the same Studio standalone on `:3333` if you prefer.

### What's in the sidebar

| Section        | What it controls                                                          |
| -------------- | ------------------------------------------------------------------------- |
| Site settings  | Contact details (emails, phone, address, hours, socials) and ad switches  |
| Articles       | Every story. Tick **Featured** to put it in the homepage carousel         |
| Videos         | The TV catalogue. "Rows this appears in" fills the /tv rows               |
| Shows & series | Multi-episode programmes                                                  |
| Sponsors       | The /sponsors logo grid: name, logo, website, active dates                |
| Ad banners     | Custom brand-deal banners. One active banner per slot replaces Google ads |
| Authors        | Bylines                                                                   |
| Categories     | Article categories                                                        |

## Content models

Schemas live in `sanity/schemas/`. They map onto `src/types/content.ts` via `src/lib/cms/map.ts`.

| Type           | Notes                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| `siteSettings` | Singleton. Contact details + ad switches; blank fields fall back to site.ts. |
| `author`       | Name, slug, role, bio, image, social.                                        |
| `category`     | Label and slug.                                                              |
| `article`      | News / feature / blog / opinion. Body, sponsor, related content, SEO.        |
| `video`        | Provider-aware source, artwork, credits, ownership, series, captions.        |
| `show`         | Series with seasons and ordered episode references.                          |
| `sponsor`      | Tier, logo variants, website, active date range.                             |
| `promotion`    | "Ad banner": a brand-deal creative for one slot, with campaign dates.        |

Every field carries an editor-facing description in the Studio.

### Validation that protects the front end

- **Alt text is required** on images unless the editor explicitly ticks "decorative".
- **A sponsored article must name its sponsor** — the label is meaningless otherwise.
- **A video must have a resolvable source**: a bare id for YouTube/Vimeo (pasting a full URL is
  rejected with an explanation), or a URL for hosted/external.
- **Production ownership is required** on every video, because it is a disclosure to the viewer.

### Draft and published states

Sanity gives you drafts for free. All queries filter with `!(_id in path("drafts.**"))`, so drafts
never leak into the public site.

## Publishing an article

1. **Content** → headline, slug, content type, standfirst, hero image, body.
2. **Metadata** → author, publication date, category, tags, related content.
3. **Commercial** → tick "Sponsored content" and pick the sponsor, if applicable.
4. **SEO** → optional overrides; the standfirst and hero are used by default.
5. Publish.

It appears on `/news` (every content type — the blog was folded in) and at `/articles/<slug>`
within the ISR window (300 seconds). Tick **Featured** and it joins the homepage carousel.

**Body blocks available:** paragraph, heading, subheading, quote, bulleted/numbered list, pull
quote, inline image (with caption + credit), inline video, section break. The renderer supports
exactly these — the CMS can never inject arbitrary HTML into a page.

## Publishing a video

1. **Content** → title, slug, summary, full description, and the **video source**.
2. **Artwork** → landscape thumbnail (required), wide cover, poster art.
3. **Metadata** → runtime in seconds, release date, and the **rows this appears in**.
4. **Credits & ownership** → production ownership (required), director, credits, sponsor.
5. Publish.

### Curating the TV rows

Row membership is driven by a video's `categories` array ("Rows this appears in"):

| Row              | Include this category  |
| ---------------- | ---------------------- |
| Latest releases  | `latest` or `featured` |
| Ski films        | `films`                |
| Athlete profiles | `athletes`             |
| Event coverage   | `events`               |

The homepage needs no curation: its video row is simply the 5 newest videos (excluding the featured
one, which leads the TV band), and its carousel is the 5 newest articles ticked **Featured**, topped
up with the latest stories if fewer are ticked.

Rows with no videos don't render. Row definitions live in `ROW_DEFINITIONS` in
`src/lib/cms/index.ts` if you need to add one.

## How YouTube and Vimeo embeds are configured

Editors enter a **provider + bare video id**, never embed HTML. `src/lib/video.ts` builds the URL:

- **YouTube** → `https://www.youtube-nocookie.com/embed/<id>` with `rel=0`, `modestbranding=1`,
  `playsinline=1`. The nocookie host defers tracking until playback begins.
- **Vimeo** → `https://player.vimeo.com/video/<id>` with `dnt=1` (do not track). Unlisted videos
  take an extra privacy hash in the "Vimeo privacy hash" field.
- **Hosted** → a direct file URL played by the native `<video>` element. No iframe, no third party.
  This is the only source type that uses the caption tracks you upload.
- **External** → deliberately _not_ embedded. The player renders a card that links out to the
  original publisher instead of iframing an unknown host.

Autoplay is only ever appended after the viewer clicks the play facade. Until that click, no
third-party player code is loaded at all.

Where to find the id:

| URL                                           | id            |
| --------------------------------------------- | ------------- |
| `https://www.youtube.com/watch?v=aqz-KE-bpKQ` | `aqz-KE-bpKQ` |
| `https://youtu.be/aqz-KE-bpKQ`                | `aqz-KE-bpKQ` |
| `https://vimeo.com/22439234`                  | `22439234`    |

## Images

Sanity's CDN (`cdn.sanity.io`) is already allowed in `next.config.ts` → `images.remotePatterns`.
`src/lib/cms/client.ts` builds transform URLs at the size each component asks for, and the hotspot
you set in the Studio becomes the CSS `object-position` for art-directed crops.

## Preview / draft mode

The foundation is in place but the route is not built:

- `previewClient()` in `src/lib/cms/client.ts` returns a token-bearing client with
  `perspective: "drafts"`, or `null` if `SANITY_API_READ_TOKEN` isn't set.
- `SANITY_PREVIEW_SECRET` is reserved as the shared secret for the enable route.

To finish it, add `src/app/api/draft/route.ts` that validates the secret, calls `draftMode().enable()`
and redirects to the document; then have the content-layer functions use `previewClient()` when
`(await draftMode()).isEnabled` is true. See the Next.js Draft Mode guide.

## Cache invalidation

Reads are tagged (`article`, `article:<slug>`, `video`, `sponsor`, `promotion`, `siteSettings`) and revalidate every
300 seconds (`siteConfig.cms.revalidateSeconds`). For instant publishing, add a Sanity webhook
pointing at a route handler that calls `revalidateTag("article")`.

## Swapping in a different CMS

Implement the functions exported by `src/lib/cms/index.ts` against your source and delete the Sanity
client. Pages only ever see the types in `src/types/content.ts`, so nothing above that boundary needs
to change.
