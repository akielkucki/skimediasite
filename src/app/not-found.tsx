import { NotFoundView } from "@/components/layout/not-found-view";
import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * Unmatched URLs render here, outside every route group, so this boundary
 * brings its own header and footer.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundView />
    </SiteChrome>
  );
}
