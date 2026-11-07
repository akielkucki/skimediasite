/**
 * Central site configuration.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS IS THE ONLY PLACE THE BRAND IS DEFINED.
 * Change `name` / `shortName` / `wordmark` below and the header, footer,
 * navigation, metadata, JSON-LD, sitemap and every other branded surface
 * updates automatically. Nothing else in the codebase hard-codes the brand.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The values shipped here are a believable *placeholder* brand. Replace the
 * fields marked `REPLACE ME` with the real publication's details before launch.
 */

export type NavItem = {
  label: string;
  href: string;
  /** Optional short description used by the mobile drawer + mega nav. */
  description?: string;
  /** Renders the link with accent treatment (used for the TV entry point). */
  emphasis?: boolean;
  external?: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
  /** Key resolved by `src/components/ui/social-icon.tsx`. */
  icon: "instagram" | "youtube" | "x" | "tiktok" | "rss";
};

/**
 * Ad placement keys. Every `<AdSlot />` in the app references one of these.
 * Adding a placement = add the key here, add its config to `ads.slots`, and
 * drop an `<AdSlot placement="..." />` where it should render.
 */
export type AdPlacementKey =
  | "global-leaderboard"
  | "global-footer"
  | "editorial-rail-left"
  | "editorial-rail-right"
  | "home-inline"
  | "index-inline"
  | "article-inline"
  | "tv-row-inline";

export type AdSlotConfig = {
  /** When false the slot renders nothing at all — no reserved space, no gap. */
  enabled: boolean;
  label: string;
  /** Reserved intrinsic size, used to avoid layout shift when a creative loads. */
  width: number;
  height: number;
  /**
   * Height reserved below the `sm` breakpoint. A desktop leaderboard ratio
   * collapses to ~32px on a phone, which clips its own creative — so narrow
   * viewports reserve a height instead of the ratio.
   */
  mobileHeight?: number;
  /** Hide the slot below the `md` breakpoint so ads never dominate mobile. */
  desktopOnly?: boolean;
};

/**
 * Ad placement sizing. Typed as a complete record so every placement key is
 * accounted for and a missing one is a compile error, not a silent no-op.
 */
const AD_SLOTS: Record<AdPlacementKey, AdSlotConfig> = {
  // Desktop-only: on phones the leaderboard pushed the publication's own
  // headline below the first viewport. Mobile monetisation uses the lower
  // inline placements instead.
  "global-leaderboard": {
    enabled: true,
    label: "Leaderboard",
    width: 970,
    height: 90,
    desktopOnly: true,
  },
  // The closing banner above the footer, on every page and every viewport —
  // the placement that carries mobile on pages with no inline slot.
  "global-footer": {
    enabled: true,
    label: "Footer banner",
    width: 728,
    height: 90,
    mobileHeight: 100,
  },
  "editorial-rail-left": {
    enabled: false,
    label: "Left rail",
    width: 160,
    height: 600,
    desktopOnly: true,
  },
  "editorial-rail-right": {
    enabled: true,
    label: "Right rail",
    width: 160,
    height: 600,
    desktopOnly: true,
  },
  "home-inline": {
    enabled: true,
    label: "Homepage inline",
    width: 728,
    height: 90,
    mobileHeight: 112,
  },
  "index-inline": {
    enabled: true,
    label: "Index inline",
    width: 728,
    height: 90,
    mobileHeight: 112,
  },
  "article-inline": {
    enabled: true,
    label: "In-article",
    width: 468,
    height: 60,
    mobileHeight: 112,
  },
  "tv-row-inline": {
    enabled: true,
    label: "TV row inline",
    width: 970,
    height: 250,
    mobileHeight: 160,
  },
};

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  /* ── Brand ───────────────────────────────────────────────────────────── */
  /** REPLACE ME — full publication name. */
  name: "North Aspect",
  /** REPLACE ME — compact name for tight UI, share text and the wordmark. */
  shortName: "NORTH ASPECT",
  /** REPLACE ME */
  description:
    "Independent skiing journalism, long-form mountain features and original ski film — reporting from the snowline up.",
  /** REPLACE ME — appears under the wordmark and in the footer. */
  tagline: "Reporting from the snowline up",
  /** Short editorial promise used on the homepage and About page. */
  editorialTagline: "Skiing, covered in full depth",

  /**
   * Wordmark configuration. The default renders a typographic lockup so the
   * site works with zero image assets. Point `image` at an SVG in /public to
   * swap in a real logo — the header picks it up automatically.
   */
  wordmark: {
    /** Split across two lines in the header lockup, like a printed masthead. */
    lines: ["NORTH", "ASPECT"] as const,
    /** Optional: e.g. "/brand/wordmark.svg". Leave null for the type lockup. */
    image: null as string | null,
    imageWidth: 180,
    imageHeight: 40,
  },

  /* ── Contact ─────────────────────────────────────────────────────────── */
  /** REPLACE ME */
  contactEmail: "hello@northaspect.example",
  /** REPLACE ME */
  editorialEmail: "tips@northaspect.example",
  /** REPLACE ME */
  sponsorshipEmail: "partners@northaspect.example",
  /** REPLACE ME (or set it in the backend) — leave empty to hide it. */
  phone: "+44 20 7946 0000",
  /** REPLACE ME (or set it in the backend) — leave empty to hide postal-address surfaces. */
  addressLines: ["North Aspect Media", "1 Example Street", "Town, AB1 2CD"] as string[],
  /** REPLACE ME (or set it in the backend) — leave empty to hide it. */
  officeHours: "Monday–Friday, 9:00–17:30",

  /* ── URLs ────────────────────────────────────────────────────────────── */
  /**
   * Canonical origin. Set NEXT_PUBLIC_SITE_URL in production so canonical
   * URLs, Open Graph images and the sitemap resolve absolutely.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000",

  /* ── Social ──────────────────────────────────────────────────────────── */
  /** REPLACE ME — these point nowhere real. */
  social: [
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
    { label: "X", href: "https://x.com", icon: "x" },
    { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
    { label: "RSS", href: "/rss.xml", icon: "rss" },
  ] satisfies SocialLink[],

  /* ── Navigation ──────────────────────────────────────────────────────── */
  mainNav: [
    { label: "News", href: "/news", description: "Skiing news and articles" },
    {
      label: "TV",
      href: "/tv",
      description: "Films, athletes and events",
      emphasis: true,
    },
    { label: "Sponsors", href: "/sponsors", description: "The brands behind us" },
    { label: "About", href: "/about", description: "Who we are" },
    { label: "Contact", href: "/contact", description: "Every way to reach us" },
  ] satisfies NavItem[],

  /** Secondary nav rendered inside the /tv experience. */
  tvNav: [
    { label: "All", href: "/tv" },
    { label: "Films", href: "/tv/collections/ski-films" },
    { label: "Athletes", href: "/tv/collections/athlete-profiles" },
    { label: "Events", href: "/tv/collections/events" },
  ] satisfies NavItem[],

  footerNav: {
    Editorial: [
      { label: "Latest news", href: "/news" },
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Editorial tips", href: "/contact?intent=editorial-tip" },
    ],
    Watch: [
      { label: "TV home", href: "/tv" },
      { label: "Ski films", href: "/tv/collections/ski-films" },
      { label: "Athletes", href: "/tv/collections/athlete-profiles" },
      { label: "Submit a film", href: "/contact?intent=video-submission" },
    ],
    Partner: [
      { label: "Our sponsors", href: "/sponsors" },
      { label: "Advertise with us", href: "/contact?intent=sponsorship" },
    ],
  } satisfies Record<string, NavItem[]>,

  /* ── SEO defaults ────────────────────────────────────────────────────── */
  seo: {
    titleTemplate: "%s · North Aspect",
    defaultTitle: "North Aspect — Skiing, covered in full depth",
    keywords: [
      "skiing",
      "ski news",
      "freeride",
      "ski films",
      "backcountry",
      "alpine",
      "snow report",
    ],
    /** Twitter handle for `twitter:site`. REPLACE ME or set to null. */
    twitterHandle: "@northaspect",
    locale: "en_GB",
    /** Falls back to the generated OG image route when a page has no hero. */
    defaultOgImage: "/opengraph-image",
  },

  /* ── Advertising ─────────────────────────────────────────────────────── */
  ads: {
    /**
     * Master switch. Set to false and every `<AdSlot />` on the site collapses
     * to nothing — no labels, no reserved boxes, no empty gaps.
     */
    enabled: true,
    /** Text rendered above every placement, required for disclosure. */
    disclosureLabel: "Advertisement",
    /** Used for house/sponsor promos rather than paid display. */
    promoDisclosureLabel: "Promotional placement",
    slots: AD_SLOTS,
    /**
     * Google AdSense. Fills any slot that has no brand banner scheduled in the
     * backend — brand deals always win. Off until the publisher id is set;
     * per-slot ad unit ids are read in src/lib/ads.ts.
     */
    adsense: {
      /** e.g. "ca-pub-1234567890123456". Public, not a secret. */
      client: /^ca-pub-\d+$/.test(process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "")
        ? (process.env.NEXT_PUBLIC_ADSENSE_CLIENT as string)
        : null,
    },
  },

  /* ── Sponsors ────────────────────────────────────────────────────────── */
  sponsors: {
    /** Show the sponsor strip under the homepage hero. */
    showHomepageStrip: true,
    /** Max logos rendered in the homepage logo cloud. */
    homepageStripLimit: 6,
    /** Copy above the logo cloud. */
    stripLabel: "Season partners",
    /** Shown wherever sponsored editorial appears. */
    sponsoredBadgeLabel: "Sponsored",
    sponsoredDisclosure:
      "This story was produced with financial support from the sponsor named above. Editorial direction and final copy remained with the North Aspect newsroom.",
    /** Partnership tiers offered on /sponsors, in display order. */
    tiers: ["presenting", "season", "supporting", "media"] as const,
  },

  /* ── Newsletter ──────────────────────────────────────────────────────── */
  newsletter: {
    enabled: true,
    heading: "The Dawn Patrol",
    description: "One dispatch a week: the stories, snowfall and film worth your morning coffee.",
    /**
     * No mailing-list provider is wired up. The form posts to a server action
     * that validates and reports back honestly that no provider is configured.
     * See docs/INTEGRATIONS.md to connect one.
     */
    provider: null as "mailchimp" | "buttondown" | "resend" | null,
  },

  /* ── CMS ─────────────────────────────────────────────────────────────── */
  cms: {
    provider: "sanity" as const,
    /** Read at request time from env; see `src/lib/cms/client.ts`. */
    projectIdEnv: "NEXT_PUBLIC_SANITY_PROJECT_ID",
    datasetEnv: "NEXT_PUBLIC_SANITY_DATASET",
    apiVersion: "2024-10-01",
    /** Mount the embedded Sanity Studio at this path (only when configured). */
    studioPath: "/studio",
    /** ISR window for CMS-backed pages, in seconds. */
    revalidateSeconds: 300,
  },

  /* ── Monetization foundations (dormant — see docs/MONETIZATION.md) ───── */
  monetization: {
    /**
     * Everything resolves as free at launch. Flipping this on later is what
     * activates gating; until then `resolveAccess()` always returns "granted".
     */
    gatingEnabled: false,
    /** Access levels the content models already carry. */
    accessLevels: ["free", "registered", "subscriber"] as const,
    /** Analytics sink. Null = events are collected but not dispatched. */
    analyticsProvider: null as "plausible" | "ga4" | "vercel" | null,
  },

  /* ── Editorial taxonomy ──────────────────────────────────────────────── */
  categories: {
    news: [
      { slug: "snow-report", label: "Snow report" },
      { slug: "resorts", label: "Resorts" },
      { slug: "competition", label: "Competition" },
      { slug: "safety", label: "Safety" },
      { slug: "environment", label: "Environment" },
      { slug: "industry", label: "Industry" },
    ],
    blog: [
      { slug: "culture", label: "Culture" },
      { slug: "opinion", label: "Opinion" },
      { slug: "gear", label: "Gear" },
      { slug: "travel", label: "Travel" },
      { slug: "technique", label: "Technique" },
    ],
  },

  /** Words-per-minute used when the CMS doesn't supply a reading time. */
  readingSpeedWpm: 225,
};

export type SponsorTier = (typeof siteConfig.sponsors.tiers)[number];
export type AccessLevel = (typeof siteConfig.monetization.accessLevels)[number];
