import type { Metadata, Viewport } from "next";
import { Anton, Geist, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { siteConfig } from "@/config/site";
import { organisationJsonLd, websiteJsonLd } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";

/**
 * Three typefaces, each with one job:
 *   Anton         — oversized condensed uppercase headlines (the house voice)
 *   Geist         — UI, navigation, metadata, decks
 *   Source Serif  — long-form article bodies
 *
 * All are self-hosted by `next/font`, so there is no render-blocking request
 * to a font CDN and no layout shift from a late swap.
 */
const display = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
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
  robots: { index: true, follow: true },
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
      className={`${display.variable} ${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <head>
        {/*
          Backstop for the scroll-triggered reveals below the fold: they start
          hidden and are animated in by Motion, so without JavaScript they
          would never appear. Above-the-fold reveals are CSS-only and don't
          need this (see components/motion/on-load.tsx).
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col bg-void text-ice">
        <a
          href="#main"
          className="sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:uppercase focus:tracking-widest focus:text-void"
        >
          Skip to content
        </a>

        <SiteHeader />

        <main id="main" className="flex-1">
          {children}
        </main>

        <SiteFooter />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organisationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd()) }}
        />
      </body>
    </html>
  );
}
