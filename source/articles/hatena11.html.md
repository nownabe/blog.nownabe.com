---
title: Gem in a Boxの冗長化
tags: gem in a box, ruby
created_at: 2015-08-31 01:11:48 +0900
updated_at: 2015-08-31 01:11:48 +0900
published: true
---

Gem in a Box冗長化の情報があんまりない気がしたのでQiitaに記事を書きました。
みんなどうやってるんだろう。（そもそも同期とか冗長化とかいらない場合も多そう）

[http://qiita.com/nownabe/items/bd3f9328b314b6c0adf6:embed:cite]

この記事はデータの同期だけなので、フェイルオーバーはVIPなりLBなりでやればいいと思います。

* 新しいGemがPushされたときすぐさま同期したい
* ミドルウェアレイヤーでめんどくさいことしたくない

って時にいいんじゃないかと思います。
