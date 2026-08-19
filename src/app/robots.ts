import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { isIndexable } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Staging/preview deployments must never be indexed.
  if (!isIndexable) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The embedded Studio is an editor tool, not a public page.
        disallow: [siteConfig.cms.studioPath, "/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
