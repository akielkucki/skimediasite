import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Category / tag filters.
 *
 * Rendered on the server as plain links that carry the current query string.
 * That keeps the filtered state in the URL (shareable, back-button friendly,
 * indexable) and ships zero client JavaScript for the interaction.
 */

export type FilterOption = { slug: string; label: string; count?: number };

export function CategoryFilter({
  basePath,
  options,
  active,
  searchQuery,
  className,
  label = "Filter by category",
}: {
  basePath: string;
  options: FilterOption[];
  active?: string;
  /** Preserved across filter changes so a search isn't lost on click. */
  searchQuery?: string;
  className?: string;
  label?: string;
}) {
  const href = (category?: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (searchQuery) params.set("q", searchQuery);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav aria-label={label} className={cn("flex flex-wrap items-center gap-2", className)}>
      <FilterPill href={href()} active={!active}>
        All
      </FilterPill>
      {options.map((option) => (
        <FilterPill key={option.slug} href={href(option.slug)} active={active === option.slug}>
          {option.label}
          {option.count !== undefined ? (
            <span className="ml-1.5 text-steel">{option.count}</span>
          ) : null}
        </FilterPill>
      ))}
    </nav>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "kicker inline-flex items-center border px-3.5 py-2.5 transition-colors duration-200",
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-steel/35 text-mist hover:border-ice hover:text-ice",
      )}
    >
      {children}
    </Link>
  );
}

/** Small "you are viewing a filtered list" summary, with a reset affordance. */
export function ActiveFilters({
  basePath,
  category,
  tag,
  query,
  total,
}: {
  basePath: string;
  category?: string;
  tag?: string;
  query?: string;
  total: number;
}) {
  const active = [category, tag, query].filter(Boolean);
  if (active.length === 0) return null;

  return (
    <p className="flex flex-wrap items-center gap-3 text-sm text-mist">
      <span>
        <strong className="font-semibold text-ice">{total}</strong>{" "}
        {total === 1 ? "story" : "stories"}
        {query ? (
          <>
            {" "}
            matching <span className="text-ice">“{query}”</span>
          </>
        ) : null}
        {tag ? (
          <>
            {" "}
            tagged <span className="text-ice">{tag}</span>
          </>
        ) : null}
      </span>
      <Link href={basePath} className="kicker text-accent underline-offset-4 hover:underline">
        Clear filters
      </Link>
    </p>
  );
}
