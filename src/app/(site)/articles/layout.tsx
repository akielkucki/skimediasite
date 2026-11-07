import localFont from "next/font/local";

/**
 * Article-route layout.
 *
 * Its only job is to scope the long-form serif to article pages: Source Serif
 * is by far the heaviest font file, and only `.prose-editorial` (the article
 * body) uses it. Loading it here keeps it off every other route's critical
 * path. `display: contents` keeps the wrapper out of layout while letting the
 * font variable inherit.
 */
const serif = localFont({
  src: "../../../fonts/source-serif-4-latin-variable.woff2",
  variable: "--font-source-serif",
  weight: "200 900",
  display: "swap",
});

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} contents`}>{children}</div>;
}
