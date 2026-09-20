---
title: "Gem in a Boxの冗長化"
tags: ["gem in a box","ruby"]
date: 2015-08-31T01:11:48+09:00
lastmod: 2015-08-31T01:11:48+09:00
---

Gem in a Box 冗長化の情報があんまりない気がしたので Qiita に記事を書きました。
みんなどうやってるんだろう。（そもそも同期とか冗長化とかいらない場合も多そう）

[Gem in a Boxサーバーのデータをrsyncで同期する - Qiita](http://qiita.com/nownabe/items/bd3f9328b314b6c0adf6)

この記事はデータの同期だけなので、フェイルオーバーは VIP なり LB なりでやればいいと思います。

* 新しい Gem が Push されたときすぐさま同期したい
* ミドルウェアレイヤーでめんどくさいことしたくない

って時にいいんじゃないかと思います。
