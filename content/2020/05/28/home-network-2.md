---
title: "自宅ネットワーク改善日記その2 L2SW交換編"
tags:
- network
date: 2020-05-28T21:30:56+09:00
lastmod: 2020-05-28T21:30:56+09:00

draft: false
isCJKLanguage: true

image: images/2020/05/28/gs308t.png
---

[前回の調査](https://blog.nownabe.com/2020/05/26/home-network-1/)で自宅LANを構成しているL2スイッチがすべて100Mbpsだということがわかったのでまとめて交換しました。

## おさらい

交換前の物理構成図はこんな感じです。
交換対象のL2SWはCO-BSW08TXとETX-SH5ですね。

<img src="/images/2020/05/26/physical-diagram.png" width="800">

で、有線だと100BASE-TXのスイッチを経由するので100Mbpsまでしかでませんでした。

<img src="/images/2020/05/26/compare-lan.png" width="600">

インターネットではなく、LAN内でiperfを使って計測した結果は次の通りです。

```bash
$ iperf -c 192.168.86.71
------------------------------------------------------------
Client connecting to 192.168.86.71, TCP port 5001
TCP window size:  162 KByte (default)
------------------------------------------------------------
[  3] local 192.168.86.35 port 47220 connected with 192.168.86.71 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec   113 MBytes  94.6 Mbits/sec
```

やはりLAN内通信でも100Mbpsを超えることはなく、94.6Mbpsしかでていません。

## 新しいL2スイッチ

今回はNETGEARの[GS308T](https://www.jp.netgear.com/business/products/switches/smart/GS308T.aspx)というL2SWを2つ買いました。

<img src="/images/2020/05/28/gs308t.png" width="600">

選んだ理由は、

* VLANに対応している
* ポート数が十分
* 値段が高くない
* 発売日が新しい

といったところです。

## 物理構成

といってもToR (Top of 収納Rack) とnownabe部屋 (リビングの片隅) のL2SWを入れ替えただけです。
他の部分も論理構成も変えてません。

<img src="/images/2020/05/28/physical-diagram.png" width="800">

おかげでLAN内の有線接続がすべて1000BASE-Tとなりました :tada:

## 計測

まず、LAN内のローカル通信の速度をiperfで計測しました。

```bash
$ iperf -c 192.168.86.71
------------------------------------------------------------
Client connecting to 192.168.86.71, TCP port 5001
TCP window size:  484 KByte (default)
------------------------------------------------------------
[  3] local 192.168.86.35 port 51748 connected with 192.168.86.71 port 5001
[ ID] Interval       Transfer     Bandwidth
[  3]  0.0-10.0 sec  1.10 GBytes   942 Mbits/sec
```

なんと942Mbpsも出ています :tada:
交換前に比べて約10倍、約1Gbpsのスピードです :heart:

次に、インターネット速度を計測しました。

<img src="/images/2020/05/28/compare.png" width="800">

ちゃんと100Mbps以上出ています！めでたい :fish:

## おわりに

今まで100Mbpsな環境を放置していたおかげで、L2SWを交換するだけで回線速度が10倍になるという感動を味わうことができました。

明日はいよいよ光回線の開通工事です。ドキドキ。

## おまけ

最初はiperfで計測するためにRaspberry Piを使おうと思って、家に転がってるラズパイを探してOSインストールしてセットアップしてウキウキで計測してたんですが、そもそもラズパイが100Mbpsまでしか出ない仕様で完全に無駄な時間を過ごしてしまったのでウキウキで撮った写真を供養させてください。

以下、ウキウキでOSをラズパイにインストールしてる様子とウキウキで計測し始めるも94Mbpsしか出ず絶望に打ちひしがれている様子です。

<img src="/images/2020/05/28/raspberrypi.png" width="800">
