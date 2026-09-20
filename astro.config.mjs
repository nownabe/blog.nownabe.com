import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import codeFilename from "./src/plugins/satteri-code-filename.mjs";
import emojiShortcodes from "./src/plugins/satteri-emoji.mjs";
import katex from "./src/plugins/satteri-katex.mjs";

export default defineConfig({
  site: "https://blog.nownabe.com",
  trailingSlash: "always",
  // Redirect-only pages (old /page/N/ and legacy .html/ paths) stay out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes("/page/") && !page.endsWith(".html/") })],
  markdown: {
    processor: satteri({
      features: { math: true },
      mdastPlugins: [emojiShortcodes, codeFilename, katex],
    }),
    shikiConfig: {
      // Code blocks are dark in both color schemes by design.
      theme: "github-dark",
      langAlias: { rb: "ruby", txt: "text" },
    },
  },
});
