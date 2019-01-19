---
title: PostgreSQLの更新でRails 5が動かなくなった
category: Log
tags: postgresql, rails, ruby
created_at: 2016-07-24 15:31:39 +0900
updated_at: 2016-07-24 15:31:39 +0900
published: true
---

CentOS 7です。

Rails 5のアプリがある日こんなメッセージを出して動かなくなってました。

```
An unhandled lowlevel error occurred. The application logs may have details.
```

`puma_error.log`をみてみると、

```
2016-07-24 14:42:22 +0900: Rack app error: #<PG::ConnectionBad: could not connect to server: No such file or directory
```

とでていて、systemctlでstatusみてみると、

```bash
[root@bots ~]# systemctl status postgresql-9.6
● postgresql-9.6.service - PostgreSQL 9.6 database server
   Loaded: loaded (/usr/lib/systemd/system/postgresql-9.6.service; enabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since 日 2016-07-24 14:38:40 JST; 5min ago
 Main PID: 33354 (code=exited, status=0/SUCCESS)

 7月 24 14:38:39 bots systemd[1]: Starting PostgreSQL 9.6 database server...
 7月 24 14:38:39 bots pg_ctl[10853]: < 2016-07-24 14:38:39.049 JST >FATAL:  データベースファイルがサーバと互換性がありません
 7月 24 14:38:39 bots pg_ctl[10853]: < 2016-07-24 14:38:39.049 JST >詳細:  データベースクラスタはPG_CONTROL_VERSION 942 で初期化されましたが、サーバは PG_CONTROL_VERSION 960 でコンパイルされています。
 7月 24 14:38:39 bots pg_ctl[10853]: < 2016-07-24 14:38:39.049 JST >ヒント:  initdbが必要のようです
 7月 24 14:38:39 bots pg_ctl[10853]: < 2016-07-24 14:38:39.050 JST >LOG:  データベースシステムはシャットダウンしました
 7月 24 14:38:40 bots systemd[1]: postgresql-9.6.service: control process exited, code=exited status=1
 7月 24 14:38:40 bots systemd[1]: Failed to start PostgreSQL 9.6 database server.
 7月 24 14:38:40 bots systemd[1]: Unit postgresql-9.6.service entered failed state.
 7月 24 14:38:40 bots systemd[1]: postgresql-9.6.service failed.
```

とこんな感じ。
どうやらyum-cronで更新されたらしい。

動いてた時のやつ:

```
Jul 13 00:53:13 Installed: postgresql96-libs-9.6beta2-2PGDG.rhel7.x86_64
Jul 13 00:53:19 Installed: postgresql96-9.6beta2-2PGDG.rhel7.x86_64
Jul 13 00:53:27 Installed: postgresql96-server-9.6beta2-2PGDG.rhel7.x86_64
Jul 13 00:53:33 Installed: libxslt-1.1.28-5.el7.x86_64
Jul 13 00:53:33 Installed: postgresql96-contrib-9.6beta2-2PGDG.rhel7.x86_64
Jul 13 00:53:40 Installed: postgresql96-devel-9.6beta2-2PGDG.rhel7.x86_64
```

今:

```
Jul 22 05:50:17 更新: postgresql96-libs.x86_64 9.6beta3-1PGDG.rhel7
Jul 22 05:50:17 更新: postgresql96.x86_64 9.6beta3-1PGDG.rhel7
Jul 22 05:50:17 更新: postgresql96-contrib.x86_64 9.6beta3-1PGDG.rhel7
Jul 22 05:50:18 更新: postgresql96-server.x86_64 9.6beta3-1PGDG.rhel7
Jul 22 05:50:18 更新: postgresql96-devel.x86_64 9.6beta3-1PGDG.rhel7
```

beta2からbeta3になってデータファイルの互換性がなくなったのか…。さすがβ版 😱

beta3のリリースノートみたらちゃんと書いてあった。

> Due to changes in system catalogs, a pg_upgrade or dump and restore will be required for users migrating databases from earlier betas.

[PostgreSQL: PostgreSQL 9.6 Beta 3 Released](https://www.postgresql.org/about/news/1686/)

というわけで、pg_upgradeしたら動きました。以下、そのときの手順です。

pg_upgradeでは新旧のバイナリと旧データが必要になります。
yum-cronで新しいバイナリしか残ってないので、古いバイナリを入手します。


```bash
$ mkdir /tmp/psql_migrate
$ cd tmp/psql_migrate
$ wget http://yum.postgresql.org/9.6/redhat/rhel-7.3-x86_64/postgresql96-server-9.6beta2-1PGDG.rhel7.x86_64.rpm

# rpmをインストールせずに展開します
$ rpm2cpio postgresql96-server-9.6beta2-1PGDG.rhel7.x86_64.rpm | cpio -idv

# 古いバイナリが揃いました
$ ls /tmp/psql_migrate/usr/pgsql-9.6/bin/
initdb  pg_controldata  pg_ctl  pg_resetxlog  postgres  postgresql96-check-db-dir  postgresql96-setup  postmaster
```

古いデータを別の場所に移して、新しい用のデータを初期化しておきます。

```bash
$ sudo mv /var/lib/pgsql/9.6/data /var/lib/pgsql/9.6/data-beta2
$ sudo mkdir /var/lib/pgsql/9.6/data
$ sudo chown postgres. /var/lib/pgsql/9.6/data
$ sudo -u postgres /usr/pgsql-9.6/bin/initdb -D /var/lib/pgsql/9.6/data
```

pg_upgradeを実行します。

```bash
# postgresユーザでカレントディレクトリにログを吐くため移動する
$ cd /var/lib/pgsql/9.6

# 実行する
$ sudo -u postgres /usr/pgsql-9.6/bin/pg_upgrade \
>     -b /tmp/psql_migrate/usr/pgsql-9.6/bin \
>     -B /usr/pgsql-9.6/bin \
>     -d /var/lib/pgsql/9.6/data-beta2 \
>     -D /var/lib/pgsql/9.6/data
Performing Consistency Checks
-----------------------------
Checking cluster versions                                   ok
Checking database user is the install user                  ok
Checking database connection settings                       ok
Checking for prepared transactions                          ok
Checking for reg* system OID user data types                ok
Checking for contrib/isn with bigint-passing mismatch       ok
Creating dump of global objects                             ok
Creating dump of database schemas
                                                            ok
Checking for presence of required libraries                 ok
Checking database user is the install user                  ok
Checking for prepared transactions                          ok

If pg_upgrade fails after this point, you must re-initdb the
new cluster before continuing.

Performing Upgrade
------------------
Analyzing all rows in the new cluster                       ok
Freezing all rows on the new cluster                        ok
Deleting files from new pg_clog                             ok
Copying old pg_clog to new server                           ok
Setting next transaction ID and epoch for new cluster       ok
Deleting files from new pg_multixact/offsets                ok
Copying old pg_multixact/offsets to new server              ok
Deleting files from new pg_multixact/members                ok
Copying old pg_multixact/members to new server              ok
Setting next multixact ID and offset for new cluster        ok
Resetting WAL archives                                      ok
Setting frozenxid and minmxid counters in new cluster       ok
Restoring global objects in the new cluster                 ok
Restoring database schemas in the new cluster
                                                            ok
Copying user relation files
                                                            ok
Setting next OID for new cluster                            ok
Sync data directory to disk                                 ok
Creating script to analyze new cluster                      ok
Creating script to delete old cluster                       ok

Upgrade Complete
----------------
Optimizer statistics are not transferred by pg_upgrade so,
once you start the new server, consider running:
    ./analyze_new_cluster.sh

Running this script will delete the old cluster's data files:
    ./delete_old_cluster.sh
```

pg_upgradeが作ったスクリプトを実行しろと言われるので、実行します。

```bash
$ systemctl start postgresql-9.6
$ sudo -u postgres ./analyze_new_cluster.sh
This script will generate minimal optimizer statistics rapidly
so your system is usable, and then gather statistics twice more
with increasing accuracy.  When it is done, your system will
have the default level of optimizer statistics.

If you have used ALTER TABLE to modify the statistics target for
any tables, you might want to remove them and restore them after
running this script because they will delay fast statistics generation.

If you would like default statistics as quickly as possible, cancel
this script and run:
    "/usr/pgsql-9.6/bin/vacuumdb" --all --analyze-only

vacuumdb: processing database "postgres": Generating minimal optimizer statistics (1 target)
vacuumdb: processing database "template1": Generating minimal optimizer statistics (1 target)
vacuumdb: processing database "postgres": Generating medium optimizer statistics (10 targets)
vacuumdb: processing database "template1": Generating medium optimizer statistics (10 targets)
vacuumdb: processing database "postgres": Generating default (full) optimizer statistics
vacuumdb: processing database "template1": Generating default (full) optimizer statistics

Done
```

実際は自分が使ってるデータベースも対象になるはずです。

最後に古いデータとかを削除します。

```bash
$ sudo -u postgres ./delete_old_cluster.sh
$ sudo rm analyze_new_cluster.sh delete_old_cluster.sh
$ rm -rf /tmp/psql_migrate/
```
