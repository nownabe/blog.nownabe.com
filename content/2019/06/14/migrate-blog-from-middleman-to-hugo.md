---
title: "ブログの静的サイトジェネレータをMiddlemanからHugoに変えた"
tags:
- static site generator
- middleman
- hugo
date: 2019-06-14T22:45:14+09:00
lastmod: 2019-06-14T22:45:14+09:00

draft: false
CJKLanguage: true
---


# 概要

このブログを生成してる静的サイトジェネレータをMiddlemanからHugoに変えました。


# なぜMiddlemanをやめたのか

アップデートがつらかったのでやめました。
久々にMiddlemanアップデートしようとして`bundle update`したら、解決できるGemのバージョンねーよ！と言われてやめるのを決意しました。

アップデートがつらいのは次のような理由でした。

* Middlemanも本体だけでなく`middleman-blog`や`middleman-deploy`などもあってそもそも依存関係がめんどくさかった
* esa.ioで記事を書いていたので、MarkdownのRendererに親和性の高いqiita-markdownを使えるようにするGemを独自で作ってた
* Emojiを使うためにそこをさらに拡張していた
* esa.ioのfrontmatterでは正確な投稿日が取れないのでGitから取るようにMiddlemanにパッチを当ててた

いろいろパッチあててるのだるかったし、他にもPythonの2.7に依存があったり、いつのまにかシンタックスハイライト効かなくなってたり、使ってたCIのWerckerがOracleに買収されたり(関係ない)と以前からやめたいとは思ってたので良い機会でした。


# なぜHugoにしたのか

Go製のジェネレータで特に問題がなかったからです。

他と比較してないのでなんとも言えませんが、Go製ということで最初に試して、十分に早いし特に拡張することなくやりたいことができたのでHugoにしました。

心配していたこの辺はなんなくクリアしました。

* 今までのURLがそのまま使えるか
* Pythonへ依存してないか
* Emojiが使えるか
* テーマ作るの難しくないか

この辺はどうでも良い部分でした。

* SlimやSCSSで書いてたけど、頻繁には変えないし量も少ないのでのHTMLやCSSで書いてもいい
* esaの吐くFrontmatterとMarkdownを解釈する必要があったけど、esaはすでにやめていたのでHugoが解釈できるMarkdownで書けばいい

後者について既存の記事を変換する必要はあったので、Rubyでスクリプトを書いて変換しました。

テーマはMiddlemanのときのものをそのまま流用して作りました。


# デプロイ

ついでにCI/CDをWerckerからGitHub Actionsに変えました。
Werckerもいろいろ変わったけどOracleに買収されてて追従する気はないし、GitHubで完結してれば一番うれしいのでActionsを使うことにしました。

GitHub Actionsは初めて使ったんですが、シンプルでいいですね。


# おわりに

MiddlemanからHugoに変わって依存関係がなくなったし変なパッチもなくなったしビルドは早くなったしシンタックスもハイライトされて万々歳です。
スッキリしました。

ビルドの遅さやパッチうんぬんはMiddlemanのせいではなくて自分の使い方が悪かったせいなんですけどね :sweat_smile:

esaをやめるときにもスクリプトでいろいろ変換してて移行しやすくなってたのもあってスムーズに移行できてよかったです :sparkles:
