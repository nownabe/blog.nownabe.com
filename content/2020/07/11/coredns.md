---
title: "CoreDNS で DNS サーバたてた"
tags:
- CoreDNS
date: 2020-07-11T20:30:44+09:00
lastmod: 2020-07-11T20:30:44+09:00

draft: false
isCJKLanguage: true

image: https://coredns.io/images/CoreDNS_Colour_Horizontal.png
---

<img src="https://coredns.io/images/CoreDNS_Colour_Horizontal.png" style="border: none">

[CoreDNS](https://coredns.io/) を使って自宅のネットワークに DNS サーバをたてました。

Kubernetesを構築して[^1]プライベートのサービスを動かそうと思ってたんですが、そのときにサービスにもドメインつけたいし、サーバごにょごにょするときのもドメインほしいしってことでDNSサーバをたてました。

[^1]: [おうちKubernetes構築日記その1 Raspberry Pi編 - nownab.log](https://blog.nownabe.com/2020/06/28/home-kubernetes-1)

## そもそもたてる必要あるの？

SSHするときもWebでアクセスするときもIPよりはドメインの方がいいので、なんらかのDNSサーバは必要でした。
DNSサーバの選択肢として、他にはパブリッククラウドのDNSサービス、ルータのDNS機能がありました。

簡単に比較するとこんな感じです。

| 項目 | クラウド | 自前CoreDNS | ルータ | コメント |
|---|---|---|---|---|
| 料金 | :mask: | :satisfied: | :satisfied: | 有料か無料か |
| 反応速度 | :mask: | :satisfied: | :satisfied: | やっぱりローカルは圧倒的に速い |
| 運用 | :satisfied: | :mask: | :mask: | オンプレはだるい |
| 設定 | :satisfied: | :satisfied: | :mask: | /etc/hosts書き換えればOK |
| 自動化 | :satisfied: | :smiley: | :mask: | etcdプラグインとか使えば簡単にできる |
| 機能 | :smile: | :satisfied: | :mask: | まあいろいろできる |

速くて無料で必要な機能が実現できる、ということで自前でDNSサーバたてることを選択しました。
運用に関しても、データぶっ飛んでもすぐ復旧できるレベルでしか使わないだろうし、なんか問題でてきたらクラウドに移せばいいぐらいの感覚です。

## なんでCoreDNS？

[CoreDNS](https://coredns.io/)っていうのはCNCFにホストされている、Goで書かれたDNSサーバです。

CoreDNSを選んだのはこのへんが理由です。

* CNCFのプロジェクトということで以前から使ってみたいと思ってた
* dnsmasq的な `/etc/hosts` での設定ができる
* DB (etcd) をバックエンドにできるのでバックアップとか自動化とかが楽
* プラグインが簡単に書けるので楽しそう
* 設定がシンプル
* 機能が全部プラグインで実現されてるって思想が良い
* Goで書かれている

今までBind、dnsmasq、PowerDNSを構築、運用したことあるんですが、今の所一番気に入ってます。
使用感もいいし、わくわく感もあります。

## 構築手順

Kubernetesのマスターとなるサーバにインストールしました。以下rootでの実行コマンドです。

```bash
# ダウンロード、インストール

curl -LO https://github.com/coredns/coredns/releases/download/v1.6.9/coredns_1.6.9_linux_amd64.tgz
tar xf coredns_1.6.9_linux_amd64.tgz
mv coredns /usr/local/bin/
chown root. /usr/local/bin/coredns


# CoreDNS用ユーザの追加

useradd -l -r -s /usr/sbin/nologin -m -d /var/lib/coredns -c 'CoreDNS user' coredns


# systemdのユニットファイル

cat <<EOF > /etc/systemd/system/coredns.service > /etc/systemd/system/coredns.service
[Unit]
Description=CoreDNS
Documentation=https://coredns.io
After=network.target

[Service]
LimitNOFILE=1048576
LimitNPROC=512
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE
NoNewPrivileges=true
User=coredns
WorkingDirectory=/var/lib/coredns
ExecStart=/usr/local/bin/coredns -conf=/etc/coredns/Corefile
ExecReload=/bin/kill -SIGUSR1 $MAINPID
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF


# CoreDNSの設定

mkdir /etc/coredns
cat <<EOF > /etc/coredns/Corefile
(common) {
  cache
  errors
  loop
}

. {
  forward . 8.8.8.8 1.1.1.1
  health :1053
  import common
  prometheus :9153
  reload
}

nownabe.in {
  hosts /etc/coredns/nownabe.in
  import common
}
EOF

# nownabe.inのレコード設定

cat <<EOF > /etc/coredns/nownabe.in
10.0.0.2   rtx.cf.nownabe.in
10.0.1.1   sv-1.cf.nownabe.in dns.cf.nownabe.in kube-master.cf.nownabe.in
10.0.1.101 kube-worker-1.cf.nownabe.in
10.0.1.102 kube-worker-2.cf.nownabe.in
10.0.1.103 kube-worker-3.cf.nownabe.in
10.0.1.104 kube-worker-4.cf.nownabe.in
EOF


# CoreDNS有効化、起動
systemctl enable coredns
systemctl start coredns
```

バイナリひとつで動くのがいいですよね。Goプロダクトって感じです。

systemdのユニットファイルは、[coredns/deployment](https://github.com/coredns/deployment)というリポジトリにある[coredns.service](https://github.com/coredns/deployment/blob/master/systemd/coredns.service)を参考にしました。
ちょっと古かったり余計な権限がついてたりしたので、少し修正しています。

今の所レコードは/etc/hosts形式で設定しています。

## DHCPの設定

ルータ RTX830 をDHCPサーバに使っているので、構築したDNSサーバを設定しました。

```txt
no dns server pp 1
no dns server dhcp lan2
no dns server select 500000 dhcp lan2 any .
no dns server select 500001 pp 1 any . restrict pp 1
dns server 10.0.1.1 8.8.8.8 1.1.1.1
dns notice order dhcp server
dns domain cf.nownabe.in
```

## クライアントの設定

DHCPを使っていないサーバにはそれぞれ手動で設定しました。
いろいろあるのでそれぞれの設定は省略しますが、 `/etc/resolv.conf` はこんな感じです。

```txt
nameserver 10.0.1.1
nameserver 8.8.8.8
nameserver 1.1.1.1
domain cf.nownabe.in
search cf.nownabe.in nownabe.in
```

## 試してみる

```bash
$ dig kube-worker-1.cf.nownabe.in

; <<>> DiG 9.11.5-P4-5.1ubuntu2.2-Ubuntu <<>> kube-worker-1.cf.nownabe.in
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 39530
;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
;; WARNING: recursion requested but not available

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
; COOKIE: 10fad6c1cf5760b3 (echoed)
;; QUESTION SECTION:
;kube-worker-1.cf.nownabe.in.   IN      A

;; ANSWER SECTION:
kube-worker-1.cf.nownabe.in. 2288 IN    A       10.0.1.101

;; Query time: 0 msec
;; SERVER: 10.0.1.1#53(10.0.1.1)
;; WHEN: 土  7月 11 21:35:29 JST 2020
;; MSG SIZE  rcvd: 111
```

いいですねー。0msで答えが返ってきてます。

外部ドメインでもキャッシュされてると0msで返ってきます。

```bash
$ dig google.com

; <<>> DiG 9.11.5-P4-5.1ubuntu2.2-Ubuntu <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 61410
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
; COOKIE: 1fc6abfd8e8a2b9d (echoed)
;; QUESTION SECTION:
;google.com.                    IN      A

;; ANSWER SECTION:
google.com.             298     IN      A       172.217.24.142

;; Query time: 0 msec
;; SERVER: 10.0.1.1#53(10.0.1.1)
;; WHEN: 土  7月 11 21:38:23 JST 2020
;; MSG SIZE  rcvd: 77
```

パブリックDNSサーバに問い合わせると4msとかかかります。

```bash
$ dig google.com @8.8.8.8

; <<>> DiG 9.11.5-P4-5.1ubuntu2.2-Ubuntu <<>> google.com @8.8.8.8
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 55448
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;google.com.                    IN      A

;; ANSWER SECTION:
google.com.             203     IN      A       172.217.27.78

;; Query time: 4 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: 土  7月 11 21:38:38 JST 2020
;; MSG SIZE  rcvd: 55

```

ただ、キャッシュにのってない場合はめちゃくちゃ遅くなります。
うーんなんでだろう。

```bash
$ dig google.com

; <<>> DiG 9.11.5-P4-5.1ubuntu2.2-Ubuntu <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 32912
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;google.com.                    IN      A

;; ANSWER SECTION:
google.com.             299     IN      A       172.217.24.142

;; Query time: 84 msec
;; SERVER: 10.0.1.1#53(10.0.1.1)
;; WHEN: 土  7月 11 21:38:22 JST 2020
;; MSG SIZE  rcvd: 65
```

## おわりに

以上です。無事に `ssh kube-worker-1` ができるようになって満足です。
キャッシュにのってない外部ドメインのクエリがめっちゃ遅いのは不便なのでなんとかしたいですね。

今後は、簡単なWeb UIとかを作りたいなーと思ってます。
