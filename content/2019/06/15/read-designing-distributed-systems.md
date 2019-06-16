---
title: "『分散システムデザインパターン』を読んだ"
tags:
- book
- reading
- docker
- kubernetes
date: 2019-06-15T19:27:08+09:00
lastmod: 2019-06-15T19:27:08+09:00

draft: false
isCJKLanguage: true
---

分散システムデザインパターンを読みました。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=nownabe0c-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4873118751&linkId=339b848407093bcf66332b2b34510ec3"></iframe>

# 感想

分散システムのインフラ構成のデザインパターンの解説本です。
分散システムといっても難しいものではなくて、ロードバランスやシャーディングといったおなじみのアーキテクチャの粒度の話です。

本書でも言及してますがデザインパターンの最大の効果は共通言語の獲得で、本書はその効果が十分得られると思います。

内容はインフラ構成の汎用的なパターンと具体例です。
なぜかやたら詳しいキャッシュの説明なんかもあります。

全体的に図が非常にわかりづらいのが残念でした。

Kubernetes上で構築するワークキューの例なんかは、おーなるほど！Kubernetesだ！って感じで興味深かったです。
実際あんな感じで構築することはないと思いますが。


# こういう人におすすめ

* イチからインフラ構成を設計したことがないバックエンド・インフラエンジニア
* 目次を見てもわからない項目があるバックエンド・インフラエンジニア


前者のインフラを設計したことがないエンジニアには最もリターンがあると思います。
本書を読んで何かができるようになるというわけではないですが「こういう汎用的な設計手法があるのか」という知識が手に入ります。
また、その汎用的な設計手法の名前もわかります。
今後インフラを構築するときには設計に説得力を持てるし、バックエンドを実装するときには多様な手段を選択肢として考えることができるようになると思います。

本書の内容はインフラ寄りの話ではありますが、バックエンドの実装にも密接に関わる話です。
なのでインフラをやらないバックエンドエンジニアでも、本書の知識を持っているか持っていないかでバックエンドの実装で取れる手段の幅が大きく変わってきます。
そういうエンジニアにはぜひ読んでほしい本です。

ある程度インフラの経験がある人にとっては、デザインパターンなだけあって「ああ、これ作ったことあるな」というものばかりです。
内容的には物足りないですが、共通言語を得るという意味では読む価値はあると思います。

全体を通してKubernetesが例として使われているのでKubernetesがわからないと例を理解するのが難しいかもしれません。
逆に、Kubernetesを使った構築手法を知ることができるかもしれません。


# 著者紹介

## Brendan Burns

* Kubernetesの創始者
* GCP, Microsoft
* Twitter: [@brendanburns](https://twitter.com/brendandburns)
* GitHub: [@brendanburns](https://github.com/brendandburns)

## 松浦 隼人

* [Yakst](https://yakst.com/ja) 管理人
* インフラエンジニア
* Twitter: [@dblmkt](https://twitter.com/dblmkt)
* GitHub: [@doublemarket](https://github.com/doublemarket)


<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=nownabe0c-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4873118751&linkId=339b848407093bcf66332b2b34510ec3"></iframe>
