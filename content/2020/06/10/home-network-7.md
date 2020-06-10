---
title: "自宅ネットワーク改善日記その7 VLAN編"
tags:
- network
- YAMAHA
- YAMAHA RTX830
date: 2020-06-10T21:33:46+09:00
lastmod: 2020-06-10T21:33:46+09:00

draft: false
isCJKLanguage: true

image: images/2020/06/10/logical-diagram.png
---

今回はVLANを設定してサーバをインターネットに公開した話です。
こんなにVLANとかルーティングとかに思いを馳せたのは5年以上前にIDCF(データセンター事業者)で働いていたとき以来だったので、なかなか苦労しました。
が、その分この改善日記シリーズで一番楽しく構築できました :smile:

全日記:

* [その1 調査編](/2020/05/26/home-network-1/)
* [その2 L2SW交換編](/2020/05/28/home-network-2/)
* [その3 光開通編](/2020/05/29/home-network-3/)
* [その4 RTX830導入編](/2020/05/30/home-network-4/)
* [その5 Google Nest Wifi導入編](/2020/05/31/home-network-5/)
* [その6 IPv4 over IPv6編](/2020/06/01/home-network-6/)
* [その7 VLAN編](/2020/06/10/home-network-7/)

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
  * IPマスカレード
  * フィルタリング

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

VLAN1001を無駄にでかく設計してしまって、未来永劫こんな多くのIPが必要になることがないのはわかりきってるので、そのうち小さくするかもしれませんw

この段階を構成図にするとこんな感じです。

<img src="/images/2020/06/10/rough-logical-diagram.png" width="800">

NASはインターネットに公開しなくてもインターネット側から使うことができるのと、サーバから使わない予定なので、ホームネットワークに置いています。

次に、物理構成を設計しました。どのケーブルをどのポートにつなぐかってところですね。

<img src="/images/2020/06/10/physical-diagram.png" width="800">

この構成図にはないですが、現在はnownabe roomのスイッチのポート6の先にもう一台スイッチがあり、Raspberry Pi 4が4台接続されています。

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
(以下はnownabe roomのGS308Tの場合。ToRも同様)

* `Switching > VLAN > Advanced > VLAN Configuration`
  * わかりやすいように名前をつけてVLAN 1001を追加

<img src="/images/2020/06/10/vlan1.png" width="600">

* `Switching > VLAN > Advanced > VLAN Membership`
  * VLAN IDで `1001` を選択
  * Portsっていうのが物理ポート
  * `U` はVLANの出口ポート
  * `T` はTrunk (VLANタグを付けたまま送信する) ポート
  * 空白はそのVLANに属さないポート

<img src="/images/2020/06/10/vlan2.png" width="600">

* `Switching > VLAN > Advanced > Port PVID Configuration`
  * `g5`、`g6`、`g7`を選択
  * PVIDを `1001` に設定
  * PVIDはVLANの入り口

<img src="/images/2020/06/10/vlan3.png" width="600">

### RTX830

VLANのルーティングをするためにRTX830にもVLANの設定をしました。
とりあえずここでは、vlanインタフェースを作ってDHCPを設定しました。
また、lan1だけでなくlan側すべてからDNSを受け付けるようにして、lan1/1 (VLAN1001)でもDNSを使えるようにしました。

```txt
# VLANインタフェースの作成
vlan lan1/1 802.1q vid=1001

# lan1/1 のRTX830のアドレスとネットマスク
ip lan1/1 address 10.0.0.2/13

# DHCPで使うIPアドレス範囲とネットワークのネットマスク
dhcp scope 1001 10.1.255.0-10.1.255.255/13

# DNSをlanインタフェース側からはすべて許可する
dns host lan
```

VLAN1001の機器は基本的に静的IPを設定するんですが、静的IP設定前でもとりあえず使えると便利なので一部のIPアドレス範囲だけDHCPを設定しています。

## ルータ設定

次にルーティングとかを設定して、VLAN1001のサーバをインターネットに公開できるように設定しました。

### ルーティング

LAN間もインターネットへも自動でルーティング設定されるんですが、このままだとインターネットに公開ができません。
というのも、[その6](/2020/06/01/home-network-6/)でIPv4の通信はDS-Liteを使うようにしていて、DS-LiteだとルータにGlobal IPがつかないからです。
なので、VLAN1001のサーバはDS-LiteではなくPPPoEを使ってインターネットに出るようにする必要があります。

図にするとこんな感じです。

<img src="/images/2020/06/10/logical-diagram.png" width="800">

RTX830のフィルタ型ルーティングを使ってデフォルトGWを設定して、DS-LiteとPPPoEの使い分けを実現しました。

```txt
ip filter 500001 pass 192.168.0.0/16 * udp,tcp * *
ip route default gateway tunnel 1 filter 500001 gateway pp 1
```

これで、`500001`にマッチする通信のみがDS-Liteの`tunnel 1`を使うようになります。

### IPマスカレード

Global IPはサーバではなくPPPoEのインタフェースに1つだけついているという状態なので、静的なIPマスカレード (NAPT) を設定して、特定のポートに対する通信を、特定のローカルIP・ポートへの通信に変換する必要があります。

今回はテストということでHTTPをサーバに割り当てました。

```txt
# NAT Descriptor 1000 はmasquarade typeとする
nat descriptor type 1000 masquarade

# NAT Descriptor 1000 にHTTPポートに関する静的IPマスカレードを設定
nat descriptor masquarade static 1000 1 10.0.1.1 tcp 80=80

# pp 1に対して設定しますよ
pp select 1

 # pp 1ではNAT Descriptor 1000を使う
 ip pp nat descriptor 1000
```

今後、公開するポートが増えたら追加していく感じになります。


### フィルタリング

初期設定だと外からの通信を許可しないようなフィルタが設定されているので、HTTPを許可する必要があります。

図にするとこんな感じです。

<img src="/images/2020/06/10/filtering.png" width="800">

最初はルーティングやNAT、フィルタリングの関係性がよくわかってなくてこの図を作りました。
こう図にするとわかりやすい気がします。

当初はLAN間もフィルタリングで通信を制御しようと考えてたんですが、まずはシンプルにやりたいことを実現するため、必要最低限のフィルタリングのみを設定しました。
`lan1/1` と `lan1` ではフィルタリングせず、インターネットの出入り口である `pp 1` と `tunnel 1` だけに対してフィルタリングを設定しました。

```txt
# PingのEcho Replyを通すフィルタ
ip filter 300000 pass * 192.168.0.0/16,10.0.0.0/9 icmp 0

# すべて拒否するフィルタ
ip filter 300099 reject * * * * *

# VLAN1001に対してのHTTPコネクション開始時の最初のパケットだけを通すフィルタ
# (3-way handshake開始のSYNパケットのみを通す)
ip filter 300001 pass * 10.0.0.0/9 tcpflag=0x0002/0x0017 * 80

# SYNパケットが通った後、そのコネクションが終了するまで通信を許可する動的フィルタ
ip filter dynamic 300001 * 10.0.0.0/9 www

pp select 1
 # PingとHTTPだけ通してあとはすべて拒否する
 ip pp secure filter in 300000 300001 300099 dynamic 300001

# すべて拒否するフィルタ
ip filter 400001 reject * * * * *

tunnel select 1
 # すべて拒否する
 ip tunnel secure filter in 400001
```

IPマスカレードと同様に、公開するポートが増えたら `pp 1` に対して許可フィルタを追加していくことになります。

## IPv6 について

今の所、サーバネットワークはIPv6に対応していません。

もともとは、サーバネットワークもホームネットワークもVLANで運用してIPv6にも対応する予定でした。
というかそう設定してたけど、なかなか上手く行かず失敗しました。
最低限だけ実現するためにできるだけシンプルにしようとして、ホームネットワークのVLANもサーバネットワークのIPv6もなくなった感じですね。

今は失敗の原因もわかっているのでどちらも設定できる気がしているんですが、もう設定が完成してしまってめんどくさいのでしばらくこれで運用すると思いますw

## 役に立ったものたち

試行錯誤する中でいろいろ調べたりトラブルシュートしたりするのに役立ったものたちを紹介します。

### 参考サイト

* [RTpro - Yamaha Network Products Home Page](http://www.rtpro.yamaha.co.jp/)
  * なんといってもこのサイトです。コマンドリファレンスや技術資料が非常に参考になりました。参考になったというかここのマニュアルがなかったら設定できません。
* [SINET Pingチェックサイト](https://www.sinet.ad.jp/connect_service/service/ping)
  * 確実にIPv4でPingが通る外部のサーバを探していて見つけました。設定が上手く行かずなかなかインターネットに繋がらなかったので確認で使わせてもらいました。
* [Cloud Shell](https://cloud.google.com/shell?hl=ja)
  * GCPが無料で提供している、Webだけでお手軽に使えるVMです。外からうちのサーバにアクセスできるか確認するのに使いました。Web Consoleからタダで素早く簡単に使えて便利です。

### 調査コマンド

このあたりのコマンドが調査で役に立ちました。
実際ログからフィルタリングのミスなんかが見つかりました。

```text
syslog debug on
syslog notice on
show log
show ip secure filter
show nat descriptor address
```

## おわりに

これで、自宅ネットワークを改善するぞ！と考え始めてからやりたかった自宅ネットワークの改善は一通り終わりました。
やったぜ！！ :tada:

インターネット速くなったし楽しかったしちゃんとやりたかったこと実現できたし非常に満足してます :satisfied:
ただ、VLANでこんな苦労するならRTX830じゃなくてRTX1210買っとけばよかったってのは思いました :joy:
最初の機器選定でどっちにするか迷ったんですよね。。。

今後は、コンフィグが汚かったりするので綺麗にしていったり、サーバで遊んだりしていこうと思います :kissing_closed_eyes:
