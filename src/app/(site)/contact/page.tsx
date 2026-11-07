import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { MaskIn } from "@/components/motion/on-load";
import { ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";
import { SocialIcon } from "@/components/ui/social-icon";
import { getContactDetails } from "@/lib/cms";
import { contactFormEnabled, realSocialLinks } from "@/lib/env";
import { CONTACT_INTENTS } from "@/lib/forms";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Email, phone, address and social links — plus a form that routes your message to the right desk.",
  path: "/contact",
});

/**
 * The full contact page. Every detail on it is edited in the backend
 * (Site settings → Contact details) and falls back to src/config/site.ts.
 *
 * The optional `?intent=` preselection is applied client-side by the form
 * after mount, so the page itself still renders once per revalidation.
 *
 * When no form-delivery provider is configured, the form is replaced by a
 * direct email route — no public visitor ever sees "no provider connected"
 * plumbing.
 */
export default async function ContactPage() {
  const contact = await getContactDetails();
  const social = realSocialLinks(contact.social);

  return (
    <>
      {/* ── Masthead ─────────────────────────────────────────────────── */}
      <section className="gutter border-b border-steel/20 pb-14 pt-16 sm:pt-24">
        <div className="flex max-w-3xl flex-col gap-5">
          <Kicker accent>Get in touch</Kicker>
          <MaskIn>
            <h1 className="display text-[clamp(2.75rem,8vw,5.5rem)] text-ice">Contact us</h1>
          </MaskIn>
          <p className="max-w-xl text-pretty leading-relaxed text-mist">
            Story tips, film submissions, sponsorship and advertising, or just a question — every
            way to reach us is below. We read everything and reply to most messages within two
            working days.
          </p>
        </div>
      </section>

      {/* ── Every channel ────────────────────────────────────────────── */}
      <section aria-label="Contact details" className="gutter py-14 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailCard title="Email">
            <dl className="flex flex-col gap-4">
              {[
                { label: "General enquiries", email: contact.contactEmail },
                { label: "Editorial & tips", email: contact.editorialEmail },
                { label: "Sponsorship & ads", email: contact.sponsorshipEmail },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-1">
                  <dt className="text-xs text-steel">{row.label}</dt>
                  <dd>
                    <a
                      href={`mailto:${row.email}`}
                      className="break-all text-sm text-ice underline-offset-4 hover:underline"
                    >
                      {row.email}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </DetailCard>

          {contact.phone || contact.officeHours ? (
            <DetailCard title="Phone">
              <div className="flex flex-col gap-4">
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                    className="display text-2xl text-ice transition-colors hover:text-accent"
                  >
                    {contact.phone}
                  </a>
                ) : null}
                {contact.officeHours ? (
                  <p className="flex flex-col gap-1">
                    <span className="text-xs text-steel">Office hours</span>
                    <span className="text-sm text-pale">{contact.officeHours}</span>
                  </p>
                ) : null}
              </div>
            </DetailCard>
          ) : null}

          {contact.addressLines.length > 0 ? (
            <DetailCard title="Address">
              <address className="text-sm not-italic leading-relaxed text-pale">
                {contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </DetailCard>
          ) : null}

          {social.length > 0 ? (
            <DetailCard title="Follow us">
              <ul className="flex flex-col gap-1">
                {social.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center gap-3 text-sm text-pale transition-colors hover:text-ice"
                    >
                      <SocialIcon icon={s.icon} />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </DetailCard>
          ) : null}
        </div>
      </section>

      {/* ── Message ──────────────────────────────────────────────────── */}
      <section
        aria-labelledby="message-heading"
        className="gutter border-t border-steel/20 py-14 sm:py-20"
      >
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Kicker accent>Send a message</Kicker>
              <h2 id="message-heading" className="display text-[clamp(2rem,5vw,3.25rem)] text-ice">
                Pick the right desk
              </h2>
              <p className="max-w-md text-pretty text-sm leading-relaxed text-mist">
                Choose the reason that fits and your message goes straight to the people who handle
                it.
              </p>
            </div>
            <dl className="flex flex-col gap-6 border-t border-steel/20 pt-8">
              {CONTACT_INTENTS.map((intent) => (
                <div key={intent.value} className="flex flex-col gap-1">
                  <dt className="kicker text-ice">{intent.label}</dt>
                  <dd className="text-sm leading-relaxed text-mist">
                    {intent.description}{" "}
                    <a
                      href={`mailto:${contact[intent.routesTo]}`}
                      className="text-steel underline underline-offset-4 transition-colors hover:text-ice"
                    >
                      {contact[intent.routesTo]}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {contactFormEnabled ? (
            <div className="border border-steel/25 p-6 sm:p-10">
              <ContactForm />
            </div>
          ) : (
            <div className="flex flex-col items-start gap-5 border border-steel/25 p-6 sm:p-10">
              <Kicker accent>Email us directly</Kicker>
              <h3 className="display text-3xl text-ice">One address reaches the newsroom</h3>
              <p className="max-w-md text-sm leading-relaxed text-mist">
                Write to us and we&rsquo;ll route it to the right desk. Include what you have, and
                how we can verify it if it&rsquo;s a tip.
              </p>
              <ButtonLink href={`mailto:${contact.contactEmail}`} size="lg">
                {contact.contactEmail}
              </ButtonLink>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 border border-steel/25 bg-charcoal/40 p-6 sm:p-8">
      <h2 className="kicker text-accent">{title}</h2>
      {children}
    </div>
  );
}
