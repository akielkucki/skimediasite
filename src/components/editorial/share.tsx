"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { absoluteUrl, cn } from "@/lib/utils";

/**
 * Share controls.
 *
 * The shared URL is built from the current path and the canonical origin in
 * `siteConfig`, not from `window.location` — so it renders identically on the
 * server and the client, needs no mount effect, and never leaks a preview or
 * proxy hostname into a shared link.
 *
 * The Web Share API is used when the browser has it; the check happens inside
 * the click handler, so there's no hydration-time feature detection either.
 */
export function ShareControls({
  title,
  className,
  tone = "dark",
}: {
  title: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  const pathname = usePathname();
  const url = absoluteUrl(pathname);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url, text: `${title} — ${siteConfig.name}` });
        return;
      } catch {
        // Cancelled or unsupported in this context — fall through to copying.
      }
    }
    await copy();
  };

  const base = cn(
    "kicker inline-flex items-center gap-2 border px-3.5 py-2.5 transition-colors",
    tone === "dark"
      ? "border-steel/35 text-mist hover:border-ice hover:text-ice"
      : "border-ink/20 text-slate hover:border-ink hover:text-ink",
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className={cn("kicker mr-1", tone === "dark" ? "text-steel" : "text-slate/70")}>
        Share
      </span>

      <button type="button" className={base} onClick={share}>
        Share…
      </button>

      <a
        className={base}
        href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        X
      </a>
      <a
        className={base}
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
      >
        Email
      </a>
      <button type="button" className={base} onClick={copy}>
        {copied ? "Link copied" : "Copy link"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
