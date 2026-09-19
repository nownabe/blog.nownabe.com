import { getCollection, type CollectionEntry } from "astro:content";
import { nameToEmoji } from "gemoji";

export type Post = CollectionEntry<"posts">;

export const SITE_TITLE = "nownab.log";
export const SITE_DESCRIPTION = "the nownabe's life log";
export const DEFAULT_IMAGE = "/img/nownabe.png";
export const PAGE_SIZE = 10;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postPath(post: Post): string {
  return `/${post.id}/`;
}

export function postImage(post: Post): string {
  const image = post.data.image;
  if (!image) return DEFAULT_IMAGE;
  return image.startsWith("/") ? image : `/${image}`;
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "Asia/Tokyo",
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

export function tagPath(tag: string): string {
  return `/tags/${tagSlug(tag)}/`;
}

// Plain-text opening of the article for og:description and the feed.
export function excerpt(post: Post, maxLength = 160): string {
  const text = (post.body ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_`>]/g, "")
    .replace(/:([a-z0-9_+-]+):/g, (match, name) => nameToEmoji[name] ?? match)
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

// Same idea as Hugo's related content: rank by shared tags, newest first.
export function relatedPosts(post: Post, all: Post[], limit = 4): Post[] {
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
