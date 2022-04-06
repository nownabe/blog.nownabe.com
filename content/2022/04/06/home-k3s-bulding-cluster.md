---
title: "おうち k3s - クラスタ構築編"
tags:
- Kubernetes
- K3s
- Raspberry Pi
date: 2022-04-06T21:06:40+09:00
lastmod: 2022-04-06T21:06:40+09:00

draft: false
isCJKLanguage: true

image: images/2020/06/28/pi-stack.jpg
---

[![Raspberry Pi stack](/images/2020/06/28/pi-stack.jpg)](/images/2020/06/28/pi-stack.jpg)

## 概要

[以前作った](https://blog.nownabe.com/2020/06/28/home-kubernetes-1/) Kubernetes 用のラズパイクラスタが埃をかぶっていたので k3s クラスタとして蘇らせた。
ラズパイの初期設定も楽にできたし、k3s のインストールも感動するぐらい楽だった。

この記事ではラズパイのセットアップから k3s のインストールまでの手順を紹介する。

## やったこと

* ラズパイに OS インストール
* ラズパイの初期設定
* k3s のインストール

## 前提知識とか

### ラズパイについて

最新 (と言っても出たのは 2 年以上前) の [Raspberry Pi 4 Model B](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/) を 4 台使っている。詳細は[前回の記事](https://blog.nownabe.com/2020/06/28/home-kubernetes-1/)を参照してほしい。ラズパイ 4 はクアッドコアで最大 8GB のメモリが積めるのでそれなりに遊べるスペックを持っていて、4 台使えば 16 コア、32GB メモリのクラスタになるので Kubernetes クラスタとして個人で遊ぶには十分なものになる。

今回は以前組んだものがあったので 4 台のラズパイでクラスタを組んだが、**k3s は軽いので 1 台でも動作するし十分遊べる。[^1]とりあえず試してみたいって人は 1 台で試してみてほしい。**

[^1]: [Rancher Docs: Installation Requirements](https://rancher.com/docs/k3s/latest/en/installation/installation-requirements/#hardware)

### K3s

[K3s](https://k3s.io/) は [Rancher](https://rancher.com/) が立ち上げた軽量 Kubernetes ディストリビューションで、今は [CNCF のサンドボックスプロジェクト](https://www.cncf.io/projects/k3s/)になっている。以下の特徴を謳っている。

* High availability (を達成するためのオプションがある)
* [認定 Kubernetes ディストリビューション](https://www.cncf.io/certification/software-conformance/)
* IoT やエッジコンピューティングのための軽量 Kubernetes
* 50MB に満たないシングルバイナリ
* ARM に最適化されている

K3s はバイナリサイズを削るために本家 Kubernetes からレガシーな機能やアルファ・ベータ機能、k3s が想定しているユースケースに不要な機能を削除している。
とはいえ、Ingress Controller がデフォルトでついてきたり、インストールがシングルバイナリでめっちゃ楽だったりで、普通に Kubernetes として使う分には本家 Kubernetes より手軽に使うことができる。



## 構成

今回はこんな感じの構成で k3s クラスタを組んだ。

![Diagram](/images/2022/04/06/diagram.png)

構築したとき、 k3s では control plane や worker node ではなく、server、agent と呼ぶということを知らなかったのでホスト名が間違っているが特に問題はないのでこのままにしている。

この図では有線 LAN も存在しているが、有線 LAN を設定する必要はなく WiFi 接続があれば構築できる。
元々組んだときに Wifi 環境がなくてもクラスタが動作するように物理ケーブルで接続していたためこのようになっている。

## Raspberry Pi OS インストール

ここからは実際の手順。まずはラズパイに OS をクリーンインストールする。

ラズパイの OS インストールは SD カードに OS イメージを書き込むという作業になる。
今回はイメージ書き込みに Raspberry Pi Imager という公式ツールを使った。
これが非常に楽で、`umount` コマンドや `dd` が不要かつ SSH までの初期設定を書き込み時にやってくれるため、GUI でポチポチとイメージを書き込んでラズパイに SD カードを挿せば SSH で接続できるようになる。

![Raspberry Pi Imager](/images/2022/04/06/raspberry-pi-imager.png)

次のような設定で 4 枚の SD カードに OS イメージを書き込んだ。

* Operating System
    * Raspberry Pi OS Lite (64-bit)
* Storage
    * 各 SD カード
* Advanced options
    * Set hostname
        * `controlplane.k3s`, `worker-1.k3s`, ...
        * ここだけ SD カードごとに変更
    * Enable SSH
        * Use password authentication
        * SSH 公開鍵を複数登録したかったができないっぽかったので一旦パスワードで
    * Set username and password
        * 初期ユーザーは `pi` になっているので、`nownabe` に変更
    * Configure wireless LAN
        * 自宅の WiFi を設定

SD カードにイメージを書き込んだら、それを各ラズパイに挿して起動。

## Raspberry Pi OS の初期設定

すでに SSH でログインできるようになっているので、ラズパイの IP アドレスを調べて設定したユーザー名とパスワードでログインする。IP アドレスは WiFi のルーターを見ればわかるはず。

まず、k3s の起動に必要な iptables のインストールと cgroup の有効化を行う。[^2]

```bash
sudo apt upgrade

# iptables をインストール
sudo apt remove nftables
sudo apt install iptables

# /boot/cmdline.txt に `cgroup_memory=1 cgroup_enable=memory` を追加する
sudo nano /boot/cmdline.txt
```

`/boot/cmdline.txt` はこんな感じになる。

```bash
nownabe@controlplane:~ $ cat /boot/cmdline.txt
console=serial0,115200 console=tty1 root=PARTUUID=xxx rootfstype=ext4 fsck.repair=yes rootwait cgroup_memory=1 cgroup_enable=memory
```

[^2]: [Rancher Docs: Advanced Options and Configuration](https://rancher.com/docs/k3s/latest/en/advanced/#enabling-legacy-iptables-on-raspbian-buster)

k3s の起動に必要な設定はこれだけなので次の設定は飛ばしてもらっても構わない。
これらの必須設定以外では前述の通り有線 LAN と SSH を次のように設定した。

```bash
sudo apt upgrade
sudo apt install vim

# 静的IPアドレスの設定

cat <<EOF >> /etc/dhcpcd.conf
interface eth0
static ip_address=192.168.3.1/24
EOF

# SSH鍵の設定: 公開鍵をGitHubからダウンロード

mkdir .ssh
curl -o .ssh/authorized_keys https://github.com/nownabe.keys
chmod 700 .ssh
chmod 600 .ssh/authorized_keys

# sshdの設定: パスワードログインとrootログインを無効化

cat <<EOF | sudo tee -a /etc/ssh/sshd_config
PasswordAuthentication no
PermitRootLogin no
EOF

# /etc/hostsの設定: ラズパイ間で通信しやすいように

cat <<EOF | sudo tee -a /etc/hosts
192.168.3.1 controlplane controlplane.k3s
192.168.3.2 worker-1 worker-1.k3s
192.168.3.3 worker-2 worker-2.k3s
192.168.3.4 worker-3 worker-3.k3s
EOF
```

## k3s インストール

いわゆるコントロールプレーン的な k3s server とワーカーノード的な k3s agent でインストール手順が微妙に異なるので、k3s server から順にインストールする。

![K3s architecture](/images/2022/04/06/k3s-architecture.png)

1 台で試す場合は k3s server だけインストールすれば OK。

### K3s server インストール

`controlplane.k3s` に k3s server をインストールする。

```bash
curl -sfL <https://get.k3s.io> | sh -
```

以上。めっちゃ簡単。`controlplane.k3s` に kubectl もインストールされているので、すぐに試すことができる。

```bash
sudo kubectl get nodes
sudo kubectl get services
sudo kubectl get pods
```

また、kubeconfig が `/etc/rancher/k3s/k3s.yaml` にあるので、これをローカルに持ってきてリモートで kubectl することもできる。

```bash
# ローカル (not ラズパイ) で

# kubeconfig とってくる
ssh ${controlplan.k3sのIP} sudo cat /etc/rancher/k3s/k3s.yaml > k3s-kubeconfig

# serverのアドレスを書き換える (clusters.0.cluster.server)
vi k3s-kubeconfig

# kubectlする
kubectl --kubeconfig=k3s-kubeconfig get nodes
```

### K3s agent インストール

残り 3 台は同じ操作。

まず、`controlplane.k3s` から agent を追加するためのトークンを取得する。

```bash
# in controlplane.k3s
sudo cat /var/lib/rancher/k3s/server/node-token
```

取得したトークンを使って、残りのラズパイに agent をインストールする。と言っても、環境変数で k3s server とトークンを指定する以外は k3s server のインストールと同じコマンドを使う。

```bash
# in worker-*.k3s
curl -sfL https://get.k3s.io | \
  K3S_URL=https://${k3s server のIPアドレス}:6443 \
  K3S_TOKEN=${token} \
  sh -
```

これで k3s agent のインストールとクラスタへの参加が完了する。`kubectl get nodes` 等で確認するとノードが増えていることがわかる。

## おわりに

本当に 1 回もエラーに遭遇することなく、前回苦労したのはなんだったのかというぐらい簡単に Kubernetes がセットアップできてしまった。

本記事の手順だけでも Pod を作って Service で公開ということはできる。それだけだと LAN 内に閉じた話になるので、インターネットへサービスを公開したいとか外出先から `kubectl` したい、というニーズにはまだ応えられない。

モチベが湧けば、次回は Cloudflare を使ってクラスターをセキュアにインターネットへ公開する記事を書きたいと思う。
