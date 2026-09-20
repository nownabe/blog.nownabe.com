import type { APIRoute, GetStaticPaths } from "astro";
import { renderCard, type CardProps } from "../../lib/card";
import { cardPath, formatDate, getPublishedPosts, SITE_TITLE } from "../../lib/posts";

// "/og/2016/07/31/hatena01.png" -> "2016/07/31/hatena01"
const slugOf = (path: string) => path.slice("/og/".length, -".png".length);

export const getStaticPaths = (async () => {
  const posts = await getPublishedPosts();
  return [
    { params: { slug: "default" }, props: { title: SITE_TITLE } },
    ...posts.map((post) => ({
      params: { slug: slugOf(cardPath(post)) },
      props: { title: post.data.title, date: formatDate(post.data.date) },
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute<CardProps> = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props)), { headers: { "Content-Type": "image/png" } });
