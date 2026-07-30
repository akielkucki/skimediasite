import Image from "next/image";
import { cn, formatDate } from "@/lib/utils";
import type { Author } from "@/types/content";

/**
 * Author byline. `full` is the biography block at the foot of an article;
 * the default is the compact byline that sits under the headline.
 */
export function AuthorByline({
  author,
  publishedAt,
  updatedAt,
  readingTime,
  variant = "compact",
  tone = "dark",
  className,
}: {
  author: Author;
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  variant?: "compact" | "full";
  tone?: "dark" | "light";
  className?: string;
}) {
  const muted = tone === "dark" ? "text-mist" : "text-slate";
  const strong = tone === "dark" ? "text-ice" : "text-ink";

  if (variant === "full") {
    return (
      <aside
        className={cn(
          "flex flex-col gap-4 border-t pt-8 sm:flex-row sm:gap-6",
          tone === "dark" ? "border-steel/25" : "border-ink/15",
          className,
        )}
      >
        {author.image ? (
          <Image
            src={author.image.src}
            alt={author.image.alt}
            width={96}
            height={96}
            className="size-20 shrink-0 object-cover grayscale"
          />
        ) : null}
        <div className="flex flex-col gap-2">
          <p className={cn("display text-xl", strong)}>{author.name}</p>
          {author.role ? <p className={cn("kicker", muted)}>{author.role}</p> : null}
          {author.bio ? (
            <p className={cn("max-w-prose text-sm leading-relaxed", muted)}>{author.bio}</p>
          ) : null}
        </div>
      </aside>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 text-sm", muted, className)}>
      {author.image ? (
        <Image
          src={author.image.src}
          alt=""
          width={40}
          height={40}
          className="size-9 shrink-0 object-cover grayscale"
        />
      ) : null}
      <span>
        By <span className={cn("font-medium", strong)}>{author.name}</span>
        {author.role ? <span className="hidden sm:inline">, {author.role}</span> : null}
      </span>
      {publishedAt ? (
        <>
          <span aria-hidden="true">·</span>
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </>
      ) : null}
      {updatedAt ? (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
          </span>
        </>
      ) : null}
      {readingTime ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{readingTime} min read</span>
        </>
      ) : null}
    </div>
  );
}
