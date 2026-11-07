import type { Metadata } from "next";
import { VideoCard } from "@/components/tv/video-card";
import { EmptyState, Kicker } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { searchVideos } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Search — ${siteConfig.shortName} TV`,
  description: "Search films, series and edits on the TV platform.",
  path: "/tv/search",
  seo: { noIndex: true },
});

/**
 * TV search results. The only request-rendered page in the TV experience —
 * everything browsable is static, and this one stays small.
 */
export default async function TvSearchPage({ searchParams }: PageProps<"/tv/search">) {
  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  const matches = query ? await searchVideos(query) : [];

  return (
    <div className="gutter py-20 sm:py-28">
      <Kicker accent>{siteConfig.shortName} TV</Kicker>
      <h1 className="display mt-4 text-[clamp(2.25rem,6vw,4rem)] text-ice">
        {query
          ? `${matches.length} ${matches.length === 1 ? "result" : "results"} for “${query}”`
          : "Search the platform"}
      </h1>
      <div className="mt-10">
        {matches.length > 0 ? (
          <div className="flex flex-wrap gap-x-6 gap-y-10">
            {matches.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={query ? "Nothing matches that" : "Type a search to get started"}
            description={
              query
                ? "Try a broader term, a category, or browse the programmed rows."
                : "Use the search control in the header, or browse the programmed rows."
            }
            action={<ButtonLink href="/tv">Back to TV</ButtonLink>}
          />
        )}
      </div>
    </div>
  );
}
