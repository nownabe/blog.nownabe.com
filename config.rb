# frozen_string_literal: true

page "/*.xml", layout: false
page "/*.json", layout: false
page "/*.txt", layout: false

activate :blog do |blog|
  blog.permalink = ":year/:month/:day/:title.html"
  blog.sources = "articles/:title.html"
  blog.default_extension = ".md"

  blog.tag_template = "tag.html"
  blog.calendar_template = "calendar.html"

  blog.paginate = true
  blog.per_page = 10
  blog.page_link = "page/{num}"
end

page "/feed.xml", layout: false

set :markdown_engine_prefix, Middleman::Renderers
set :markdown_engine, :qiita

set :slim, format: :html

configure :build do
  activate :minify_css
  activate :minify_javascript
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.deploy_method = :git
end
