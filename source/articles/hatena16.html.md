---
title: qiita-markdownをMiddlemanで使えるようにするGemを作った
tags: ruby, middleman, markdown, github pages
created_at: 2016-07-26 23:57:51 +0900
updated_at: 2016-07-26 23:57:51 +0900
published: true
---

github pagesでblogを公開しようと思ってゆるりと構築中なんですが、静的ジェネレータとして[Middleman](https://middlemanapp.com/)を使うことにしました。

[esa.io](https://esa.io/)のGitHub Webhookから記事を投稿することを目論んでるので、記事の執筆にはMarkdownを使うことになります。

で、esaのMarkdownって拡張されていて、その中でも[コードブロックのファイル名表示](https://docs.esa.io/posts/49#11-4-0)がどうしても使いたいんです。
良い機能ですよね。

というわけでesaのMarkdownをそのままレンダリングするものがあればいいんですが、なさそうなので同じくファイル名表示ができる[qiita-markdown](https://github.com/increments/qiita-markdown)を使うことにしました。

といってもMiddleman内部では各種レンダリングに[Tilt](https://github.com/rtomayko/tilt)を使用しているので、Tiltに対応させれば使うことはできます。

次のようなクラスをひとつ作るだけでOKです。
(Middlemanが対応しているTiltがちょっと古いので注意が必要です)

```ruby
# frozen_string_literal: true

require "tilt/template"
require "qiita/markdown"

module Tilt
  class QiitaTemplate < Template
    self.default_mime_type = "text/html"

    def self.engine_initialized?
      defined? Qiita::Markdown::Processor
    end

    def prepare
      @engine = Qiita::Markdown::Processor.new
      @output = nil
    end

    def evaluate(_scope, _locals, &block)
      @output ||= @engine.call(data)[:output].to_s
    end
  end
end
```


なんですが簡単に使えるようにGemにもしました。

[https://rubygems.org/gems/middleman-renderers-qiita_template:title]

`Gemfile`に`gem "middleman-renderers-qiita_template"`を追加して、`config.rb`に

```ruby
set :markdown_engine_prefix, Middleman::Renderers
set :markdown_engine, :qiita
```

と追加すれば使えます。

突貫で作ったのでいろいろできてない感はあります。

数式への対応とかMiddleman風のリンクへの対応とかしたいですねー。

何かアレばぜひPRください 😇
