---
title: "CloudNative Days Tokyo 2019 参加メモ"
tags:
  - CloudNative
  - Kubernetes
  - Docker
  - Event
date: 2019-08-07T16:00:00+09:00
lastmod: 2019-08-07T16:00:00+09:00
draft: false
isCJKLanguage: true
---

先日[CloudNative Days Tokyo 2019](https://cloudnativedays.jp/cndt2019/)に参加してきました。

見たやつのメモだったり、見れなかったけど気になったやつのメモだったり、資料まとめだったりです。

スライドまとめてくれてる方がいました。
[CloudNative Days Tokyo 2019 スライドまとめ - kamoqq.info](https://kamoqq.info/post/cloud-native-days-tokyo-2019-slide/)

# 全体の感想

前回参加したのは 1 年前とかだったと思うけど、そのときに比べて次のような印象を受けた。

- エンタープライズや大規模での利用事例が増えた。イベントもそこらへんをアピールしたい感あった
- operator や storage の話が増えて、すべてをコンテナでという流れが進んでる感があった。来年あたりは operator のツラみとか聞けそう
- operator とかの話に伴って、CRD の話も増えた

# Day 1

## Datadog で実現するこれからのコンテナ監視

Datadog 使ってるけど、VM からコンテナに移行してまだ Datadog を使いこなせてない感があるので見たかったけど見れなかったやつ。

資料もどこにあるかわからん。発表者の同タイトルのスライドならあった。

<iframe src="//www.slideshare.net/slideshow/embed_code/key/CIMZnTV0y1VzZs" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

- Datadog で外形監視できるようになってたの初めて知った。Pingdom やめられる？

## Kubernetes クラスタの自動管理システムのつくりかた

昔やってたことに近いし今でもこういうことがやりたいので興味ある。

<script async class="speakerdeck-embed" data-id="3b6f73bb6b984c2196261c3e320e5b92" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- Quay 導入事例はじめて見た。なんで採用したのか知りたい
- OSS で公開されてる
  - [cybozu-go/cke: A kubernetes cluster manager](https://github.com/cybozu-go/cke)
- 競合は Rancher
- CoreOS
- CKE 自体は Kubernetes にのらない？
- 障害復旧のところとか DBaaS 作ったときのこと思い出して懐かしい

## Kubernetes を拡張して日々のオペレーションを自動化する

CRD の話。

<script async class="speakerdeck-embed" data-id="5935ff7a769344cbbaf66657c9bf24b2" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- CRD を開発・運用するうえでのキーワードがいろいろ入ってて参考になる
- Platform Style の自動化ってのが CRD を使った自動化のこと？

## Kubernetes 拡張を利用した自作 Autoscaler で実現するストレスフリーな運用の世界

CRD で Bigtable の Autoscaler を作った話。

<script async class="speakerdeck-embed" data-id="615ce1ee285a454cac481fe7c2de71f1" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

## adtech studio における CRD〜抽象化した GPUaaS による段階移行計画 & AKE Ingress v2〜

<script async class="speakerdeck-embed" data-id="d3d58b0046044a5dbedd4a5f37dd0956" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- Kubernetes の 3 つの側面
  - コンテナ実行基盤としての Kubernetes
  - X as a Service 基盤としての Kubernetes
  - 分散システムフレームワークとしての Kubernetes

## Cloud Native Storage が拓く Database on Kubernetes の世界

やっぱり Kubernetes 上での DB 運用ってのは気になる。

<script async class="speakerdeck-embed" data-id="d5d77ff6e35d45509ecf7bacf987f54d" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- [Rook](https://rook.io/)使ってみたい
  - ceph-operator 的な感じっぽい
    - ceph 以外も使えるっぽい
  - production ready

## OCIv2?! 軽量高速なイケてる次世代イメージ仕様の最新動向を抑えよう！

<iframe src="//www.slideshare.net/slideshow/embed_code/key/mnhz8wVy7RJK9m" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

- コンテナまわりの基礎技術
  - Build
  - Ship
  - Run
- Build: OCI Image Format Specification
  - 課題: イメージ軽くならないことが多い
  - OCIv2
    - tar よりいいアーカイブ方式
    - 細かい粒度での重複排除
- Ship: OCI Distribution Specification
  - 課題: デプロイ単位ありすぎ
  - OCI Artifact Registry
    - なんでもはいるレジストリ
- Run: OCI Runtime Specification
  - 課題: pull に時間がかかる
  - lazypull
    - ファイル単位で必要になった時点で pull

## メルペイのマイクロサービスの構築と運用

<script async class="speakerdeck-embed" data-id="5406ad306b5f43c8a4d2c3a66b05bb22" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- Microservices ちゃんとやろうとするとちゃんとやらないとなー
- おまけのトラブル集がいい

## Argo による機械学習実行基盤の構築・運用からみえてきたこと

Argo 導入しようとしてた(インストールだけした)ので。

<iframe src="//www.slideshare.net/slideshow/embed_code/key/YJMYhJxASQIJ7" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

- Argo 導入しようとしていたので、ちょうどいいレベル感でとても参考になった
- 雑に比較検討して Argo にしようか、という段階だったので digdag や Airflow(Composer)との比較がよかった
  - 話を聞く限りだと Composer はまだまだっぽい
- Argo CD はまだいいかな、と思ってたけど結構よさそうで使いたくなった
- Argo のツラいポイントは Argo のツラいポイントじゃない感じだった

## Prometheus setup with long term storage

なかなか使う機会ないけどずっと使いたいとは思ってるので。

<script async class="speakerdeck-embed" data-id="190cf8cb48d44912b4690823450b05e0" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- Prometheus の TSDB の仕組みの概要が知れてよかった
- Cortex は Prometheus as a Service を提供するためのものっぽい
  - 自社で Prometheus を冗長化したいとかスケールさせたいとかだとオーバースペックで複雑すぎ？
  - 必要最低限のコンポーネントだけで動かせばそんなことない？
- Thanos よさそう
  - v0.5 からの Receiver で Remote Write に対応
    - Document は TBD で詳しいことはわからん

## CircleCI 2.0 を支える 2 つのコンテナクラスター

CircleCI を実現してる仕組みの話ならめっちゃ気になる。

<script async class="speakerdeck-embed" data-id="63a5f2f4b767455d888cb5fe4bc93ab5" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- Kubernetes と Nomad を併用してる
- RabbitMQ 使ってる :relaxed:
- 自前で K8s 運用してるところは結構 CoreOS が多い気がする
- CircleCI ジョブ = Nomad ジョブ
- Mesos は複雑で断念
- Nomad のクライアントノードは Datadog からの Autoscale って感じ？
- 障害対応フローよさ
  - ちゃんと障害ごとにチームを組んでしっかり分担してるの素晴らしい

## 失敗しない！Kubernetes 向けストレージ選び 5 つのポイント

最近の Kubernetes のストレージ事情が知りたい。

<script async class="speakerdeck-embed" data-id="63b4c879b3ce4439bfaad9b370477234" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- [Cloud Native Landscape](https://github.com/cncf/landscape)

## Knative で実現する Kubernetes 上のサーバーレスアーキテクチャ

Knative を使うか使わないかの判断基準がほしい。

<script async class="speakerdeck-embed" data-id="ed63d2bc07f84f57a4fb303e0b423cc0" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- うーんやっぱり使う必要がない限り使わなく良いって印象

## Re-architecturing of Microservices

<script async class="speakerdeck-embed" data-id="243725932ffc4ac0bb0009189f998102" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- Microservices を始めるとおそらく必ずぶち当たるモノリスの Microservices 化と Microservices の境界ミスの修正事例

## Kubernetes を運用したことで学んだアンチパターン

資料見つからず。

## Operator でどう変わる？これからのデータベース運用

現状の operator がどこまで使えるのか知りたかった。

<script async class="speakerdeck-embed" data-id="0f6959179aff447b8b88c9c9b6c827b8" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- operator の概要が具体的な MySQL の例で聞けてよかった
- できること、できないことも知れてよかった
  - 使えるけど、まだまだ発展途上という印象
- operator の話聞くとまんま昔やってた話で懐かしい(作りたい)

## gVisor で実現するマルチテナント Kubernetes

資料見つからず。

## Kubernetes クラスタのポータビリティを保つための 8 原則

Kubernetes 管理者として把握しておきたい。

<script async class="speakerdeck-embed" data-id="89ea4d9a289d47f0a2f2069361298473" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- いつでも k8s クラスタを捨てられる(再作成)できるようにする
- 非名前管理でわざと依存できなそうな名前にするの面白い
- StatefulSet 禁止してるのか…
  - そのへんのうまい移行方法あればいいのいなー

# Day 2

## 楽天モバイルの世界初完全仮想化クラウド型モバイルネットワーク

資料なし。

- 今の時代 IPv6 だけでネットワーク組むのが当たり前なのかな

## 決済システムの内製化への旅 - Spring と PCF で作るクラウドネイティブなシステム開発

<iframe src="//www.slideshare.net/slideshow/embed_code/key/wji06Ai1Vlt15A" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

- 全委託の状態から内製にもっていったの
- 監視ちゃんとやっててえらい
- Cloud Foundry なの意外
  - Kubernetes との比較、実際に比較したのか気になる
  - 選定理由、なんとなく選んだ感がある

## 金融領域における OpenStack 導入事例の紹介

資料なし。

## Change the Game, Change the World

<script async class="speakerdeck-embed" data-id="b78c8f88d463417cb0fa08714021f3a8" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- [OperatorHub.io | The registry for Kubernetes Operators](https://operatorhub.io/)
  - Red Hat Certified Operators
- Couchbase まだ生きてるのか
- [Learning OpenShift](https://learn.openshift.com/operatorframework/)
  - Operator を学べる

## OpenStack を用いたパブリッククラウドの国内事例と課題

資料なし。

## あなたに Kubernetes は必要ですか？ Kubernetes のこれからについて話し合おう。

資料なし。

- 記事が出てた
  - [「あなたに Kubernetes は必要ですか？」を、Kubernetes Meetup Tokyo のコアメンバーが議論：OpenStack Days Tokyo／CloudNative Days Tokyo 2019 - ＠IT](https://www.atmarkit.co.jp/ait/articles/1907/23/news120.html)
  - 元ネタ [多分あなたに Kubernetes は必要ない | Yakst](https://yakst.com/ja/posts/5455)
- [fabiolb/fabio: Consul Load-Balancing made simple](https://github.com/fabiolb/fabio)
  - これ初めて知ったけど欲しかったやつ感ある

## Kubernetes CNI プラグイン結局どれを選べばいいのか

<script async class="speakerdeck-embed" data-id="667ade5055f149ffaef7c6417b1c2f52" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- LINE は Rancher 使ってるのか
- 違いとか全然知らなかったので、めっちゃありがたい資料

## 最近の Docker の新機能

<iframe src="//www.slideshare.net/slideshow/embed_code/key/dseIedeSImRW0d" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

## ZOZOTOWN の Cloud Native Journey 〜トール・マカベッチのアンサーソング付き〜

<iframe src="//www.slideshare.net/slideshow/embed_code/key/zPqDASOlr705xW" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>

## マイクロサービス運用における最高の DX を目指して

<script async class="speakerdeck-embed" data-id="3c44de142a39489faeb1401cd33f6e8e" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

## 実録！CloudNative を目指した 230 日

<script async class="speakerdeck-embed" data-id="29be0427f1c14ce5936ea63c9d883109" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

## Microservices を支える Infrastructure as Software

<script async class="speakerdeck-embed" data-id="0367920dc65e4482bc5b7e4447b378ba" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- [Loki Design Document](https://docs.google.com/document/d/11tjK_lvp1-SVsFZjgOTr1vV3-q6vBAsZYIQ5ZeYBkyM/view)

## Kubernetes Logging 入門

<script async class="speakerdeck-embed" data-id="f6bbe81181d54acf9995cd9e334e499d" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- Loki は Cortex の水平スケールアーキテクチャを参考にしている

## A deep dive into service mesh and Istio

<script async class="speakerdeck-embed" data-id="475abca3cd564fef890ebcf469ffe600" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- Istio ありだと 20ms ぐらいのオーバーヘッドがあった

## クラウドネイティブを創る技術

<script async class="speakerdeck-embed" data-id="0fc45516f99149b09569afb061a07259" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- 内製技術で FaaS 実現してるのアツいよなー

## Istio で実現するクラウドネイティブ時代のセキュリティ

<script async class="speakerdeck-embed" data-id="f5318a23e5da45309458edfef400ba8c" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

## Kubernetes The Heartful Way ~手作りにこだわる職人たちの想い~

<script async class="speakerdeck-embed" data-id="9020b65c9f2f403189b7320d7e677118" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- kube-controller-manager、kube-scheduler、kube-proxy、kubelet を人が担うと何をすることになるのかという話
- netplan しらんかった
  - ここしばらく手動で IP 設定とかしてない…

## Understanding Envoy

<script async class="speakerdeck-embed" data-id="669bc7b7464a42128bd5d01c85f48eda" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

## サーバレス・ネイティブ が お伝えする、フルサーバレス開発の魅力

https://riotz.works/slides/2019-cloudnative-days/#1

## スタートアップサービスでもやれる!Kubernetes を使ったセキュア Web アプリの構築と運用

資料なし

## CNCF サンドボックスプロダクト 15 本ノック！

https://docs.google.com/presentation/d/1O9Q9E1hH6mBA5w8oDENnCYObZvij1-Dr_obvsY3X29k/edit?usp=sharing

- 17 本になってた
- cndjp
  - https://cnd.connpass.com/
- https://www.cncf.io/sandbox-projects/
- Flux
  - Argo CD との違いが気になる
- Network Service Mesh 気になる
- SPIFFE
  - [SPIFFE で何が解決できるのか - Qiita](https://qiita.com/hiyosi/items/6e8d56b257c55a709b4d)
  - 意識しておきたい
- OpenEBS
  - ストレージ機能をコンテナ内に内包
  - 使ってみたい
- CloudEvents
  - 意識しておきたい
- OpenMetrics
  - 放置されてる？
  - OpenTelemetry に取り込まれる
  - 注視しなくていい
- Cortex
  - go build しないと使えない
  - コンポーネント自作しないと使えない
    - 最近は example ある？

## あなたの k8s は大丈夫？k8s でできるセキュリティ対策（入門編）

資料なし

## 100 行のコードで Docker の基本を実現せよ！

<script async class="speakerdeck-embed" data-id="ae0adb751bf0400cb90bdc711e42d3e2" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- https://github.com/p8952/bocker
- https://github.com/xibuka/bocker
- docker run 以外にもいろいろ

## 歴史から紐解く Linux カーネルのコンテナ機能

<script async class="speakerdeck-embed" data-id="0d1b0d7fb7d245d79bf0af8e2b5c0f71" data-ratio="1.77966101694915" src="//speakerdeck.com/assets/embed.js"></script>

- タイトル通りの発表だった

## How cgroup-v2 and PSI impacts CloudNative?

<script async class="speakerdeck-embed" data-id="f2e85152056d4c278128291370a8f974" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

## そのコンテナ、もっと「賢く」置けますよ？

<script async class="speakerdeck-embed" data-id="2a7b598976a343bba5c153e284e9ffc0" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- スケジューリングの話

## いつもニコニコあなたの隣に這い寄るカオスエンジニアリング！

<script async class="speakerdeck-embed" data-id="1b56fa1e87154ad38b4b626f19edb4b5" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- [Chaos Engineering [Book]](https://www.oreilly.com/library/view/chaos-engineering/9781491988459/)
- Chaos Conf...かっこいい

## Challenging Secure Introduction with SPIFFE

<script async class="speakerdeck-embed" data-id="c461694ab52a4bac810445826182bbc3" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

## [ライブコーディング] Custom Resource と Controller を作ろう

資料なし

## Kubernetes に audit ログを求めるのは間違っているだろうか

<script async class="speakerdeck-embed" data-id="a2412affcedc48399db7c5ddb406bb25" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

- ResponseStarted / ResponseComplete
  - リクエストによってはヘッダを先に返して Body は後で返すみたいなやつがある
- おすすめは Pattern 3: audit webhook log + falco
- audit2rbac 便利そう
