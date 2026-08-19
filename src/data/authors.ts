import type { Author } from "@/types/content";

/**
 * Development seed data. Fictional people — replace via the CMS.
 *
 * No portrait photography is assigned to these invented names: pairing a real
 * person's photograph with a fictional byline could imply a false identity or
 * endorsement. Bylines render a typographic monogram until real staff
 * photography exists (see `AuthorByline`).
 */
export const authors: Author[] = [
  {
    _id: "author-mera-lindqvist",
    name: "Mera Lindqvist",
    slug: "mera-lindqvist",
    role: "Editor-in-chief",
    bio: "Twelve seasons reporting on the European freeride circuit. Writes about snow science, risk and the people who make a living in avalanche terrain.",
  },
  {
    _id: "author-tobias-renner",
    name: "Tobias Renner",
    slug: "tobias-renner",
    role: "Senior reporter, snow & safety",
    bio: "Former mountain guide turned journalist. Covers avalanche forecasting, rescue policy and the economics of ski patrol.",
  },
  {
    _id: "author-juno-akiyama",
    name: "Juno Akiyama",
    slug: "juno-akiyama",
    role: "Culture editor",
    bio: "Writes on ski culture, film and the long argument between tradition and progression. Based in Hokkaido from December to April.",
  },
  {
    _id: "author-callum-ross",
    name: "Callum Ross",
    slug: "callum-ross",
    role: "Gear editor",
    bio: "Tests skis, boots and touring kit to failure, then explains what actually broke and why it matters.",
  },
  {
    _id: "author-ines-cabrera",
    name: "Inés Cabrera",
    slug: "ines-cabrera",
    role: "Environment correspondent",
    bio: "Reports on water, energy and land use across alpine communities. Previously a hydrologist.",
  },
  {
    _id: "author-desk",
    name: "Newsroom",
    slug: "newsroom",
    role: "Staff",
    bio: "Reporting filed by the newsroom.",
  },
];

export const authorBySlug = (slug: string) => authors.find((a) => a.slug === slug);
export const author = (slug: string): Author => {
  const found = authorBySlug(slug);
  if (!found) throw new Error(`Unknown seed author: ${slug}`);
  return found;
};
