import Link from "next/link";
import { ArticleCard } from "./article-card";
import { ActiveFilters, CategoryFilter, type FilterOption } from "./filters";
import { AdSlot } from "@/components/ads/ad-slot";
import { WideLayout } from "@/components/layout/wide-layout";
import { EditorialRule, Reveal, StaggerGroup, StaggerItem } from "@/components/motion/primitives";
import { MaskIn } from "@/components/motion/on-load";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Kicker, Tag } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import type { Article, Paginated } from "@/types/content";

/**
 * Shared index view for /news and /blog.
 *
 * Both routes share the machinery — filters, pagination, empty states — but
 * pass different `tone`s: `news` is dense and information-first, `blog` gives
 * each story more air and leads with the numbered editorial index.
 *
 * Pagination is URL-driven ("load more" is a link to `?page=2`), so it works
 * without JavaScript, is crawlable, and every state is a shareable URL.
 */
export function ArticleIndex({
  basePath,
  kicker,
  title,
  standfirst,
  featured,
  results,
  categories,
  activeCategory,
  activeTag,
  query,
  page,
  perPage,
  tone = "news",
  tags,
}: {
  basePath: string;
  kicker: string;
  title: string;
  standfirst: string;
  featured: Article | null;
  results: Paginated<Article>;
  categories: FilterOption[];
  activeCategory?: string;
  activeTag?: string;
  query?: string;
  page: number;
  perPage: number;
  tone?: "news" | "blog";
  tags: string[];
}) {
  const blog = tone === "blog";
  const nextPageHref = buildHref(basePath, {
    category: activeCategory,
    tag: activeTag,
    q: query,
    page: page + 1,
  });

  return (
    <>
      {/* ── Masthead ─────────────────────────────────────────────────── */}
      <section className="gutter border-b border-steel/20 pb-10 pt-16 sm:pt-24">
        <div className="flex flex-col gap-5">
          <Kicker accent>{kicker}</Kicker>
          <MaskIn>
            <h1
              className={cn(
                "display text-ice",
                blog ? "text-[clamp(3rem,10vw,7.5rem)]" : "text-[clamp(2.75rem,8vw,6rem)]",
              )}
            >
              {title}
            </h1>
          </MaskIn>
          <p className="max-w-2xl text-pretty leading-relaxed text-mist">{standfirst}</p>
        </div>
      </section>

      <WideLayout className="gutter py-12">
        {/* ── Featured story ─────────────────────────────────────────── */}
        {featured && page === 1 && !activeCategory && !activeTag && !query ? (
          <>
            <Reveal className="mb-14">
              <ArticleCard article={featured} variant="wide" preload />
            </Reveal>
            <EditorialRule className="mb-12" />
          </>
        ) : null}

        {/* ── Filters ────────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-5">
          <CategoryFilter
            basePath={basePath}
            options={categories}
            active={activeCategory}
            searchQuery={query}
          />
          <ActiveFilters
            basePath={basePath}
            category={activeCategory}
            tag={activeTag}
            query={query}
            total={results.total}
          />
        </div>

        {/* ── Results ────────────────────────────────────────────────── */}
        {results.items.length > 0 ? (
          <StaggerGroup
            as="div"
            className={cn(
              "grid gap-x-8 gap-y-14",
              blog ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {results.items.map((article, i) => (
              <StaggerItem key={article._id}>
                <ArticleCard article={article} index={blog ? i : undefined} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState
            title={query ? `Nothing matches “${query}”` : "No stories here yet"}
            description={
              query
                ? "Try a broader term, or clear the filters to see everything we've published."
                : "Nothing has been published in this section. Check back, or browse the full archive."
            }
            action={
              <ButtonLink href={basePath} variant="secondary">
                Clear filters
              </ButtonLink>
            }
          />
        )}

        {/* ── Pagination ─────────────────────────────────────────────── */}
        {results.hasMore ? (
          <div className="mt-16 flex flex-col items-center gap-3">
            <ButtonLink href={nextPageHref} variant="secondary" size="lg">
              Load {Math.min(perPage, results.total - results.items.length)} more
            </ButtonLink>
            {/* `?page=N` widens the window rather than replacing it, so the
                already-read stories stay on screen when more are loaded. */}
            <p className="text-xs text-steel">
              Showing {results.items.length} of {results.total}
            </p>
          </div>
        ) : null}

        <AdSlot placement="index-inline" className="mt-20" />

        {/* ── Topic tags ─────────────────────────────────────────────── */}
        {tags.length > 0 ? (
          <section
            aria-labelledby="topics-heading"
            className="mt-20 border-t border-steel/20 pt-10"
          >
            <h2 id="topics-heading" className="kicker mb-5 text-steel">
              Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  href={buildHref(basePath, { tag, q: query })}
                  className={activeTag === tag ? "border-accent text-accent" : undefined}
                >
                  {tag}
                </Tag>
              ))}
              {activeTag ? (
                <Link href={basePath} className="kicker px-2.5 py-1.5 text-accent underline">
                  Clear
                </Link>
              ) : null}
            </div>
          </section>
        ) : null}
      </WideLayout>
    </>
  );
}

function buildHref(basePath: string, params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== 1) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
