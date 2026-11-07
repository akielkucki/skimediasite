import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { assertProductionConfig, isIndexable } from "@/lib/env";

// Fail a production build/startup on placeholder configuration (localhost
// canonicals, `.example` contacts, missing content source). See lib/env.ts.
assertProductionConfig();

/**
 * Two typefaces load globally, each with one job:
 *   Anton — oversized condensed uppercase headlines (the house voice)
 *   Geist — UI, navigation, metadata, decks
 * The long-form serif (Source Serif 4) loads only on the article route — see
 * src/app/articles/layout.tsx.
 *
 * All font files are vendored in src/fonts with their OFL license texts, so
 * builds never depend on Google Fonts network availability, and `next/font`
 * self-hosts them with size-adjusted fallbacks (no layout shift).
 */
const display = localFont({
  src: "../fonts/anton-latin-400.woff2",
  variable: "--font-anton",
  weight: "400",
  display: "swap",
});

const sans = localFont({
  src: "../fonts/geist-latin-variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    locale: siteConfig.seo.locale,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    ...(siteConfig.seo.twitterHandle ? { site: siteConfig.seo.twitterHandle } : {}),
  },
  // Previews and staging must never be indexed; production is.
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // Opts into Next's scroll-behaviour override on route changes, so
      // in-page smooth scrolling doesn't make navigation feel sluggish.
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <head>
        {/*
          Backstop for the scroll-triggered reveals below the fold: they start
          hidden and are revealed by an IntersectionObserver, so without
          JavaScript they would never appear. Above-the-fold reveals are
          CSS-only and don't need this (see components/motion/on-load.tsx).
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      {/* Header, footer and ads live in app/(site)/layout.tsx, so the
          backend at /studio renders full-screen without them. */}
      <body className="flex min-h-full flex-col bg-void text-ice">{children}</body>
    </html>
  );
}
