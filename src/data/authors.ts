import { img } from "./media";
import type { Author } from "@/types/content";

/** Development seed data. Fictional people — replace via the CMS. */
export const authors: Author[] = [
  {
    _id: "author-mera-lindqvist",
    name: "Mera Lindqvist",
    slug: "mera-lindqvist",
    role: "Editor-in-chief",
    bio: "Twelve seasons reporting on the European freeride circuit. Writes about snow science, risk and the people who make a living in avalanche terrain.",
    image: img("portrait-01", "Portrait placeholder for Mera Lindqvist"),
    social: [{ label: "Instagram", href: "https://instagram.com" }],
  },
  {
    _id: "author-tobias-renner",
    name: "Tobias Renner",
    slug: "tobias-renner",
    role: "Senior reporter, snow & safety",
    bio: "Former mountain guide turned journalist. Covers avalanche forecasting, rescue policy and the economics of ski patrol.",
    image: img("portrait-02", "Portrait placeholder for Tobias Renner"),
  },
  {
    _id: "author-juno-akiyama",
    name: "Juno Akiyama",
    slug: "juno-akiyama",
    role: "Culture editor",
    bio: "Writes on ski culture, film and the long argument between tradition and progression. Based in Hokkaido from December to April.",
    image: img("portrait-03", "Portrait placeholder for Juno Akiyama"),
  },
  {
    _id: "author-callum-ross",
    name: "Callum Ross",
    slug: "callum-ross",
    role: "Gear editor",
    bio: "Tests skis, boots and touring kit to failure, then explains what actually broke and why it matters.",
    image: img("portrait-04", "Portrait placeholder for Callum Ross"),
  },
  {
    _id: "author-ines-cabrera",
    name: "Inés Cabrera",
    slug: "ines-cabrera",
    role: "Environment correspondent",
    bio: "Reports on water, energy and land use across alpine communities. Previously a hydrologist.",
    image: img("portrait-05", "Portrait placeholder for Inés Cabrera"),
  },
  {
    _id: "author-desk",
    name: "Newsroom",
    slug: "newsroom",
    role: "Staff",
    bio: "Reporting filed by the newsroom.",
    image: img("portrait-06", "Placeholder mark for newsroom byline"),
  },
];

export const authorBySlug = (slug: string) => authors.find((a) => a.slug === slug);
export const author = (slug: string): Author => {
  const found = authorBySlug(slug);
  if (!found) throw new Error(`Unknown seed author: ${slug}`);
  return found;
};
