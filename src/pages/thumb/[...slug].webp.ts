import type { APIRoute, GetStaticPaths } from "astro";
import { banner, getPublishedPosts, thumbPath } from "../../lib/posts";
import { renderThumb } from "../../lib/thumb";

// "/thumb/2016/07/31/hatena01.webp" -> "2016/07/31/hatena01"
const slugOf = (path: string) => path.slice("/thumb/".length, -".webp".length);

export const getStaticPaths = (async () => {
  const posts = await getPublishedPosts();
  return posts.flatMap((post) => {
    const src = banner(post);
    return src ? [{ params: { slug: slugOf(thumbPath(post)) }, props: { src } }] : [];
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ src: string }> = async ({ props }) =>
  new Response(new Uint8Array(await renderThumb(`public${props.src}`)), {
    headers: { "Content-Type": "image/webp" },
  });
