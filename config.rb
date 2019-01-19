# frozen_string_literal: true

require "time"

$LOAD_PATH.unshift File.expand_path("../lib", __FILE__)
Time.zone = "Asia/Tokyo"

page "/*.xml", layout: false
page "/*.json", layout: false
page "/*.txt", layout: false

activate :blog do |blog|
  blog.permalink = ":year/:month/:day/:title.html"
  blog.sources = "articles/:year/:month/:day/:title.html"
  blog.default_extension = ".md"

  blog.calendar_template = "calendar.html"

  blog.paginate = true
  blog.per_page = 10
  blog.page_link = "page/{num}"
end

page "/feed.xml", layout: false

set :markdown_engine_prefix, Middleman::Renderers
set :markdown_engine, :qiita

emoji_collection = Somemoji.emoji_one_emoji_collection
url_generator = proc { |code| "/images/emoji/#{emoji_collection.find_by_code(code).base_path}.svg" }

set :markdown,
  option_context: {
    hostname: ENV["WERCKER"] ? "blog.nownabe.com" : "localhost:4567",
    script: true,
    emoji_url_generator: url_generator,
    emoji_names: Somemoji.send(:emoji_definitions).map { |h| h["code"] }
  },
  filters: [
    Qiita::Markdown::Filters::Greenmat,
    Qiita::Markdown::Filters::ImageLink,
    Qiita::Markdown::Filters::Footnote,
    Qiita::Markdown::Filters::Code,
    Qiita::Markdown::Filters::Checkbox,
    Qiita::Markdown::Filters::Emoji,
    Qiita::Markdown::Filters::SyntaxHighlight,
    Qiita::Markdown::Filters::ExternalLink,
  ]

set :slim, format: :html

configure :build do
  activate :minify_css
  activate :minify_javascript
end

activate :external_pipeline,
  name: :prebuilt,
  command: ": 'External Pipeline: Prebuilt'",
  source: "prebuilt"

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.deploy_method = :git
end

ready do
  sitemap.resources.group_by { |r| r.data&.category }.each do |category, pages|
    proxy(
      "/#{category}.html",
      "category.html",
      locals: { category: category, pages: pages }
    ) if category
  end
end

helpers do
  def url
    if config.environment == :development
      "https://localhost:4567#{current_article.url}"
    else
      "https://blog.nownabe.com#{current_article.url}"
    end
  end

  def article_description
    current_article.summary.gsub(%r{(</?[^<>]+>)+}, " ").gsub(/([\n\r])+/, " ")
  end
end
