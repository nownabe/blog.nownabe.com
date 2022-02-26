---
title: "5年前に書いた React/Redux アプリから Redux を処した"
category: note
tags:
- React
- Redux
- Recoil
date: 2022-02-26T17:17:16+09:00
lastmod: 2022-02-26T17:17:16+09:00

draft: false
isCJKLanguage: true

image: images/2022/02/26/brainfuck-board-escaped-from-redux.png
---

もっと気軽にブログを書いていこう記事第一弾。
第二弾もあってほしい。

![brainfuck-board-escaped-from-redux](/images/2022/02/26/brainfuck-board-escaped-from-redux.png)


## やったこと

5年前に作った React と Redux で書いたウェブアプリを Next.js と Hooks と Recoil で動くようにほぼ全て書き換えた。
[Brainfuck Board](https://brainfuck-board.nownabe.com/) という Brainfuck を実行できるウェブアプリで、Dependabot がうるさかったり、完成度が中途半端だったりでずっとなんとかしたいとは思っててようやく手を付けることができた。

[nownabe/brainfuck-board: Brainfuck Platform](https://github.com/nownabe/brainfuck-board)

やったことを時系列に羅列するとこんな感じ。

* ソースコード見て当時の振り返り
* 最新のナウい状態管理の調査。Recoil がいいらしい
* Redux から Hooks/Recoil にどうやって移行するか検討
* ちまちま変えていくのはだるそうだったので、スクラッチで書き換え
* [プルリク](https://github.com/nownabe/brainfuck-board/pull/192)をマージ
* Vercel にデプロイ
* 細かいところ整えたり、バグ修正したり、新機能つけたり
* Renovate で automerge な設定


## 感想

時代の進化を感じることができてとても良かった。
Web フロント界隈は流れが早いだの落ち着かないだの言われてたけど、5年前の実装を思い出しながら書いてると正当に進化してるなーと改めて思った。

* Redux をやめて Hooks ベースになっただけでめっちゃスッキリしてさすがのこんまりもびっくりすると思う
* 単純にファイル数・コードが減るし、レイヤードなアーキテクチャのまとまりがよくなる気がする
* Redux 関係だけじゃなくて、自分の窓から投げ捨てたくなるようなコードも捨てられて最高
* Suspense 使いたかったけど使いどころがなくて残念
* Firebase まわりの実装はまだ納得いってない
* 内面だけじゃなくてアプリ自体も良くなってよかった
* 今回はスクラッチで書き直したけど、地道な移行もできなくはなさそう (技術的には可能)

## おわりに

メンテは計画的に。

![Contribution](/images/2022/02/26/contribution.png)
