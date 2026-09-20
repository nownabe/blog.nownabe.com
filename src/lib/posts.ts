import { existsSync } from "node:fs";
import { getCollection, type CollectionEntry } from "astro:content";
import { nameToEmoji } from "gemoji";

export type Post = CollectionEntry<"posts">;

export const SITE_TITLE = "nownab.log";
export const SITE_DESCRIPTION = "the nownabe's life log";

// Social cards are rendered at build time by pages/og/[...slug].png.ts; this one is for non-post pages.
export const DEFAULT_IMAGE = "/og/default.png";

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// Legacy posts are named like 2016/07/31/hatena01.html.md; the canonical URL drops the .html
// and the old path is kept as a redirect (see pages/[...slug].astro).
export function postPath(post: Post): string {
  return `/${post.id.replace(/\.html$/, "")}/`;
}

export function legacyPath(post: Post): string | undefined {
  return post.id.endsWith(".html") ? `/${post.id}/` : undefined;
}

export function postYear(post: Post): string {
  return post.data.date.toLocaleDateString("en-CA", { year: "numeric", timeZone: "Asia/Tokyo" });
}

const BANNER_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];

// A banner is public/images/<post path>/banner.<ext>, shown in lists and at the top of the article.
// It is not the social card: every post's og:image is the generated card at cardPath().
export function banner(post: Post): string | undefined {
  const dir = `/images${postPath(post).slice(0, -1)}`;
  const ext = BANNER_EXTENSIONS.find((ext) => existsSync(`public${dir}/banner.${ext}`));
  return ext && `${dir}/banner.${ext}`;
}

export function cardPath(post: Post): string {
  return `/og${postPath(post).slice(0, -1)}.png`;
}

// Many posts open with the banner as a Markdown image, a linked image or a raw <img>; render it once, not twice.
export function bannerOpensBody(post: Post): boolean {
  const image = banner(post);
  const firstLine = (post.body ?? "").trimStart().split("\n", 1)[0] ?? "";
  return !!image && firstLine.includes(image);
}

const dotted = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tokyo",
});

// 2026.02.23
export function formatDate(date: Date): string {
  return dotted.format(date).replaceAll("-", ".");
}

// 2026.02
export function formatYearMonth(date: Date): string {
  return formatDate(date).slice(0, 7);
}

export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

export function tagPath(tag: string): string {
  return `/tags/${tagSlug(tag)}/`;
}

function inlineText(markdown: string): string {
  return markdown
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/:([a-z0-9_+-]+):/g, (match, name) => nameToEmoji[name] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}

function paragraphs(post: Post): string[] {
  const out: string[] = [];
  let inFence = false;
  for (const raw of (post.body ?? "").split("\n")) {
    const line = raw.trim();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line) continue;
    if (/^(#|!\[|\[!\[|<|>|\||[-*+]\s|\d+\.\s|---|\[\^)/.test(line)) continue;
    const text = inlineText(line);
    if (text) out.push(text);
  }
  return out;
}

// The opening sentence of the article, used as the one-line lead in lists.
export function lead(post: Post, maxLength = 110): string {
  const text = paragraphs(post)[0] ?? "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

// Longer plain-text opening for og:description and the feed.
export function excerpt(post: Post, maxLength = 160): string {
  const text = paragraphs(post).slice(0, 3).join(" ");
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

// Japanese reads at roughly 600 characters a minute.
export function readingMinutes(post: Post): number {
  const chars = inlineText((post.body ?? "").replace(/```[\s\S]*?```/g, " ")).length;
  return Math.max(1, Math.round(chars / 600));
}

// Same idea as Hugo's related content: rank by shared tags, newest first.
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const tags = new Set(post.data.tags.map(tagSlug));
  if (tags.size === 0) return [];
  return all
    .filter((other) => other.id !== post.id)
    .map((other) => ({
      post: other,
      score: other.data.tags.filter((t) => tags.has(tagSlug(t))).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.getTime() - a.post.data.date.getTime())
    .slice(0, limit)
    .map(({ post }) => post);
}

export function groupByTag(posts: Post[]): Map<string, { tag: string; posts: Post[] }> {
  const groups = new Map<string, { tag: string; posts: Post[] }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const group = groups.get(slug) ?? { tag, posts: [] };
      group.posts.push(post);
      groups.set(slug, group);
    }
  }
  return groups;
}

export function groupByYear(posts: Post[]): { year: string; posts: Post[] }[] {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    const year = postYear(post);
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups].map(([year, posts]) => ({ year, posts }));
}
