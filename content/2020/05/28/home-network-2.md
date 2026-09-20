---
title: "自宅ネットワーク改善日記その2 L2SW交換編"
tags:
- network
date: 2020-05-28T21:30:56+09:00
lastmod: 2020-05-28T21:30:56+09:00
---

[前回の調査](https://blog.nownabe.com/2020/05/26/home-network-1/) で自宅 LAN を構成している L2 スイッチがすべて 100Mbps だということがわかったのでまとめて交換しました。

全日記:

* [その1 調査編](/2020/05/26/home-network-1/)
* [その2 L2SW交換編](/2020/05/28/home-network-2/)
* [その3 光開通編](/2020/05/29/home-network-3/)
* [その4 RTX830導入編](/2020/05/30/home-network-4/)
* [その5 Google Nest Wifi導入編](/2020/05/31/home-network-5/)
* [その6 IPv4 over IPv6編](/2020/06/01/home-network-6/)
* [その7 VLAN編](/2020/06/10/home-network-7/)

## おさらい

交換前の物理構成図はこんな感じです。
交換対象の L2SW は CO-BSW08TX と ETX-SH5 ですね。

<img src="/images/2020/05/26/physical-diagram.png" width="800" alt="" height="536">

で、有線だと 100BASE-TX のスイッチを経由するので 100Mbps までしかでませんでした。

<img src="/images/2020/05/26/compare-lan.png" width="600" alt="" height="294">

インターネットではなく、LAN 内で iperf を使って計測した結果は次の通りです。

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

やはり LAN 内通信でも 100Mbps を超えることはなく、94.6Mbps しかでていません。

## 新しいL2スイッチ

今回は NETGEAR の [GS308T](https://www.jp.netgear.com/business/products/switches/smart/GS308T.aspx) という L2SW を 2 つ買いました。

<img src="/images/2020/05/28/home-network-2/banner.webp" width="600" alt="" height="303">

選んだ理由は、

* VLAN に対応している
* ポート数が十分
* 値段が高くない
* 発売日が新しい

といったところです。

## 物理構成

といっても ToR (Top of 収納 Rack) と nownabe 部屋 (リビングの片隅) の L2SW を入れ替えただけです。
他の部分も論理構成も変えてません。

<img src="/images/2020/05/28/physical-diagram.png" width="800" alt="" height="530">

おかげで LAN 内の有線接続がすべて 1000BASE-T となりました :tada:

## 計測

まず、LAN 内のローカル通信の速度を iperf で計測しました。

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

なんと 942Mbps も出ています :tada:
交換前に比べて約 10 倍、約 1Gbps のスピードです :heart:

次に、インターネット速度を計測しました。

<img src="/images/2020/05/28/compare.png" width="800" alt="" height="327">

ちゃんと 100Mbps 以上出ています！めでたい :fish:

## おわりに

今まで 100Mbps な環境を放置していたおかげで、L2SW を交換するだけで回線速度が 10 倍になるという感動を味わうことができました。

明日はいよいよ光回線の開通工事です。ドキドキ。

## おまけ

最初は iperf で計測するために Raspberry Pi を使おうと思って、家に転がってるラズパイを探して OS インストールしてセットアップしてウキウキで計測してたんですが、そもそもラズパイが 100Mbps までしか出ない仕様で完全に無駄な時間を過ごしてしまったのでウキウキで撮った写真を供養させてください。

以下、ウキウキで OS をラズパイにインストールしてる様子とウキウキで計測し始めるも 94Mbps しか出ず絶望に打ちひしがれている様子です。

<img src="/images/2020/05/28/raspberrypi.webp" width="800" alt="" height="301">
