import { siteConfig } from "@/config/site";
import type { Video, VideoSource } from "@/types/content";

/**
 * Embed URLs are *derived* from structured `VideoSource` data — the CMS never
 * supplies raw embed HTML, so there is no path for arbitrary markup to reach
 * the page. Privacy-conscious hosts are used where the provider offers one.
 */

export type EmbedTarget = {
  /** iframe src, or null for sources that are played natively / off-site. */
  src: string | null;
  /** Where the viewer ends up if we can't (or shouldn't) embed. */
  externalUrl: string | null;
  allow: string;
  /** Referrer policy applied to the iframe. */
  referrerPolicy: "strict-origin-when-cross-origin" | "no-referrer";
  providerLabel: string;
};

const IFRAME_ALLOW =
  "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";

/**
 * `autoplay` is only ever passed after an explicit user gesture (a click on
 * the play facade). Nothing on the site autoplays on load, and nothing
 * autoplays with sound before that click.
 */
export function resolveEmbed(
  source: VideoSource,
  opts: { autoplay?: boolean; muted?: boolean } = {},
): EmbedTarget {
  const autoplay = opts.autoplay ? "1" : "0";
  const muted = opts.muted ? "1" : "0";

  switch (source.provider) {
    case "youtube": {
      // youtube-nocookie.com defers cookie/tracking until playback begins.
      const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
        autoplay,
        mute: muted,
      });
      if (source.startAt) params.set("start", String(source.startAt));
      return {
        src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(source.videoId)}?${params}`,
        externalUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(source.videoId)}`,
        allow: IFRAME_ALLOW,
        referrerPolicy: "strict-origin-when-cross-origin",
        providerLabel: "YouTube",
      };
    }

    case "vimeo": {
      // `dnt=1` asks Vimeo not to track the session.
      const params = new URLSearchParams({
        dnt: "1",
        title: "0",
        byline: "0",
        portrait: "0",
        autoplay,
        muted,
      });
      if (source.hash) params.set("h", source.hash);
      return {
        src: `https://player.vimeo.com/video/${encodeURIComponent(source.videoId)}?${params}`,
        externalUrl: `https://vimeo.com/${encodeURIComponent(source.videoId)}`,
        allow: IFRAME_ALLOW,
        referrerPolicy: "strict-origin-when-cross-origin",
        providerLabel: "Vimeo",
      };
    }

    case "hosted":
      // Played by the native <video> element — no iframe, no third party.
      return {
        src: null,
        externalUrl: source.url,
        allow: IFRAME_ALLOW,
        referrerPolicy: "no-referrer",
        providerLabel: `${siteConfig.shortName} player`,
      };

    case "external":
      // Deliberately not embedded: we link out rather than iframe an unknown host.
      return {
        src: null,
        externalUrl: source.url,
        allow: IFRAME_ALLOW,
        referrerPolicy: "no-referrer",
        providerLabel: source.label ?? "External site",
      };
  }
}

/** Canonical watch URL for schema.org / share controls. */
export function embedUrlFor(source: VideoSource) {
  return resolveEmbed(source).src ?? resolveEmbed(source).externalUrl ?? undefined;
}

/* ── Production ownership labelling ───────────────────────────────────────
 * Viewers should always be able to tell what we made from what we didn't.
 * These strings are the single source of truth for that disclosure.
 * ──────────────────────────────────────────────────────────────────────── */

export const OWNERSHIP_LABELS: Record<
  Video["ownership"],
  { short: string; long: string; tone: "original" | "shared" | "third-party" }
> = {
  original: {
    short: "Original",
    long: "Produced in-house by our film team.",
    tone: "original",
  },
  "co-production": {
    short: "Co-production",
    long: "Made in partnership with an outside production company. Editorial control was shared.",
    tone: "shared",
  },
  partner: {
    short: "Partner content",
    long: "Supplied by a partner brand or production house. We selected and programmed it; we did not produce it.",
    tone: "shared",
  },
  licensed: {
    short: "Licensed",
    long: "Licensed for distribution on this platform. Rights remain with the original producer.",
    tone: "third-party",
  },
  embedded: {
    short: "Embedded",
    long: "Hosted by a third party and embedded here. Playback is served by the original publisher.",
    tone: "third-party",
  },
};
