import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.editorialTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card.
 *
 * Drawn rather than photographed, so it needs no asset pipeline and always
 * reflects the current brand name from `siteConfig`. Pages with their own hero
 * image override this via `pageMetadata`.
 */
export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(150deg, #05070a 0%, #14181e 55%, #1e242c 100%)",
        padding: 72,
        position: "relative",
      }}
    >
      {/* Ridgeline motif */}
      <svg
        width="1200"
        height="360"
        viewBox="0 0 1200 360"
        style={{ position: "absolute", left: 0, bottom: 0, opacity: 0.5 }}
      >
        <path
          d="M0 300 L180 170 L330 250 L520 110 L700 240 L880 150 L1060 260 L1200 190 L1200 360 L0 360 Z"
          fill="#1e242c"
        />
        <path
          d="M0 340 L200 240 L400 310 L620 200 L820 300 L1010 230 L1200 300 L1200 360 L0 360 Z"
          fill="#0a0d11"
        />
      </svg>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 56, height: 6, background: "#ff4b12" }} />
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#9dadbd",
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>

      {/* Satori has no z-index; stacking is document order. */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 132,
            lineHeight: 0.9,
            letterSpacing: -4,
            textTransform: "uppercase",
            color: "#eef4f9",
            fontWeight: 800,
          }}
        >
          {siteConfig.shortName}
        </div>
        <div style={{ fontSize: 34, color: "#c6d5e2", marginTop: 22, maxWidth: 900 }}>
          {siteConfig.editorialTagline}
        </div>
      </div>
    </div>,
    size,
  );
}
