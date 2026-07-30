"use client";

import Image from "next/image";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { cn, formatDuration } from "@/lib/utils";
import { resolveEmbed } from "@/lib/video";
import type { CaptionTrack, ImageAsset, VideoSource } from "@/types/content";

/**
 * The unified media player.
 *
 * One visual wrapper around four very different sources. It deliberately does
 * NOT reimplement playback: YouTube and Vimeo get their own accessible
 * players, and first-party files get the native `<video>` controls, which are
 * better tested with screen readers and system captions than anything we'd
 * build here.
 *
 * What the wrapper does add:
 *   • A click-to-load facade, so no third-party player JS is fetched until the
 *     viewer actually asks for it (big win for LCP and for privacy).
 *   • A fixed aspect box, so the page never shifts when the player appears.
 *   • Consistent labelling, captions wiring, and an honest failure state.
 */
export function MediaPlayer({
  source,
  title,
  poster,
  captions,
  duration,
  className,
  tone = "dark",
  /** Sets the facade image as an LCP candidate on detail pages. */
  priority = false,
  slug,
  ownership,
}: {
  source: VideoSource;
  title: string;
  poster?: ImageAsset;
  captions?: CaptionTrack[];
  duration?: number;
  className?: string;
  tone?: "dark" | "light";
  priority?: boolean;
  slug?: string;
  ownership?: string;
}) {
  const [activated, setActivated] = useState(false);
  const [failed, setFailed] = useState(false);
  const embed = resolveEmbed(source, { autoplay: activated, muted: false });

  const activate = () => {
    setActivated(true);
    track({
      name: "video_play",
      slug: slug ?? title,
      provider: source.provider,
      ownership: ownership ?? "unknown",
    });
  };

  /* ── external: we link out rather than iframe an unknown host ─────────── */
  if (source.provider === "external") {
    return (
      <Frame className={className} tone={tone}>
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="kicker text-mist">Hosted by {embed.providerLabel}</p>
          <p className="display max-w-lg text-balance text-2xl text-ice">{title}</p>
          <p className="max-w-md text-sm text-mist">
            This film is published elsewhere and is not embedded here. The link opens the original
            publisher&rsquo;s site.
          </p>
          <a
            href={embed.externalUrl ?? "#"}
            rel="noopener noreferrer"
            target="_blank"
            className="mt-2 inline-flex h-11 items-center bg-ice px-6 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-void transition-colors hover:bg-accent"
          >
            Watch on {embed.providerLabel}
          </a>
        </div>
      </Frame>
    );
  }

  /* ── hosted: native <video>, with captions ────────────────────────────── */
  if (source.provider === "hosted") {
    if (failed) return <Unavailable className={className} tone={tone} title={title} />;
    return (
      <Frame className={className} tone={tone}>
        {/* Caption tracks are rendered below from `captions`. */}
        <video
          className="h-full w-full bg-black"
          controls
          preload="metadata"
          playsInline
          poster={poster?.src}
          aria-label={title}
          title={title}
          onPlay={() =>
            track({
              name: "video_play",
              slug: slug ?? title,
              provider: "hosted",
              ownership: ownership ?? "unknown",
            })
          }
          onError={() => setFailed(true)}
        >
          <source src={source.url} type={source.mimeType ?? "video/mp4"} />
          {captions?.map((c) => (
            <track
              key={c.src}
              src={c.src}
              kind={c.kind ?? "captions"}
              srcLang={c.srcLang}
              label={c.label}
              default={c.default}
            />
          ))}
          <p className="p-6 text-sm text-mist">
            Your browser can&rsquo;t play this video.{" "}
            <a href={source.url} className="underline">
              Download the file
            </a>{" "}
            instead.
          </p>
        </video>
      </Frame>
    );
  }

  /* ── youtube / vimeo: facade → iframe ─────────────────────────────────── */
  if (!embed.src) return <Unavailable className={className} tone={tone} title={title} />;

  return (
    <Frame className={className} tone={tone}>
      {activated ? (
        <iframe
          src={embed.src}
          title={title}
          className="h-full w-full border-0"
          allow={embed.allow}
          allowFullScreen
          referrerPolicy={embed.referrerPolicy}
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={activate}
          className="group relative h-full w-full cursor-pointer overflow-hidden text-left"
        >
          <span className="sr-only">
            Play {title} ({embed.providerLabel})
          </span>
          {poster ? (
            <Image
              src={poster.src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              placeholder={poster.blurDataURL ? "blur" : undefined}
              blurDataURL={poster.blurDataURL}
              priority={priority}
              className="object-cover transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 bg-gradient-to-br from-graphite to-void" />
          )}
          <span className="absolute inset-0 bg-void/35 transition-colors group-hover:bg-void/20" />

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-20 items-center justify-center border border-ice/60 bg-void/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-focus-visible:border-accent">
              <PlayGlyph className="ml-1 size-7 text-ice transition-colors group-hover:text-void" />
            </span>
          </span>

          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
            <span className="kicker bg-void/80 px-2.5 py-1.5 text-ice backdrop-blur-sm">
              {embed.providerLabel}
            </span>
            {duration ? (
              <span className="kicker bg-void/80 px-2.5 py-1.5 text-ice backdrop-blur-sm">
                {formatDuration(duration)}
              </span>
            ) : null}
          </span>
        </button>
      )}
    </Frame>
  );
}

/* ── Shared chrome ─────────────────────────────────────────────────────── */

function Frame({
  children,
  className,
  tone,
}: {
  children: React.ReactNode;
  className?: string;
  tone: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden",
        tone === "dark" ? "border border-steel/25 bg-charcoal" : "bg-charcoal",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Unavailable({
  title,
  className,
  tone,
}: {
  title: string;
  className?: string;
  tone: "dark" | "light";
}) {
  return (
    <Frame className={className} tone={tone}>
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="kicker text-accent">Unavailable</p>
        <p className="display text-xl text-ice">{title}</p>
        <p className="max-w-sm text-sm text-mist">
          This video can&rsquo;t be played right now. It may have been removed by its publisher, or
          the source may be misconfigured.
        </p>
      </div>
    </Frame>
  );
}

export function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6 3.5 20 12 6 20.5V3.5Z" />
    </svg>
  );
}
