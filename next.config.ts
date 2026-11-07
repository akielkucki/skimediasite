import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/** Google AdSense is only allowed through the CSP once a publisher id is set. */
const adsenseOn = /^ca-pub-\d+$/.test(process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "");

/**
 * Hosts Google AdSense needs (ad script, creatives, measurement, and the
 * Funding Choices consent message for UK/EEA visitors). Google rotates
 * creative CDNs, which is why img-src opens to `https:` when ads are on.
 */
const ADSENSE = {
  script: [
    "https://pagead2.googlesyndication.com",
    "https://*.googlesyndication.com",
    "https://*.doubleclick.net",
    "https://*.google.com",
    "https://*.gstatic.com",
    "https://*.adtrafficquality.google",
    "https://fundingchoicesmessages.google.com",
  ],
  frame: [
    "https://*.doubleclick.net",
    "https://*.googlesyndication.com",
    "https://*.google.com",
    "https://*.adtrafficquality.google",
    "https://fundingchoicesmessages.google.com",
  ],
  connect: [
    "https://*.googlesyndication.com",
    "https://*.doubleclick.net",
    "https://*.google.com",
    "https://*.adtrafficquality.google",
    "https://fundingchoicesmessages.google.com",
  ],
};

const ads = (hosts: string[]) => (adsenseOn ? ` ${hosts.join(" ")}` : "");

/**
 * Content Security Policy for the public site.
 *
 * Sized to exactly what the site does: self-hosted assets and fonts, Sanity's
 * image CDN, the click-to-load YouTube (nocookie) / Vimeo players, and —
 * only when a publisher id is configured — Google AdSense. `'unsafe-inline'`
 * for scripts covers Next's bootstrap inline scripts and the JSON-LD blocks;
 * move to nonces if a stricter policy is ever required. Development is
 * excluded because the dev runtime needs `eval`.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${ads(ADSENSE.script)}`,
  "style-src 'self' 'unsafe-inline'",
  adsenseOn ? "img-src 'self' data: https:" : "img-src 'self' data: https://cdn.sanity.io",
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${ads(ADSENSE.connect)}`,
  `frame-src https://www.youtube-nocookie.com https://player.vimeo.com${ads(ADSENSE.frame)}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * The backend at /studio talks to Sanity's API (HTTPS + websockets for live
 * editing), loads Sanity's dashboard bridge script and UI font, and shows
 * sign-in avatars from Google/GitHub.
 */
const studioCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://core.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
  "font-src 'self' data: https://design-system-static.sanity.io",
  "media-src 'self' blob: https://cdn.sanity.io",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io",
  "frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.sanity.io",
  "frame-ancestors 'self'",
].join("; ");

const sharedHeaders = [
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
    return [
      {
        // Everything except the backend.
        source: "/((?!studio).*)",
        headers: [
          ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
          ...sharedHeaders,
        ],
      },
      {
        source: "/studio/:path*",
        headers: [
          ...(isProd ? [{ key: "Content-Security-Policy", value: studioCsp }] : []),
          ...sharedHeaders,
        ],
      },
    ];
  },

  async redirects() {
    // Sections removed in the simplification pass — keep old links working.
    const removedTvCollections = [
      "original-series",
      "destination-stories",
      "technique",
      "gear",
      "staff-picks",
      "with-partners",
    ];
    return [
      { source: "/blog", destination: "/news", permanent: true },
      ...removedTvCollections.map((slug) => ({
        source: `/tv/collections/${slug}`,
        destination: "/tv",
        permanent: true,
      })),
    ];
  },

  // Surfaces accidental client/server boundary mistakes during development.
  reactStrictMode: true,

  poweredByHeader: false,
};

export default nextConfig;
