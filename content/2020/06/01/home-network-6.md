---
title: "自宅ネットワーク改善日記その6 IPv4 over IPv6編"
tags:
- network
- PPPoE
- DS-Lite
date: 2020-06-01T22:18:28+09:00
lastmod: 2020-06-01T22:18:28+09:00

draft: false

image: images/2020/06/01/compare-ipv4.png
---

今回は DS-Lite で IPv4 通信が 90 倍速くなった話です。

<img src="/images/2020/06/01/compare-ipv4.png" width="800">

全日記:

* [その1 調査編](/2020/05/26/home-network-1/)
* [その2 L2SW交換編](/2020/05/28/home-network-2/)
* [その3 光開通編](/2020/05/29/home-network-3/)
* [その4 RTX830導入編](/2020/05/30/home-network-4/)
* [その5 Google Nest Wifi導入編](/2020/05/31/home-network-5/)
* [その6 IPv4 over IPv6編](/2020/06/01/home-network-6/)
* [その7 VLAN編](/2020/06/10/home-network-7/)

## あらすじ

その 1 からその 5 で、ルータ、スイッチ、アクセスポイント、ケーブルといった物理的な機器については予定してた構成が整いました。
しかし、フレッツ光回線ということもあって相変わらず混雑時間帯は数 Mbps 以下しかでないという状況でした。

今回はその状況を改善するために、IPoE による高速な IPv6 通信を設定して、さらに DS-Lite による IPv4 over IPv6 で IPv4 通信も高速化しました。

## IPv6 (IPoE) 設定

IPv6 で通信するときは、混雑して低速な PPPoE ではなく高速な IPoE という接続方式を選択できます。
例えば YouTube や Netflix といった IPv6 に対応しているサイトであれば、IPoE を使って IPv6 で接続すれば高速に通信できます。

というわけで、まずは IPoE を設定しました。
設定は RTX830 の Web GUI で行いました。

`Web GUI > かんたん設定 > プロバイダー設定 > 新規` で、接続種別に IPv6 IPoE を選択するだけです。これで IPv6 で通信できるようになります。

Netflix の [fast.com](https://fast.com) や Cloudflare の [Speed Test](https://speed.cloudflare.com/) のようなインターネット速度計測サイトであれば接続元の IP が表示されるので、今 IPv4 で接続しているか IPv6 で接続しているかが簡単に判断できます。

次の画像は、混雑時間に連続して PPPoE な IPv4 と IPoE な IPv6 を fast.com で計測した結果です。

<img src="/images/2020/06/01/compare-pppoe-ipoe.png" width="800">

IPv4 か IPv6 かは下部に表示されているクライアントの IP で判断できます。
IPv4 に比べて IPv6 だと 120 倍以上のスピードが出ていることがわかります。

次のカーネルパラメータを設定して IPv6 を有効化/無効化することで、クライアント側の IPv4 と IPv6 を切り替えました。

```bash
net.ipv6.conf.all.disable_ipv6 = 0 or 1
net.ipv6.conf.default.disable_ipv6 = 0 or 1
```

## IPv4 over IPv6 (DS-Lite) 設定

IPv6 では高速に通信できるようになったといっても、まだまだ IPv4 も現役です。
IPv4 についても、IPv4 over IPv6 で IPv4 通信をカプセル化して IPv6 の通信にのせることで、IPoE と同様のスピードで通信できるようになります。
IPv4 over IPv6 にもいくつかありますが、今回は IIJmio ひかりが対応している DS-Lite で IPv4 を高速化しました。
IIJmio ひかりでは Internet Mutifeed 社の transix というサービスで DS-Lite を提供しています。

Web GUI では設定できないので、公式の [設定例](http://www.rtpro.yamaha.co.jp/RT/docs/ipip/index.html#setting9) を参考にコマンドで設定しました。以下が設定コマンドです。

```bash
> administrator
# ip route default gateway tunnel 1
# tunnel select 1
# tunnel endpoint name gw.transix.jp
# tunnel enable 1
# tunnel encapsulation ipip
# save
```

解説ブログやドキュメントで RTX 系のルータだと `gw.transix.jp` というホスト名は指定できないと書いてあることがありますが、RTX830 だと `tunnel endpoint name` で問題なく指定できます。他の機種だとファームウェアのバージョンによったりするみたいです。

`tunnel encapsulation ipip` というのが、IPv4 をカプセル化して IPv6 のトンネルに流すという設定ですね。

次の画像は、連続して DS-Lite な IPv4 と IPoE な IPv6 を fast.com で計測した結果です。

<img src="/images/2020/06/01/compare-ipoe.png" width="800">

IPv4 でも IPv6 と同等のスピードがでています！！やったぜ！！！　:tada::tada::tada:

## おわりに

IPv4 でも IPoE な IPv6 と同等なスピードが出るようになりました :rocket::sparkles:

これでようやく、弊家の劣悪なインターネット環境がまともになりました。よかった… :sob::sparkles:

ツイッターのタイムラインにはちゃんと画像が表示されるし、ミーティング中に声が途切れることもなくなったし、インターネットって素晴らしいですね！　:sparkling_heart:
