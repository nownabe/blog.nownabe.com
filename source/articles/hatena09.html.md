---
title: 今更Raspberry PiでLチカやってみた
tags: raspberry pi
created_at: 2015-08-09 00:21:18 +0900
updated_at: 2015-08-09 00:21:18 +0900
published: true
---

[f:id:nownabe:20150808235527j:plain]

流行りにのってRaspberry PiでLチカやってみました！（だいぶ乗り遅れてる）

Raspberry Piは[サバフェス](http://svfes2015.ds.jp-east.idcfcloud.com/index.html)の賞品でもらったまま眠ってたのがあったので引っ張り出してきました。
LEDとかは家にあったものを拾い集めました。


# Raspberry Pi準備
OSのインストールや初期設定はQiitaにまとめました。

[http://qiita.com/nownabe/items/e16b962fcdb1a702093e:embed:cite]

[http://qiita.com/nownabe/items/a6ec3dfcfcb6ab37ea1e:embed:cite]

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

[f:id:nownabe:20150808235527j:plain]

# Lチカ
点滅させてみます。とりあえずbashで。。。

```bash
while :; do sudo echo 1 > /sys/class/gpio/gpio4/value; sleep 0.001; sudo echo 0 > /sys/class/gpio/gpio4/value; sleep 0.001; done
```

[https://youtu.be/jThq1LOG9IQ:embed:cite]

# 電圧？
電圧を測ってみると5Vピンも3Vピンも3.3Vでした。
う〜んなんでだろう。

[f:id:nownabe:20150808235625j:plain]

GNDと畳の電位差はほとんどなかったのでGNDはちゃんととれてるみたいですw
[f:id:nownabe:20150808235731j:plain]

# おわりに
高専時代にやったZ80ぶりのLチカでした。

最初トランジスタも発見したのでトランジスタでスイッチングしようと思ったんですがうまく行かず。。。
すっかりもう色々忘れてて歳を感じてやばいのでそのうちやりますw
