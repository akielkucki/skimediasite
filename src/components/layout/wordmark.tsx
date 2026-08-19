import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The masthead lockup.
 *
 * Reads entirely from `siteConfig.wordmark`. With `image` set it renders that
 * file; otherwise it stacks `wordmark.lines` into a typographic mark, so the
 * site ships with a credible masthead and zero brand assets.
 */
export function Wordmark({ className, stacked = true }: { className?: string; stacked?: boolean }) {
  const { wordmark, name, shortName } = siteConfig;

  if (wordmark.image) {
    return (
      <Link href="/" className={cn("inline-flex items-center", className)} aria-label={name}>
        <Image
          src={wordmark.image}
          alt={name}
          width={wordmark.imageWidth}
          height={wordmark.imageHeight}
          // Small, above the fold on every route: load eagerly, but leave the
          // page's single image preload to the hero.
          loading="eager"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label={name}
      className={cn(
        "group inline-flex flex-col justify-center bg-ice px-3 py-2 text-void",
        "transition-colors duration-200 hover:bg-accent",
        className,
      )}
    >
      {stacked ? (
        wordmark.lines.map((line) => (
          <span
            key={line}
            className="display block text-[1.05rem] leading-[0.84] tracking-[-0.02em] sm:text-[1.3rem]"
          >
            {line}
          </span>
        ))
      ) : (
        <span className="display block text-[1.2rem] leading-none tracking-[-0.02em]">
          {shortName}
        </span>
      )}
    </Link>
  );
}
