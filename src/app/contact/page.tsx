import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { MaskIn } from "@/components/motion/on-load";
import { Kicker } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { CONTACT_INTENTS, type ContactIntent } from "@/lib/forms";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Editorial tips, video submissions, sponsorship enquiries and technical issues — how to reach the right desk.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const params = await searchParams;
  const raw = Array.isArray(params.intent) ? params.intent[0] : params.intent;
  const defaultIntent = CONTACT_INTENTS.find((i) => i.value === raw)?.value as
    ContactIntent | undefined;

  return (
    <div className="gutter py-16 sm:py-24">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <Kicker accent>Get in touch</Kicker>
            <MaskIn>
              <h1 className="display text-[clamp(2.75rem,8vw,5.5rem)] text-ice">Contact</h1>
            </MaskIn>
            <p className="max-w-md text-pretty leading-relaxed text-mist">
              Pick the reason that fits and the message reaches the right desk. We read everything;
              we reply to most things within two working days.
            </p>
          </div>

          <dl className="flex flex-col gap-6 border-t border-steel/20 pt-8">
            {CONTACT_INTENTS.map((intent) => (
              <div key={intent.value} className="flex flex-col gap-1">
                <dt className="kicker text-ice">{intent.label}</dt>
                <dd className="text-sm leading-relaxed text-mist">
                  {intent.description}{" "}
                  <a
                    href={`mailto:${siteConfig[intent.routesTo]}`}
                    className="text-steel underline underline-offset-4 transition-colors hover:text-ice"
                  >
                    {siteConfig[intent.routesTo]}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          <div className="border-t border-steel/20 pt-8 text-sm text-steel">
            <p className="kicker mb-3 text-steel">Post</p>
            <address className="not-italic leading-relaxed">
              {siteConfig.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </div>

        <div className="border border-steel/25 p-6 sm:p-10">
          <ContactForm defaultIntent={defaultIntent} />
        </div>
      </div>
    </div>
  );
}
