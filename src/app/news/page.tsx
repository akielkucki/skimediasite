import type { Metadata } from "next";
import { ArticleIndex } from "@/components/editorial/article-index";
import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

const PER_PAGE = 9;
const KINDS = ["news", "feature"] as const;

export const metadata: Metadata = pageMetadata({
  title: "Skiing news",
  description:
    "Reporting on snow conditions, resorts, competition, safety, the environment and the business of skiing.",
  path: "/news",
});

export default async function NewsPage({ searchParams }: PageProps<"/news">) {
  const params = await searchParams;
  const category = single(params.category);
  const tag = single(params.tag);
  const query = single(params.q);
  const page = Math.max(1, Number(single(params.page) ?? 1) || 1);

  // Featured story is only fetched for the unfiltered first page.
  const unfiltered = page === 1 && !category && !tag && !query;
  const featuredResult = unfiltered ? await getArticles({ kind: [...KINDS], limit: 1 }) : null;
  const featured = featuredResult?.items[0] ?? null;

  const results = await getArticles({
    kind: [...KINDS],
    category,
    tag,
    search: query,
    limit: page * PER_PAGE,
    excludeIds: featured ? [featured._id] : [],
  });

  const all = await getArticles({ kind: [...KINDS] });
  const tags = [...new Set(all.items.flatMap((a) => a.tags))].sort().slice(0, 18);

  const categories = siteConfig.categories.news.map((c) => ({
    ...c,
    count: all.items.filter((a) => a.category.slug === c.slug).length,
  }));

  return (
    <ArticleIndex
      basePath="/news"
      kicker="The newsroom"
      title="Skiing news"
      standfirst="Snow, safety, competition and the business of the mountains — filed as it happens, and followed up when it matters."
      featured={featured}
      results={results}
      categories={categories.filter((c) => c.count > 0)}
      activeCategory={category}
      activeTag={tag}
      query={query}
      page={page}
      perPage={PER_PAGE}
      tone="news"
      tags={tags}
    />
  );
}

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
