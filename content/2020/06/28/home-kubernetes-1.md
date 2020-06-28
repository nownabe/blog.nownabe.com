---
title: "おうちKubernetes構築日記その1 Raspberry Pi編"
tags:
- Kubernetes
date: 2020-06-28T19:55:52+09:00
lastmod: 2020-06-28T19:55:52+09:00

draft: false
isCJKLanguage: true

image: images/2020/06/28/pi-stack.jpg
---

[家に光回線を引いて](https://blog.nownabe.com/2020/05/29/home-network-3/)グローバルIPが手に入ったとほぼ同時にRaspberry Pi 4の8GB版が発売になり、機は熟したということでずっとやりたかったおうちKubernetesを構築しました。

<img src="/images/2020/06/28/pi-stack.jpg">

## おうちKubernetesとは

その名の通り、おうちで構築・運用するKubernetesです。
Raspberry Piを使って構成するケースが多いようです。

おうちKubernetesはもう何年も前から組みたかったんですが、Raspberry Pi 3ではメモリが1GB、Raspberry 4でも4GBしかなかったので実用性ないよなーってことで保留してました。
そこに、メモリを8GB搭載したRaspberry Pi 4が今月2020年5月末に発売され、ついに来たぞということで4台買って構築しました。

## 構成

構成ってほどでもないんですが、こんな感じです。

![nodes](/images/2020/06/28/nodes.png)

昔から家にあったサーバをmasterにして、ラズパイ4台はすべてWorkerノードとして利用しています。
なので合計16 core、32GBのクラスタになります。
これだけあるとまあまあ遊べそうな気がしてきます。

master用のサーバははるか昔にファイルサーバ用として組んだマシンなのでスペックはしょぼいんですが、ディスクは大量に積んでたのでそのうちPersistent Volumeとして利用できるようにしたいなーと考えています。
ちなみに、しばらく使ってなくてメモリ32GBぐらいは積んでるだろうと思って起動したところ8GBしかなくて、ラズパイと同じやんけ！と叫びながら8GB追加しました。
まさかまたDDR3のメモリを買うことになるとは…。

ネットワークに関しては、今回無線での接続はせずに有線で接続しました。
移動する予定もないし、そもそもサーバ用のNWに入るWifiを用意していなかったからです。

## 材料

Kubernetesまわりの材料はこんな感じです。

![parts](/images/2020/06/28/parts.jpg)

| 材料 | 個数 | 備考 |
|---|---|---|
| [Raspberry Pi 4 Model B / 8GB](https://www.switch-science.com/catalog/6370/) | 4 | Switch Scienceに在庫がありました。 |
| [サムスン EVO Plus 512GB microSDCX](https://amzn.to/3dzHxnO) | 4 | 正直こんなでかい容量いらんかった… |
| [GeeekPi Raspberry Pi 4 モデルB用Piラックケース](https://amzn.to/31rHuYG) | 1 | ラズパイ4はヒートシンクとファン必須らしい |
| [エレコム EHC-G05PA-SB](https://amzn.to/3i9jZJM) | 1 | ハブ。USB給電で動くもの |
| [エレコム LANケーブル CAT6 0.15m](https://amzn.to/3g50iB5) | 2 | あとでもう2本買い足した |
| [エレコム LANケーブル CAT6 0.30m](https://amzn.to/3eBykN3) | 2 | 全部0.15mで良かった |
| [Anker PowerPort Speed 5](https://amzn.to/2YEAi9I) | 1 | 給電用。5ポートある |
| [Micro USB充電ケーブル 30cm](https://amzn.to/2YHPUcS) | 1 | ハブ用 |
| [USB-C 充電ケーブル 30cm 2本入り](https://amzn.to/3dzGCDS) | 2 | ラズパイ用。合計4本 |
| [8.9インチポータブルモニタ](https://amzn.to/2Ag5L96) | 1 | 初期設定用 |
| [Micro-HDMI to Mini-HDMI ケーブル](https://amzn.to/2VlbsKb) | 1 | ラズパイとポータブルモニタ接続用 |

この構成だとラズパイ4の仕様的に電源容量が不足してるんですが、今の所問題なく動作しています。
負荷があがったときとかに問題が出てきたらまたなんか考えます。

初期設定するためにポータブルモニタを買ってみたんですが、これがめちゃくちゃ便利でした。
サーバにネットワーク経由で入れなくなったときのトラブルシュート用に最高です。

Workerノードでなにかしらの分散ストレージを組むつもりで速くて容量の大きいSDカードを買ったんですが、今は貴重なWorkerのリソースをストレージに割きたくないなーってなってます。
というわけで良いSDカードは無駄になりそうです :joy:

## SDカード準備

さて、前置きが長くなりましたがここから実際の作業の様子です。
といっても最初は地味な作業で、ラズパイ用のOSイメージをSDカードに書き込む作業です。

OSは[Raspberry Pi OS Lite (Buster)](https://www.raspberrypi.org/downloads/)にしました。
デスクトップは不要なのでLiteです。
今はもうRaspbianって言わないんですね。

ダウンロードしたイメージは `dd` コマンドでSDカードに書き込みました。

```bash
umount /dev/sdc1
sudo dd bs=4M if=2020-05-27-raspios-buster-lite-armhf.img of=/dev/sdc
```

![sd cards](/images/2020/06/28/sdcards.jpg)

## ラック組み立て

ラックケースにはこんな感じの部品が入っていました。
互換性があるのでラズパイ3用のヒートシンクも入っていますが今回は使いません。

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

これを繰り返し、4台のラズパイをインストールすればラックの組み立ては完了です！
お美しい！！ :tada: :sparkles:

![non cabled rack](/images/2020/06/28/non-cabled-rack.jpg)

## ケーブリング

次はケーブリングです。
LANケーブルと電源ケーブルを接続していきます。

![cables](/images/2020/06/28/cables.jpg)

いろいろ試行錯誤して最も綺麗に納まるなというところで、Ankerとハブを両面テープでラックに固定しました。
こんな感じです。

<div style="display: flex; max-width: 100%;">
<img src="/images/2020/06/28/pi-stack.jpg" style="max-width: 50%; height: auto;">
<img src="/images/2020/06/28/pi-stack2.jpg" style="max-width: 50%; height: auto;">
</div>

このときは30cmのLANケーブルを使っていてくるくるしてる部分があるのですが、今は15cmのケーブルに買い替えてよりすっきりしています。

電源ケーブルの方は同じ長さのUSBケーブルを買ったにも関わらず微妙に長さが違っていたんですが、それがいい感じに働いてはからずもスッキリと納まってくれました。

## OSセットアップ

最後に、OSの初期設定をしました。
とりあえずSSHさえできればあとはなんとかなるので、SSHの設定までです。

こんな感じで、1台ずつポータブルモニタとキーボードをつないでセットアップしていきました。

![os-setup](/images/2020/06/28/os-setup.jpg)

以下はだいたい `root` でコマンドを実行しています。

まずはOSを64bitモードで起動するようにします。

```bash
echo "arm_64bit=1" >> /boot/config.txt
```

Static IPを設定します。

```bash
# /etc/dhcpcd.conf

interface eth0
static ip_address=10.0.1.101/13
static routers=10.0.0.2
static domain_name_servers=10.0.0.2
```

SSHを有効にします。

```bash
systemctl enable ssh
```

一度rebootします。

```bash
reboot
```

これで、一応SSHできるようになりました。
ただ、初期ユーザ・初期パスワードでSSHログインできてしまうのでもう少し設定していきます。

SSHでログインします。

```bash
$ ssh pi@10.0.1.101
```

一応64bitになってるか確認しておきます。

```bash
$ uname -m
aarch64
```

以下、

* 言語設定
* ホスト名設定
* IPv6無効化
* SSH設定
* nownabeユーザ作成
* nownabeユーザSSH設定
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

これで一旦OSのセットアップはおわりです。
これを4台分やることになります。

## おわりに

その1はここまでです。まだ全然Kubernetes関係ないですね。

組み立てたラックケースは机の隅っこに置いてるんですが、ストレス感じたときとかにラズパイのLEDをぼーっと眺めると癒やされるのでとても重宝しています。
あとは電気消して暗闇で光ってるの眺めると満足感を得られるのでおすすめです :satisfied:

![on-desk](/images/2020/06/28/on-desk.jpg)

次回Kubernetes！といきたいところですが、次回は自宅用DNSサーバを立てる話になりそうです。
