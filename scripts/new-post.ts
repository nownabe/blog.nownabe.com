import { mkdir, writeFile } from "node:fs/promises";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("usage: bun run new <slug>   (lowercase letters, digits, hyphens)");
  process.exit(1);
}

const now = new Date();
const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, "+09:00");
const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const frontmatter = `---
title: "${title}"
tags:
date: ${jst}
lastmod: ${jst}
---

`;

await writeFile(`content/${slug}.md`, frontmatter, { flag: "wx" });
await mkdir(`public/images/${slug}`, { recursive: true });
console.log(`created content/${slug}.md and public/images/${slug}/ (put banner.png there for a banner)`);
