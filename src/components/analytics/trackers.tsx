"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * Client-side analytics hooks.
 *
 * These components are only rendered when an analytics provider is configured
 * (`siteConfig.monetization.analyticsProvider`), so with analytics off they
 * cost nothing — no hydration, no listeners, no bundle bytes on the page.
 * No personal data is collected: events carry routes, slugs and placement
 * names only.
 */

/** Fires a `page_view` on every route change. Rendered once in the layout. */
export function RouteTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track({ name: "page_view", path: pathname });
  }, [pathname]);
  return null;
}

/** Fires a single content-view event on mount (article/video detail pages). */
export function ContentViewTracker({ event }: { event: AnalyticsEvent }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event);
  }, [event]);
  return null;
}

/** A link that reports a click event (sponsor clicks, ad interactions). */
export function TrackedLink({
  event,
  href,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  event: AnalyticsEvent;
  children: ReactNode;
}) {
  const external = /^https?:\/\//.test(href);
  const onClick = () => track(event);
  if (external) {
    const { className, rel, target } = props as ComponentProps<"a">;
    return (
      <a href={href} onClick={onClick} className={className} rel={rel} target={target}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
