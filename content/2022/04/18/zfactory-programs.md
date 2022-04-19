---
title: "ZUTOMAYO FACTORY「鷹は飢えても踊り忘れず」で表示されていたプログラムについて"
tags:
date: 2022-04-18T23:41:48+09:00
lastmod: 2022-04-18T23:41:48+09:00

draft: false
isCJKLanguage: true

image: images/2022/04/18/3.png
---

## はじめに

ずっと真夜中でいいのに。のライブ [Z FACTORY「鷹は飢えても踊り忘れず」](https://zutomayo.net/live/21/) に参加してきました。ライブはもうただただ最高だったので感想も書きたいところですが、この記事ではライブに関連して現れたプログラムについて調べてみようと思います。また、できるだけプログラマーではなくてもわかるように噛み砕いて説明します。

## 注意点

私は歌詞やMVの考察はできないので、本記事で取り扱うのはあくまでもプログラムや[ZTMY LEAKS](http://ihihi.me/)から読み取れる内容だけです。また、PHPについては素人同然なので的外れな部分があるかもしれませんがご了承ください。


## ライブで現れた 3 つのプログラム

私が確認できた範囲では今回のライブで3つのプログラムがあったようです。

* バナー画像のプログラム
* [day1 "memory_limit = -1"] のプログラム
* [day2 "ob_start"] のプログラム

以下ではそれぞれについて調べてみます。[day1 "memory_limit = -1"] のプログラムと [day2 "ob_start"] のプログラムは非常に似ていますが、おそらくずとまよにおけるストーリーや世界観の中で重要な役割を持つ変更が追加されているので別のプログラムとして取り上げます。

## バナー画像のプログラム

1つ目は「バナー画像のプログラム」です。
このプログラムはずとまよの[公式サイト](https://zutomayo.net/live/21/)やグッズパンフレットの画像の中に登場しています。

[![1](/images/2022/04/18/1.jpg)](/images/2022/04/18/1.jpg)

![product lineup](/images/2022/04/18/2.jpg)

バナーのプログラムは JavaScript というプログラミング言語で書かれています。
JavaScript は Web サイトでよく使われるプログラミング言語で、バナーのプログラムも実際に[ずとまよ公式サイト](https://zutomayo.net/)で使われている JavaScript プログラムから引用されています。
例えば公式サイトのトップページでは再生ボタンをクリックしたらYouTubeの動画を再生できたり、お知らせウィンドウを移動できたりしますが、そういった部分の制御にこのプログラムが利用されています。

![3](/images/2022/04/18/3.png)


公式サイトで使われている JavaScript プログラムの一部に次のような部分があります。(プログラム全文は[こちら](https://zutomayo.net/themes/zutomayo/_assets/js/common.js?22021803)から確認できます)

```javascript
  var TopAnim = (function(){

    const topObj = $("#articletop");
    const _menu = topObj.find(".ztmy-top--nav li a span");
    const _news = topObj.find(".ztmy-top--news");
    const _mv = topObj.find(".ztmy-top--mv");
    // const _rule = CSSRulePlugin.getRule(".ztmy-top--nav li a:before");

    return{
        Init: function(url){

          const tl = gsap.timeline();

          // tl.staggerTo(_rule, 0.3, {cssRule: {width: "100%"},delay: 0.5,stagger: 0.3});
          // tl.staggerTo(_rule, 0.2, {cssRule: {left: "100%",width:0},delay: 0.2,stagger: 0.3});
          gsap.to(_menu, 0.2, {width: "100%",delay: 1,stagger: 0.1,ease: Power2.easeInOut});

          if(isSmartPhone()){
            gsap.to(_news, 0.5, { opacity: 1, scale:1, delay: 0.5,stagger: 0.3,ease: Sine.easeOut });
          } else {
            gsap.to(_news, 0.5, { opacity: 1, scale:1.5, delay: 0.5,stagger: 0.3,ease: Sine.easeOut });
          }

          gsap.to(_mv, 1, {right: 25,delay: 2.5,ease: Power2.Back});

          // var tl = gsap.timeline({ repeat: -1, yoyo: true });

          // tl.staggerTo(_rule, 1, {
          //   cssRule: { left: 100 },
          //   ease: Power2.easeInOut
          // }, 0.5);
        }
      }
  })();
```

このプログラムはバナー画像の左列のプログラムと一致します。真ん中の列、右の列も同じプログラムの別の箇所が引用されています。

ただし、公式サイトのプログラムとまったく同じではなく、バナーのプログラムには3つの英文と2つのことわざが追加されています。
これらは引用元のプログラムにはなく、JavaScript の文法にも違反していることから画像のために追加されていることがわかります。

* [左列] Every second is of infinite value. (一秒一秒には無限の価値がある)
* [中列] Forever is composed of nows. (永遠は多くの今で構成される)
* [右列] It is not that we have a short time to live, but that we waste a lot of it. (生きる時間が短いということではなく、多くの時間を無駄にしているのである)
* 雀百まで踊り忘れず (右列)
* 鷹は飢えても穂を摘まず (右列)

ことわざは今回のライブタイトルの元ネタでしょう。
3つの英文は後述する [day1 "memory_limit = -1"] のプログラムと [day2 "ob_start"] のプログラムの内容とも一致します。
そのため、ライブのテーマとして重要な意味を持つことが推測できます。
ACAねさんのMCとも関連しているように思えます。

## [day1 "memory_limit = -1"] のプログラム

私が参戦したのは2日目だったので直接確認したわけではありませんが、ライブ開始前のディスプレイに表示されていたようです。
また、ZTMY LEAKS にも 1日目 (2022年4月16日) に [memory_limit = -1](http://ihihi.me/?p=108) というタイトルで、ディスプレイと同じものと思われるプログラムが投稿されています。

ZTMY LEAKS から引用したプログラムの全文はこちらです。

```php
$we = Worker::getWorking(); // 私達は存在している。
define(People::lifetime()->every_second, INFINIT_VALUE); // 1秒1秒には無限の価値がある。

if ($we->think(People::lifetime()->length > $we->lifetime()->expected)) { // 私達の生きる時間が短いのではなく、
  while (!$we->die()) { $we->setRole(Role::MACHINES); } // 私達がその多くを無駄にしているのだ。
}

$forever = (new Forever([ // 永遠は、いくつもの現在から成り立っている。
  "params" => array_map(function ($someone) {
    return $someone->lifetime()->now;
  }, $we)
]))->compose();

while ($forever->night()) { // どんな夜も、私達は踊り続ける。
  $we->dance(Mode::DIGINIFIEDLY); // 尊厳を持ち、
  $we->dance(Mode::COURTEOUSLY); // 礼節を重んじ、
  $we->dance(Mode::TENACIOUSLY); // 粘り強く。
}

assertSame(TONIGHT, $forever->night()); // この夜もそうでなければならない。

/** 2022.04.16 */
memory_limit = -1;
```

このプログラムは PHP というプログラミング言語で書かれています。
PHP は Web サイトでよく使われる言語で、ずとまよの公式サイトやZTMY LEAKSでもPHPが使われているようです[^1]。例えばZUTOMAYO PREMIUMのログイン処理などで使われていると考えられます。

[^1]: PHP の場合は JavaScript と違って直接プログラムを確認することはできません。しかし、URLやHTTPのレスポンスを手がかりにしてPHPが使われていることが推測できます。

また、この ZTMY LEAKS の記事に John Titer が次のように返信しています。

> 時代は末期。そこは「灰版電機工業㈱」が権威を奮う世界。抑圧され感情が乏しくなった工場職員が労働を続けている。――。ふと電撃が走る。それに呼応して現れた見た事のない機械を構える職員、時空の歪み、別世界線との交差。工場のレーンにはこの世界にないものが流れ、やがて混ぜられた。そこには感情(bug)を持つ”人間”という種が生成された。
>
> memory_limit = -1
>
> 感情(bug)の連鎖が始まる。工場職員たちも自分のメモリを開放し、世界に抗う。
>
> ――。

灰版電機工業は[勘ぐれい](https://youtu.be/ugpywe34_30)、[Ham](https://youtu.be/ouLndhBRL4w)、[袖のキルト](https://youtu.be/9PnCSI8ndws)のMVに登場しています。

### プログラムの解説

ここからプログラムを読み解いていきたいと思います。

#### 前提

まず、大きな前提として、プログラムとプログラムではない部分について理解しておく必要があります。
例えば、1行目は次のように `//` で区切られています。

```php
$we = Worker::getWorking(); // 私達は存在している。
```

`//` より右側の部分は「コメント」と呼ばれ、プログラム的な意味は持ちません。
左側のPHPプログラムを読む人が理解しやすいように、日本語で補足をするコメントが書かれています。
また、下から2行目の `/** 2022.04.16 */` もコメントです。

#### プログラムの内容

では1行ずつ見ていきます。

```php
$we = Worker::getWorking(); // 私達は存在している。
```

`$we` は変数と呼ばれ、データを格納します。例えば、`$pi = 3.14;` とすれば `$pi` 変数には `3.14` という数字が格納されます。

`Worker::getWorking()` は、全Workerのうち動いている (workingな) Workerを取得 (get) します。そのため、`$we` 変数には現在動作している Worker 全員のデータが格納されます。

```php
define(People::lifetime()->every_second, INFINIT_VALUE); // 1秒1秒には無限の価値がある。
```

`define(A, B)`はAをBとして定義します。例えば、`define(PI, 3.14)` とすれば `PI` が `3.14` として定義されるので、その後のプログラムでは `PI` を `3.14` と同じ意味で使うことができるようになります。

ここでは、`People::lifetime()->every_second` (人間の一生の一秒一秒) を `INFINIT_VALUE` (無限の価値) として定義しています。

```php
if ($we->think(People::lifetime()->length > $we->lifetime()->expected)) { // 私達の生きる時間が短いのではなく、
  while (!$we->die()) { $we->setRole(Role::MACHINES); } // 私達がその多くを無駄にしているのだ。
}
```

こちらはこのブロックでひとつの意味を成すプログラムですが、少し複雑なので日本語で表現してみます。

```text
もしも (私達はこう考えるならば (人類の一生の長さ より 私達の一生の期待 が短いと)) {
  死ぬまで繰り返す { 私達に役割を与える 機械であるという }
}
```

ここで、「私達」と表現しているのは `$we` であり、現在動いている Worker 全員を意味します。
これをさらに日本語として意訳するとこんな感じでしょうか。

```text
もし、私達が人類の一生より自分たちの一生が短いと考えるならば、死ぬまで機械であることを繰り返す。
```

プログラムの解釈としてはこうなりますが、意味したいところは「もし、自分たちの一生が短いと感じるのであれば、それは機械のように過ごすことを繰り返しているのだ」ということかなのかもしれません。
こう解釈すると、コメントの「私達の生きる時間が短いのではなく、私達がその多くを無駄にしているのだ。」が理解できる気がします。

```php
$forever = (new Forever([ // 永遠は、いくつもの現在から成り立っている。
  "params" => array_map(function ($someone) {
    return $someone->lifetime()->now;
  }, $we)
]))->compose();
```

こちらも複雑なのですが、キーとなるのは中心にあるこの部分です。

```php
array_map(function ($someone) {
  return $someone->lifetime()->now;
}, $we)
```

こちらは、`$we` のそれぞれ、つまり、それぞれの Worker の「今」を列挙するというプログラムになっています。
これを使いつつ、意味が変わらないようにわかりやすくプログラムを書き換えると次のように成ります。

```php
$forever = (new Forever(それぞれの Worker の今))->compose()
```

さらに日本語で書き換えるとこうなります。

```php
$forever = 「それぞれの Worker の今」から永遠を構成する
```

つまり、`$forever` 変数には現在動いているWorkerそれぞれの今から構成された永遠が格納されます。

```php
while ($forever->night()) { // どんな夜も、私達は踊り続ける。
  $we->dance(Mode::DIGINIFIEDLY); // 尊厳を持ち、
  $we->dance(Mode::COURTEOUSLY); // 礼節を重んじ、
  $we->dance(Mode::TENACIOUSLY); // 粘り強く。
}
```

`while (条件) { プログラム }` は条件が正しい限り `{}` で囲われたプログラムを繰り返すという意味になります。

`$we->dance(モード)` は指定されたモードで Worker 達が踊るという意味でしょう。モードには少なくとも`DIGINIFIEDLY` (dignifiedlyのミススペル？威厳のある、高貴な)、`COURTEOUSLY` (礼儀正しく)、`TENACIOUSLY` (粘り強く)という3つのモードがあるようです。

なのでこのブロックは「永遠に夜がある限り高貴に踊り、礼儀正しく踊り、粘り強く踊ることを繰り返す」という意味になります。
`$forever->night()`が具体的には何なのかによりますが、別の言い方をするとWorker達は夜が来る限り踊り続けることを止められないということになります。
これより後ろにプログラムが続いていることから `$forever->night()` には終わりが来るということが推測できます。

```php
assertSame(TONIGHT, $forever->night()); // この夜もそうでなければならない。
```

`assertSame(A, B)` は `A` と `B` が等しいことを確認するためのものです。
もし `A` と `B` が異なればエラーを報告します。
つまりこのプログラムは `TONIGHT` と `$forever->night()` が等しいことを確認しています。

```php
/** 2022.04.16 */
memory_limit = -1;
```

ようやく最後のパートです。
`/** 2022.04.16 */` はコメントでありプログラム的な意味はないのですが、`memory_limit = -1` というプログラムを書き足した日付、もしくはこのプログラム全体を書いた日付ではないかと思います。
プログラミングの世界では、プログラムを書いたときにその時の日付をコメントとして残す文化が存在します。

`memory_limit = -1` はプログラムに割り当てるメモリの上限を外す、つまり無制限にメモリを使えるようにするという意味です。

パソコンやスマホのメモリがいっぱいになって動作が重くなったという経験を持つ人もいると思います。あるプログラムがメモリを使いすぎるとコンピュータ全体が重くなったり、他のプログラムが動作しなくなったりします。それを防ぐためにプログラムが使えるメモリの最大値を設定できるようになっているのですが、このプログラムではその制限外しています。

### 気になるポイント

John Titer の記事に対する返信を再度引用します。

> 時代は末期。そこは「灰版電機工業㈱」が権威を奮う世界。抑圧され感情が乏しくなった工場職員が労働を続けている。――。ふと電撃が走る。それに呼応して現れた見た事のない機械を構える職員、時空の歪み、別世界線との交差。工場のレーンにはこの世界にないものが流れ、やがて混ぜられた。そこには感情(bug)を持つ”人間”という種が生成された。
>
> memory_limit = -1
>
> 感情(bug)の連鎖が始まる。工場職員たちも自分のメモリを開放し、世界に抗う。
>
> ――。

* Worker は灰版電機工業の感情が乏しくなった工場職員のことか？
* People は感情(bug)を持つ"人間"のことか？
* `$forever->night()` に終わりは来るのか？来るとしたら終わりとは何か？
* 感情を持ち"人間"になった結果、2022年4月16日に`memory_limit = -1` を設定して世界(灰版電機工業？)に抗ったのか？

## [day2 "ob_start"] のプログラム

私が参戦したのは2日目だったんですが、ディスプレイは遠くて見えなかったのでこれも直接確認したわけではありません。
day1と同じく [ZTMY LEAKS](http://ihihi.me/?p=110) にプログラムが投稿されています。

ZTMY LEAKSから引用したプログラム全文はこちらです。

```php
$we = Worker::getWorking(); // 私達は存在している。
define(People::lifetime()->every_second, INFINIT_VALUE); // 1秒1秒には無限の価値がある。

if ($we->think(People::lifetime()->length > $we->lifetime()->expected)) { // 私達の生きる時間が短いのではなく、
while (!$we->die()) { $we->setRole(Role::MACHINES);} // 私達がその多くを無駄にしているのだ。
}

$forever = (new Forever([ // 永遠は、いくつもの現在から成り立っている。
“params” => array_map(function ($someone) {
return $someone->lifetime()->now;
}, $we)
]))->compose();

while ($forever->night()) { // どんな夜も、私達は踊り続ける。
$we->dance(Mode::DIGINIFIEDLY); // 尊厳を持ち、
$we->dance(Mode::COURTEOUSLY); // 礼節を重んじ、
$we->dance(Mode::TENACIOUSLY); // 粘り強く。
}

assertSame(TONIGHT, $forever->night()); // この夜もそうでなければならない。

/** 2022.04.16 */
memory_limit = -1;

--- 2022-04-16T19:00:00+0900
+++ 2122-04-17T19:00:00+0900

$we2 = Worker::getWorking(); // 私達は生きている。
assertFalse($we->place == $we2->place); // たとえ生きる居場所が違くたって
assertFalse($we->period == $we2->period); // たとえ生きる時代が違くたって
assertSame($we->enthusiasm, $we2->enthusiasm); // 私達の熱を決して奪うことは出来ない
/* 2122.04.17 */
ob_start();
```

day1のプログラムに8行が追加されています。

また、この記事にはJohn Titerが次のように返信しています。

> ――。
>
> 100年が経過し、世界は様相を変えた。
> いつしか権威は崩落する。
> 朽ち果て緑覆われた工場、そこにはかつての活気はない。
> しかし、限界を突破し感情(BUG)を得た職員達は過去の遺物を手に持ち演奏を続けていた。
> 世界が変わったとしても。
> 体、形が変わったとしても。
> 誰にもその熱を奪うことはできなかった。
>
> “ob_start”
>
> ――。ふと電撃が走り、工場は再び稼働を始める。
> 新たな歪みが生まれ、それは何処かへ向かった。

### プログラムの解説

day2は追加された部分のみ調べます。

#### 表示について

まず、ZTMY LEAKSでは追加された部分は次のように表示されています。

![4](/images/2022/04/18/4.png)

しかし、元のテキストは次のようなものだったのではないかと予想しています。

```diff
--- 2022-04-16T19:00:00+0900
+++ 2122-04-17T19:00:00+0900

+ $we2 = Worker::getWorking(); // 私達は生きている。
+ assertFalse($we->place == $we2->place); // たとえ生きる居場所が違くたって
+ assertFalse($we->period == $we2->period); // たとえ生きる時代が違くたって
+ assertSame($we->enthusiasm, $we2->enthusiasm); // 私達の熱を決して奪うことは出来ない
+ /* 2122.04.17 */
+ ob_start();
```

これは diff というもので、プログラムの修正前後の差分を表現をする方法です。もしかしたらライブ会場のディスプレイにはこれに近い形で表示されていたのかもしれません。

なぜZTMY LEAKSではこのような形で表示されてしまったのかは定かではありませんが、ZTMY LEAKSで使われている WordPress というブログツールのエディタが勝手に変換してしまったのではないかと考えています。

day2のプログラムが diff 形式で表現されていたとすると、これは「2022年4月16日のプログラムに対して、2122年4月17日に6行が追加された」ということを意味します。
以下はその仮定の元で内容を見ていきます。

#### 内容

day1のプログラムと同様にひとつずつ見ていきます。

```diff
--- 2022-04-16T19:00:00+0900
+++ 2122-04-17T19:00:00+0900
```

diff では `---` の後ろには変更前のプログラムが作成された日付、`+++` の後ろには変更した日付が書かれます。
つまり、2022年4月16日に作成されたプログラムに対して2122年4月17日に変更を加えた、ということになります。
2022年4月16日は`memory_limit = -1`を書き加えた日、2122年4月17日はその100年と1日後ですね。

```php
$we2 = Worker::getWorking(); // 私達は生きている。
```

day1のプログラムにもありました。
これを書き加えたのが100年後なので、`$we2` には100年後に生きている Worker 全員が格納されるイメージでしょうか。

```php
assertFalse($we->place == $we2->place); // たとえ生きる居場所が違くたって
assertFalse($we->period == $we2->period); // たとえ生きる時代が違くたって
```

`assertFalse(A == B)` は `A` と `B` が等しくないことを確認します。
なので、ここでは次の2つの事実を確認しています。

* `$we` と `$we2` の `place` (場所) が違うこと
* `$we` と `$we2` の `priod` (時代) が違うこと

```php
assertSame($we->enthusiasm, $we2->enthusiasm); // 私達の熱を決して奪うことは出来ない
```

`assertSame` は一度でてきましたね。
ここでは `$we` と `$we2` の `enthusiasm` (熱意) が等しいことを確認しています。

```php
/* 2122.04.17 */
ob_start();
```

`/* 2122.04.17 */` は `memory_limit = -1` のときと同じように追加した日付をコメントしたものと考えられます。

`ob_start()` は本来のPHPでは少し複雑な意味を持つのですが、簡単に説明すると「今からアウトプットを初めますよ」という宣言になります。

### 気になるポイント

再度 John Titer の返信を引用します。

> ――。
>
> 100年が経過し、世界は様相を変えた。
> いつしか権威は崩落する。
> 朽ち果て緑覆われた工場、そこにはかつての活気はない。
> しかし、限界を突破し感情(BUG)を得た職員達は過去の遺物を手に持ち演奏を続けていた。
> 世界が変わったとしても。
> 体、形が変わったとしても。
> 誰にもその熱を奪うことはできなかった。
>
> “ob_start”
>
> ――。ふと電撃が走り、工場は再び稼働を始める。
> 新たな歪みが生まれ、それは何処かへ向かった。

* 時系列を整理するとこんな感じ？
    * 灰版電機工業が権威を奮う世界
    * 感情(bug)を持つ"人間"が現れ、2022年4月16日に `memory_limit = -1` して世界に抗う
    * なんだかんだで灰版電機工業の権威が崩落して向上は朽ち果てる
    * 2122年4月17日に工場が再稼働して `ob_start()` する
* [袖のキルト](https://youtu.be/9PnCSI8ndws)のMVが2122年4月17日だろうか？
* `ob_start()`にはこれからアウトプットを始めるよ、活動を始めるよ、という意味が込められている？


## おわりに

以上です。

本記事ではプログラムをプログラムとして理解するということを試みましたが、厳密にプログラムとして解釈するのではなくこのプログラムはどういう意図があって書かれたのか、ということを考えることが重要だと感じました。

実はプログラミングという作業はプログラムを書く時間より読む時間の方が多いです。そして、読むときには表面上の意味だけでなく、どういう背景があり、書いた人がどういう意図で、どういう気持ちで書いたのか、という情報を収集・推測しながら読むことが非常に重要になります。
今回はその対象がずとまよの世界観であり、非常に楽しくプログラムを読むことができました。

もしこの記事を最後まで読んでくれた方で(いるのか？)、このMVを見ればこういうことも考えられるかも、とかこういう解釈があるかも、という情報があればぜひ教えてください。

あと最後にもう一度、ライブ最高でした！！！！！ありがとう！！！

テクノプアのチケットも当たってくれ〜〜〜〜 :pray: :pray: :pray: 
というわけでZUTOMAYO PREMIUMに入会しました。