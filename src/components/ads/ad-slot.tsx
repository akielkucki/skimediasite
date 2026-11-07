import Image from "next/image";
import Link from "next/link";
import { AdsenseUnit } from "./adsense-unit";
import { TrackedLink } from "@/components/analytics/trackers";
import { siteConfig, type AdPlacementKey } from "@/config/site";
import { adsenseSlotFor } from "@/lib/ads";
import { getPromotion, googleAdsAllowed, isAdSlotEnabled } from "@/lib/cms";
import { isProduction } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { Promotion } from "@/types/content";

/**
 * Advertisement / promotional placement.
 *
 * What fills a slot, in order:
 *
 *   1. a brand banner (`promotion`) scheduled for it in the backend
 *   2. Google AdSense, when a publisher id + ad unit id are configured
 *   3. in development only, a labelled placeholder showing where the slot is
 *   4. otherwise nothing at all
 *
 * …and it renders nothing when `siteConfig.ads.enabled === false` or the slot
 * is switched off (in site.ts or in the backend's Site settings).
 *
 * "Nothing" means no wrapper, no label and no reserved height, so a disabled
 * slot leaves no gap behind. Spacing lives on the slot markup rather than on
 * a container in the page, which is why an absent slot is invisible.
 *
 * Sizes come from config and are applied as an aspect box, so a creative
 * loading in never shifts the page.
 */

type Fill =
  | { kind: "promotion"; promotion: Promotion }
  | { kind: "adsense"; client: string; slot: string }
  | { kind: "placeholder" };

async function resolveFill(placement: AdPlacementKey): Promise<Fill | null> {
  if (!siteConfig.ads.enabled) return null;
  if (!(await isAdSlotEnabled(placement))) return null;

  const promotion = await getPromotion(placement);
  if (promotion) return { kind: "promotion", promotion };

  const client = siteConfig.ads.adsense.client;
  const slot = adsenseSlotFor(placement);
  if (client && slot && (await googleAdsAllowed())) return { kind: "adsense", client, slot };

  return isProduction ? null : { kind: "placeholder" };
}

function disclosureFor(fill: Fill) {
  if (fill.kind === "placeholder") return "Ad space";
  if (fill.kind === "promotion" && fill.promotion.creativeType === "house") {
    return siteConfig.ads.promoDisclosureLabel;
  }
  return siteConfig.ads.disclosureLabel;
}

export async function AdSlot({
  placement,
  className,
  /** Overrides the config label, e.g. "Promotional placement" for house promos. */
  label,
  /** "light" adapts the disclosure label for the paper reading slab. */
  tone = "dark",
}: {
  placement: AdPlacementKey;
  className?: string;
  label?: string;
  tone?: "dark" | "light";
}) {
  const fill = await resolveFill(placement);
  if (!fill) return null;

  const slot = siteConfig.ads.slots[placement];
  const disclosure = label ?? disclosureFor(fill);

  return (
    <aside
      aria-label={disclosure}
      className={cn(
        "w-full flex-col items-center gap-2",
        // `desktopOnly` placements disappear entirely on small screens so
        // monetisation never pushes the publication's own headline off the
        // first mobile viewport.
        slot.desktopOnly ? "hidden md:flex" : "flex",
        className,
      )}
    >
      {/* Steel fails 4.5:1 on the light paper slab; slate holds it. */}
      <p className={cn("kicker", tone === "light" ? "text-slate" : "text-steel")}>{disclosure}</p>
      <AdCreative
        fill={fill}
        placement={placement}
        width={slot.width}
        height={slot.height}
        mobileHeight={slot.mobileHeight}
      />
    </aside>
  );
}

/**
 * Desktop-only rail placement. Rendered inside the wide-layout margin and
 * removed entirely below the `wide` breakpoint rather than being squeezed.
 */
export async function RailAdSlot({
  placement,
  className,
}: {
  placement: AdPlacementKey;
  className?: string;
}) {
  const fill = await resolveFill(placement);
  if (!fill) return null;

  const slot = siteConfig.ads.slots[placement];
  const disclosure = disclosureFor(fill);

  return (
    <aside
      aria-label={disclosure}
      className={cn("sticky top-32 hidden w-40 shrink-0 flex-col gap-2 wide:flex", className)}
    >
      <p className="kicker text-steel">{disclosure}</p>
      <AdCreative fill={fill} placement={placement} width={slot.width} height={slot.height} rail />
    </aside>
  );
}

/* ── Creative rendering ────────────────────────────────────────────────── */

function AdCreative({
  fill,
  placement,
  width,
  height,
  mobileHeight = 104,
  rail = false,
}: {
  fill: Fill;
  placement: AdPlacementKey;
  width: number;
  height: number;
  mobileHeight?: number;
  rail?: boolean;
}) {
  let inner: React.ReactNode;
  if (fill.kind === "adsense") {
    inner = <AdsenseUnit client={fill.client} slot={fill.slot} />;
  } else if (fill.kind === "placeholder") {
    inner = <PlaceholderCreative placement={placement} width={width} height={height} />;
  } else if (fill.promotion.creativeType === "image" && fill.promotion.image) {
    inner = (
      <Image
        src={fill.promotion.image.src}
        alt={fill.promotion.image.alt || fill.promotion.headline || fill.promotion.label}
        fill
        sizes={rail ? "160px" : "(max-width: 768px) 100vw, 970px"}
        className="object-cover"
        placeholder={fill.promotion.image.blurDataURL ? "blur" : undefined}
        blurDataURL={fill.promotion.image.blurDataURL}
      />
    );
  } else {
    inner = <HouseCreative promotion={fill.promotion} rail={rail} />;
  }

  const box = (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden",
        fill.kind === "placeholder"
          ? "border border-dashed border-steel/40"
          : "border border-steel/25 bg-charcoal",
        fill.kind === "promotion" && "transition-colors duration-200 hover:border-steel/60",
        // Reserving the ratio up front is what prevents layout shift. But a
        // 970×90 leaderboard squeezed to a phone's width is ~32px tall, which
        // would clip its own creative — so below `sm` the slot reserves a
        // fixed height instead of the desktop ratio. Both reserve *something*,
        // which is what matters for CLS.
        "[aspect-ratio:var(--ad-ratio)]",
        "max-sm:min-h-[var(--ad-mobile-height)] max-sm:[aspect-ratio:auto]",
      )}
      style={
        {
          "--ad-ratio": `${width} / ${height}`,
          "--ad-mobile-height": `${mobileHeight}px`,
          maxWidth: rail ? undefined : `${width}px`,
        } as React.CSSProperties
      }
    >
      {inner}
    </div>
  );

  if (fill.kind !== "promotion" || !fill.promotion.href) return box;
  const { promotion } = fill;

  // Paid placements should not pass link equity.
  const rel = promotion.creativeType === "house" ? undefined : "sponsored nofollow";

  // Click tracking hydrates only when an analytics provider is configured;
  // otherwise the placement stays a plain server-rendered link.
  if (siteConfig.monetization.analyticsProvider) {
    return (
      <TrackedLink
        href={promotion.href!}
        className="block w-full"
        rel={rel}
        event={{
          name: "ad_slot_click",
          placement: promotion.placement,
          sponsor: promotion.sponsor?.slug,
        }}
      >
        {box}
      </TrackedLink>
    );
  }

  return (
    <Link href={promotion.href!} className="block w-full" rel={rel}>
      {box}
    </Link>
  );
}

/** Text creative for house and sponsor promos — no external script required. */
function HouseCreative({ promotion, rail }: { promotion: Promotion; rail: boolean }) {
  return (
    <div
      className={cn(
        "grain flex h-full w-full flex-col justify-center gap-1.5 bg-gradient-to-br from-graphite to-charcoal",
        rail
          ? "p-4 text-left"
          : "px-6 py-4 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-5 sm:text-left",
      )}
    >
      {promotion.sponsor ? (
        <span className="kicker text-accent">{promotion.sponsor.name}</span>
      ) : null}
      <span className="display text-balance text-lg leading-tight text-ice sm:text-xl">
        {promotion.headline}
      </span>
      {promotion.body ? (
        <span className={cn("text-xs leading-snug text-mist", rail ? "" : "sm:max-w-xs")}>
          {promotion.body}
        </span>
      ) : null}
    </div>
  );
}

/** Development-only marker for an empty slot, so the layout can be reviewed. */
function PlaceholderCreative({
  placement,
  width,
  height,
}: {
  placement: AdPlacementKey;
  width: number;
  height: number;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-3 text-center">
      <span className="kicker text-steel">
        {siteConfig.ads.slots[placement].label} · {width}×{height}
      </span>
      <span className="text-xs text-steel">
        Google ad or brand banner goes here. Visible in development only.
      </span>
    </div>
  );
}
