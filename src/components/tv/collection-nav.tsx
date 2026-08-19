import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The TV sub-navigation, driven by `siteConfig.tvNav`. A Server Component —
 * the active state comes from the rendered route, not client state.
 */
export function TvCollectionNav({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav
      aria-label="TV collections"
      className="gutter no-scrollbar sticky top-[4.25rem] z-30 flex gap-2 overflow-x-auto border-y border-steel/20 bg-void/92 py-3 backdrop-blur-md"
    >
      {siteConfig.tvNav.map((item) => {
        const slug = item.href.split("/tv/collections/")[1];
        const active = slug ? activeSlug === slug : !activeSlug;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "true" : undefined}
            className={cn(
              "kicker flex min-h-11 shrink-0 items-center border px-4 transition-colors",
              active
                ? "border-accent bg-accent/10 text-accent"
                : "border-steel/35 text-mist hover:border-ice hover:text-ice",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
