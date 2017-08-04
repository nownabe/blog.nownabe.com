---
title: お名前.comからIDCF DNSに移行した話
category: Tech
tags: idcf cloud, dns
created_at: 2015-08-10 23:46:12 +0900
updated_at: 2015-08-10 23:46:12 +0900
published: true
---

ネームサーバーをお名前.comからIDCF DNSに移行しました。

IDCF DNSは1ドメイン50円で100レコードまでなら使い放題です（クエリ数に関係ない）。
お名前.comはドメイン取得のおまけで無料なので、50円余分に払わないといけません。
とはいえまあ50円です笑

APIで操作できるので動的にレコードが変化するようなドメインのDNSとしてはよさそうです。
ということでなけなしの50円を払いお名前.comから移行することにしました。

# 流れ
移行の流れとしては、次のようになります。

1. IDCF DNSに登録する
2. IDCF DNSにゾーンを作成する
3. IDCF DNSにレコードを登録する
4. IDCF DNSでドメインを認証する
5. ネームサーバーを切り替える

# IDCF DNSに登録する
こちらにアクセスします。
https://console.idcfcloud.com/dns/

多分登録画面とかログイン画面とか出てくるはず。。。

# IDCF DNSにゾーン作成
無事にログインできるとこんな画面が出るので、「ゾーン作成」をクリックします。

![ゾーン作成1](/images/articles/hatena10/01.png)

作成画面が出てくるので、ドメインやメールアドレスを入力します。
ドメインがそのままゾーン名となります。hogehoge.comみたいな感じです。

![ゾーン作成2](/images/articles/hatena10/02.png)

これでゾーンが作成されました。

# IDCF DNSにレコード登録
次はレコードを登録していきます。

ゾーンが作成されると、このようにゾーン一覧に新しいゾーンが表示されます。

![ゾーン一覧](/images/articles/hatena10/03.png)

ゾーン名をクリックすると、SOAレコードやNSレコードが登録されていることがわかります。
右上の「レコード登録」から今登録してあるレコードを登録していきます。

![レコード登録1](/images/articles/hatena10/04.png)

今のところ登録できるレコードはA、CNAME、AAAA、MX、TXT、SRVのみです。

![レコード登録2](/images/articles/hatena10/05.png)

こんな感じで、お名前.comと差異がないようにします。

![レコード比較 IDCF](/images/articles/hatena10/06.png)

![レコード比較 onamae](/images/articles/hatena10/07.png)

# IDCD DNSでドメイン認証
ドメインの所有者であるということを確認するため、ドメインの認証が必要になっています。

IDCF DNSのゾーンページの、「認証する」をクリックします。

![認証する](/images/articles/hatena10/08.png)

すると、このような認証方法が書かれたモーダルが表示されます。

![認証モーダル](/images/articles/hatena10/09.png)

モザイクばかりでわかりにくいですが、、、今回は新規ドメインではないので1番の方法を使用します。
よくあるTXTレコードに認証文字列を登録する方法です。

お名前.comの方で、TXTレコードを登録します。

![TXTレコード](/images/articles/hatena10/10.png)

digコマンドでTXTレコードが確認できたら、準備完了です。

```bash
$ dig @157.7.32.53 hogehoge.com. TXT

; <<>> DiG 9.8.3-P1 <<>> @157.7.32.53 hogehoge.com. TXT
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 53710
;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 4, ADDITIONAL: 6
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;hogehoge.com.			IN	TXT

;; ANSWER SECTION:
hogehoge.com.		3600	IN	TXT	"idcf-dns-token=xxxxxxxxxxxxxxxxxxxxxxxx"

;; AUTHORITY SECTION:
hogehoge.com.		86400	IN	NS	02.dnsv.jp.
hogehoge.com.		86400	IN	NS	01.dnsv.jp.
hogehoge.com.		86400	IN	NS	03.dnsv.jp.
hogehoge.com.		86400	IN	NS	04.dnsv.jp.

;; ADDITIONAL SECTION:
01.dnsv.jp.		86400	IN	A	157.7.32.53
02.dnsv.jp.		86400	IN	A	157.7.33.53
03.dnsv.jp.		86400	IN	A	157.7.32.35
03.dnsv.jp.		86400	IN	AAAA	2400:8500:3000::53
04.dnsv.jp.		86400	IN	A	157.7.33.35
04.dnsv.jp.		86400	IN	AAAA	2400:8500:3fff::53

;; Query time: 6 msec
;; SERVER: 157.7.32.53#53(157.7.32.53)
;; WHEN: Sun Aug  9 21:26:58 2015
;; MSG SIZE  rcvd: 285
```

準備ができたら、認証しましょう。

![認証モーダル2](/images/articles/hatena10/11.png)

無事に終わると認証完了とでます。

![認証完了](/images/articles/hatena10/12.png)

ちゃんとIDCF DNSのネームサーバーで名前解決できるようになってます。

```bash
$ dig @ns01.idcfcloud.com hogehoge.com

; <<>> DiG 9.8.3-P1 <<>> @ns01.idcfcloud.com hogehoge.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 37498
;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;hogehoge.com.			IN	A

;; ANSWER SECTION:
hogehoge.com.		3600	IN	A	1.2.3.4

;; Query time: 9 msec
;; SERVER: 210.140.183.65#53(210.140.183.65)
;; WHEN: Sun Aug  9 21:34:00 2015
;; MSG SIZE  rcvd: 46
```

# ネームサーバー切り替え
いよいよ、ネームサーバーを切り替えます。

お名前.comの、「ドメイン設定 > ネームサーバーの変更」を開きます。
切り替えたいドメインを選択し、「他のネームサーバーを利用」を選びます。

![ネームサーバー変更](/images/articles/hatena10/13.png)

IDCF DNSのネームサーバーを入力し、設定します。

![ネームサーバー](/images/articles/hatena10/14.png)

これで切り替え完了です。
digコマンドで確認できます。
（切り替えに1日〜2日ぐらいかかります）

```bash
dig bar.hogehoge.com

; <<>> DiG 9.8.3-P1 <<>> bar.hogehoge.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 7938
;; flags: qr rd ra; QUERY: 1, ANSWER: 2, AUTHORITY: 3, ADDITIONAL: 3

;; QUESTION SECTION:
;bar.hogehoge.com.		IN	A

;; ANSWER SECTION:
bar.hogehoge.com.	3600	IN	CNAME	foo.hogehoge.com.
foo.hogehoge.com.	3595	IN	A	5.6.7.8

;; AUTHORITY SECTION:
hogehoge.com.		3574	IN	NS	ns02.idcfcloud.com.
hogehoge.com.		3574	IN	NS	ns03.idcfcloud.com.
hogehoge.com.		3574	IN	NS	ns01.idcfcloud.com.

;; ADDITIONAL SECTION:
ns01.idcfcloud.com.	570	IN	A	210.140.183.65
ns02.idcfcloud.com.	570	IN	A	202.234.29.33
ns03.idcfcloud.com.	570	IN	A	210.152.232.97

;; Query time: 27 msec
;; SERVER: 192.168.63.100#53(192.168.63.100)
;; WHEN: Mon Aug 10 23:36:06 2015
;; MSG SIZE  rcvd: 186
```

# おわりに
Web UIはシンプルで使いやすくてGoodですね！
料金がクエリ数に関係ないのも素晴らしい。

ドメイン取得も一括でできたらなぁ。
