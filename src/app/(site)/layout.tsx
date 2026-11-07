import { SiteChrome } from "@/components/layout/site-chrome";

/** Every public page. The backend at /studio sits outside this group. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
