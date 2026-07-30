"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Wordmark } from "./wordmark";
import { siteConfig } from "@/config/site";
import { EASE_CINEMATIC, EASE_EDITORIAL } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The site header.
 *
 * Client-side because of three interactions: the scroll-condensed background,
 * the mobile drawer and the search overlay. Everything it renders is derived
 * from `siteConfig` — changing the brand name or the nav array in one file
 * updates this component with no edits here.
 */
export function HeaderBar() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 48));

  // Route changes close every overlay — otherwise the drawer survives a nav.
  // Adjusted during render (React's documented pattern) rather than in an
  // effect, so the closed state is committed in the same pass as the new route.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  // Escape closes whichever overlay is open.
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
                    <motion.span
                      layoutId={reduced ? undefined : "nav-underline"}
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
              aria-controls="mobile-nav"
              className="flex size-11 items-center justify-center text-ice lg:hidden"
            >
              <span className="sr-only">Open menu</span>
              <MenuGlyph />
            </button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {searchOpen ? <SearchPanel onClose={() => setSearchOpen(false)} /> : null}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {menuOpen ? <MobileNav onClose={() => setMenuOpen(false)} isActive={isActive} /> : null}
      </AnimatePresence>
    </>
  );
}

/* ── Search ────────────────────────────────────────────────────────────── */

const SEARCH_SCOPES = [
  { value: "/news", label: "News" },
  { value: "/blog", label: "Blog" },
  { value: "/tv", label: "TV" },
] as const;

/**
 * The search entry point. Rather than a bespoke client-side index, this hands
 * the query to whichever index page owns that content — those pages already
 * filter on `?q=`, server-side, so results are shareable URLs.
 */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [scope, setScope] = useState<string>("/news");
  const id = useId();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      id="site-search"
      initial={reduced ? false : { height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={reduced ? undefined : { height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE_EDITORIAL }}
      className="overflow-hidden border-t border-steel/25 bg-void/95 backdrop-blur-md"
    >
      <form
        role="search"
        className="gutter flex flex-wrap items-center gap-3 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          const value = inputRef.current?.value.trim() ?? "";
          router.push(value ? `${scope}?q=${encodeURIComponent(value)}` : scope);
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
                "kicker cursor-pointer border px-3 py-2 transition-colors",
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
    </motion.div>
  );
}

/* ── Mobile drawer ─────────────────────────────────────────────────────── */

function MobileNav({
  onClose,
  isActive,
}: {
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Move focus into the drawer so keyboard users aren't stranded behind it.
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[60] lg:hidden"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-void/80 backdrop-blur-sm"
      />
      <motion.div
        ref={panelRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        initial={reduced ? false : { x: "100%" }}
        animate={{ x: 0 }}
        exit={reduced ? undefined : { x: "100%" }}
        transition={{ duration: 0.42, ease: EASE_CINEMATIC }}
        className="grain absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-steel/25 bg-ink"
      >
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
              <motion.li
                key={item.href}
                initial={reduced ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduced ? 0 : 0.08 + index * 0.05, ease: EASE_CINEMATIC }}
                className="border-b border-steel/20"
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
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-steel/25 px-5 py-5">
          <p className="kicker mb-3 text-steel">{siteConfig.tagline}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {siteConfig.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="kicker text-mist transition-colors hover:text-ice"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
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
