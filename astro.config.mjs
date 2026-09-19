import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import codeFilename from "./src/plugins/satteri-code-filename.mjs";
import emojiShortcodes from "./src/plugins/satteri-emoji.mjs";

export default defineConfig({
  site: "https://blog.nownabe.com",
  trailingSlash: "always",
  integrations: [sitemap()],
  // Hugo served /page/1/ as an alias of /; keep the old URL working.
  redirects: { "/page/1/": "/" },
  markdown: {
    processor: satteri({
      // Articles were written for Hugo's Goldmark: no $math$, no ~single-tilde~ strikethrough.
      features: { math: false },
      mdastPlugins: [emojiShortcodes, codeFilename],
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      // Study-note articles use ```math fences; Shiki has no "math" grammar.
      langAlias: { math: "latex", rb: "ruby", txt: "text" },
    },
  },
});
