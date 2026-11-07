import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

/**
 * /ads.txt — declares Google as an authorised seller of this site's ad space.
 * AdSense withholds ads (and flags the site) without it. 404 until a
 * publisher id is configured.
 */
export function GET() {
  const client = siteConfig.ads.adsense.client;
  if (!client) return new Response("Not found", { status: 404 });

  const publisher = client.replace(/^ca-/, "");
  return new Response(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
