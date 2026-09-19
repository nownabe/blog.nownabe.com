import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import codeFilename from "./src/plugins/satteri-code-filename.mjs";
import emojiShortcodes from "./src/plugins/satteri-emoji.mjs";

export default defineConfig({
  site: "https://blog.nownabe.com",
  trailingSlash: "always",
  // Redirect-only pages (old /page/N/ and legacy .html/ paths) stay out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes("/page/") && !page.endsWith(".html/") })],
  markdown: {
    processor: satteri({
      // Articles were written for Hugo's Goldmark: no $math$ syntax.
      features: { math: false },
      mdastPlugins: [emojiShortcodes, codeFilename],
    }),
    shikiConfig: {
      // Code blocks are dark in both color schemes by design.
      theme: "github-dark",
      // Study-note articles use ```math fences; Shiki has no "math" grammar.
      langAlias: { math: "latex", rb: "ruby", txt: "text" },
    },
  },
});
