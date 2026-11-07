import type { Metadata } from "next";
import { NextStudio } from "next-sanity/studio";
import config from "~/sanity.config";
import { Kicker } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { isCmsConfigured } from "@/lib/cms/client";

/**
 * The backend panel: Sanity Studio, mounted at /studio.
 *
 * Every Studio sub-route (`/studio/structure/article;…`) lands on this one
 * page; the Studio does its own client-side routing from there. Sign-in is
 * handled by Sanity — only people invited to the Sanity project can edit.
 *
 * Outside the (site) route group on purpose: no header, footer or ads.
 */

export const dynamic = "force-static";

export { viewport } from "next-sanity/studio";

export const metadata: Metadata = {
  title: "Backend",
  referrer: "same-origin",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (!isCmsConfigured) return <StudioSetup />;
  return <NextStudio config={config} />;
}

/** Shown instead of the Studio until a Sanity project is connected. */
function StudioSetup() {
  const steps = [
    <>
      Create a free project at{" "}
      <a href="https://www.sanity.io/manage" className="text-ice underline underline-offset-4">
        sanity.io/manage
      </a>{" "}
      and copy its <strong className="text-ice">Project ID</strong>.
    </>,
    <>
      Add it to <code className="text-ice">.env.local</code> as{" "}
      <code className="text-ice">NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and set the same variable on
      your host), then restart the site.
    </>,
    <>
      In the Sanity project under <strong className="text-ice">API → CORS origins</strong>, add this
      site&rsquo;s address (e.g. <code className="text-ice">http://localhost:3000</code>) with{" "}
      <em>Allow credentials</em> ticked.
    </>,
    <>
      Reload this page and sign in. Invite anyone else who should edit from the project&rsquo;s{" "}
      <strong className="text-ice">Members</strong> tab.
    </>,
  ];

  return (
    <div className="gutter flex min-h-svh flex-col justify-center py-24">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <Kicker accent>{siteConfig.name} backend</Kicker>
        <h1 className="display text-[clamp(2.5rem,8vw,5rem)] text-ice">Connect the CMS</h1>
        <p className="text-pretty leading-relaxed text-mist">
          This is where articles, videos, sponsors, ad banners and contact details are edited. It
          needs a Sanity project before it can open. Until then the site keeps running on its
          built-in sample content.
        </p>
        <ol className="flex flex-col gap-4 border-t border-steel/25 pt-6">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4 text-sm leading-relaxed text-mist">
              <span className="display w-6 shrink-0 text-xl text-steel">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
