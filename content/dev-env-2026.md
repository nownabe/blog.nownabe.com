---
title: "開発環境式年遷宮 (2026年)"
tags:
date: 2026-02-23T22:45:00+09:00
lastmod: 2026-02-23T21:45:00+09:00

draft: false
isCJKLanguage: true

image: /images/dev-env-2026/dev-env-2026.jpg
---

![banner](/images/dev-env-2026/dev-env-2026.jpg)

## 開発環境式年遷宮 (2026年)

ローカル開発環境を式年遷宮しようと思い、既存の設定をすべて見直して一から作り直した結果、以前とほぼ同じになった。あまり変わらなかったが記録として残しておく。

今まで開発環境について記事を書いたことがなかった気がするので、今までの開発環境の変遷も思い出せる限り振り返ってみようかと思う。

## きっかけ

複数の同僚から WezTerm や Nix の Home Manager を勧められていたところに、貸与PCのリプレースのタイミングが重なり、SRE Kaigi でもらった熱量を活かして開発環境を見直すことにした。

## OS

WSL (Ubuntu) のまま。特に移行はなし。

OS についてはこんな感じの変遷のはず。

* Windows XP ～ 7
* Mac OS X
* Ubuntu
* WSL (Ubuntu)

Windows 時代から Dual Boot で RedHat 系の Linux を入れて、開発ではそちらを使っていた。CentOS や Fedora が多かったと思う。他にもドラゴンがテーマでやたら GUI がぐりんぐりんするオレオレディストリなんかも使ってみたりしていたが、結局はメジャーかつ標準で使いやすいものということで Ubuntu に落ち着いた。Docker で Debian が使われることが多かったのもある。WSL2 が安定してからは、Dual Boot もめんどくさかったのでやめて WSL 一本でやっている。

Mac は勤務先から貸与される PC が Mac だったので個人でも買って使ってみてた事はあるが、Linux 以上の魅力が感じられずに Linux に戻った。

本当は WSL ではなく素の Ubuntu を使いたいが、ゲームをするために Windows を使っている。

## dotfiles

dotfiles というか、ローカル開発環境の構築というか。Chezmoi から Nix Home Manager に移行した。

Chezmoi は 2 年前ぐらいから使い始めたが、Home Manager のほうが AI と相性が良さそうと感じて乗り換えた。

今までの方法を思い出せる限り時系列順で並べてみるとこんな感じ。

* シェルスクリプト
* itamae-go
* mitamae
* Chezmoi
* Home Manager

mitamae 時代が一番長く気に入っていたが、ほぼ OS の差を考えることもなくなったのでよりシンプルな Chezmoi に移行して、今回 Home Manager に移行したという流れ。

## エディタ

Neovim から Neovim になった。AstroNvim v4 を使っていたのが v5 になった。

以前は AstroNvim v4 をカスタマイズして使っていて、Telescope を snacks.picker に置き換えたいなど変えたいところがちょこちょこあり最初は自分でコンフィグをすべて書こうと頑張っていたが、面倒すぎたのと AstroNvim v5 で十分なことに気付いたので AstroNvim バージョンアップに落ち着いた。ただ、コンフィグは使い回さずに一から書き直した。

AstroNvim v4 時代は Cline や Cursor の盛り上がりで一瞬 VS Code を頑張って使ってみたりもしたが、Claude Code のおかげで Neovim に戻ることができた。感謝。

メインで使っていたエディタをだいたい時系列順に並べると多分こんな感じ。

* メモ帳
* TeraPad
* サクラエディタ
* Emacs
* 秀丸 (Tex、プログラミング)
* Aptana Studio (Ruby)
* NetBeans (Ruby)
* Vim
* Neovim

Vim をメインにし始めたのは、サーバーで作業することが増えて Vim で揃えるか、というのがきっかけだったと思う。Atom や Sublime Text、VS Code なども試しつつ、Vim (Neovim) を使い続けている。

## ターミナル

基本は OS デフォルトのターミナルを使っている。今は Windows Terminal。

今回、WezTerm を試してみたが結局 Windows Terminal に落ち着いた。WezTerm は Lua で設定できるのが魅力的かつ、マルチプレクサの機能も持っていて tmux のレイヤーなくせるんじゃね、と野望を抱き結構頑張って設定したが、表示がバグる問題が致命的で本格採用できなかった。しばらく WezTerm を使ってみたが、マルチプレクサの機能が tmux に慣れていたためかしっくりこなかったので、落ち着くところに落ち着いた気はする。

![wezterm omg](/images/dev-env-2026/wezterm-bug.png)

これはバグった WezTerm 上の Neovim でファイルの保存を試みているところ。

## ターミナルマルチプレクサ

今まで tmux wrapper の byobu を使っていたが、byobu をやめて素の tmux に移行した。

以前から byobu はやめたいと考えていたが、WezTerm の経由がきっかけでやめられてスッキリした。

byobu 以前は screen を使っていた。

## シェル

zsh から変わらず。ただし、AI と Home Manager によって zplug が不要になった。

Vim を使い始めた頃に zsh を使い始めて、それ以前は bash を使っていた。

## AI Agent

Claude Max を契約して Claude Code をメインで使っている。使い方としてはシェルで起動して使うのがメイン。Neovim から sidekick.nvim 経由で呼び出すこともある。

## あとがき

AI のおかげで開発環境を一から構築し直すというのもだいぶ楽だった。
開発環境構築のような作業もなくなっていくんだろうか。
