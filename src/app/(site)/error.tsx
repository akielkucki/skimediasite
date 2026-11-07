"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";

/**
 * Route-level error boundary. Keeps the shell intact and offers a real
 * recovery path rather than a dead end.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with a real error sink (Sentry, etc.) — see docs/INTEGRATIONS.md.
    console.error(error);
  }, [error]);

  return (
    <div className="gutter flex min-h-[70svh] flex-col justify-center py-24">
      <Kicker accent>Something broke</Kicker>
      <h1 className="display mt-5 text-[clamp(2.5rem,9vw,6rem)] leading-[0.85] text-ice">
        We lost the signal
      </h1>
      <p className="mt-6 max-w-md text-pretty leading-relaxed text-mist">
        This page failed to load. It&rsquo;s most likely temporary — try again, and if it keeps
        happening, let us know.
      </p>
      {error.digest ? (
        <p className="mt-3 text-xs text-steel">
          Reference: <code className="text-mist">{error.digest}</code>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Back to the homepage
        </ButtonLink>
        <ButtonLink href="/contact?intent=technical" variant="ghost">
          Report the problem
        </ButtonLink>
      </div>
    </div>
  );
}
