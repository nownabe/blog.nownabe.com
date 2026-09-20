nownab.log
==========

https://blog.nownabe.com/

Built with [Astro](https://astro.build/). Articles live in `content/`, images in `public/images/`.

## Prerequisites

- [mise](https://mise.jdx.dev/)

## Setup

```sh
mise run setup
```

## Writing

```sh
mise run server        # dev server
mise run new <slug>    # create content/<slug>.md and public/images/<slug>/
                       # public/images/<slug>/banner.png (or .jpg) becomes the list thumbnail and article banner
                       # the title is the only h1: body headings start at ##
                       # raw <img> tags need alt (alt="" if decorative) and width + height
mise run lint          # textlint, all articles (errors block CI; warnings are style hints)
bunx textlint content/<slug>.md   # one article
mise run test          # Markdown plugin, social card and article convention checks (scripts/check-content.ts)
mise run check         # astro check
mise run build         # build into dist/
```
