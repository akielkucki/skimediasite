import type { Sponsor } from "@/types/content";

/**
 * Development seed data.
 *
 * These are INVENTED brands. No real company has any relationship with this
 * site. Logos are rendered as typographic lockups by `<SponsorLogo />` rather
 * than image files, so nothing here can be mistaken for a real brand asset.
 */
export const sponsors: Sponsor[] = [
  {
    _id: "sponsor-fjellhaus",
    name: "Fjellhaus",
    slug: "fjellhaus",
    tier: "presenting",
    featured: true,
    description:
      "Placeholder brand. Technical outerwear built for long days in cold, wet maritime snow.",
    website: "https://example.com",
    logo: {},
    activeFrom: "2025-10-01",
    activeUntil: "2027-06-30",
  },
  {
    _id: "sponsor-corniche-labs",
    name: "Corniche Labs",
    slug: "corniche-labs",
    tier: "season",
    featured: true,
    description: "Placeholder brand. Avalanche transceivers and snowpack instrumentation.",
    website: "https://example.com",
    logo: {},
    activeFrom: "2025-11-01",
  },
  {
    _id: "sponsor-vertic",
    name: "Vertic Skis",
    slug: "vertic-skis",
    tier: "season",
    featured: true,
    description: "Placeholder brand. Small-batch skis pressed in the Dolomites.",
    website: "https://example.com",
    logo: {},
  },
  {
    _id: "sponsor-northline-rail",
    name: "Northline Rail",
    slug: "northline-rail",
    tier: "supporting",
    featured: true,
    description: "Placeholder brand. Overnight rail service to alpine valleys.",
    website: "https://example.com",
    logo: {},
  },
  {
    _id: "sponsor-glacier-coffee",
    name: "Glacier Coffee Co.",
    slug: "glacier-coffee",
    tier: "supporting",
    featured: true,
    description: "Placeholder brand. Roasters supplying mountain huts across four ranges.",
    website: "https://example.com",
    logo: {},
  },
  {
    _id: "sponsor-tarn-optics",
    name: "Tarn Optics",
    slug: "tarn-optics",
    tier: "supporting",
    featured: true,
    description: "Placeholder brand. Flat-light lenses and goggle systems.",
    website: "https://example.com",
    logo: {},
  },
  {
    _id: "sponsor-halden-outfitters",
    name: "Halden Outfitters",
    slug: "halden-outfitters",
    tier: "media",
    featured: false,
    description: "Placeholder brand. Touring hardware and skin systems.",
    website: "https://example.com",
    logo: {},
  },
  {
    _id: "sponsor-verglas-film",
    name: "Verglas Film",
    slug: "verglas-film",
    tier: "media",
    featured: false,
    description: "Placeholder production house. Co-produces documentary work with our film team.",
    website: "https://example.com",
    logo: {},
  },
];

export const sponsorBySlug = (slug: string) => sponsors.find((s) => s.slug === slug);
export const sponsor = (slug: string): Sponsor => {
  const found = sponsorBySlug(slug);
  if (!found) throw new Error(`Unknown seed sponsor: ${slug}`);
  return found;
};
