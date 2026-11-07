import type { AdPlacementKey } from "@/config/site";

/**
 * Google AdSense ad-unit ids, per placement.
 *
 * Each slot reads `ADSENSE_SLOT_<PLACEMENT>` (e.g. `ADSENSE_SLOT_GLOBAL_FOOTER`)
 * and falls back to `ADSENSE_SLOT_DEFAULT`, so one responsive display unit
 * can fill every slot until you want per-slot reporting. Read on the server
 * only; the id reaches the browser as part of the rendered `<ins>` tag.
 */
export function adsenseSlotFor(placement: AdPlacementKey): string | null {
  const key = `ADSENSE_SLOT_${placement.toUpperCase().replace(/-/g, "_")}`;
  const id = process.env[key] || process.env.ADSENSE_SLOT_DEFAULT;
  return id && /^\d+$/.test(id) ? id : null;
}
