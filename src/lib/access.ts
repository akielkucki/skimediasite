import { siteConfig, type AccessLevel } from "@/config/site";

/**
 * Dormant monetization foundation.
 *
 * Content models already carry `accessLevel`, sponsors and promotions already
 * carry campaign windows — but nothing is gated. `siteConfig.monetization
 * .gatingEnabled` is the single switch that would turn this on, and while it
 * is false this function always grants access.
 *
 * Deliberately no fake lock UI is shown anywhere in the app. See
 * docs/MONETIZATION.md for how to extend this into a real subscription check.
 */

export type Viewer = {
  /** Reserved: populated by an auth layer that does not exist yet. */
  isAuthenticated: boolean;
  entitlements: AccessLevel[];
};

export const ANONYMOUS_VIEWER: Viewer = {
  isAuthenticated: false,
  entitlements: ["free"],
};

export type AccessDecision =
  { status: "granted" } | { status: "requires-registration" } | { status: "requires-subscription" };

export function resolveAccess(
  level: AccessLevel = "free",
  viewer: Viewer = ANONYMOUS_VIEWER,
): AccessDecision {
  // Launch behaviour: everything is free, full stop.
  if (!siteConfig.monetization.gatingEnabled) return { status: "granted" };
  if (level === "free") return { status: "granted" };
  if (viewer.entitlements.includes(level)) return { status: "granted" };
  return level === "registered"
    ? { status: "requires-registration" }
    : { status: "requires-subscription" };
}

export function isFullyAccessible(level: AccessLevel = "free") {
  return resolveAccess(level).status === "granted";
}
