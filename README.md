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
mise run lint          # textlint
mise run test          # Markdown plugin checks
mise run check         # astro check
mise run build         # build into dist/
```
