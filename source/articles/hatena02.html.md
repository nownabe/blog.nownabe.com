---
title: RubotyのデータをLevelDBで永続化するruboty-leveldbというGemを作った
tags: ruby, leveldb, ruboty
created_at: 2015-03-01 19:10:15 +0900
updated_at: 2015-03-01 19:10:15 +0900
published: true
---

# 経緯
会社でチャットボットとして[Ruboty](https://github.com/r7kamura/ruboty)を使ってます。

Rubotyはデータの永続化にプラグインを使わないといけないんですが、今はRedis用のプラグインしか用意されていません。
（もしかしたら誰か作ってるのがあるかも）

おそらく、RubotyはHeroku + Redis To Goのような環境で運用されることを想定されていて、Redis用のプラグインしかないんだと思います。
プライベートで使ってるのはその構成なんですが、会社では自前のサーバでDockerコンテナとして動作させています。

外部のサーバに置きたくなくてそうしてるのでデータも内部に持ちたかったんですが、RubotyのためだけにRedisサーバ運用するのもなんだかなーとしばらくデータ永続化せずに使ってました。

けどこのままはアカンなーということで、[LevelDB](https://github.com/google/leveldb)を使ってRubotyのデータを永続化できる[ruboty-leveldb](https://rubygems.org/gems/ruboty-leveldb)というプラグインを作成しました！

# なぜLevelDB？
正直言うと、余分なサーバ建てずにデータの永続化ができればテキストファイルでも他のKVSでもなんでも良かったんですが、使ってみたかったのでLevelDBにしました。

Rubotyのデータぐらいだと、LevelDBが他のKVSに比べてどういいのかとかは全然見えません。

個人的には[KyotoCabinet](http://fallabs.com/kyotocabinet/)が好きで使ってたんですが、ほぼ同じ感覚で使えました。
LevelDBが流行りならLevelDBでも全然いいなーという感想です。

LevelDBについてはここがまとまってました。

* [LevelDB入門 (基本編)](http://yosuke-furukawa.hatenablog.com/entry/2014/05/05/095207)

# 使い方
Qiitaに書きました。

* [Rubotyのデータ永続化にLevelDBを使う](http://qiita.com/nownabe/items/06977acec7f08133d8c9)

# 感想
Rubotyまわりはとてもコードが綺麗でよく見てるんですが、本当に参考になります。
ruboty-leveldbもほとんど[ruboty-redis](https://github.com/r7kamura/ruboty-redis)まんまですw

…今気づいたんですがRubotyのREADMEでruboty-leveldbが紹介されてる…！！
ありがとうございます！！

https://github.com/r7kamura/ruboty
