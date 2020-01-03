---
title: "JavaScript で Github Action を作ってみた"
tags:
- GitHub Actions
- GitHub Action
- JavaScript
date: 2020-01-03T21:52:48+09:00
lastmod: 2020-01-03T21:52:48+09:00

draft: false
isCJKLanguage: true

image: images/2020/01/03/github-action-javascript.png
---

![JavaScript](/images/2020/01/03/github-action-javascript.png)

JavaScript で GitHub Action を実装して公開しました。
今までは Dockerfile を書いてたんですが、公式から「できれば JavaScript で作ってくれよな！」的な圧力を感じて、いつまでも Dockerfile に頼ってたらアカンと思ったので JavaScript で実装してみました。

作った Action は [nowactions/update-majorver](https://github.com/nowactions/update-majorver) です。

## なぜ Docker より JavaScript がいいのか

どっかで公式は JavaScript を推奨しているというのを見た気がしないでもないんですが記憶が定かではないので、個人的に考えている理由を書きます。

理由はとても単純で、JavaScript だとすべての OS で動作するからです。
Docker だと Linux (Ubuntu) でしか動作しません。
JavaScript だと Linux、Windows、macOS すべてで動作します。

おそらくはこれが理由で、公式の [Action](https://github.com/actions) もほぼ全て JavaScript (又は TypeScript) で実装されています。

とは言いつつも、単体の step で Workflow が完結するような Action だとか、Windows？Mac？そんなマイノリティ知らんということで Linux だけで動けばいいという判断もできると思います。
今回 JavaScript で実装してみて、そんな場合でも Docker ではなく JavaScript で実装することにメリットはあるなぁと感じました。

* JavaScript で書ける
  * ある程度複雑な処理では Bash より遥かに楽に書けることが多いです。個人的には async/await で JavaScript 書きたくない感はほぼなくなったのでなかなか嬉しいです
* Docker というレイヤーがない
  * マシン上で直接動作するのではやいです。小さいビルド済みイメージだとそんな変わらないかもしれませんが、ビルドが走る場合と比べたら爆速です
  * あと単純に余分なものがなくて minimal 感があっていいです
* [toolkit](https://github.com/actions/toolkit) が便利
  * Action を実装するための npm パッケージなんですが、便利でした。inputを直感的に得られたり、Octokitが簡単に使えたりして助かりました
  * 今回は core と github だけ使いましたが、exec、io、tool-cache も便利そうです
* テストしやすい
  * JavaScript なのでテストできます
* 書ける人多い
  * 複雑な Bash スクリプトよりは多い、んじゃないかと思ってます。知らんけど

## 作ってどうだったか

上に全部書いてしまったんですが、なかなかよかったです。

やっぱり Bash よりは JavaScript で書くのが楽ですね。

作る前はビルドとかなんかめんどくさそうというイメージがあったんですが、特にそんなこともなかったです。
index.js を作ればもう動きます。
prettier したり jest したりもできて開発体験はよかったです。

また、Docker で作るときって Base イメージを選ぶところから、その後の実装についてもかなり選択肢が多いんですが、 JavaScript だとそのへんの選択肢はなくて脳への負担が少なくてよかったです。
フレームワークに乗っかる感じですね。というか toolkit が Action のフレームワークなんだと思います。

## Action で Docker はオワコンなのか

そんなことはないです。
Dockerfile を書いた方がいいという場合も全然あるので、適材適所で使い分けるのが良いです。

とはいえ、すべてのOSで動作するので公開する Action は JavaScrit で作る努力をしたほうがいいのかなーと思います。
