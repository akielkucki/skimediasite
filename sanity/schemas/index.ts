import type { SchemaTypeDefinition } from "sanity";
import { captionTrack, editorialBody, editorialImage, seoFields, videoSource } from "./objects";
import {
  article,
  author,
  category,
  promotion,
  show,
  siteSettings,
  sponsor,
  video,
} from "./documents";

/** Every schema type the Studio registers. */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  editorialImage,
  videoSource,
  captionTrack,
  seoFields,
  editorialBody,
  // Documents
  siteSettings,
  author,
  category,
  article,
  video,
  show,
  sponsor,
  promotion,
];
