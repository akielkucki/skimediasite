import Link from "next/link";
import { Wordmark } from "./wordmark";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SocialIcon } from "@/components/ui/social-icon";
import { SponsorLogo } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { getContactDetails, getFeaturedSponsors } from "@/lib/cms";
import { newsletterEnabled, realSocialLinks } from "@/lib/env";

export async function SiteFooter() {
  const [sponsors, contact] = await Promise.all([getFeaturedSponsors(6), getContactDetails()]);
  const year = new Date().getFullYear();
  // Generic platform-root links from the seed config are dropped rather than
  // rendered as fake handles; /rss.xml always survives the filter.
  const social = realSocialLinks(contact.social);

  return (
    <footer className="grain mt-24 border-t border-steel/25 bg-ink">
      {/* The newsletter band renders only when a mailing-list provider is
          actually connected (always visible in development for testing). */}
      {newsletterEnabled ? (
        <section
          aria-labelledby="newsletter-heading"
          className="gutter border-b border-steel/25 py-14"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end">
            <div className="max-w-xl">
              <p className="kicker mb-4 text-accent">Newsletter</p>
              <h2
                id="newsletter-heading"
                className="display text-[clamp(2rem,5vw,3.25rem)] text-ice"
              >
                {siteConfig.newsletter.heading}
              </h2>
              <p className="mt-4 text-mist">{siteConfig.newsletter.description}</p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      ) : null}

      {sponsors.length > 0 ? (
        <section
          aria-labelledby="footer-sponsors"
          className="gutter border-b border-steel/25 py-10"
        >
          <h2 id="footer-sponsors" className="kicker mb-6 text-steel">
            {siteConfig.sponsors.stripLabel}
          </h2>
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
            {sponsors.map((s) => (
              <li key={s._id}>
                <Link
                  href={`/sponsors#${s.slug}`}
                  className="block opacity-70 transition-opacity hover:opacity-100"
                >
                  <SponsorLogo sponsor={s} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="gutter grid gap-12 py-14 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <div className="flex flex-col items-start gap-5">
          <Wordmark />
          <p className="max-w-xs text-sm leading-relaxed text-mist">{siteConfig.description}</p>
          {social.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    rel="noopener noreferrer"
                    className="flex size-11 items-center justify-center border border-steel/30 text-mist transition-colors hover:border-ice hover:text-ice"
                  >
                    <span className="sr-only">{s.label}</span>
                    <SocialIcon icon={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3">
          {Object.entries(siteConfig.footerNav).map(([group, items]) => (
            <div key={group}>
              <h2 className="kicker mb-4 text-steel">{group}</h2>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-mist transition-colors hover:text-ice"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="gutter flex flex-col gap-4 border-t border-steel/25 py-6 text-xs text-steel sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {siteConfig.name}. {siteConfig.tagline}.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/privacy" className="transition-colors hover:text-ice">
            Privacy &amp; terms
          </Link>
          <Link href="/contact" className="transition-colors hover:text-ice">
            Contact
          </Link>
          <a href={`mailto:${contact.contactEmail}`} className="transition-colors hover:text-ice">
            {contact.contactEmail}
          </a>
          {contact.addressLines.length > 0 ? <span>{contact.addressLines.join(" · ")}</span> : null}
        </div>
      </div>
    </footer>
  );
}
