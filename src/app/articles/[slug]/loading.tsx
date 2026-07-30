import { Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="gutter py-16 sm:py-24">
      <span className="sr-only">Loading story</span>
      <div className="mx-auto flex max-w-4xl flex-col gap-5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-9 w-64" />
      </div>
      <Skeleton className="mx-auto mt-10 aspect-[16/9] w-full max-w-6xl" />
      <div className="mx-auto mt-14 flex max-w-[42rem] flex-col gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={i % 4 === 3 ? "h-4 w-2/3" : "h-4 w-full"} />
        ))}
      </div>
    </div>
  );
}
