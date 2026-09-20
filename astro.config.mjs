import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import codeFilename from "./src/plugins/satteri-code-filename.mjs";
import emojiShortcodes from "./src/plugins/satteri-emoji.mjs";
import katex from "./src/plugins/satteri-katex.mjs";

// The sitemap integration only sees URLs, so an article's lastmod (or date) is read back
// from its front matter. Pages that are not articles get no lastmod.
function postLastmod(url) {
  const path = new URL(url).pathname.slice(1, -1);
  const file = [`content/${path}.md`, `content/${path}.html.md`].find(existsSync);
  if (!file) return undefined;
  const front = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? "";
  return (front.match(/^lastmod: (.+)$/m) ?? front.match(/^date: (.+)$/m))?.[1];
}

export default defineConfig({
  site: "https://blog.nownabe.com",
  trailingSlash: "always",
  integrations: [
    sitemap({
      // Redirect-only pages (old /page/N/ and legacy .html/ paths) stay out of the sitemap.
      filter: (page) => !page.includes("/page/") && !page.endsWith(".html/"),
      serialize: (item) => ({ ...item, lastmod: postLastmod(item.url) }),
    }),
  ],
  vite: {
    server: {
      // Claude Code keeps git worktrees (each with its own dist/) under .claude/, and every
      // build there would otherwise reload the dev server. Anchored to this project root so a
      // dev server started inside a worktree does not ignore its own tree.
      watch: { ignored: [`${fileURLToPath(new URL(".claude", import.meta.url))}/**`] },
    },
  },
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
