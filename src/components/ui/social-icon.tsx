import type { SocialLink } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Inline social glyphs. Simple, generic marks — deliberately not the
 * platforms' official logo files, which are trademarked assets we should not
 * be redistributing. Each is labelled for screen readers by its parent link.
 */

const PATHS: Record<SocialLink["icon"], string> = {
  instagram:
    "M4 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm3.6-.9a.6.6 0 1 0 0 1.2.6.6 0 0 0 0-1.2Z",
  youtube: "M1.5 4.5h13v7h-13v-7Zm5 1.6v3.8l3.4-1.9-3.4-1.9Z",
  x: "M2 2h3.2l3.1 4.2L11.8 2H14l-4.6 5.6L14.4 14h-3.2L7.8 9.4 4.1 14H2l4.9-6L2 2Z",
  tiktok:
    "M9.4 1.5h2c.2 1.5 1.1 2.6 2.6 2.8v2c-1 0-1.9-.3-2.6-.8v4.3a4 4 0 1 1-4-4c.2 0 .4 0 .6.1v2.1a2 2 0 1 0 1.4 1.9V1.5Z",
  rss: "M3 11a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 6.5a7.5 7.5 0 0 1 7.5 7.5H8A5 5 0 0 0 3 9V6.5ZM3 2a12 12 0 0 1 12 12h-2.5A9.5 9.5 0 0 0 3 4.5V2Z",
};

export function SocialIcon({ icon, className }: { icon: SocialLink["icon"]; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-4", className)}
    >
      <path d={PATHS[icon]} />
    </svg>
  );
}
