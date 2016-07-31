# frozen_string_literal: true

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
    puts number
    puts max
    puts ratio
    TAG_CLOUD_CLASSES.each do |threshold, klass|
      return klass if ratio >= threshold
    end
  end
end
