# frozen_string_literal: true

require "open-uri"

module Migrator
  class ImageDownloader
    def initialize(url, destination)
      @url = url
      @destination = destination
    end

    def call
      File.binwrite(@destination, open(@url).read)
    end
  end
end
