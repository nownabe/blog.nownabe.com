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
      ensure_dir
      write_file
      delete_original_file
    end

    private

    def article
      @article ||= Article.new(@file)
    end

    # Download images hosted by esa
    def body
      article.body.gsub(%r{https://img.esa.io/[^"\)]+}) do |image_url|
        save_image(image_url)
      end
    end

    def delete_original_file
      FileUtils.rm(@file)
    end

    def destination_dir
      @destination_dir ||=
        File.join(
          @base_dir,
          sprintf("%04d", article.date.year),
          sprintf("%02d", article.date.month),
          sprintf("%02d", article.date.day)
        )
    end

    def destination_path
      @destination_path ||=
        File.join(
          destination_dir,
          File.basename(@file)
        )
    end

    def ensure_dir
      FileUtils.mkdir_p(destination_dir)
    end

    def save_image(url)
      filename = "#{@next_image_id}#{File.extname(url)}"
      @next_image_id += 1
      path = File.join(destination_dir, filename)
      ImageDownloader.new(url, path).call
      "./#{filename}"
    end

    def write_file
      File.write(
        destination_path,
        body
      )
    end
  end
end
