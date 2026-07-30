import { defineField, defineType } from "sanity";

/**
 * Document types.
 *
 * Every document that the front end renders also carries `accessLevel` — the
 * dormant monetization foundation. It is present, editable and ignored: the app
 * resolves everything as free until `siteConfig.monetization.gatingEnabled` is
 * turned on. See docs/MONETIZATION.md.
 */

const ACCESS_LEVEL = defineField({
  name: "accessLevel",
  title: "Access level",
  type: "string",
  initialValue: "free",
  description:
    "Reserved for a future subscription. Everything currently publishes as free regardless of this value.",
  options: {
    list: [
      { title: "Free — anyone", value: "free" },
      { title: "Registered (not yet enforced)", value: "registered" },
      { title: "Subscriber (not yet enforced)", value: "subscriber" },
    ],
    layout: "radio",
  },
  group: "monetization",
});

/* ── Site settings ─────────────────────────────────────────────────────── */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  description:
    "Overrides for the values in src/config/site.ts. Anything left blank falls back to the file.",
  fields: [
    defineField({ name: "name", title: "Site name", type: "string" }),
    defineField({ name: "shortName", title: "Short name", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "editorialTagline", title: "Editorial tagline", type: "string" }),
    defineField({ name: "contactEmail", title: "General contact email", type: "string" }),
    defineField({ name: "editorialEmail", title: "Editorial/tips email", type: "string" }),
    defineField({ name: "sponsorshipEmail", title: "Sponsorship email", type: "string" }),
    defineField({
      name: "social",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "url" }),
            defineField({
              name: "icon",
              type: "string",
              options: {
                list: ["instagram", "youtube", "x", "tiktok", "rss"],
              },
            }),
          ],
        },
      ],
    }),
    defineField({ name: "seo", title: "Default SEO", type: "seoFields" }),
    defineField({
      name: "adSlots",
      title: "Ad slot overrides",
      type: "array",
      description:
        "Switch a placement off without a deploy. Placement keys are listed in src/config/site.ts.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "placement",
              type: "string",
              options: {
                list: [
                  "global-leaderboard",
                  "editorial-rail-left",
                  "editorial-rail-right",
                  "home-inline",
                  "index-inline",
                  "article-inline",
                  "tv-row-inline",
                ],
              },
            }),
            defineField({ name: "enabled", type: "boolean", initialValue: true }),
          ],
          preview: { select: { title: "placement", subtitle: "enabled" } },
        },
      ],
    }),
    defineField({
      name: "featuredSponsors",
      title: "Featured sponsors",
      type: "array",
      description: "Shown in the homepage and footer logo strips, in this order.",
      of: [{ type: "reference", to: [{ type: "sponsor" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

/* ── Author ────────────────────────────────────────────────────────────── */

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      type: "string",
      description: "Job title as it should appear in bylines, e.g. “Gear editor”.",
    }),
    defineField({
      name: "bio",
      type: "text",
      rows: 4,
      description: "Two or three sentences. Shown at the foot of every article they write.",
    }),
    defineField({ name: "image", title: "Profile image", type: "editorialImage" }),
    defineField({
      name: "social",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "url" }),
          ],
        },
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});

/* ── Category ──────────────────────────────────────────────────────────── */

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "label" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "section",
      title: "Belongs to",
      type: "string",
      options: {
        list: [
          { title: "News index", value: "news" },
          { title: "Blog index", value: "blog" },
        ],
        layout: "radio",
      },
      initialValue: "news",
    }),
  ],
  preview: { select: { title: "label", subtitle: "section" } },
});

/* ── Article ───────────────────────────────────────────────────────────── */

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Metadata" },
    { name: "commercial", title: "Commercial" },
    { name: "seo", title: "SEO" },
    { name: "monetization", title: "Access" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(120).warning("Long headlines wrap awkwardly."),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      description: "The URL. Changing it after publication breaks existing links.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Content type",
      type: "string",
      group: "content",
      initialValue: "news",
      description:
        "News and features appear on /news. Blog and opinion appear on /blog. All live at /articles/[slug].",
      options: {
        list: [
          { title: "News", value: "news" },
          { title: "Feature", value: "feature" },
          { title: "Blog", value: "blog" },
          { title: "Opinion", value: "opinion" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dek",
      title: "Standfirst",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "The sentence under the headline. Also used on cards and as the fallback meta description.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "hero",
      title: "Hero image",
      type: "editorialImage",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroVideo",
      title: "Hero video (optional)",
      type: "videoSource",
      group: "content",
      description: "If set, replaces the hero image with a player on the article page.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "editorialBody",
      group: "content",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated date",
      type: "datetime",
      group: "meta",
      description: "Set this when you materially change a published piece. It is shown to readers.",
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "meta",
      description: "Lowercase, spaces are fine. Used for the topic filters.",
    }),
    defineField({
      name: "readingTime",
      title: "Reading time (minutes)",
      type: "number",
      group: "meta",
      description: "Leave blank and the site calculates it from the body.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      initialValue: false,
      description: "Eligible to lead the homepage or its index page.",
    }),
    defineField({
      name: "relatedArticles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
      group: "meta",
      validation: (rule) => rule.max(3),
      description: "Up to three. The site fills any remainder automatically.",
    }),
    defineField({
      name: "relatedVideos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "video" }] }],
      group: "meta",
    }),

    defineField({
      name: "sponsored",
      title: "Sponsored content",
      type: "boolean",
      group: "commercial",
      initialValue: false,
      description:
        "Adds a “Sponsored” badge on every card, a disclosure block on the page, and a label in the RSS feed.",
    }),
    defineField({
      name: "sponsor",
      type: "reference",
      to: [{ type: "sponsor" }],
      group: "commercial",
      hidden: ({ parent }) => !parent?.sponsored,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { sponsored?: boolean };
          if (parent?.sponsored && !value) {
            return "Sponsored content must name its sponsor — that's the whole point of the label.";
          }
          return true;
        }),
    }),

    defineField({ name: "seo", type: "seoFields", group: "seo" }),
    ACCESS_LEVEL,
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", kind: "kind", media: "hero", date: "publishedAt" },
    prepare: ({ title, kind, media, date }) => ({
      title,
      subtitle: `${kind ?? "—"} · ${date ? new Date(date).toLocaleDateString("en-GB") : "unscheduled"}`,
      media,
    }),
  },
});

/* ── Video ─────────────────────────────────────────────────────────────── */

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "artwork", title: "Artwork" },
    { name: "meta", title: "Metadata" },
    { name: "credits", title: "Credits & ownership" },
    { name: "seo", title: "SEO" },
    { name: "monetization", title: "Access" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "One-line summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "Shown on cards and in the TV hero.",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "text",
      rows: 5,
      group: "content",
      description: "Shown on the detail page. Say who made it and what it is.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "source",
      title: "Video source",
      type: "videoSource",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "captions",
      title: "Caption tracks",
      type: "array",
      of: [{ type: "captionTrack" }],
      group: "content",
      description:
        "Only used for videos we host ourselves. YouTube and Vimeo serve their own captions.",
      hidden: ({ parent }) => parent?.source?.provider !== "hosted",
    }),

    defineField({
      name: "thumbnail",
      title: "Landscape thumbnail (16:9)",
      type: "editorialImage",
      group: "artwork",
      description: "Used in the content rows. Required.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Wide cover art",
      type: "editorialImage",
      group: "artwork",
      description: "Cinematic backdrop for the hero and detail page. Falls back to the thumbnail.",
    }),
    defineField({
      name: "poster",
      title: "Poster art (2:3)",
      type: "editorialImage",
      group: "artwork",
      description: "Portrait key art, used in the film rows.",
    }),

    defineField({
      name: "duration",
      title: "Runtime (seconds)",
      type: "number",
      group: "meta",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "releaseDate",
      type: "date",
      group: "meta",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Rows this appears in",
      type: "array",
      of: [{ type: "string" }],
      group: "meta",
      description:
        "This is how the /tv rows are curated. Add one or more of: latest, featured, films, originals, athletes, destinations, technique, education, events, gear, staff-picks, sponsored.",
      options: {
        list: [
          "latest",
          "featured",
          "films",
          "originals",
          "athletes",
          "destinations",
          "technique",
          "education",
          "events",
          "gear",
          "staff-picks",
          "sponsored",
        ],
      },
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "meta",
    }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "meta",
      description: "Short labels on the card, e.g. “New”, “Staff pick”. Keep to one or two words.",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "meta",
      initialValue: false,
      description: "Eligible for the TV billboard.",
    }),
    defineField({
      name: "series",
      type: "reference",
      to: [{ type: "show" }],
      group: "meta",
      description: "Set if this is an episode of a series.",
    }),
    defineField({
      name: "season",
      title: "Season number",
      type: "number",
      group: "meta",
      hidden: ({ parent }) => !parent?.series,
    }),
    defineField({
      name: "episode",
      title: "Episode number",
      type: "number",
      group: "meta",
      hidden: ({ parent }) => !parent?.series,
    }),

    defineField({
      name: "ownership",
      title: "Production ownership",
      type: "string",
      group: "credits",
      initialValue: "original",
      description:
        "Shown to viewers on every card and detail page. Be accurate — this is a disclosure, not marketing.",
      options: {
        list: [
          { title: "Original — we produced it", value: "original" },
          { title: "Co-production — shared editorial control", value: "co-production" },
          { title: "Partner content — supplied to us", value: "partner" },
          { title: "Licensed — rights remain with the producer", value: "licensed" },
          { title: "Embedded — hosted and served by a third party", value: "embedded" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "director", type: "string", group: "credits" }),
    defineField({
      name: "credits",
      type: "array",
      group: "credits",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "role", type: "string", validation: (r) => r.required() }),
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        },
      ],
    }),
    defineField({
      name: "sponsor",
      type: "reference",
      to: [{ type: "sponsor" }],
      group: "credits",
      description: "Set if a brand funded this film. Triggers the sponsorship disclosure.",
    }),

    defineField({ name: "seo", type: "seoFields", group: "seo" }),
    ACCESS_LEVEL,
  ],
  orderings: [
    {
      title: "Newest first",
      name: "releaseDesc",
      by: [{ field: "releaseDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "thumbnail", ownership: "ownership", date: "releaseDate" },
    prepare: ({ title, media, ownership, date }) => ({
      title,
      subtitle: `${ownership ?? "—"} · ${date ?? "unscheduled"}`,
      media,
    }),
  },
});

/* ── Show / series ─────────────────────────────────────────────────────── */

export const show = defineType({
  name: "show",
  title: "Show or series",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover artwork",
      type: "editorialImage",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "poster", title: "Poster artwork (2:3)", type: "editorialImage" }),
    defineField({
      name: "ownership",
      type: "string",
      initialValue: "original",
      options: {
        list: ["original", "co-production", "partner", "licensed", "embedded"],
      },
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({
      name: "seasons",
      title: "Seasons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "number", type: "number", validation: (r) => r.required() }),
            defineField({ name: "title", type: "string" }),
            defineField({
              name: "episodes",
              type: "array",
              of: [{ type: "reference", to: [{ type: "video" }] }],
              description: "In broadcast order.",
            }),
          ],
          preview: {
            select: { number: "number", title: "title" },
            prepare: ({ number, title }) => ({ title: title ?? `Season ${number}` }),
          },
        },
      ],
    }),
  ],
  preview: { select: { title: "title", media: "cover" } },
});

/* ── Sponsor ───────────────────────────────────────────────────────────── */

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "website", type: "url" }),
    defineField({
      name: "tier",
      title: "Partnership level",
      type: "string",
      initialValue: "supporting",
      options: {
        list: [
          { title: "Presenting", value: "presenting" },
          { title: "Season", value: "season" },
          { title: "Supporting", value: "supporting" },
          { title: "Media", value: "media" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logoColor",
      title: "Logo — full colour",
      type: "editorialImage",
      description: "SVG or transparent PNG. Used on light surfaces and the sponsors page.",
    }),
    defineField({
      name: "logoMono",
      title: "Logo — single colour",
      type: "editorialImage",
      description: "White or light monochrome version, for the dark logo strips.",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      initialValue: false,
      description: "Show in the homepage and footer strips.",
    }),
    defineField({
      name: "activeFrom",
      type: "date",
      description: "The strips hide sponsors outside their active window.",
    }),
    defineField({ name: "activeUntil", type: "date" }),
  ],
  preview: { select: { title: "name", subtitle: "tier", media: "logoColor" } },
});

/* ── Promotion / ad placement ──────────────────────────────────────────── */

export const promotion = defineType({
  name: "promotion",
  title: "Promotion / ad placement",
  type: "document",
  description:
    "Fills an ad slot. If nothing matches a placement, that slot renders nothing at all — no empty box.",
  fields: [
    defineField({
      name: "label",
      title: "Internal label",
      type: "string",
      description: "For the newsroom only. Never shown to readers.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "placement",
      title: "Placement key",
      type: "string",
      description: "Must match a key in src/config/site.ts → ads.slots.",
      options: {
        list: [
          { title: "Leaderboard (below nav, all pages)", value: "global-leaderboard" },
          { title: "Left rail (wide desktop)", value: "editorial-rail-left" },
          { title: "Right rail (wide desktop)", value: "editorial-rail-right" },
          { title: "Homepage inline", value: "home-inline" },
          { title: "News/blog index inline", value: "index-inline" },
          { title: "In-article", value: "article-inline" },
          { title: "Between TV rows", value: "tv-row-inline" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "creativeType",
      type: "string",
      initialValue: "house",
      options: {
        list: [
          { title: "House / text creative", value: "house" },
          { title: "Image creative", value: "image" },
          { title: "Third-party script (not yet wired up)", value: "script" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "headline",
      type: "string",
      hidden: ({ parent }) => parent?.creativeType === "image",
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 2,
      hidden: ({ parent }) => parent?.creativeType === "image",
    }),
    defineField({
      name: "image",
      type: "editorialImage",
      hidden: ({ parent }) => parent?.creativeType !== "image",
    }),
    defineField({
      name: "href",
      title: "Destination URL",
      type: "string",
      description: "Absolute URL, or a site path like /articles/my-story.",
    }),
    defineField({ name: "sponsor", type: "reference", to: [{ type: "sponsor" }] }),
    defineField({
      name: "startDate",
      type: "date",
      description: "Leave blank to run immediately.",
    }),
    defineField({ name: "endDate", type: "date", description: "Leave blank to run indefinitely." }),
    defineField({
      name: "active",
      type: "boolean",
      initialValue: true,
      description: "Off = never renders, regardless of dates.",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "placement", active: "active" },
    prepare: ({ title, subtitle, active }) => ({
      title: active ? title : `(paused) ${title}`,
      subtitle,
    }),
  },
});
