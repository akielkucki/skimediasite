import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Shared objects.
 *
 * Every field carries an editor-facing description. The validation rules here
 * are the ones that protect the front end — alt text, a resolvable video
 * source, a sponsor when something is marked sponsored.
 */

/** Image + the metadata the templates actually render. */
export const editorialImage = defineType({
  name: "editorialImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describe the image for someone who can't see it. Leave empty ONLY if the image is purely decorative.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { asset?: unknown; decorative?: boolean };
          if (!parent?.asset) return true;
          if (parent.decorative) return true;
          return value ? true : "Alt text is required unless the image is marked decorative.";
        }),
    }),
    defineField({
      name: "decorative",
      title: "Decorative only",
      type: "boolean",
      initialValue: false,
      description: "Tick if the image adds no information (screen readers will skip it).",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Shown under the image. Optional.",
    }),
    defineField({
      name: "credit",
      title: "Credit",
      type: "string",
      description: "Photographer or agency. Required for licensed photography.",
    }),
  ],
});

/**
 * Structured video source.
 *
 * Deliberately NOT a raw embed field: the front end builds privacy-conscious
 * embed URLs itself from a provider + id, so no arbitrary HTML can reach a page.
 */
export const videoSource = defineType({
  name: "videoSource",
  title: "Video source",
  type: "object",
  fields: [
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      initialValue: "youtube",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
          { title: "Hosted by us (file URL)", value: "hosted" },
          { title: "External (link out, not embedded)", value: "external" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "videoId",
      title: "Video ID",
      type: "string",
      description:
        "YouTube: the part after ?v= (e.g. dQw4w9WgXcQ). Vimeo: the numeric id. Not the whole URL.",
      hidden: ({ parent }) => !["youtube", "vimeo"].includes(parent?.provider),
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { provider?: string };
          if (!["youtube", "vimeo"].includes(parent?.provider ?? "")) return true;
          if (!value) return "A video ID is required for YouTube and Vimeo.";
          if (/^https?:\/\//.test(value)) return "Paste only the ID, not the full URL.";
          return true;
        }),
    }),
    defineField({
      name: "hash",
      title: "Vimeo privacy hash",
      type: "string",
      description: "Only needed for unlisted Vimeo videos (the ?h= value).",
      hidden: ({ parent }) => parent?.provider !== "vimeo",
    }),
    defineField({
      name: "url",
      title: "File or page URL",
      type: "url",
      description:
        "Hosted: a direct link to the video file (.mp4). External: the page where the film lives.",
      hidden: ({ parent }) => !["hosted", "external"].includes(parent?.provider),
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { provider?: string };
          if (!["hosted", "external"].includes(parent?.provider ?? "")) return true;
          return value ? true : "A URL is required for hosted and external sources.";
        }),
    }),
    defineField({
      name: "mimeType",
      title: "MIME type",
      type: "string",
      initialValue: "video/mp4",
      hidden: ({ parent }) => parent?.provider !== "hosted",
    }),
    defineField({
      name: "label",
      title: "Publisher name",
      type: "string",
      description: "Shown on the 'watch on …' button, e.g. the broadcaster's name.",
      hidden: ({ parent }) => parent?.provider !== "external",
    }),
    defineField({
      name: "startAt",
      title: "Start at (seconds)",
      type: "number",
      hidden: ({ parent }) => parent?.provider !== "youtube",
    }),
  ],
});

export const captionTrack = defineType({
  name: "captionTrack",
  title: "Caption track",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "WebVTT file",
      type: "file",
      options: { accept: ".vtt" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "srcLang",
      title: "Language code",
      type: "string",
      initialValue: "en",
      description: "BCP-47, e.g. en, de, fr-CA.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "label", title: "Label", type: "string", initialValue: "English" }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      initialValue: "captions",
      options: {
        list: [
          { title: "Captions (includes sound effects)", value: "captions" },
          { title: "Subtitles (dialogue only)", value: "subtitles" },
        ],
      },
    }),
    defineField({
      name: "isDefault",
      title: "Default track",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

export const seoFields = defineType({
  name: "seoFields",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Search/social title",
      type: "string",
      description: "Overrides the headline in search results and social cards. Aim for ≤60 chars.",
      validation: (rule) => rule.max(70).warning("Titles over 70 characters get truncated."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "One or two sentences. Aim for 120–155 characters.",
      validation: (rule) =>
        rule.max(180).warning("Descriptions over 180 characters get truncated."),
    }),
    defineField({
      name: "image",
      title: "Social share image",
      type: "editorialImage",
      description: "Falls back to the hero image, then to the site's generated card.",
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      type: "url",
      description: "Only set this if the piece was first published elsewhere.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

/** Rich text body. The renderer supports exactly these block types. */
export const editorialBody = defineType({
  name: "editorialBody",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      name: "pullQuote",
      title: "Pull quote",
      type: "object",
      fields: [
        defineField({
          name: "quote",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required().max(240),
        }),
        defineField({ name: "attribution", type: "string", title: "Attribution" }),
      ],
      preview: { select: { title: "quote", subtitle: "attribution" } },
    }),
    // Named `inline…` because Sanity forbids array members that reuse a
    // built-in type name (`image`) and warns on clashes with document types
    // (`video`). src/lib/cms/map.ts maps them back to the app's block types.
    defineArrayMember({
      name: "inlineImage",
      title: "Inline image",
      type: "editorialImage",
    }),
    defineArrayMember({
      name: "inlineVideo",
      title: "Inline video",
      type: "object",
      fields: [
        defineField({
          name: "title",
          type: "string",
          description: "Used as the player's accessible name. Always required.",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "source", type: "videoSource", validation: (rule) => rule.required() }),
        defineField({ name: "poster", type: "editorialImage", title: "Poster frame" }),
      ],
      preview: { select: { title: "title" } },
    }),
    defineArrayMember({
      name: "divider",
      title: "Section break",
      type: "object",
      fields: [
        defineField({
          name: "note",
          type: "string",
          title: "Editor note (not published)",
          readOnly: true,
          initialValue: "Renders as a horizontal rule.",
        }),
      ],
      preview: { prepare: () => ({ title: "— Section break —" }) },
    }),
  ],
});
