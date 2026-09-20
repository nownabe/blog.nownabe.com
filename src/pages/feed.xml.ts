import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { render } from "astro:content";
import { excerpt, getPublishedPosts, postPath, SITE_DESCRIPTION, SITE_TITLE } from "../lib/posts";

export async function GET(context: APIContext) {
  // Full HTML for every post is about 5 MB; the newest 20 keep the feed around 0.5 MB.
  const posts = (await getPublishedPosts()).slice(0, 20);
  const container = await AstroContainer.create();
  const origin = context.site!.origin;
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return {
        title: post.data.title,
        link: postPath(post),
        pubDate: post.data.date,
        description: excerpt(post),
        content: html.replace(/(src|href)="\/(?!\/)/g, `$1="${origin}/`),
        categories: post.data.tags,
      };
    }),
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    customData: "<language>ja-JP</language>",
    items,
  });
}
