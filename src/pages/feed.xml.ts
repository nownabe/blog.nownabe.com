import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { excerpt, getPublishedPosts, postPath, SITE_DESCRIPTION, SITE_TITLE } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    customData: "<language>ja-JP</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      link: postPath(post),
      pubDate: post.data.date,
      description: excerpt(post),
      categories: post.data.tags,
    })),
  });
}
