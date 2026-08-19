import Image from "next/image";
import { Fragment } from "react";
import { MediaPlayer } from "@/components/tv/media-player";
import { AdSlot } from "@/components/ads/ad-slot";
import { cn } from "@/lib/utils";
import type { RichTextBlock, RichTextSpan } from "@/types/content";

/**
 * Renders an article body.
 *
 * Blocks are a closed union, so there is no path for arbitrary HTML from the
 * CMS to reach the page — links become `<a>`, images become `<Image>`, and a
 * video block becomes the same provider-aware `<MediaPlayer>` used on /tv.
 *
 * `adAfterBlock` injects one in-article placement after the given block index,
 * which is how ads land inside the copy without the content model knowing
 * anything about advertising.
 */
export function RichText({
  blocks,
  adAfterBlock,
  className,
}: {
  blocks: RichTextBlock[];
  adAfterBlock?: number;
  className?: string;
}) {
  return (
    <div className={cn("prose-editorial", className)}>
      {blocks.map((block, index) => (
        <Fragment key={block._key}>
          <Block block={block} />
          {adAfterBlock === index ? (
            <div className="not-prose my-12 border-y border-ink/10 py-6">
              <AdSlot placement="article-inline" tone="light" />
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

function Block({ block }: { block: RichTextBlock }) {
  switch (block._type) {
    case "paragraph":
      return (
        <p>
          <Spans spans={block.text} />
        </p>
      );

    case "heading": {
      const Tag = block.level === 2 ? "h2" : "h3";
      return (
        <Tag
          className={cn(
            "display mt-14 leading-[0.95] text-ink",
            block.level === 2
              ? "text-[clamp(1.6rem,3.4vw,2.25rem)]"
              : "text-[clamp(1.3rem,2.6vw,1.6rem)]",
          )}
        >
          {block.text}
        </Tag>
      );
    }

    case "pullQuote":
      return (
        <figure className="my-12 border-l-2 border-accent pl-6 sm:pl-8">
          <blockquote className="display text-balance leading-[1.02] text-[clamp(1.5rem,3.4vw,2.25rem)] text-ink">
            {block.quote}
          </blockquote>
          {block.attribution ? (
            <figcaption className="mt-4 font-sans text-xs uppercase tracking-[0.16em] text-slate">
              {block.attribution}
            </figcaption>
          ) : null}
        </figure>
      );

    case "image":
      return (
        <figure className="my-12">
          <div className="relative aspect-[16/9] overflow-hidden bg-charcoal">
            <Image
              src={block.image.src}
              alt={block.image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              placeholder={block.image.blurDataURL ? "blur" : undefined}
              blurDataURL={block.image.blurDataURL}
              className="object-cover"
            />
          </div>
          {block.image.caption || block.image.credit ? (
            <figcaption className="mt-3 flex flex-wrap gap-x-3 font-sans text-xs leading-relaxed text-slate">
              {block.image.caption ? <span>{block.image.caption}</span> : null}
              {block.image.credit ? <span className="text-slate">{block.image.credit}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      );

    case "video":
      return (
        <figure className="my-12">
          <MediaPlayer
            source={block.source}
            title={block.title}
            poster={block.poster}
            tone="light"
          />
          <figcaption className="mt-3 font-sans text-xs text-slate">{block.title}</figcaption>
        </figure>
      );

    case "list": {
      const Tag = block.style === "number" ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "my-8 flex flex-col gap-3 pl-6",
            block.style === "number" ? "list-decimal" : "list-disc",
          )}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1 marker:text-accent">
              <Spans spans={item} />
            </li>
          ))}
        </Tag>
      );
    }

    case "divider":
      return <hr className="my-14 border-0 border-t border-ink/15" />;
  }
}

function Spans({ spans }: { spans: RichTextSpan[] }) {
  return (
    <>
      {spans.map((span, i) => {
        let node = <>{span.text}</>;
        if (span.bold) node = <strong className="font-semibold">{node}</strong>;
        if (span.italic) node = <em>{node}</em>;
        if (span.href) {
          const external = /^https?:\/\//.test(span.href);
          node = (
            <a
              href={span.href}
              {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
            >
              {node}
            </a>
          );
        }
        return <Fragment key={i}>{node}</Fragment>;
      })}
    </>
  );
}
