# External services

What is stubbed, what it currently does, and exactly where to connect the real thing.

## The honesty rule

Nothing in this project pretends a message was delivered. Every stub either says plainly that it did
nothing, or does nothing visible at all. If you connect a real service and it fails, the user is told
it failed — not thanked.

---

## Contact & sponsorship forms

**Status:** fully working _except_ delivery.

Both forms are real `<form action={serverAction}>` elements, so they submit before hydration.
`useActionState` layers the pending/success/error states on top. Validation runs on the server
(`src/lib/validation.ts` + `src/lib/forms.ts`) and the same rules drive the client-side hints, so the
two can't drift.

With no provider configured, a valid submission returns status `unconfigured` and renders an amber
banner headed **"Not sent — no provider connected"**, naming the address the user should write to
instead. The submission is logged server-side so it isn't lost in development.

### Connecting a provider

One function: `deliver()` in `src/app/actions.ts`.

```dotenv
CONTACT_FORM_ENDPOINT=https://api.example.com/forms
CONTACT_FORM_API_KEY=...            # sent as `Authorization: Bearer …`
```

Any endpoint that accepts a JSON `POST` works — a Formspree URL, a Zapier hook, or your own route
handler wrapping Resend/Postmark/SendGrid. The payload is:

```json
{
  "kind": "contact" | "sponsorship" | "newsletter",
  "name": "…", "email": "…", "subject": "…", "message": "…",
  "intent": "editorial-tip",
  "routedTo": "tips@…"
}
```

To send email directly from the action instead, replace the `fetch` in `deliver()` with your SDK
call and return `{ delivered: true, detail: "ok" }`. Nothing else changes.

### Where enquiries are routed

`CONTACT_INTENTS` in `src/lib/forms.ts` maps each intent to a `siteConfig` address:

| Intent           | Goes to            |
| ---------------- | ------------------ |
| General enquiry  | `contactEmail`     |
| Editorial tip    | `editorialEmail`   |
| Video submission | `editorialEmail`   |
| Sponsorship      | `sponsorshipEmail` |
| Technical issue  | `contactEmail`     |

---

## Newsletter

**Status:** stubbed, and says so.

`siteConfig.newsletter.provider` is `null`, so a valid address returns:

> "Address looks good — but no mailing-list provider is connected yet, so you have not been
> subscribed to anything."

To connect one: set `provider` in `src/config/site.ts` to `"mailchimp" | "buttondown" | "resend"`,
then handle it in `subscribeNewsletter` in `src/app/actions.ts` (it already falls through to
`deliver()` once a provider is set). Set `newsletter.enabled` to `false` to remove the whole footer
section instead.

---

## Spam protection

**Status:** honeypot only.

Every form renders a visually-hidden `website` field (`<Honeypot />`). If it's filled, `isSpam()` in
`src/lib/forms.ts` returns true and the action reports success without doing anything — standard
honeypot behaviour, which avoids telling a bot it was caught.

`isSpam()` is the single hook for real protection. To add Cloudflare Turnstile:

1. Render the widget in the form and let it write a token into a hidden input.
2. In the server action, verify the token against `siteverify` before validating.
3. Keep the honeypot — it costs nothing and catches the unsophisticated half.

Rate limiting is not implemented. If you deploy behind Vercel or Cloudflare, do it at the edge
rather than in the action.

---

## Analytics

**Status:** call sites exist, no provider attached.

`siteConfig.monetization.analyticsProvider` is `null`, so `track()` in `src/lib/analytics.ts` is a
no-op in production and a `console.debug` in development. The events are already named and typed and
already fired from the right places:

| Event                                    | Fired from                                    |
| ---------------------------------------- | --------------------------------------------- |
| `video_play`                             | Media player, on facade click and native play |
| `tv_row_scroll`                          | TV row arrow buttons                          |
| `contact_submit`                         | Contact and sponsorship forms                 |
| `newsletter_submit`                      | Newsletter form                               |
| `ad_slot_render` / `ad_slot_click`       | Reserved for the ad slots                     |
| `sponsor_click`                          | Reserved for sponsor links                    |
| `article_view` / `video_view` / `search` | Reserved                                      |

Set `analyticsProvider` to `"plausible"` or `"ga4"`, add the vendor script to `app/layout.tsx`, and
`track()` starts dispatching. Adding a new event means extending the `AnalyticsEvent` union, which
makes the compiler find every call site for you.

---

## Error reporting

`src/app/error.tsx` currently `console.error`s. Replace that with your Sentry (or equivalent) capture
call; the `error.digest` is already surfaced to the user as a reference code.

---

## Video hosting

- **YouTube / Vimeo** — nothing to configure beyond the ids editors enter. See
  [CMS.md](CMS.md#how-youtube-and-vimeo-embeds-are-configured).
- **First-party hosted** — the `hosted` provider takes any direct file URL. Point it at a signed
  Mux/Cloudflare Stream/S3 URL and the native player handles it. If you move to HLS you'll need a
  player library; wire it into `MediaPlayer`'s `hosted` branch only — nothing else knows about it.
- **Captions** — WebVTT files uploaded in the Studio, rendered as `<track>` elements. Only used for
  hosted video; YouTube and Vimeo serve their own.
