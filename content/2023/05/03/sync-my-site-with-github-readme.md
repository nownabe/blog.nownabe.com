---
title: "自分のウェブサイトを GitHub のプロフィール README と同期させた"
tags: [github]
date: 2023-05-03T23:21:28+09:00
lastmod: 2023-05-03T23:21:28+09:00

draft: false
isCJKLanguage: true

image: images/2023/05/03/banner.png
---

![banner](/images/2023/05/03/banner.png)

GitHub の [プロフィール](https://github.com/nownabe) の Markdown
をレンダリングして[個人サイト](https://nownabe.com) に同期するようにした。

個人サイトあるけど、内容もそんなないしデザインも凝ってないし、ちょっと前に作った GitHub の [profile README](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme) で内容ほぼカバーできてるしそっから同期させたい、ってのがモチベ。

個人サイトを廃止していいのではという気もするが、GitHub
というサービスに依存するのではなく自分のドメインをインデックスとしておきたいし、いろんな場所から既にリンクしてしまっているのでこういう方法を取ることにした。

デザインに関しては、時間かけて考えたくないし、マスターは GitHub
にあるんですよということがわかりやすいように GitHub のデザインを~~パクっ~~参考にした。

同期の方法は単純で、[nownabe/nownabe.com](https://github.com/nownabe/nownabe.com) リポジトリの GitHub Actions のワークフローを定期的に実行して、ワークフローでサイトの生成と GitHub Pages へのデプロイをしている。README の Push をトリガーにしていないのは、README が別リポジトリにあって連携がめんどくさいのと、同期に数時間や数日の遅延があっても構わないというのが理由。Pages を README のリポジトリに移行するというのも考えたけど、個人サイトはなんだかんだ変遷があってまたいつ別の方法を取るかわからないのでプロフィールから切り離しておいた方がいいだろうということでこの構成にした。

ワークフローの中では次のように処理を行っている。

1. 最新のプロフィール README を Actions のローカルに持ってくる (プロフィールリポジトリはパブリックなので簡単に持ってこれる)
1. Ruby スクリプトで README を HTML にレンダリングして、ERB のテンプレートに差し込み、`dist/index.html` に出力する (`dist/` には予め必要な画像や `CNAME` ファイルが入っている)
1. [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact) で `dist/`
   をアーティファクトとしてアップロードする
1. [actions/deploy-pages](https://github.com/actions/deploy-pages) でアーティファクトを GitHub Pages
   にデプロイする

また、これをするために、リポジトリの Settings で Pages のソースを GitHub Actions に設定しておく。

詳しく知りたいという人がもしいたら、[nownabe/nownabe.com](https://github.com/nownabe/nownabe.com)
を見てもらうのが一番わかりやすいと思う。なにせワークフローの YAML と簡単な Ruby スクリプトしかない。

今回 Markdown パーサーに [Redcarpet](https://github.com/vmg/redcarpet) を使ったが、GitHub
のパーサーと互換性がなくて、少し README を書き換えた。具体的には、次のような `<details>` の中の
Markdown を解釈してくれなくて、`<details>` の中をすべて HTML に書き換えた。

```markdown
## Articles

<details>
  <summary>Other articles</summary>

* list item 1
* list item 2
</details>
```

というわけで、個人サイトのことを考えなくてよくなってとてもスッキリしました。
