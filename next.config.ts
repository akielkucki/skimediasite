import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // `images.domains` is deprecated in Next 16 — remotePatterns only.
    // Placeholder art is local, so this only matters once the CMS serves images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Surfaces accidental client/server boundary mistakes during development.
  reactStrictMode: true,

  poweredByHeader: false,
};

export default nextConfig;
