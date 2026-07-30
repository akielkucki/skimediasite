import { CardSkeleton, Skeleton } from "@/components/ui/primitives";

/**
 * Root loading state.
 *
 * Mirrors the real page's rhythm — a tall hero block, a heading, then a card
 * grid — so the transition into content doesn't jump.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-[70svh] w-full" />
      <div className="gutter py-16">
        <Skeleton className="mb-4 h-3 w-24" />
        <Skeleton className="mb-10 h-10 w-72" />
        <CardSkeleton count={3} />
      </div>
    </div>
  );
}
