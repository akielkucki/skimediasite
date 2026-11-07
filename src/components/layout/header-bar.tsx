"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Wordmark } from "./wordmark";
import { siteConfig } from "@/config/site";
import { realSocialLinks } from "@/lib/env";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * The site header.
 *
 * Client-side for three interactions — the scroll-condensed background, the
 * mobile drawer and the search overlay — all implemented with a scroll
 * listener, a native `<dialog>` and CSS transitions. No animation library is
 * loaded on this path (or anywhere else in the app).
 *
 * The drawer is a real modal: `showModal()` gives a focus trap, an inert
 * background, Escape-to-close and focus restoration natively.
 */
export function HeaderBar() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setCondensed(window.scrollY > 48));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Route changes close every overlay — otherwise the drawer survives a nav.
  // Adjusted during render (React's documented pattern) rather than in an
  // effect, so the closed state is committed in the same pass as the new route.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  // Escape closes the search panel (the dialog handles its own Escape).
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return base === "/" ? pathname === "/" : pathname.startsWith(base);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300 ease-[var(--ease-editorial)]",
          condensed
            ? "border-b border-steel/25 bg-void/92 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-void/85 to-transparent",
        )}
      >
        <nav aria-label="Primary" className="gutter flex items-stretch gap-4 py-3">
          <Wordmark className="shrink-0" />

          <ul className="ml-4 hidden items-center gap-7 lg:flex">
            {siteConfig.mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "kicker relative py-2 transition-colors duration-200",
                    item.emphasis
                      ? "text-accent hover:text-[#ff6438]"
                      : "text-ice/75 hover:text-ice",
                    isActive(item.href) && !item.emphasis && "text-ice",
                  )}
                >
                  {item.label}
                  {isActive(item.href) ? (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-px w-full bg-current"
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-controls="site-search"
              className="flex size-11 items-center justify-center text-ice/75 transition-colors hover:text-ice"
            >
              <span className="sr-only">Search</span>
              <SearchGlyph />
            </button>

            <Link
              href="/tv"
              className="hidden h-11 items-center border border-accent px-5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-void sm:inline-flex"
            >
              Watch TV
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="flex size-11 items-center justify-center text-ice lg:hidden"
            >
              <span className="sr-only">Open menu</span>
              <MenuGlyph />
            </button>
          </div>
        </nav>

        {searchOpen ? <SearchPanel onClose={() => setSearchOpen(false)} /> : null}
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
    </>
  );
}

/* ── Search ────────────────────────────────────────────────────────────── */

const SEARCH_SCOPES = [
  { value: "/news", label: "News" },
  { value: "/tv/search", label: "TV" },
] as const;

/**
 * The search entry point. Rather than a bespoke client-side index, this hands
 * the query to whichever index page owns that content — those pages already
 * filter on `?q=`, server-side, so results are shareable URLs.
 */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [scope, setScope] = useState<string>("/news");
  const id = useId();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      id="site-search"
      className="search-panel-in overflow-hidden border-t border-steel/25 bg-void/95 backdrop-blur-md"
    >
      <form
        role="search"
        className="gutter flex flex-wrap items-center gap-3 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          const value = inputRef.current?.value.trim() ?? "";
          if (value) track({ name: "search", query: value, scope });
          router.push(
            value ? `${scope}?q=${encodeURIComponent(value)}` : scope.replace(/\/search$/, ""),
          );
          onClose();
        }}
      >
        <label htmlFor={id} className="sr-only">
          Search the site
        </label>
        <input
          ref={inputRef}
          id={id}
          type="search"
          name="q"
          placeholder="Search stories, films and reporting…"
          className="min-w-0 flex-1 border-b border-steel/40 bg-transparent py-3 text-lg text-ice placeholder:text-steel focus:border-accent focus:outline-none"
        />
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">Search within</legend>
          {SEARCH_SCOPES.map((s) => (
            <label
              key={s.value}
              className={cn(
                "kicker flex min-h-11 cursor-pointer items-center border px-3 transition-colors",
                scope === s.value
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-steel/40 text-mist hover:border-ice hover:text-ice",
              )}
            >
              <input
                type="radio"
                name="scope"
                value={s.value}
                checked={scope === s.value}
                onChange={() => setScope(s.value)}
                className="sr-only"
              />
              {s.label}
            </label>
          ))}
        </fieldset>
        <button
          type="submit"
          className="h-11 bg-ice px-6 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-void transition-colors hover:bg-accent"
        >
          Search
        </button>
      </form>
    </div>
  );
}

/* ── Mobile drawer ─────────────────────────────────────────────────────── */

function MobileNav({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const social = realSocialLinks(siteConfig.social);

  // `showModal()` provides most of the modal contract natively: the rest of
  // the page is inert, Escape closes, and focus returns to the opener on
  // close. The Tab handler below completes the trap — without it, tabbing
  // past the last control hands focus to the browser chrome.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  };

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Site menu"
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === dialogRef.current) onClose();
      }}
      onKeyDown={trapTab}
      className="drawer m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-void/80 backdrop:backdrop-blur-sm lg:hidden"
    >
      <div className="grain ml-auto flex h-full w-full max-w-sm flex-col border-l border-steel/25 bg-ink text-ice">
        <div className="flex items-center justify-between border-b border-steel/25 px-5 py-3">
          <Wordmark stacked={false} />
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center text-ice"
          >
            <span className="sr-only">Close menu</span>
            <CloseGlyph />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="flex flex-col">
            {siteConfig.mainNav.map((item, index) => (
              <li
                key={item.href}
                className="drawer-item border-b border-steel/20"
                style={{ animationDelay: `${0.06 + index * 0.05}s` }}
              >
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex flex-col gap-1 py-5"
                >
                  <span
                    className={cn("display text-3xl", item.emphasis ? "text-accent" : "text-ice")}
                  >
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="text-sm text-mist">{item.description}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {social.length > 0 ? (
          <div className="border-t border-steel/25 px-5 py-5">
            <p className="kicker mb-3 text-steel">{siteConfig.tagline}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="kicker inline-flex min-h-11 items-center text-mist transition-colors hover:text-ice"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="kicker border-t border-steel/25 px-5 py-5 text-steel">
            {siteConfig.tagline}
          </p>
        )}
      </div>
    </dialog>
  );
}

/* ── Glyphs ────────────────────────────────────────────────────────────── */

function SearchGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.8 12.8 17 17" strokeLinecap="square" />
    </svg>
  );
}

function MenuGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6">
      <path d="M2 6h16M2 14h16" strokeLinecap="square" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5">
      <path d="M4 4l12 12M16 4L4 16" strokeLinecap="square" />
    </svg>
  );
}
