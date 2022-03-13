---
title: "増えすぎた GitHub のリポジトリを一括で整理するツールを作った"
tags:
- GitHub
- TypeScript
- CLI
date: 2022-03-13T23:27:09+09:00
lastmod: 2022-03-13T23:27:09+09:00

draft: false
isCJKLanguage: true

image: images/2022/03/13/ghrepos-organizer.png
---


GitHub のリポジトリを一括で整理するための [ghrepos-organizer](https://github.com/nownabe/ghrepos-organizer) というツールを作りました。
元々は整理が目的でしたが、全リポジトリに対して自動ブランチ削除機能を有効化するみたいな使い方もできるようになりました。


<iframe width="790" height="445" src="https://www.youtube.com/embed/f_KKVQlxmHw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## できること

あるOwner (user or organization) のリポジトリのうち、選択したリポジトリに対して一括で以下の操作を適用できます。

* 削除
* すべての Issue を Close
* すべての Pull Request を Close
* 属性の変更
  * Visibility (Public / Private)
  * Wiki機能の On/Off
  * Project機能の On/Off
  * マージした時に自動でブランチを削除する機能の On/Off
  * アーカイブ
* 他の Organization への Transfer

## 使い方

ghrepos-organizerを使うためには GitHub の Personal Access Token が必要に成ります。`repo` スコープがついていればOKです。リポジトリの削除を実行するためには `delete_repo` スコープも必要です。

npx コマンドで実行できます。

```bash
npx ghrepos-organizer
```

コマンドを実行すると対話式に色々聞かれるので、適用する操作を選んだり、操作対象のリポジトリを選んだりします。

操作 (Action) を選ぶ様子:

[![choose-actions](/images/2022/03/13/choose-actions.png)](/images/2022/03/13/choose-actions.png)

リポジトリを選ぶ様子:

[![choose-repositories](/images/2022/03/13/choose-repositories.png)](/images/2022/03/13/choose-repositories.png)

最後に最終確認のプロンプトが出るので、Yes (`y`) を入力すると実行されます。

## 環境変数

環境変数で一部の挙動を設定できるようになっています。

* `GH_PAT` - Personal Access Token を環境変数で設定できます。
* `CONCURRENCY` - 操作の並列数を設定できます。デフォルトは5です。
* `ENABLE_DELETE` - 削除機能を有効化します。

## おわりに

昔のリポジトリをまるっとアーカイブしたい時や、ブランチ自動削除機能を一括で有効化したいときなんかにぜひ使ってみてください。

今回初めてNodeでCLIを作ってみたので、そのことについての記事もまた書きたいと思います。