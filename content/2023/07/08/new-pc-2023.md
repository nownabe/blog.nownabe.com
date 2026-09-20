---
title: "PC を新調した (2023 年版)"
tags:
date: 2023-07-08T18:32:54+09:00
lastmod: 2023-07-08T18:32:54+09:00

draft: false

image: images/2023/07/08/pc.jpg
---


![pc](/images/2023/07/08/pc.jpg)

6 月に新しくデスクトップ PC を買ったのでその記録。

## 新調した理由

- 今使ってるのもう 5 年ぐらい前のだし (調べたらちょうど 2018 年の 6 月ぐらいに買ってた)
- 円安だし [3年半働いた](https://blog.nownabe.com/2023/06/17/leaving-google-cloud/) 自分への褒美に RSU ちょっと売ってなんか買うかー
- Generative AI 動かすために強い GPU ほしい
- 今 1 台で Linux (普段使い) と Windows (ゲーム) のデュアルブートしてて運用だるい
- もっと古いデスクトップ PC の下取りしたい

## BTO にした理由

今までのデスクトップ PC はすべて自作で組んできたけど、今回は自作じゃなくて BTO にした。パーツは選びたいけど組み立てはもういいかな、ってのとパーツの箱いらねってのが理由。

ブランドは [arkhive](https://www.ark-pc.co.jp/bto/special/arkhive/) にした。まずはこんな感じの基準で選んで arkhive と [Sycom](https://www.sycom.co.jp/bto/Hydro/) が候補になった。

- RTX 4090 でつよつよ PC が組める
- パーツが柔軟に選べる (マザボやケースも)
- 水冷

arkhive か Sycom で arkhive を選んだ理由はこんな感じ。

- RTX4090 だと Sycom デュアル水冷はいらなそう
- arkhive だと白色ベースでいい感じにカッコよくできる

## パーツ

パーツ選定の基本方針はこんな感じ。

- GeForce RTX 4090
- Intel
- できるだけ白
- できるだけ光る
- できるだけ最強
- 信頼してるメーカー(ASUS、WD)

選んだパーツはこんな感じ。今コンシューマー向けで選べるほぼ最強の構成になったと思う。

- CPU: [Intel Core i9-13900KF](https://www.amazon.co.jp/dp/B0BJ91FHN3?tag=nownabe02-22)
- M/B: [ASUS ROG MAXIMUS Z790 HERO](https://www.amazon.co.jp/dp/B0BM988CZ6?tag=nownabe02-22)
- メモリ: [G.Skill DDR5-5600 32GBx2](https://www.amazon.co.jp/dp/B0B3DP63RB?tag=nownabe02-22)
- GPU: [ZOTAC GAMING GeForce RTX 4090 AMP Extreme AIRO](https://www.amazon.co.jp/dp/B0BHKGTYS9?tag=nownabe02-22)
- ストレージ 1: [Western Digital WD_BLACK SN850X NVMe SSD](https://www.amazon.co.jp/dp/B0B3RQDGL7?tag=nownabe02-22)
- ストレージ 2: [Samsung 980 PRO 4.0 NVMe SSD 2TB](https://www.amazon.co.jp/dp/B08THM8YGY?tag=nownabe02-22)
- ケース: [Fractal Design Torrent White RGB TG Clear Tint](https://www.amazon.co.jp/dp/B0BPS41V89?tag=nownabe02-22)
- CPU クーラー: [ASUS ROG STRIX LC II 360 ARGB White Edition](https://www.amazon.co.jp/dp/B0B1CWYBC7?tag=nownabe02-22)
- 電源: [SilverStone HELA 1200R Platinum](https://www.amazon.co.jp/dp/B0BQ6BJ95P?tag=nownabe02-22)
- OS: Windows 11 Pro 64bit

メモリだけは欲しいのが BTO の選択肢としてなかったので自分で買って挿し換えた。

## 箱

考えたらわかるんだけど、これだけ自由にパーツ選べる自作好き向けの BTO が箱や付属品やマニュアルを送ってこないわけがなかった。というわけで PC とともにパーツの箱が大量に来たんだけど、RTX 4090 以外の箱は処分する予定。グラボは買い替えることもあるかなーってことで。

こんな感じのでっかいダンボールが 2 つ届いて、本体とパーツの箱だった。

![cases](/images/2023/07/08/cases.jpg)

## 感想

🌟大🌟満🌟足🌟
スペックはもちろん文句ないし、なにより見た目がカッコいい。見てるだけで癒やされる。

ゲームは最高画質がサクサク動くし、LLM や Stable Diffusion もそれなりにいい感じで動く。

BTO ということで組み立ては他人にやってもらったわけだけど、非常に丁寧でその点もよかった。これはマザボ裏の配線の様子。

![cables](/images/2023/07/08/cables.jpg)

今回デュアルブートはせずに Windows オンリーにしたけど、それもいい選択だったなと思ってる。まだ本格的に開発端末としては使ってないものの、WSL が優秀で今のところ困ってない。Windows じゃ開発できないよなぁって理由で渋々 Mac 使ってる人は Windows を検討してみてもいいかもしれない。少なくとも Linux を使ってた人は Mac より WSL の方が使いやすいんじゃないかな。
