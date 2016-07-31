---
title: 超簡単にサーバのデータをIDCFオブストに定期バックアップするItamaeプラグイン
tags: idcf cloud, itamae
created_at: 2015-05-21 00:47:50
updated_at: 2015-05-21 00:47:50
published: true
---

# はじめに
サーバのあるディレクトリ内のファイルを[IDCFのオブジェクトストレージ](http://www.idcf.jp/cloud/storage/)に定期バックアップする[Itamae](http://itamae.kitchen/)プラグインを作ったので紹介します！

[https://github.com/nownabe-infra/itamae-plugin-recipe-idcf-backup_to_object_storage:embed:cite]

# 結論
作ったのは`itamae-plugin-recipe-idcf-backup_to_object_storage`というクソ長い名前のGem（Itamaeプラグイン）です。
このプラグインを使うと、下の図のように任意の期間のバックアップファイルをオブジェクトストレージに保存することができます。

[f:id:nownabe:20150521000006p:plain]

# 概要
このプラグインを使ってプロビジョニングするとどうなるのか簡単に説明します。

* バックアップスクリプトが作成される
* バックアップスクリプトを叩くcronジョブが作成される
* バックアップスクリプトは
  * 指定されたサーバのディレクトリと指定されたオブストのバケットを同期する
  * 指定された期間より古いファイルはサーバからもオブストからも削除する
* バックアップ実行前に任意のコマンドを実行できる
  * mysqldumpとかtar zcfとか
  * このコマンドで、指定したディレクトリ内にバックアップファイルを生成する

# 使い方
## サンプル
サンプルを見てもらうのが一番はやいと思います。

[https://github.com/nownabe-infra/example-idcf-backup_to_object_storage:title]

## Gemfile
Gemfileにプラグインを追加します。

```ruby
# Gemfile
source "https://rubygems.org"
gem "itamae-plugin-recipe-idcf-backup_to_object_storage"
```

bundle installも忘れずにやっておきましょう。

```bash
$ bundle install
```

## node.yml
node.ymlでいろいろ設定します。

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

* `schedule`: バックアップを実行するスケジュール。みんなおなじみのcron形式
* `path`: バックアップ元のディレクトリ。この中のファイルをオブストに同期します
* `bucket`: 同期先のバケット
* `expire`: ファイルを保持する期間。ここで設定した日数より前に作成されたファイルは、サーバーからもオブストからも削除されます
* `command`: (optional) バックアップ前に実行するコマンド。だいたいはこのコマンドで`path`のディレクトリ内にバックアップファイルを作ることになると思います

上記のサンプルだと、

* 毎日3時30分に
* mysqldumpで/backupsディレクトリに全データベースのdumpをとる
* 7日前より古く作成されたファイルを削除する
* /backupsディレクトリをbackup.yourbucketに同期する

という一連の処理になります。

## recipe
recipeには、1行追加するだけでOKです。

```ruby
# recipe.rb
include_recipe "idcf-backup_to_object_storage"
```

## プロビジョニング
最後に、SSH経由でプロビジョニングします。

```bash
$ bundle exec itamae ssh -h ${YOURHOST} -y node.yml recipe.rb
```

ユーザを指定する場合は`-u`オプション、ポートを指定する場合は`-p`オプションを使います。

プロビジョニングが完了してスケジュールが実行されると、オブストにバックアップファイルがアップロードされているはずです。
コントロールパネルでファイル一覧を表示できるので確認してみてください。

# おわりに
プルリクお待ちしております！
