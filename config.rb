# frozen_string_literal: true

$LOAD_PATH.unshift File.expand_path("../lib", __FILE__)
Time.zone = "Asia/Tokyo"

module EsaFrontmatter
  def data
    return @page_data if @page_data
    super
    @page_data[:date] ||= @page_data[:created_at]
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
set :markdown,
  option_context: {
    hostname: ENV["WERCKER"] ? "blog.nownabe.com" : "localhost:4567",
    script: true
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
