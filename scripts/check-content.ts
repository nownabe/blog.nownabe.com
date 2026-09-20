// Enforces the article conventions that the schema cannot see (see README "Writing"):
// exact front matter shape, the title as the only h1, alt on raw <img> tags, the banner living at its path only.
// Usage: bun scripts/check-content.ts [content/foo.md ...]   (default: every article)
import { existsSync, globSync } from "node:fs";
import { readFile } from "node:fs/promises";

const DATE = String.raw`\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\+09:00`;
const FRONT_MATTER = new RegExp(
  `^title: "(?:[^"\\\\\\n]|\\\\.)*"\\n` +
    `tags:(?: \\[[^\\n]*\\])?\\n(?:(?:  )?- [^\\n]+\\n)*` +
    `date: ${DATE}\\n` +
    `(?:lastmod: ${DATE}\\n)?$`,
);

const files = process.argv.length > 2 ? process.argv.slice(2) : globSync("content/**/*.md");
const problems: string[] = [];

for (const path of files) {
  const src = await readFile(path, "utf8");
  const m = src.match(/^---\n([\s\S]*?\n)---\n([\s\S]*)$/);
  if (!m) {
    problems.push(`${path}: no front matter`);
    continue;
  }
  const [, front, body] = m;
  if (!FRONT_MATTER.test(front)) {
    problems.push(
      `${path}: front matter must be exactly title (double-quoted), tags, date, optional lastmod`,
    );
  }

  const title = front.match(/^title: "(.*)"$/m)?.[1];
  const lines = body.split("\n");
  const firstLine = lines.find((line) => line.trim() !== "") ?? "";
  if (/\/banner\.(png|jpg)/.test(firstLine)) {
    problems.push(`${path}: the banner is rendered by the template; do not open the body with it`);
  }

  const bodyStartsAtLine = front.split("\n").length + 2; // the two --- lines
  let fence = false;
  let firstHeading: string | undefined;
  lines.forEach((line, i) => {
    if (/^(```|~~~)/.test(line)) fence = !fence;
    if (fence) return;
    for (const tag of line.match(/<img\b[^>]*>/g) ?? []) {
      if (!/\salt\s*=/.test(tag))
        problems.push(
          `${path}:${bodyStartsAtLine + i}: <img> needs an alt attribute (alt="" if decorative)`,
        );
    }
    const heading = line.match(/^(#+) (.*)$/);
    if (!heading) return;
    if (heading[1] === "#")
      problems.push(
        `${path}:${bodyStartsAtLine + i}: body headings start at ##; the title is the only h1`,
      );
    firstHeading ??= heading[2].trim();
  });
  if (title && firstHeading === title) {
    problems.push(`${path}: the first heading repeats the title; the template already renders it`);
  }
}

// A banner is only found at public/images/<post path>/banner.png|jpg, so a misplaced one silently disappears.
for (const banner of globSync("public/images/**/banner.*")) {
  const dir = banner.slice("public/images/".length, banner.lastIndexOf("/"));
  if (!/\/banner\.(png|jpg)$/.test(banner)) {
    problems.push(`${banner}: banners are banner.png or banner.jpg`);
  } else if (!existsSync(`content/${dir}.md`) && !existsSync(`content/${dir}.html.md`)) {
    problems.push(`${banner}: no article at content/${dir}.md`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`content: ok (${files.length} articles)`);
