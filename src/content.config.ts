import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  // The id doubles as the URL path. The default generateId slugifies and
  // would drop the ".html" that 172 legacy URLs (e.g. /2016/07/31/hatena01.html/) depend on.
  loader: glob({
    pattern: "**/*.md",
    base: "./content",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.coerce.string(),
    date: z.coerce.date(),
    lastmod: z.coerce.date().optional(),
    tags: z
      .array(z.coerce.string())
      .nullish()
      .transform((tags) => tags ?? []),
  }),
});

export const collections = { posts };
