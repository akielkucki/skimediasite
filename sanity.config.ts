"use client";

import { defineConfig } from "sanity";
import { structureTool, type StructureResolver } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { siteConfig } from "./src/config/site";

/**
 * Sanity Studio configuration — the site's backend panel.
 *
 * Mounted inside the Next.js app at /studio (src/app/studio). It is also
 * usable standalone with `npm run studio`. The `"use client"` directive is
 * what lets the server route hand this config to the client-only Studio.
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID (and optionally
 * NEXT_PUBLIC_SANITY_DATASET). Without them /studio shows setup steps instead
 * of the Studio, and the website itself keeps running on seed content.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Site settings is a singleton: one fixed document, opened directly. */
const SINGLETONS = new Set(["siteSettings"]);

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("article").title("Articles"),
      S.documentTypeListItem("video").title("Videos"),
      S.documentTypeListItem("show").title("Shows & series"),
      S.divider(),
      S.documentTypeListItem("sponsor").title("Sponsors"),
      S.documentTypeListItem("promotion").title("Ad banners"),
      S.divider(),
      S.documentTypeListItem("author").title("Authors"),
      S.documentTypeListItem("category").title("Categories"),
    ]);

export default defineConfig({
  name: "default",
  title: `${siteConfig.name} — Backend`,
  // Sanity rejects an empty id; /studio never renders the Studio without a
  // real one (see src/app/studio), so this placeholder is never used.
  projectId: projectId || "not-configured",
  dataset,
  basePath: siteConfig.cms.studioPath,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: siteConfig.cms.apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    // No "create another Site settings" from the global + menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    // A singleton can be edited and published, never duplicated or deleted.
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(({ action }) => action !== "duplicate" && action !== "delete")
        : actions,
  },
});
