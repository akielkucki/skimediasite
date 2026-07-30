import { RailAdSlot } from "@/components/ads/ad-slot";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Wide editorial layout.
 *
 * Below the `wide` breakpoint (96rem) this is a plain block — the rails don't
 * render at all, so nothing is squeezed and no space is reserved. At and above
 * it, the margins that would otherwise be dead space carry the rail
 * placements. If either rail is disabled or unfilled it collapses and the
 * content simply centres.
 */
export function WideLayout({
  children,
  className,
  rails = true,
}: {
  children: ReactNode;
  className?: string;
  rails?: boolean;
}) {
  if (!rails) return <div className={className}>{children}</div>;

  return (
    <div className={cn("wide:flex wide:justify-center wide:gap-10", className)}>
      <RailAdSlot placement="editorial-rail-left" />
      <div className="min-w-0 flex-1 wide:max-w-[76rem]">{children}</div>
      <RailAdSlot placement="editorial-rail-right" />
    </div>
  );
}
