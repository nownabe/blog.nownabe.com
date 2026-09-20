---
date: 2015-03-01T19:10:15+0900
lastmod: 2015-03-01T19:10:15+0900
tags: ["ruby","leveldb","ruboty"]
draft: false

title: RubotyのデータをLevelDBで永続化するruboty-leveldbというGemを作った
---

# 経緯
会社でチャットボットとして [Ruboty](https://github.com/r7kamura/ruboty) を使ってます。

Ruboty はデータの永続化にプラグインを使わないといけないんですが、今は Redis 用のプラグインしか用意されていません。
（もしかしたら誰か作ってるのがあるかも）

おそらく、Ruboty は Heroku + Redis To Go のような環境で運用されることを想定されていて、Redis 用のプラグインしかないんだと思います。
プライベートで使ってるのはその構成なんですが、会社では自前のサーバで Docker コンテナとして動作させています。

外部のサーバに置きたくなくてそうしてるのでデータも内部に持ちたかったんですが、Ruboty のためだけに Redis サーバ運用するのもなんだかなーとしばらくデータ永続化せずに使ってました。

けどこのままはアカンなーということで、[LevelDB](https://github.com/google/leveldb) を使って Ruboty のデータを永続化できる [ruboty-leveldb](https://rubygems.org/gems/ruboty-leveldb) というプラグインを作成しました！

# なぜLevelDB？
正直言うと、余分なサーバ建てずにデータの永続化ができればテキストファイルでも他の KVS でもなんでも良かったんですが、使ってみたかったので LevelDB にしました。

Ruboty のデータぐらいだと、LevelDB が他の KVS に比べてどういいのかとかは全然見えません。

個人的には [KyotoCabinet](http://fallabs.com/kyotocabinet/) が好きで使ってたんですが、ほぼ同じ感覚で使えました。
LevelDB が流行りなら LevelDB でも全然いいなーという感想です。

LevelDB についてはここがまとまってました。

* [LevelDB入門 (基本編)](http://yosuke-furukawa.hatenablog.com/entry/2014/05/05/095207)

# 使い方
Qiita に書きました。

* [Rubotyのデータ永続化にLevelDBを使う](http://qiita.com/nownabe/items/06977acec7f08133d8c9)

# 感想
Ruboty まわりはとてもコードが綺麗でよく見てるんですが、本当に参考になります。
ruboty-leveldb もほとんど [ruboty-redis](https://github.com/r7kamura/ruboty-redis) まんまです w

…今気づいたんですが Ruboty の README で ruboty-leveldb が紹介されてる…！！
ありがとうございます！！

https://github.com/r7kamura/ruboty
