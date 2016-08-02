---
title: EasySettingsをSettingslogicの替りにいかがでしょうか
tags: ruby, easy_settings
created_at: 2015-03-07 02:15:01 +0900
updated_at: 2015-03-07 02:15:01 +0900
published: true
---

今までRailsとかその他諸々のアプリケーションで、定数の管理に[Settingslogic](https://github.com/settingslogic/settingslogic)を使ってました。
色々不満がありつつ使ってたんですが、この度[EasySettings](https://rubygems.org/gems/easy_settings)というGemを新しく作りました。

https://github.com/nownabe/easy_settings

元々はアプリ側でデフォルト値を設定したくて[SettingslogicDefault](https://rubygems.org/gems/settingslogic_default)みたいなGemを作ったんですが、色々と限界を感じたのでもう新しいの作ってしまおうと。

## 初期化いらず
```ruby
# EasySettings
# いらない

# Settingslogic
class Settings < Settingslogic
   source Rails.root.join("config/settings.yml").to_s
end
```

## メソッド形式での動的代入ができる
```ruby
# EasySettings
> EasySettings.foo ||= "bar"
=> "bar"

# Settingslogic
> Settings.foo ||= "bar"
Settingslogic::MissingSetting: Missing setting 'foo' in settings1.yml
```

## ネストされたHashで同じキーが使える
というか使えないSettingslogicにびっくり。

```ruby
# EasySettings
> EasySettings["foo"] = {foo: "bar"}
=> {:foo=>"bar"}
> EasySettings.foo.foo
=> "bar"

# Settingslogic
> Settings["foo"] = {foo: "bar"}
=> {:foo=>"bar"}
> Settings.foo.foo
Settingslogic::MissingSetting: Missing setting 'foo' in settings.yml
```

## デフォルト値が設定できる
元々これをやりたかったんですが、あんまりいらない気もする。
デフォルト値設定を簡潔に書きたくてこういう仕様にしました。

```ruby
> EasySettings.foo
=> nil
> EasySettings.has_key?(:foo)
=> false
> EasySettings.foo("bar")
=> "bar"
> EasySettings.foo
=> "bar"
> EasySettings.foo("baz")
=> "bar"
```

こんなこともできます。

```ruby
> EasySettings.foo({}).bar("baz")
=> "baz"
> EasySettings.to_h
=> {"foo"=>{"bar"=>"baz"}}
```

Settingslogicだとできない。

```ruby
> (Settings[:foo] ||= {})[:bar] ||= "baz"
=> "baz"
> Settings[:foo][:bar]
=> nil
```

詳しい使い方はGithubのREADMEに書いてます。

是非、使ってみてください。
