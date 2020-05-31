---
title: "自宅ネットワーク改善日記その4 RTX830導入編"
tags:
- network
- YAMAHA
- RTX830
date: 2020-05-30T14:19:10+09:00
lastmod: 2020-05-30T14:19:10+09:00

draft: false
isCJKLanguage: true

image: images/2020/05/30/tor-photo.png
---

今回はルータとしてYAMAHAの[RTX830](https://network.yamaha.com/products/routers/rtx830/index)を導入しました。

前回まで:

* [その1 調査編](/2020/05/26/home-network-1/)
* [その2 L2SW交換編](/2020/05/28/home-network-2/)
* [その3 光開通編](/2020/05/29/home-network-3/)

## おさらい

前回は、ついに光回線が開通して高速な回線とグローバルIPを手に入れました。

<img src="/images/2020/05/29/physical-diagram.png" width="800">

しかし、ただ接続しただけだと、速いときは速いものの夜は1Mbpsを切るぐらいのスピードしかでないという状態でした。

## YAMAHA RTX830

<img src="/images/2020/05/30/rtx830.png" width="600">

家とか小規模オフィスに置くのには定番のルータなんじゃないかなーと思います。
今回は次の要素が理由でこのルータを選びました。

* IPv6 IPoE
* VLAN
* IPsec VPN
* DNS
* DHCP
* SSH
* Web GUI
* 見た目

前職も前々職もオフィスでYAMAHA製品使ってたというのもありました。
見た目が結構好きなんですよね。色が良い :smile:

## 設置

ToRに設置しました。写真は設置後のToRの様子です。

<img src="/images/2020/05/30/tor-photo.png" width="800">

いい感じですね :blush:
ただ、L2SW (GS308T) が結構熱を出していて心配です。
ただの収納棚で排気も何もできないのでこれからの季節は何かしら対策したほうがよさそうです。

RTX830 を設置して物理構成はこんな感じになりました。

<img src="/images/2020/05/30/physical-diagram.png" width="800">

コンシューマ向け無線ルータのかわりにルータっぽいルータが入って、いよいよネットワークっぽくなってきました。
Google Wifiはブリッジモードに変更しました。

## 設定

とりあえずインターネットにPPPoEで接続して、公開鍵認証でSSHログインできるところまで設定しました。


### インターネット接続

いつもどおり PPPoE でインターネットに接続します。
ここは Web GUI で設定しました。

Web GUI に接続する前に、ルータを接続したあとネットワークアドレスが変わったりしたのでクライアントのネットワークを再起動しました。

```bash
sudo systemctl restart network-manager
```

これでルーターまで疎通するようになったので、Web GUIにアクセスしました。初期状態だと http://192.168.100.1 でアクセスできます。Username、Passwordは空欄で大丈夫です。

まずは管理パスワードの設定や新規ユーザの作成を行いました。また、Anonymousユーザはいろいろ無効化しておきました。

その後はポチポチと かんたん設定 > プロバイダー接続 > 新規作成 で PPPoE を設定しました。

これで無事インターネットに接続できました :tada:
とくに躓くこともなく、スムーズに設定できました。

### SSH 設定

以降の設定はSSH経由でやりたいので、公開鍵認証でSSHログインできるところまで設定しました。
`$`がローカルPC、`>`がルータコンソール、`#`がルータ管理コンソールです。

公開鍵認証をするためにはファームウェアを更新する必要があったので、Web GUIで更新しました。
管理 > 保守 > ファームウェアの更新 > ネットワーク経由でファームウェアを更新 です。
公開鍵認証に対応しているのは `Rev.15.02.15` 以上です。インストールされていたのは `Rev.15.02.09` でした。

次に、SSHサーバを有効化しました。デフォルトでは無効化されています。コンソールの文字コードの設定や、公開鍵ファイルをSFTPで送信するためSFTPの設定もしました。

```bash
$ telnet 192.168.100.1
> console character en.ascii
> administrator
# sshd host key generate
# sshd service on
# sftpd host lan
# save
# quit
> quit
```

これでSSHにユーザ名とパスワードで接続することができるようになりました。

次に、公開鍵ファイルをSFTPでアップロードして、公開鍵とユーザの紐づけを設定しました。

```bash
$ sftp 192.168.100.1
sftp> mkdir /ssh
sftp> mkdir /ssh/authorized_keys
sftp> /home/nownabe/.ssh/id_ed25519.pub /ssh/authorized_keys/nownabe
sftp> ls /ssh/authorized_keys
sftp> exit

$ ssh 192.168.100.1
> administrator
# sshd authorized-keys filename nownabe path=/ssh/authorized_keys/nownabe
# save
# quit
> quit
```

これで公開鍵認証でSSHに接続できるようになりました。

最後に、telnetを無効化したりSSHを制限したりしておきました。

```bash
$ ssh 192.168.100.1
> administrator
# sshd auth method publickey
# sshd host lan
# telnetd host none
# telnetd service off
# save
# quit
> quit
```

## おわりに

とりあえずインターネットの設定と、SSHログインはできました。
ここからが本番ですが、ルータのコマンド操作なんて大昔にちょっとCisco触ったぐらいしか経験がないので勉強しつつやっていきたいと思います。
