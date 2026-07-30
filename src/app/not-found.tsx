import { ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="gutter flex min-h-[70svh] flex-col justify-center py-24">
      <Kicker accent>Error 404</Kicker>
      <h1 className="display mt-5 text-[clamp(3rem,12vw,9rem)] leading-[0.82] text-ice">
        Off piste
      </h1>
      <p className="mt-6 max-w-md text-pretty leading-relaxed text-mist">
        There&rsquo;s nothing at this address. The story may have moved, or the link may have been
        mistyped.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Back to the homepage</ButtonLink>
        <ButtonLink href="/news" variant="secondary">
          Latest news
        </ButtonLink>
        <ButtonLink href="/tv" variant="secondary">
          Browse TV
        </ButtonLink>
      </div>

      {/* Contour motif — the same visual language as the empty state. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 90"
        className="mt-16 w-full max-w-lg text-steel/30"
        fill="none"
        stroke="currentColor"
      >
        <path d="M0 78 Q80 20 170 52 T400 26" />
        <path d="M0 88 Q80 34 170 64 T400 40" />
        <path d="M0 98 Q80 48 170 76 T400 54" />
      </svg>
    </div>
  );
}
