---
title: "おうちKubernetes構築日記その1 Raspberry Pi編"
tags:
- Kubernetes
date: 2020-06-28T19:55:52+09:00
lastmod: 2020-06-28T19:55:52+09:00
image: images/2020/06/28/pi-stack.jpg
---

[家に光回線を引いて](https://blog.nownabe.com/2020/05/29/home-network-3/) グローバル IP が手に入ったとほぼ同時に Raspberry Pi 4 の 8GB 版が発売になり、機は熟したということでずっとやりたかったおうち Kubernetes を構築しました。

<img src="/images/2020/06/28/pi-stack.jpg">

## おうちKubernetesとは

その名の通り、おうちで構築・運用する Kubernetes です。
Raspberry Pi を使って構成するケースが多いようです。

おうち Kubernetes はもう何年も前から組みたかったんですが、Raspberry Pi 3 ではメモリが 1GB、Raspberry 4 でも 4GB しかなかったので実用性ないよなーってことで保留してました。
そこに、メモリを 8GB 搭載した Raspberry Pi 4 が今月 2020 年 5 月末に発売され、ついに来たぞということで 4 台買って構築しました。

## 構成

構成ってほどでもないんですが、こんな感じです。

![nodes](/images/2020/06/28/nodes.png)

昔から家にあったサーバを master にして、ラズパイ 4 台はすべて Worker ノードとして利用しています。
なので合計 16 core、32GB のクラスタになります。
これだけあるとまあまあ遊べそうな気がしてきます。

master 用のサーバははるか昔にファイルサーバ用として組んだマシンなのでスペックはしょぼいんですが、ディスクは大量に積んでたのでそのうち Persistent Volume として利用できるようにしたいなーと考えています。
ちなみに、しばらく使ってなくてメモリ 32GB ぐらいは積んでるだろうと思って起動したところ 8GB しかなくて、ラズパイと同じやんけ！と叫びながら 8GB 追加しました。
まさかまた DDR3 のメモリを買うことになるとは…。

ネットワークに関しては、今回無線での接続はせずに有線で接続しました。
移動する予定もないし、そもそもサーバ用の NW に入る Wifi を用意していなかったからです。

## 材料

Kubernetes まわりの材料はこんな感じです。

![parts](/images/2020/06/28/parts.jpg)

| 材料 | 個数 | 備考 |
|---|---|---|
| [Raspberry Pi 4 Model B / 8GB](https://www.switch-science.com/catalog/6370/) | 4 | Switch Scienceに在庫がありました。 |
| [サムスン EVO Plus 512GB microSDCX](https://www.amazon.co.jp/dp/B07MVLX5XV?tag=nownabe02-22) | 4 | 正直こんなでかい容量いらんかった… |
| GeeekPi Raspberry Pi 4 モデルB用Piラックケース | 1 | ラズパイ4はヒートシンクとファン必須らしい |
| [エレコム EHC-G05PA-SB](https://www.amazon.co.jp/dp/B017SFTMFS?tag=nownabe02-22) | 1 | ハブ。USB給電で動くもの |
| [エレコム LANケーブル CAT6 0.15m](https://www.amazon.co.jp/dp/B00G2PY0NU?tag=nownabe02-22) | 2 | あとでもう2本買い足した |
| [エレコム LANケーブル CAT6 0.30m](https://www.amazon.co.jp/dp/B00G2PY0VW?tag=nownabe02-22) | 2 | 全部0.15mで良かった |
| [Anker PowerPort Speed 5](https://www.amazon.co.jp/dp/B01MRO0S1P?tag=nownabe02-22) | 1 | 給電用。5ポートある |
| [Micro USB充電ケーブル 30cm](https://www.amazon.co.jp/dp/B07PXQJGW5?tag=nownabe02-22) | 1 | ハブ用 |
| [USB-C 充電ケーブル 30cm 2本入り](https://www.amazon.co.jp/dp/B07PYT3S5V?tag=nownabe02-22) | 2 | ラズパイ用。合計4本 |
| [8.9インチポータブルモニタ](https://www.amazon.co.jp/dp/B07H93YBTQ?tag=nownabe02-22) | 1 | 初期設定用 |
| [Micro-HDMI to Mini-HDMI ケーブル](https://www.amazon.co.jp/dp/B07RFKYM8K?tag=nownabe02-22) | 1 | ラズパイとポータブルモニタ接続用 |

この構成だとラズパイ 4 の仕様的に電源容量が不足してるんですが、今の所問題なく動作しています。
負荷があがったときとかに問題が出てきたらまたなんか考えます。

初期設定するためにポータブルモニタを買ってみたんですが、これがめちゃくちゃ便利でした。
サーバにネットワーク経由で入れなくなったときのトラブルシュート用に最高です。

Worker ノードでなにかしらの分散ストレージを組むつもりで速くて容量の大きい SD カードを買ったんですが、今は貴重な Worker のリソースをストレージに割きたくないなーってなってます。
というわけで良い SD カードは無駄になりそうです :joy:

## SDカード準備

さて、前置きが長くなりましたがここから実際の作業の様子です。
といっても最初は地味な作業で、ラズパイ用の OS イメージを SD カードに書き込む作業です。

OS は [Raspberry Pi OS Lite (Buster)](https://www.raspberrypi.org/downloads/) にしました。
デスクトップは不要なので Lite です。
今はもう Raspbian って言わないんですね。

ダウンロードしたイメージは `dd` コマンドで SD カードに書き込みました。

```bash
umount /dev/sdc1
sudo dd bs=4M if=2020-05-27-raspios-buster-lite-armhf.img of=/dev/sdc
```

![sd cards](/images/2020/06/28/sdcards.jpg)

## ラック組み立て

ラックケースにはこんな感じの部品が入っていました。
互換性があるのでラズパイ 3 用のヒートシンクも入っていますが今回は使いません。

![case parts](/images/2020/06/28/case-parts.jpg)

まずはアクリル板に貼ってある保護シールを剥がします。
透明のラックを買ったはずが白いやんけおいと思ってたんですが、シールを剥がすと透明になりました。

![rack plate](/images/2020/06/28/rack-plate.jpg)

次にヒートシンクを取り付けました。
熱された空気がお互い干渉しないように、ヒートシンクの向きはすべて揃えました。
結構小さいので、ピンセットみたいな道具があった方がやりやすいと思います。

![heat sink](/images/2020/06/28/heatsink.jpg)

次はラズパイの取り付けです。
ファン用の換気口が空いていない底用のプレートにラズパイを取り付けます。

![on plate](/images/2020/06/28/on-plate.jpg)

次にその上にくるプレートを組み立てます。
直下のラズパイ用の空冷ファンと、そこに設置されるラズパイの基礎となるスペーサーを取り付けます。
ファンは向きを間違えるとまったく空冷の意味をなさないので、向きをしっかり確認してから取り付けました。
また、底のプレートにはプレート同士を接続するための長いスペーサーを取り付けます。

![fan](/images/2020/06/28/fan.jpg)

これを繰り返し、4 台のラズパイをインストールすればラックの組み立ては完了です！
お美しい！！　:tada: :sparkles:

![non cabled rack](/images/2020/06/28/non-cabled-rack.jpg)

## ケーブリング

次はケーブリングです。
LAN ケーブルと電源ケーブルを接続していきます。

![cables](/images/2020/06/28/cables.jpg)

いろいろ試行錯誤して最も綺麗に納まるなというところで、Anker とハブを両面テープでラックに固定しました。
こんな感じです。

<div style="display: flex; max-width: 100%;">
<img src="/images/2020/06/28/pi-stack.jpg" style="max-width: 50%; height: auto;">
<img src="/images/2020/06/28/pi-stack2.jpg" style="max-width: 50%; height: auto;">
</div>

このときは 30cm の LAN ケーブルを使っていてくるくるしてる部分があるのですが、今は 15cm のケーブルに買い替えてよりすっきりしています。

電源ケーブルの方は同じ長さの USB ケーブルを買ったにも関わらず微妙に長さが違っていたんですが、それがいい感じに働いてはからずもスッキリと納まってくれました。

## OSセットアップ

最後に、OS の初期設定をしました。
とりあえず SSH さえできればあとはなんとかなるので、SSH の設定までです。

こんな感じで、1 台ずつポータブルモニタとキーボードをつないでセットアップしていきました。

![os-setup](/images/2020/06/28/os-setup.jpg)

以下はだいたい `root` でコマンドを実行しています。

まずは OS を 64bit モードで起動するようにします。

```bash
echo "arm_64bit=1" >> /boot/config.txt
```

Static IP を設定します。

```bash
# /etc/dhcpcd.conf

interface eth0
static ip_address=10.0.1.101/13
static routers=10.0.0.2
static domain_name_servers=10.0.0.2
```

SSH を有効にします。

```bash
systemctl enable ssh
```

一度 reboot します。

```bash
reboot
```

これで、一応 SSH できるようになりました。
ただ、初期ユーザ・初期パスワードで SSH ログインできてしまうのでもう少し設定していきます。

SSH でログインします。

```bash
$ ssh pi@10.0.1.101
```

一応 64bit になってるか確認しておきます。

```bash
$ uname -m
aarch64
```

以下、

* 言語設定
* ホスト名設定
* IPv6 無効化
* SSH 設定
* nownabe ユーザ作成
* nownabe ユーザ SSH 設定
* 初期パスワード削除

をババっとやっていきます。

```bash
$ sudo -i

## 言語設定
# echo 'export LC_ALL="en_GB.UTF-8"' >> /etc/profile

## ホスト名設定
# hostnamectl set-hostname kube-worker-1.cf.nownabe.in

## IPv6無効化
# echo 'net.ipv6.conf.all.disable_ipv6 = 1' >> /etc/sysctl.conf
# sysctl -p

## SSH設定
# vim /etc/ssh/sshd_config

PermitRootLogin no
PasswordAuthentication no

## nownabeユーザ作成
# useradd -m nownabe
# usermod -aG sudo nownabe
# passwd nownabe

## nownabeユーザSSH設定
# su - nownabe
$ mkdir .ssh
$ curl -o .ssh/authorized_keys https://github.com/nownabe.keys
$ chmod 700 .ssh
$ chmod 600 .ssh/authorized_keys
$ exit

## 初期パスワード削除
# passwd -d pi

# systemctl restart sshd
# exit
```

これで一旦 OS のセットアップはおわりです。
これを 4 台分やることになります。

## おわりに

その 1 はここまでです。まだ全然 Kubernetes 関係ないですね。

組み立てたラックケースは机の隅っこに置いてるんですが、ストレス感じたときとかにラズパイの LED をぼーっと眺めると癒やされるのでとても重宝しています。
あとは電気消して暗闇で光ってるの眺めると満足感を得られるのでおすすめです :satisfied:

![on-desk](/images/2020/06/28/on-desk.jpg)

次回 Kubernetes！といきたいところですが、次回は自宅用 DNS サーバを立てる話になりそうです。
