import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { siteConfig } from "./src/config/site";

/**
 * Sanity Studio configuration.
 *
 * Run the Studio with `npm run studio` (it starts on http://localhost:3333).
 * It is NOT mounted inside the Next.js app: keeping it a separate process
 * means the ~2MB Studio bundle never enters the website's build, and the
 * website keeps working with no Sanity credentials at all.
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Copy .env.example to .env.local and fill it in — " +
      "see docs/CMS.md. (The website itself runs fine without this; only the Studio needs it.)",
  );
}

export default defineConfig({
  name: "default",
  title: `${siteConfig.name} — Studio`,
  projectId,
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: siteConfig.cms.apiVersion })],
  schema: { types: schemaTypes },
  document: {
    // Site settings is a singleton — one document, no "create another".
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((item) => item.templateId !== "siteSettings")
        : prev,
  },
});
