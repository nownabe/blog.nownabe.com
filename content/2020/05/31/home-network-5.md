---
title: "自宅ネットワーク改善日記その5 Google Nest Wifi導入編"
tags:
- network
- Google
- Google Nest Wifi
- Nest Wifi
date: 2020-05-31T09:15:15+09:00
lastmod: 2020-05-31T09:15:15+09:00

draft: false
isCJKLanguage: true

image: images/2020/05/31/wifi-analyzer.png
---

今回は Google Nest Wifi を新しく導入した話です。

全日記:

* [その1 調査編](/2020/05/26/home-network-1/)
* [その2 L2SW交換編](/2020/05/28/home-network-2/)
* [その3 光開通編](/2020/05/29/home-network-3/)
* [その4 RTX830導入編](/2020/05/30/home-network-4/)
* [その5 Google Nest Wifi導入編](/2020/05/31/home-network-5/)
* [その6 IPv4 over IPv6編](/2020/06/01/home-network-6/)
* [その7 VLAN編](/2020/06/10/home-network-7/)

## あらすじ

前回、YAMAHAのRTX830を導入したことによりGoogle Wifiのルータとしての任が解かれました。
構成図はこんな感じで、ただのアクセスポイントとして機能しています。

<img src="/images/2020/05/30/physical-diagram.png" width="800">

というわけで、Wifiアクセスポイントを自由に配置できるようになりました。
今は新しく買ったGoogle Nest Wifiと今まで使ってたGoogle Wifiとを併用しています。

## Google Nest Wifi

今回新しく [Google Nest Wifi](https://store.google.com/jp/product/nest_wifi) を買いました。
ルータはRTX830にやらせるので無線アクセスポイントはブリッジするアクセスポイントであればシンプルなものほど嬉しくて、前から使ってた Google Wifi がシンプルでよかったので後継のNest Wifiにしました。

<img src="/images/2020/05/31/nest-wifi-photo.png" width="800">

ルータとして動かす必要がなくなったことで置き場所が自由になりました。
というわけで、ToRではなくリビングのGoogle Homeの横に置いて、壁内配線を経由してToRのL2SWに接続しています。

## Google Wifi

じゃあ今まで使ってたGoogle Wifiはどうすんの？そもそも新しく買う必要あったの？ってことなんですが、新しく買った理由は2つあります。

* せっかく無料で使えるマンションネットワークを活かしたかった
* 慣れないルータ設定でメイン回線がダウンする可能性が十分あるので、バックアップを用意しておきたかった

というわけで、Google WifiはマンションネットワークのNATルータ兼アクセスポイントとして現役で使っています。
バックアップWifiやゲストWifiとして使う予定です。

Google WifiとNest Wifiの2つAPを置くことで、物理構成的には予定していたものが完成しました :clap:

<img src="/images/2020/05/31/physical-diagram.png" width="800">

## 計測

一応Nest WifiはGoogle Wifiより仕様上の性能は上がってるんですが、そんな大きいものでもないし、そもそもそこは期待していた部分でもないので今回は計測してません。

それよりも、置き場所が自由になりリビングに置けたので、リビングでの電波強度の改善が期待できます。
僕の作業場所はリビングなので、普段の作業への効果も期待できます。

Androidの [Wifi Analyzer](https://play.google.com/store/apps/details?id=abdelrahman.wifianalyzerpro&hl=ja) というアプリで調べるとこんな感じでした。

<img src="/images/2020/05/31/wifi-analyzer.png" width="800">

やはりリビングではかなり改善しています。
距離はそんなに変わらないものの、棚の中にあるかどうかという点で大きく差がついている感じです。

しかし、Nest Wifiから距離が遠い妻の部屋や寝室では、だいぶ距離が近いGoogle Wifiの方が良いという結果になりました。
今のところ特に問題はなさそうですが、問題があるようならもう1台Nest Wifiを置くなどの対策を検討する必要がありそうです。

## おわりに

いよいよ物理構成が完成しました。
次からはインターネット速度の改善と論理構成の構築をやっていきます。
