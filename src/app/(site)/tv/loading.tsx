import { Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading the TV platform</span>
      <Skeleton className="h-[65svh] w-full" />
      <div className="flex flex-col gap-12 py-12">
        {Array.from({ length: 2 }).map((_, row) => (
          <div key={row} className="flex flex-col gap-4">
            <div className="gutter">
              <Skeleton className="h-7 w-56" />
            </div>
            <div className="flex gap-5 px-5 md:px-10 xl:px-16">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex w-72 shrink-0 flex-col gap-3 sm:w-80">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
