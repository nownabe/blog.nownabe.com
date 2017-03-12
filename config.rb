# frozen_string_literal: true

require "time"

$LOAD_PATH.unshift File.expand_path("../lib", __FILE__)
Time.zone = "Asia/Tokyo"

module EsaFrontmatter
  WORK_DIR = File.expand_path("../", __FILE__).freeze

  def data
    return @page_data if @page_data
    super
    command = "cd #{WORK_DIR} && " \
      "git log --date=rfc --pretty=format:\"%ad\" source/#{@file_descriptor.relative_path}"
    created_at = Time.rfc2822(`#{command}`.lines.last)
    @page_data[:created_at] = created_at
    @page_data[:date] = created_at
    @page_data
  end
end

Middleman::Sitemap::Resource.prepend(EsaFrontmatter)

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
    Qiita::Markdown::Filters::Sanitize
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

TAG_CLOUD_CLASSES = {
  0.2 => "big-tag",
  0.1 => "major-tag",
  0.05 => "normal-tag",
  0.02 => "minor-tag",
  0.01 => "rare-tag",
  0.0 => "unusual-tag"
}.freeze

helpers do
  def tag_cloud_class(number, max)
    ratio = number / max.to_f
    TAG_CLOUD_CLASSES.each do |threshold, klass|
      return klass if ratio >= threshold
    end
  end

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
