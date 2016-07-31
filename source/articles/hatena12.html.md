---
title: tokyo.ex #2
tags: elixir, event
created_at: 2016-05-24 00:36:44 +0900
updated_at: 2016-05-24 00:36:44 +0900
published: true
---

[tokyo.ex](http://beam-lang.connpass.com/event/30513/)に参加してきました。Elixir初心者なので全部の話が面白かった 🤗

## セッション
### Phoenixを使った案件でリリースまでに起きた問題と対応 by [@ndruger](https://twitter.com/ndruger)

[http://www.slideshare.net/ndruger/phoenix-62288840:embed:cite]

* コンパイル時の型がなくてErlangのDialyzerを使ってチェック
    * ある程度チェックする術があるのはいいけどなんかもやもやする
    * 発表者の方も言ってたけどないよりはいいってことか
* 依存パッケージの記述をミスってproductionでだけ500エラーが発生
    * 確かにはまったらはまりそう… :scream:
    * そのうち改善されるんだろうか

### running webb app on elixir by [@ohrdev](https://twitter.com/ohrdev)

[http://www.slideshare.net/ohr486/running-web-app-on-elixir:embed:cite]

* ドリコムで1年半Elixirを運用してきた中での話
* とは言いつつElixirならではの話題はなし
* Varnishの話が気になったから調べてみよう

## LT
### :ets.give_away/3 by [@ColdFreak](https://github.com/ColdFreak)

http://coldfreak.github.io/ets-give-away/

* 元同僚
* 具体的なコードと丁寧な解説でわかりやすかった
* Erlangおもしろいなーって感じ
* ets側の実装が気になる

### Concurrency basis by [@tuvistavie](https://github.com/tuvistavie)

http://tuvistavie.com/slides/concurrency/#/

* Live Coding!
* こちらも具体的なコード + ライブコーディングで非常にわかりやすかった
* あれだけのコードであんな面白いことができるの面白いなーって感じ
* 遊んでみたい

### Create LINE Bot with Elixir by [@ma2ge](https://twitter.com/ma2ge)

[https://speakerdeck.com/ma2gedev/create-line-bot-with-elixir:embed:cite]

* LINE botをPhoenixで作ったという話
* IoTでいろいろやってて楽しそう
* cloudBit欲しくなりました

### Phoenix Tips and Tricks by [@yohei_tanimoto](https://twitter.com/yohei_tanimoto)

(資料なし)

[http://www.slideshare.net/tanimotoyohei/for-tokyoex-2-lt:embed:cite]



* PhoenixのTipsを過去の資料とともに紹介
* 新参者なのでこれまでのダイジェストをやってくれるのはとてもよかった

### Improve the performance of cryptographic functions by AES-NI by [@mururururu](https://twitter.com/mururururu)

(資料なし)

* `StringIO`とか`ExUnit.CaptureIO`とかの作者の方
* まだ学生らしい
* Erlang 19.0からAES-NIを使えるようになる
* 4-5倍速くなる

### 書籍Programming Elixir関連 by [@_ko1](https://twitter.com/_ko1)

(資料なし)

* RubyのYARVを作った方
* まさかElixirの会でみるとはw
* ルビィのぼうけん
  * 子供ができたらぜひ読ませたい
* [東京Ruby会議](http://regional.rubykaigi.org/tokyo11/)
* ElixirのOTPを勉強してRuby 3.0に活かすためにやってる
  * Ruby 3.0楽しみ

[asin:4798143499:detail]

## 感想
Elixir全然わかってない状態で行っても大丈夫かなーと思ってたけど、行ってよかった。というかむしろ初心者のうちの方が楽しめるかもしれませんね 😊
