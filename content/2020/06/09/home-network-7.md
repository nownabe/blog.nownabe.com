---
title: "自宅ネットワーク改善日記その7 VLAN編"
tags:
- network
- YAMAHA
- YAMAHA RTX830
date: 2020-06-09T20:13:46+09:00
lastmod: 2020-06-09T20:13:46+09:00

draft: true
isCJKLanguage: true

image: img/nownabe.png
---

```
TODO: Change date
TODO: Change OG Image
```

今回はVLANを設定してサーバをインターネットに公開した話です。
こんなにVLANとかルーティングとかに思いを馳せたのは5年以上前にIDCF(データセンター事業者)で働いていたとき以来だったので、なかなか苦労したけどその分この改善日記シリーズで一番楽しく構築できました。

前回まで:

* [その1 調査編](/2020/05/26/home-network-1/)
* [その2 L2SW交換編](/2020/05/28/home-network-2/)
* [その3 光開通編](/2020/05/29/home-network-3/)
* [その4 RTX830導入編](/2020/05/30/home-network-4/)
* [その5 Google Nest Wifi導入編](/2020/05/31/home-network-5/)
* [その6 IPv4 over IPv6編](/2020/06/01/home-network-6/)

## あらすじ

前回IPv4 over IPv6を設定したことで、ついに快適にインターネットできる環境が整いました。

<img src="/images/2020/06/01/compare-ipoe.png" width="800">

普通にインターネットを使う環境が整ったので、今回は特に困ってないけどやりたかったことをやりました。具体的には、

* グローバルIPが手に入ったのでサーバをインターネットに公開
* VLAN対応NW機器が手に入ったのでサーバ用とそれ以外用でネットワークを分割

ということをしました。

## やったこと

サーバ用のネットワークをVLANを使って普段使いのネットワークとわけました。
以後、サーバ用でない普段使い用のネットワークをホームネットワークとします。
また、サーバ用のネットワークをインターネットに公開しました。

これらを実現するために必要なタスクは次の4つでした。

* 設計 (論理・物理)
* 物理構築
* VLAN構築
* ルータ設定
  * ルーティング
  * フィルタリング
  * IPマスカレード

以下、それぞれ順に説明します。

## 設計

まず、雑に論理構成を設計しました。といっても、ネットワークアドレスを決めたぐらいです。

* lan1 - 192.168.100.0/24 - ホームネットワーク
  * RTX830のデフォルト設定をそのまま使う
* lan1/1 (VLAN1001) - 10.0.0.0/13 - サーバネットワーク
  * 10.0.0.0/9から切り出す感じで
  * GCPにVPNでつなげたくて、わかりやすくGCPのデフォルトの10.128.0.0/9を避けた
  * RTX830のVLAN数上限32の半分をサーバ用として、均等に分割して/13になった
  * 今のところこういう使い方を想定してます
    * 10.0.0.0/15 物理機器
    * 10.2.0.0/15 Kubernetes Service
    * 10.4.0.0/14 Kubernetes Pod

VLAN1001が無駄にでかく設計してしまって、未来永劫こんな多くのIPが必要になることがないのはわかりきってるので、そのうち小さくするかもしれませんw
この段階を構成図にするとこんな感じです。

<img src="/images/2020/06/09/rough-logical-diagram.png" width="800">

NASはインターネットに公開しなくてもインターネット側から使うことができるのと、サーバから使わない予定なので、ホームネットワークに置いています。

次に、物理構成を設計しました。どのケーブルをどのポートにつなぐかってところですね。

<img src="/images/2020/06/09/physical-diagram.png" width="800">

この構成図には書いてないですが、現在はnownabe roomのスイッチのポート6の先にもう一台スイッチがあり、Raspberry Pi 4が4台接続されています。

## 物理構築

設計した通りにLANケーブルをつないでいきました。

## VLAN構築

VLANを構築するために、スイッチとルータそれぞれ設定しました。

### GS308T

まず、2台のNETGEAR GS308TにVLAN1001の設定をしました。

GS308TはWeb UIで設定するんですが、それぞれのIPアドレスは[NETGEAR Insight](https://play.google.com/store/apps/details?id=com.netgear.insight&hl=ja)というアプリで調べました。
同じネットワークにあるNETGEAR機器を一覧表示してくれます。
実はアプリでいろいろ設定できるんじゃないかと思ってインストールしたんですが、ほぼIPがわかる程度でした。

IPがわかったらブラウザでそのIPにアクセスして、デフォルトのパスワードである `password` を入力してログインしました。次の順にVLANを設定しました。

* `Switching > VLAN > Advanced > VLAN Configuration`
  * わかりやすいように名前をつけてVLAN 1001を追加

<img src="/images/2020/06/09/vlan1.png" width="600">

* `Switching > VLAN > Advanced > VLAN Membership`
  * VLAN IDで `1001` を選択
  * Portsっていうのが物理ポート
  * `U` はVLANの出口ポート
  * `T` はTrunk (VLANタグを付けたまま送信する) ポート

<img src="/images/2020/06/09/vlan2.png" width="600">

* `Switching > VLAN > Advanced > Port PVID Configuration`
  * `g5`、`g6`、`g7`を選択
  * PVIDを `1001` に設定
  * PVIDはVLANの入り口

<img src="/images/2020/06/09/vlan3.png" width="600">

### RTX830


## hoge

VLAN使えばなんとかなるやろRTX1210
