# frozen_string_literal: true

require "yaml"

require "migrator/date_detector"

module Migrator
  class Article
    def initialize(file)
      @file = file
    end

    def body
      @body ||= File.read(@file)
    end

    def date
      @date ||= DateDetector.new(@file).call
    end

    def metadata
      @metadata ||= YAML.load_file(@file)
    end

    def title
      metadata["title"]
    end
  end
end
