import type { Metadata } from "next";
import { ArticleIndex } from "@/components/editorial/article-index";
import { siteConfig } from "@/config/site";
import { getArticleFacets, getArticles } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

const PER_PAGE = 8;
const KINDS = ["blog", "opinion"] as const;

export const metadata: Metadata = pageMetadata({
  title: "Blog & opinion",
  description: "Columns, arguments and reported essays on ski culture, gear, travel and technique.",
  path: "/blog",
});

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const params = await searchParams;
  const category = single(params.category);
  const tag = single(params.tag);
  const query = single(params.q);
  const page = Math.max(1, Number(single(params.page) ?? 1) || 1);

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

  const facets = await getArticleFacets([...KINDS]);
  const tags = facets.tags.slice(0, 18);

  const categories = siteConfig.categories.blog.map((c) => ({
    ...c,
    count: facets.categoryCounts[c.slug] ?? 0,
  }));

  return (
    <ArticleIndex
      basePath="/blog"
      kicker="Columns & essays"
      title="The Blog"
      standfirst="Arguments, obsessions and reported essays. Where the newsroom writes in the first person and takes a position."
      featured={featured}
      results={results}
      categories={categories.filter((c) => c.count > 0)}
      activeCategory={category}
      activeTag={tag}
      query={query}
      page={page}
      perPage={PER_PAGE}
      tone="blog"
      tags={tags}
    />
  );
}

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
