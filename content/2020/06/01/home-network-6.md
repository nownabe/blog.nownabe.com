---
title: "自宅ネットワーク改善日記その6 IPv4 over IPv6編"
tags:
- network
- PPPoE
- DS-Lite
date: 2020-06-01T22:18:28+09:00
lastmod: 2020-06-01T22:18:28+09:00

draft: false
isCJKLanguage: true

image: images/2020/06/01/compare-ipv4.png
---

今回はDS-LiteでIPv4通信が90倍速くなった話です。

<img src="/images/2020/06/01/compare-ipv4.png" width="800">

前回まで:

* [その1 調査編](/2020/05/26/home-network-1/)
* [その2 L2SW交換編](/2020/05/28/home-network-2/)
* [その3 光開通編](/2020/05/29/home-network-3/)
* [その4 RTX830導入編](/2020/05/30/home-network-4/)
* [その5 Google Nest Wifi導入編](/2020/05/31/home-network-5/)

## あらすじ

その1からその5で、ルータ、スイッチ、アクセスポイント、ケーブルといった物理的な機器については予定してた構成が整いました。
しかし、フレッツ光回線ということもあって相変わらず混雑時間帯は数Mbps以下しかでないという状況でした。

今回はその状況を改善するために、IPoEによる高速なIPv6通信を設定して、さらにDS-LiteによるIPv4 over IPv6でIPv4通信も高速化しました。

## IPv6 (IPoE) 設定

IPv6で通信するときは、混雑して低速なPPPoEではなく高速なIPoEという接続方式を選択できます。
例えばYouTubeやNetflixといったIPv6に対応しているサイトであれば、IPoEを使ってIPv6で接続すれば高速に通信できます。

というわけで、まずはIPoEを設定しました。
設定はRTX830のWeb GUIで行いました。

`Web GUI > かんたん設定 > プロバイダー設定 > 新規` で、接続種別にIPv6 IPoEを選択するだけです。これでIPv6で通信できるようになります。

Netflixの[fast.com](https://fast.com)やCloudflareの[Speed Test](https://speed.cloudflare.com/)のようなインターネット速度計測サイトであれば接続元のIPが表示されるので、今IPv4で接続しているかIPv6で接続しているかが簡単に判断できます。

次の画像は、混雑時間に連続してPPPoEなIPv4とIPoEなIPv6をfast.comで計測した結果です。

<img src="/images/2020/06/01/compare-pppoe-ipoe.png" width="800">

IPv4かIPv6かは下部に表示されているクライアントのIPで判断できます。
IPv4に比べてIPv6だと120倍以上のスピードが出ていることがわかります。

次のカーネルパラメータを設定してIPv6を有効化/無効化することで、クライアント側のIPv4とIPv6を切り替えました。

```bash
net.ipv6.conf.all.disable_ipv6 = 0 or 1
net.ipv6.conf.default.disable_ipv6 = 0 or 1
```

## IPv4 over IPv6 (DS-Lite) 設定

IPv6では高速に通信できるようになったといっても、まだまだIPv4も現役です。
IPv4についても、IPv4 over IPv6でIPv4通信をカプセル化してIPv6の通信にのせることで、IPoEと同様のスピードで通信できるようになります。
IPv4 over IPv6にもいくつかありますが、今回はIIJmioひかりが対応しているDS-LiteでIPv4を高速化しました。
IIJmioひかりではInternet Mutifeed社のtransixというサービスでDS-Liteを提供しています。

Web GUIでは設定できないので、公式の[設定例](http://www.rtpro.yamaha.co.jp/RT/docs/ipip/index.html#setting9)を参考にコマンドで設定しました。以下が設定コマンドです。

```bash
> administrator
# ip route default gateway tunnel 1
# tunnel select 1
# tunnel endpoint name gw.transix.jp
# tunnel enable 1
# tunnel encapsulation ipip
# save
```

解説ブログやドキュメントでRTX系のルータだと`gw.transix.jp`というホスト名は指定できないと書いてあることがありますが、RTX830だと`tunnel endpoint name`で問題なく指定できます。他の機種だとファームウェアのバージョンによったりするみたいです。

`tunnel encapsulation ipip`というのが、IPv4をカプセル化してIPv6のトンネルに流すという設定ですね。

次の画像は、連続してDS-LiteなIPv4とIPoEなIPv6をfast.comで計測した結果です。

<img src="/images/2020/06/01/compare-ipoe.png" width="800">

IPv4でもIPv6と同等のスピードがでています！！やったぜ！！！ :tada::tada::tada:

## おわりに

IPv4でもIPoEなIPv6と同等なスピードが出るようになりました :rocket::sparkles:

これでようやく、弊家の劣悪なインターネット環境がまともになりました。よかった… :sob::sparkles:

ツイッターのタイムラインにはちゃんと画像が表示されるし、ミーティング中に声が途切れることもなくなったし、インターネットって素晴らしいですね！ :sparkling_heart:
