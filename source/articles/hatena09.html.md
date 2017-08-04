---
title: 今更Raspberry PiでLチカやってみた
category: Diary
tags: raspberry pi
created_at: 2015-08-09 00:21:18 +0900
updated_at: 2015-08-09 00:21:18 +0900
published: true
---

![Lチカ](/images/articles/hatena09/01.jpg)

流行りにのってRaspberry PiでLチカやってみました！（だいぶ乗り遅れてる）

Raspberry Piは[サバフェス](http://svfes2015.ds.jp-east.idcfcloud.com/index.html)の賞品でもらったまま眠ってたのがあったので引っ張り出してきました。
LEDとかは家にあったものを拾い集めました。


# Raspberry Pi準備
OSのインストールや初期設定はQiitaにまとめました。

[MacOSXでRasberry PiにRaspbianをインストールする - Qiita](http://qiita.com/nownabe/items/e16b962fcdb1a702093e)

[Raspberry PiをWLI-UC-GNMEで無線LANに接続する - Qiita](http://qiita.com/nownabe/items/a6ec3dfcfcb6ab37ea1e)

これ以外でやったのはパッケージのアップデートと、

```bash
sudo apt-get update -y
sudo apt-get upgrade -y
```

NTP設定です。
NTPは`/etc/ntp.conf`の`server`の行をコメントアウトして`pool ntp.nict.jp iburst`を追加します。

```
#server 0.debian.pool.ntp.org iburst
#server 1.debian.pool.ntp.org iburst
#server 2.debian.pool.ntp.org iburst
#server 3.debian.pool.ntp.org iburst
pool ntp.nict.jp iburst
```

# Lピカ
GPIOの4番ピンを使います。

まずはGPIOの4番ピンを使うことを宣言します
これで`/sys/class/gpio/gpio4`というリンクが作成されます。

```bash
pi@raspberrypi ~ $ sudo echo 4 > /sys/class/gpio/export
pi@raspberrypi ~ $ ls /sys/class/gpio
export  gpio4  gpiochip0  unexport
```

GPIO4を出力用に設定します。

```bash
pi@raspberrypi ~ $ sudo echo out > /sys/class/gpio/gpio4/direction
pi@raspberrypi ~ $ sudo cat /sys/class/gpio/gpio4/direction
out
```

`/sys/class/gpio/gpio4/value`に1/0を出力することで、ON/OFFします。

```bash
pi@raspberrypi ~ $ sudo echo 1 > /sys/class/gpio/gpio4/value
pi@raspberrypi ~ $ sudo echo 0 > /sys/class/gpio/gpio4/value
pi@raspberrypi ~ $ sudo echo 1 > /sys/class/gpio/gpio4/value
pi@raspberrypi ~ $ sudo echo 0 > /sys/class/gpio/gpio4/value
```

LEDが光ったり消えたりします。

![Lチカ](/images/articles/hatena09/01.jpg)

# Lチカ
点滅させてみます。とりあえずbashで。。。

```bash
while :; do sudo echo 1 > /sys/class/gpio/gpio4/value; sleep 0.001; sudo echo 0 > /sys/class/gpio/gpio4/value; sleep 0.001; done
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/jThq1LOG9IQ" frameborder="0" allowfullscreen></iframe>

# 電圧？
電圧を測ってみると5Vピンも3Vピンも3.3Vでした。
う〜んなんでだろう。

![02](/images/articles/hatena09/02.jpg)

GNDと畳の電位差はほとんどなかったのでGNDはちゃんととれてるみたいですw
![03](/images/articles/hatena09/03.jpg)

# おわりに
高専時代にやったZ80ぶりのLチカでした。

最初トランジスタも発見したのでトランジスタでスイッチングしようと思ったんですがうまく行かず。。。
すっかりもう色々忘れてて歳を感じてやばいのでそのうちやりますw
