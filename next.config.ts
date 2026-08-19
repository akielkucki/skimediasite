import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Content Security Policy.
 *
 * Sized to exactly what the site does: self-hosted assets and fonts, Sanity's
 * image CDN, and the click-to-load YouTube (nocookie) / Vimeo players. No
 * third-party scripts run. `'unsafe-inline'` for scripts covers Next's
 * bootstrap inline scripts and the JSON-LD blocks; move to nonces if a
 * stricter policy is ever required. Development is excluded because the dev
 * runtime needs `eval`.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.sanity.io",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Transport policy: effective once the site is served over HTTPS at the
  // edge/deployment platform. Preload only after verifying the whole zone.
  { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  images: {
    // `images.domains` is deprecated in Next 16 — remotePatterns only.
    // Seed photography is committed locally, so this only matters once the
    // CMS serves images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  // Surfaces accidental client/server boundary mistakes during development.
  reactStrictMode: true,

  poweredByHeader: false,
};

export default nextConfig;
