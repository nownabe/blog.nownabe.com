---
date: 2016-07-26T23:57:51+0900
lastmod: 2016-07-26T23:57:51+0900
tags: ["ruby","middleman","markdown","github pages"]
draft: false

title: qiita-markdownをMiddlemanで使えるようにするGemを作った
---

github pages で blog を公開しようと思ってゆるりと構築中なんですが、静的ジェネレータとして [Middleman](https://middlemanapp.com/) を使うことにしました。

[esa.io](https://esa.io/) の GitHub Webhook から記事を投稿することを目論んでるので、記事の執筆には Markdown を使うことになります。

で、esa の Markdown って拡張されていて、その中でも [コードブロックのファイル名表示](https://docs.esa.io/posts/49#11-4-0) がどうしても使いたいんです。
良い機能ですよね。

というわけで esa の Markdown をそのままレンダリングするものがあればいいんですが、なさそうなので同じくファイル名表示ができる [qiita-markdown](https://github.com/increments/qiita-markdown) を使うことにしました。

といっても Middleman 内部では各種レンダリングに [Tilt](https://github.com/rtomayko/tilt) を使用しているので、Tilt に対応させれば使うことはできます。

次のようなクラスをひとつ作るだけで OK です。
(Middleman が対応している Tilt がちょっと古いので注意が必要です)

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


なんですが簡単に使えるように Gem にもしました。

[middleman-renderers-qiita_template | RubyGems.org | your community gem host](https://rubygems.org/gems/middleman-renderers-qiita_template)

`Gemfile` に `gem "middleman-renderers-qiita_template"` を追加して、`config.rb` に

```ruby
set :markdown_engine_prefix, Middleman::Renderers
set :markdown_engine, :qiita
```

と追加すれば使えます。

突貫で作ったのでいろいろできてない感はあります。

数式への対応とか Middleman 風のリンクへの対応とかしたいですねー。

何かアレばぜひ PR ください :innocent:
