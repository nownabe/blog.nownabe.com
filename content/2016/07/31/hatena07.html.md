---
date: 2015-05-20T00:53:44+0900
lastmod: 2015-05-20T00:53:44+0900
tags: ["ruby", "rubygems", "gem in a box"]
draft: false
isCJKLanguage: true

title: Gem in a Boxに簡単にリリースできるGem作ったけどいっぱいあったのでまとめ
category: Tech

created_at: 2015-05-20 00:53:44 +0900
updated_at: 2015-05-20 00:53:44 +0900
published: true
---

# はじめに
プライベートなGem Serverというか、[Gem in a Box](https://github.com/geminabox/geminabox)に手軽にGemをリリースできるようにする[geminabox-rake_tasks](https://github.com/nownabe/geminabox-rake_tasks)というGemを作りました。

https://github.com/nownabe/geminabox-rake_tasks

このGemを使うと、次の2点が実現できます。

* Rubygems.orgにリリースできない
* 通常のrakeタスクと同じコマンドでGem in a Boxサーバにリリースできる

社内でプライベートなGem ServerをGem in a Boxで構築してる場合など手軽でいいんじゃないかと思います。

# 使い方
まず、gemspecファイルに次の行を追加します。

```ruby
spec.add_development_dependency "geminabox-rake_tasks"
```

お決まりのbundle installしてください。

```bash
$ bundle
```

Rakefileの`require "bundler/gem_tasks"`を削除して、次の行を追加します。

```ruby
require "geminabox/rake_tasks"
```

リリースする前に、Gem in a Boxサーバの設定が必要になります。

```bash
$ bundle exec gem inabox -c
Enter the root url for your personal geminabox instance (e.g. http://gems/).
Host:  http://yourgeminabox/
```

このコマンドで、`./gem/geminabox`が設定されます。

```bash
$ cat ~/.gem/geminabox
---
:host: http://yourgeminabox/
```

これでリリースできるようになってます。

```bash
$ bundle exec rake release
testgem 0.1.0 built to pkg/testgem-0.1.0.gem.
Tagged v0.1.0.
Pushed git commits and tags.
Pushed testgem 0.1.0
```

![01](/images/articles/hatena07/01.png)

他にも、`bundler/gem_tasks`と同じタスクが使えます。

```bash
$ bundle exec rake -T
rake build          # Build testgem-0.1.0.gem into the pkg directory
rake install        # Build and install testgem-0.1.0.gem into system gems
rake install:local  # Build and install testgem-0.1.0.gem into system gems without network access
rake release        # Create tag v0.1.0 and build and push testgem-0.1.0.gem to your gem in a box server
```

# 競合
よく調べもせずに作ったので、同じようなのがいっぱいありました。

## geminabox-release
https://github.com/dfherr/geminabox-release

Rakefile:

```ruby
require "geminabox-release"
GeminaboxRelease.patch(use_config: true)

# か、 GeminaboxRelease.path(host: "http://yourgeminabox/")
```

Rake Tasks:

```bash
$ bundle exec rake -T
rake build             # Build testgem-0.1.0.gem into the pkg directory
rake inabox:forcepush  # Build & push testgem-0.1.0.gem overwriting same version to http://localhost:8080
rake inabox:push       # Build & push testgem-0.1.0.gem to http://localhost:8080
rake inabox:release    # Create tag v0.1.0 and build and push testgem-0.1.0.gem to http://localhost:8080
rake install           # Build and install testgem-0.1.0.gem into system gems
rake install:local     # Build and install testgem-0.1.0.gem into system gems without network access
rake release           # Create tag v0.1.0 and build and push testgem-0.1.0.gem to Rubygems
```

## geminabox-rake
https://github.com/jgraichen/geminabox-rake

Rakefile:

```ruby
require "geminabox/rake"
GeminaboxRake.install
```

Rake Tasks:

```bash
$ bundle exec rake -T
rake geminabox:build          # Build testgem-0.1.0.gem into the pkg directory
rake geminabox:install        # Build and install testgem-0.1.0.gem into system gems
rake geminabox:install:local  # Build and install testgem-0.1.0.gem into system gems without network access
rake geminabox:release        # Create tag v0.1.0 and build and push testgem-0.1.0.gem to Rubygems
```

## bundler-geminabox
https://github.com/sonots/bundler-geminabox

Rakefile:

```ruby
require "bundler/geminabox/gem_tasks"
```

Rake Tasks:

```bash
$ bundle exec rake -T
rake build              # Build testgem-0.1.0.gem into the pkg directory
rake geminabox_release  # Create tag v0.1.0 and build and push testgem-0.1.0.gem to https://your.rubygems.org
rake install            # Build and install testgem-0.1.0.gem into system gems
rake install:local      # Build and install testgem-0.1.0.gem into system gems without network access
rake release            # [WARN] Release to rubygems.org is prohibited, use rake geminabox_release
```

このGemは`bundle gem`の所から面倒みてくれるみたいです。
こっちのほうがうっかりrubygems.orgにリリースすることはないかもしれません。

というかこのGemでいいような気がしてきました。

```bash
GEMINABOX=https://your.rubygems.org bundle-geminabox gem foo
      create  foo/Gemfile
      create  foo/.gitignore
      create  foo/lib/foo.rb
      create  foo/lib/foo/version.rb
      create  foo/LICENSE.txt
      create  foo/foo.gemspec
      create  foo/.consolerc
      create  foo/Rakefile
      create  foo/README.md
       force  foo/Gemfile
       force  foo/Rakefile
```

## bundler_geminabox
https://github.com/joshkrueger/bundler_geminabox

Rakefile:

```ruby
require "bundler_geminabox/gem_tasks"
```

Rake Tasks:

```bash
$ bundle exec rake -T
rake build          # Build testgem-0.1.0.gem into the pkg directory
rake install        # Build and install testgem-0.1.0.gem into system gems
rake install:local  # Build and install testgem-0.1.0.gem into system gems without network access
rake release        # Create tag v0.1.0 and build and push testgem-0.1.0.gem to your geminabox server
```

ほぼ同じでした。

# おわりに
急いでたのでろくに調べずに作ってしまったんですが、まあ普通に考えたら誰か作りますよねw
