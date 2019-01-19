# frozen_string_literal: true

require "fileutils"

require "migrator/article"
require "migrator/image_downloader"

module Migrator
  class Migrator
    def initialize(file, base_dir)
      @file = file
      @base_dir = base_dir
      @next_image_id = 1
    end

    def call
      ensure_dirs
      write_file
      delete_original_file
    end

    private

    def article
      @article ||= Article.new(@file)
    end

    def article_dir
      @article_dir ||= File.join("articles", date_path)
    end

    def article_destination
      @article_destination ||=
        File.join(
          @base_dir,
          article_dir,
          File.basename(@file)
        )
    end

    # Download images hosted by esa
    def body
      article.body.gsub(%r{https://img.esa.io/[^"\)]+}) do |image_url|
        save_image(image_url)
      end
    end

    def date_path
      @date_path ||=
        File.join(
          sprintf("%04d", article.date.year),
          sprintf("%02d", article.date.month),
          sprintf("%02d", article.date.day)
        )
    end

    def delete_original_file
      FileUtils.rm(@file)
    end


    def ensure_dirs
      FileUtils.mkdir_p(File.join(@base_dir, article_dir))
      FileUtils.mkdir_p(File.join(@base_dir, image_dir))
    end

    def image_dir
      @image_dir ||= File.join("images", date_path)
    end

    def save_image(url)
      filepath = File.join(image_dir, "#{@next_image_id}#{File.extname(url)}")
      @next_image_id += 1
      ImageDownloader.new(url, File.join(@base_dir, filepath)).call
      "/#{filepath}"
    end

    def write_file
      File.write(article_destination, body)
    end
  end
end
