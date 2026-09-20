---
title: "超簡単にサーバのデータをIDCFオブストに定期バックアップするItamaeプラグイン"
tags: ["idcf cloud","itamae"]
date: 2015-05-21T00:47:50+09:00
lastmod: 2015-05-21T00:47:50+09:00
---

## はじめに
サーバのあるディレクトリ内のファイルを [IDCFのオブジェクトストレージ](http://www.idcf.jp/cloud/storage/) に定期バックアップする [Itamae](http://itamae.kitchen/) プラグインを作ったので紹介します！

[nownabe/itamae-plugin-recipe-idcf-backup_to_object_storage](https://github.com/nownabe-infra/itamae-plugin-recipe-idcf-backup_to_object_storage)

## 結論
作ったのは `itamae-plugin-recipe-idcf-backup_to_object_storage` というクソ長い名前の Gem（Itamae プラグイン）です。
このプラグインを使うと、下の図のように任意の期間のバックアップファイルをオブジェクトストレージに保存できます。

![01](/images/articles/hatena08/01.png)

## 概要
このプラグインを使ってプロビジョニングするとどうなるのか簡単に説明します。

* バックアップスクリプトが作成される
* バックアップスクリプトを叩く cron ジョブが作成される
* バックアップスクリプトは
  * 指定されたサーバのディレクトリと指定されたオブストのバケットを同期する
  * 指定された期間より古いファイルはサーバからもオブストからも削除する
* バックアップ実行前に任意のコマンドを実行できる
  * mysqldump とか tar zcf とか
  * このコマンドで、指定したディレクトリ内にバックアップファイルを生成する

## 使い方
### サンプル
サンプルを見てもらうのが一番はやいと思います。

https://github.com/nownabe-infra/example-idcf-backup_to_object_storage

### Gemfile
Gemfile にプラグインを追加します。

```ruby
# Gemfile
source "https://rubygems.org"
gem "itamae-plugin-recipe-idcf-backup_to_object_storage"
```

bundle install も忘れずにやっておきましょう。

```bash
$ bundle install
```

### node.yml
node.yml でいろいろ設定します。

```yaml
# node.yml
idcf:
  backup_to_object_storage:
    access_key: YOUR_ACCESS_KEY
    secret_key: YOUR_SECRET_KEY
    directories:
      - schedule: 30 3 * * *
        path: /backups
        bucket: backup.yourbucket
        expire: 7
        command: mysqldump -u root -x --all-databases > /backups/dump_`date +\%Y\%m\%d\%H\%M`.sql
```

* `idcf.backup_to_object_storage.access_key`: オブストのアクセスキー
* `idcf.backup_to_object_storage.secret_key`: オブストのシークレットキー
* `idcf.backup_to_object_storage.directories`: バックアップの設定の配列

バックアップの設定は、次のようになってます。

* `schedule`: バックアップを実行するスケジュール。みんなおなじみの cron 形式
* `path`: バックアップ元のディレクトリ。この中のファイルをオブストに同期します
* `bucket`: 同期先のバケット
* `expire`: ファイルを保持する期間。ここで設定した日数より前に作成されたファイルは、サーバーからもオブストからも削除されます
* `command`: (optional) バックアップ前に実行するコマンド。だいたいはこのコマンドで `path` のディレクトリ内にバックアップファイルを作ることになると思います

上記のサンプルだと、

* 毎日 3 時 30 分に
* mysqldump で/backups ディレクトリに全データベースの dump をとる
* 7 日前より古く作成されたファイルを削除する
* /backups ディレクトリを backup.yourbucket に同期する

という一連の処理になります。

### recipe
recipe には、1 行追加するだけで OK です。

```ruby
# recipe.rb
include_recipe "idcf-backup_to_object_storage"
```

### プロビジョニング
最後に、SSH 経由でプロビジョニングします。

```bash
$ bundle exec itamae ssh -h ${YOURHOST} -y node.yml recipe.rb
```

ユーザを指定する場合は `-u` オプション、ポートを指定する場合は `-p` オプションを使います。

プロビジョニングが完了してスケジュールが実行されると、オブストにバックアップファイルがアップロードされているはずです。
コントロールパネルでファイル一覧を表示できるので確認してみてください。

## おわりに
プルリクお待ちしております！
