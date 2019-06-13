---
date: 2016-05-24T00:36:44+0900
lastmod: 2016-05-24T00:36:44+0900
tags: ["elixir", "event"]
draft: false
isCJKLanguage: true

title: tokyo.ex #2
category: Diary

created_at: 2016-05-24 00:36:44 +0900
updated_at: 2016-05-24 00:36:44 +0900
published: true
---

[tokyo.ex](http://beam-lang.connpass.com/event/30513/)に参加してきました。Elixir初心者なので全部の話が面白かった 🤗

## セッション
### Phoenixを使った案件でリリースまでに起きた問題と対応 by [@ndruger](https://twitter.com/ndruger)

<iframe src="//www.slideshare.net/slideshow/embed_code/key/M2erfQuGQQVhj0" width="510" height="420" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/ndruger/phoenix-62288840" title="Phoenixを使った案件でリリースまでに起きた問題と対応" target="_blank">Phoenixを使った案件でリリースまでに起きた問題と対応</a> </strong> from <strong><a href="//www.slideshare.net/ndruger" target="_blank">ndruger</a></strong> </div>

* コンパイル時の型がなくてErlangのDialyzerを使ってチェック
    * ある程度チェックする術があるのはいいけどなんかもやもやする
    * 発表者の方も言ってたけどないよりはいいってことか
* 依存パッケージの記述をミスってproductionでだけ500エラーが発生
    * 確かにはまったらはまりそう… :scream:
    * そのうち改善されるんだろうか

### running webb app on elixir by [@ohrdev](https://twitter.com/ohrdev)

<iframe src="//www.slideshare.net/slideshow/embed_code/key/fxbWyONifRtZG5" width="510" height="420" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/ohr486/running-web-app-on-elixir" title="running web app on elixir" target="_blank">running web app on elixir</a> </strong> from <strong><a href="//www.slideshare.net/ohr486" target="_blank">Tsunenori Oohara</a></strong> </div>

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

<script async class="speakerdeck-embed" data-id="e1aa1812b2bf4e1693b3c815c9f9e340" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

* LINE botをPhoenixで作ったという話
* IoTでいろいろやってて楽しそう
* cloudBit欲しくなりました

### Phoenix Tips and Tricks by [@yohei_tanimoto](https://twitter.com/yohei_tanimoto)

<iframe src="//www.slideshare.net/slideshow/embed_code/key/jRclcpE6eKWHbB" width="510" height="420" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/tanimotoyohei/for-tokyoex-2-lt" title="For tokyo.ex #2 LT" target="_blank">For tokyo.ex #2 LT</a> </strong> from <strong><a href="//www.slideshare.net/tanimotoyohei" target="_blank">Yohei Tanimoto</a></strong> </div>


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

<div class="asin"><div class="asin-image"><a href="https://www.amazon.co.jp/exec/obidos/ASIN/4798143499/nownabe0c-22/"><img src="http://images-jp.amazon.com/images/P/4798143499.09._SL160_.jpg" alt="ルビィのぼうけん こんにちは!  プログラミング" title="ルビィのぼうけん こんにちは!  プログラミング"></a></div><div class="asin-detail"><p><a href="https://www.amazon.co.jp/exec/obidos/ASIN/4798143499/nownabe0c-22/">ルビィのぼうけん こんにちは!  プログラミング</a></p><ul><li>リンダ・リウカス</li><li>翔泳社</li></ul></div></div>

## 感想
Elixir全然わかってない状態で行っても大丈夫かなーと思ってたけど、行ってよかった。というかむしろ初心者のうちの方が楽しめるかもしれませんね 😊
