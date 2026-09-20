---
title: "tokyo.ex #2"
tags: ["elixir","event"]
date: 2016-05-24T00:36:44+09:00
lastmod: 2016-05-24T00:36:44+09:00
---

[tokyo.ex](http://beam-lang.connpass.com/event/30513/) に参加してきました。Elixir 初心者なので全部の話が面白かった 🤗

## セッション
### Phoenixを使った案件でリリースまでに起きた問題と対応 by [@ndruger](https://twitter.com/ndruger)

<iframe src="//www.slideshare.net/slideshow/embed_code/key/M2erfQuGQQVhj0" width="510" height="420" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/ndruger/phoenix-62288840" title="Phoenixを使った案件でリリースまでに起きた問題と対応" target="_blank">Phoenixを使った案件でリリースまでに起きた問題と対応</a> </strong> from <strong><a href="//www.slideshare.net/ndruger" target="_blank">ndruger</a></strong> </div>

* コンパイル時の型がなくて Erlang の Dialyzer を使ってチェック
    * ある程度チェックする術があるのはいいけどなんかもやもやする
    * 発表者の方も言ってたけどないよりはいいってことか
* 依存パッケージの記述をミスって production でだけ 500 エラーが発生
    * 確かにはまったらはまりそう… :scream:
    * そのうち改善されるんだろうか

### running webb app on elixir by [@ohrdev](https://twitter.com/ohrdev)

<iframe src="//www.slideshare.net/slideshow/embed_code/key/fxbWyONifRtZG5" width="510" height="420" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/ohr486/running-web-app-on-elixir" title="running web app on elixir" target="_blank">running web app on elixir</a> </strong> from <strong><a href="//www.slideshare.net/ohr486" target="_blank">Tsunenori Oohara</a></strong> </div>

* ドリコムで 1 年半 Elixir を運用してきた中での話
* とは言いつつ Elixir ならではの話題はなし
* Varnish の話が気になったから調べてみよう

## LT
### :ets.give_away/3 by [@ColdFreak](https://github.com/ColdFreak)

http://coldfreak.github.io/ets-give-away/

* 元同僚
* 具体的なコードと丁寧な解説でわかりやすかった
* Erlang おもしろいなーって感じ
* ets 側の実装が気になる

### Concurrency basis by [@tuvistavie](https://github.com/tuvistavie)

http://tuvistavie.com/slides/concurrency/#/

* Live Coding!
* こちらも具体的なコード + ライブコーディングで非常にわかりやすかった
* あれだけのコードであんな面白いことができるの面白いなーって感じ
* 遊んでみたい

### Create LINE Bot with Elixir by [@ma2ge](https://twitter.com/ma2ge)

<script async class="speakerdeck-embed" data-id="e1aa1812b2bf4e1693b3c815c9f9e340" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

* LINE bot を Phoenix で作ったという話
* IoT でいろいろやってて楽しそう
* cloudBit 欲しくなりました

### Phoenix Tips and Tricks by [@yohei_tanimoto](https://twitter.com/yohei_tanimoto)

<iframe src="//www.slideshare.net/slideshow/embed_code/key/jRclcpE6eKWHbB" width="510" height="420" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/tanimotoyohei/for-tokyoex-2-lt" title="For tokyo.ex #2 LT" target="_blank">For tokyo.ex #2 LT</a> </strong> from <strong><a href="//www.slideshare.net/tanimotoyohei" target="_blank">Yohei Tanimoto</a></strong> </div>


* Phoenix の Tips を過去の資料とともに紹介
* 新参者なのでこれまでのダイジェストをやってくれるのはとてもよかった

### Improve the performance of cryptographic functions by AES-NI by [@mururururu](https://twitter.com/mururururu)

(資料なし)

* `StringIO` とか `ExUnit.CaptureIO` とかの作者の方
* まだ学生らしい
* Erlang 19.0 から AES-NI を使えるようになる
* 4-5 倍速くなる

### 書籍Programming Elixir関連 by [@_ko1](https://twitter.com/_ko1)

(資料なし)

* Ruby の YARV を作った方
* まさか Elixir の会でみるとは w
* ルビィのぼうけん
  * 子供ができたらぜひ読ませたい
* [東京Ruby会議](http://regional.rubykaigi.org/tokyo11/)
* Elixir の OTP を勉強して Ruby 3.0 に活かすためにやってる
  * Ruby 3.0 楽しみ

[ルビィのぼうけん こんにちは!  プログラミング](https://www.amazon.co.jp/dp/4798143499?tag=nownabe02-22)

## 感想
Elixir 全然わかってない状態で行っても大丈夫かなーと思ってたけど、行ってよかった。というかむしろ初心者のうちの方が楽しめるかもしれませんね 😊
