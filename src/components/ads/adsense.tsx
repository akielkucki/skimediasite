import { siteConfig } from "@/config/site";
import { googleAdsAllowed } from "@/lib/cms";

/**
 * Loads the AdSense library once per page view, only when a publisher id is
 * configured and the backend hasn't switched Google ads off. The consent
 * message UK/EEA visitors must see is served by this same script once it is
 * enabled in AdSense → Privacy & messaging.
 *
 * A plain async `<script>` rather than `next/script`: React hoists it into
 * <head> and dedupes it, exactly as Google's snippet expects, without the
 * `data-nscript` attribute AdSense warns about.
 */
export async function AdsenseScript() {
  const client = siteConfig.ads.adsense.client;
  if (!siteConfig.ads.enabled || !client || !(await googleAdsAllowed())) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
