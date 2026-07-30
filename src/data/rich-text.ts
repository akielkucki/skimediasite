import type { ImageAsset, RichTextBlock, RichTextSpan, VideoSource } from "@/types/content";

/**
 * Tiny authoring helpers for the seed content.
 *
 * `body(...)` auto-assigns stable `_key`s so the seed data reads like prose
 * instead of a wall of object literals. Sanity supplies its own keys, so this
 * only ever runs against local mock content.
 */

type BlockFactory = (key: string) => RichTextBlock;

export function body(...blocks: BlockFactory[]): RichTextBlock[] {
  return blocks.map((make, i) => make(`b${i}`));
}

const toSpans = (input: string | RichTextSpan[]): RichTextSpan[] =>
  typeof input === "string" ? [{ text: input }] : input;

export const p =
  (text: string | RichTextSpan[]): BlockFactory =>
  (_key) => ({ _type: "paragraph", _key, text: toSpans(text) });

export const h =
  (text: string, level: 2 | 3 = 2): BlockFactory =>
  (_key) => ({ _type: "heading", _key, level, text });

export const quote =
  (q: string, attribution?: string): BlockFactory =>
  (_key) => ({ _type: "pullQuote", _key, quote: q, attribution });

export const figure =
  (image: ImageAsset): BlockFactory =>
  (_key) => ({ _type: "image", _key, image });

export const embed =
  (source: VideoSource, title: string, poster?: ImageAsset): BlockFactory =>
  (_key) => ({ _type: "video", _key, source, title, poster });

export const list =
  (style: "bullet" | "number", items: Array<string | RichTextSpan[]>): BlockFactory =>
  (_key) => ({ _type: "list", _key, style, items: items.map(toSpans) });

export const divider = (): BlockFactory => (_key) => ({ _type: "divider", _key });

/** Inline span helpers. */
export const b = (text: string): RichTextSpan => ({ text, bold: true });
export const i = (text: string): RichTextSpan => ({ text, italic: true });
export const a = (text: string, href: string): RichTextSpan => ({ text, href });
export const t = (text: string): RichTextSpan => ({ text });
