"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * One Google AdSense unit, sized by the reserved box it sits in.
 *
 * Keyed on the pathname so slots that persist across client-side navigation
 * (the leaderboard and footer banner) request a fresh ad on every page.
 */
export function AdsenseUnit({ client, slot }: { client: string; slot: string }) {
  const pathname = usePathname();
  return <AdsenseIns key={pathname} client={client} slot={slot} />;
}

function AdsenseIns({ client, slot }: { client: string; slot: string }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Already filled (Strict Mode mounts twice in development) or the
      // script was blocked by an ad blocker — either way, leave the box.
    }
  }, []);

  return (
    <ins
      className="adsbygoogle absolute inset-0"
      style={{ display: "block", width: "100%", height: "100%" }}
      data-ad-client={client}
      data-ad-slot={slot}
    />
  );
}
